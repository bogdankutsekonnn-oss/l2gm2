#!/usr/bin/env node
/**
 * Гейт качества статической сборки — запускается после `nuxt generate`
 * и до заливки на хостинг (.github/workflows/deploy.yml), а также руками:
 *
 *   npm run check:build
 *
 * Зачем: 12-13.08.2026 в индекс Яндекса попали 13 адресов (статьи блога,
 * новости, теги, /chronicle/c1/), которые уехали на прод с кодом 200 и
 * заголовком «Страница не найдена» — внутри HTML лежал отрендеренный
 * error.vue. Ни prerender.failOnError, ни карта сайта такого не ловят:
 * страница считается собранной успешно. Дальше — набор проверок, каждая
 * из которых ловит свой класс этой поломки.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..', '.output', 'public')

// Статические PHP-админки из public/api — не страницы Nuxt, у них нет
// ни canonical, ни SEO-меты, и в индексе им делать нечего.
const EXEMPT_PREFIXES = ['api/', 'comments-api/']
// Легитимные страницы ошибки: 404.html отдаётся хостингом на несуществующий
// адрес, 200.html — фолбэк Nitro. Заголовок «Страница не найдена» тут норма.
const ERROR_PAGES = ['404.html', '200.html']

const ERROR_MARKER = 'data-error-page'
const ERROR_TITLE = 'Страница не найдена'

const errors = []
const fail = (msg) => errors.push(msg)

if (!existsSync(ROOT)) {
  console.error(`Нет каталога сборки ${ROOT} — сначала запусти nuxt generate`)
  process.exit(1)
}

/** Все .html внутри .output/public, пути — относительные, через «/». */
function htmlFiles(dir = ROOT) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full))
    else if (name.endsWith('.html')) out.push(relative(ROOT, full).split(sep).join('/'))
  }
  return out
}

const pages = htmlFiles()
const isExempt = (p) => EXEMPT_PREFIXES.some((prefix) => p.startsWith(prefix))
const isErrorPage = (p) => ERROR_PAGES.includes(p)

const read = (p) => readFileSync(join(ROOT, p), 'utf8')
const titleOf = (html) => html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ''
const robotsOf = (html) =>
  [...html.matchAll(/<meta[^>]+name=["']robots["'][^>]*>/gi)].map(
    (m) => m[0].match(/content=["']([^"']*)["']/i)?.[1]?.toLowerCase() ?? '',
  )

// ── 1. Запечённые 404: error.vue под адресом реальной страницы ──────────────
for (const p of pages) {
  if (isExempt(p) || isErrorPage(p)) continue
  const html = read(p)
  if (html.includes(ERROR_MARKER) || titleOf(html).includes(ERROR_TITLE)) {
    fail(`страница ошибки запеклась вместо контента: /${p}`)
  }
}

// ── 2. Пустой <title> — тоже брак, который уедет в выдачу ───────────────────
for (const p of pages) {
  if (isExempt(p)) continue
  if (!titleOf(read(p))) fail(`нет <title>: /${p}`)
}

// ── 3. Страницы ошибок обязаны быть в noindex (регресс-гейт на error.vue) ───
for (const p of ERROR_PAGES) {
  if (!pages.includes(p)) {
    fail(`в сборке нет ${p}`)
    continue
  }
  const rules = robotsOf(read(p))
  if (!rules.some((r) => r.includes('noindex'))) {
    fail(`${p} без noindex — потеряна страховка error.vue (useRobotsRule)`)
  }
}

// ── 4. Противоречивые директивы robots на одной странице ────────────────────
for (const p of pages) {
  if (isExempt(p)) continue
  const rules = robotsOf(read(p))
  const hasNoindex = rules.some((r) => r.includes('noindex'))
  const hasIndex = rules.some((r) => !r.includes('noindex') && r.includes('index'))
  if (hasNoindex && hasIndex) {
    fail(`конфликт мет robots (index + noindex): /${p} → ${rules.join(' | ')}`)
  }
}

// ── 5. Canonical на каждой индексируемой странице Nuxt ─────────────────────
for (const p of pages) {
  if (isExempt(p) || isErrorPage(p)) continue
  const html = read(p)
  // Закрытым от индекса страницам (/thanks/, /add-server/, /rating/) canonical
  // не нужен — они в выдачу не идут.
  if (robotsOf(html).some((r) => r.includes('noindex'))) continue
  if (!/rel=["']canonical["']/i.test(html)) fail(`нет canonical: /${p}`)
}

// ── 6. Паритет карты сайта и сборки ─────────────────────────────────────────
// Карта не должна обещать поисковику адреса, которых сборка не создала
// (так /chronicle/freya/ и ещё 6 хроник отдавали 404, найдено 19.08.2026),
// и не должна тянуть в индекс страницы, закрытые noindex.
const sitemapPath = join(ROOT, 'sitemap.xml')
if (!existsSync(sitemapPath)) {
  fail('в сборке нет sitemap.xml')
} else {
  const xml = readFileSync(sitemapPath, 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  if (locs.length < 50) fail(`в sitemap.xml всего ${locs.length} адресов — карта собралась пустой`)
  for (const loc of locs) {
    const path = loc.replace(/^https?:\/\/[^/]+/, '')
    if (path.includes('.xml')) continue
    const file = path === '/' ? 'index.html' : `${path.replace(/^\/|\/$/g, '')}/index.html`
    if (!pages.includes(file)) {
      fail(`sitemap обещает страницу, которой нет в сборке: ${path}`)
      continue
    }
    if (robotsOf(read(file)).some((r) => r.includes('noindex'))) {
      fail(`страница в sitemap закрыта noindex: ${path}`)
    }
  }
}

// ── 7. Внутренние ссылки ведут на существующие страницы ────────────────────
// Ссылка на несобранный адрес — это 404 и для читателя, и для краулера:
// в мае-2026 статьи блога ссылались на фильтры вида /chronicle/high-five/rate/x15/
// с рейтами, которых нет в data/rates.json, — таких страниц сборка не создаёт.
const allFiles = new Set()
;(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full)
    else allFiles.add(relative(ROOT, full).split(sep).join('/'))
  }
})(ROOT)

const brokenLinks = new Map()
for (const p of pages) {
  if (isExempt(p)) continue
  for (const m of read(p).matchAll(/href=["'](\/[^"'#?]*)["']/g)) {
    const href = m[1].trim() // в markdown встречаются ссылки с пробелом перед «)»
    if (/\.[a-z0-9]{2,12}$/i.test(href)) continue // файлы: .js, .css, .webmanifest…
    const file = href === '/' ? 'index.html' : `${href.replace(/^\/|\/$/g, '')}/index.html`
    if (!allFiles.has(file) && !brokenLinks.has(href)) brokenLinks.set(href, p)
  }
}
for (const [href, from] of brokenLinks) {
  fail(`ссылка на несуществующую страницу: ${href} (со страницы /${from})`)
}

if (errors.length) {
  console.error(`\nПроверка сборки не пройдена — ${errors.length} проблем(ы):`)
  for (const e of errors) console.error(`  • ${e}`)
  console.error('\nДеплой остановлен.')
  process.exit(1)
}

console.log(`OK: проверено ${pages.length} HTML-страниц, замечаний нет`)
