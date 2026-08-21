#!/usr/bin/env node
/**
 * Смоук-тест живого сайта после заливки на хостинг. Запускается из
 * .github/workflows/deploy.yml, руками — так:
 *
 *   node scripts/check-live.mjs                 # проверить https://l2gm.com
 *   node scripts/check-live.mjs https://l2gm.com
 *
 * Гейт scripts/check-build.mjs проверяет сборку, но не то, что реально легло
 * на хостинг: FTP заливает файлы поштучно, и оборванная заливка оставляет
 * часть страниц битыми, а workflow при этом отчитается об успехе.
 *
 * Список адресов берём из локальной сборки (.output/public) — тогда в проверку
 * попадают и страницы вне карты сайта (/cookies/, /chronicle/x/rate/y/), — и
 * дополняем адресами из живого sitemap.xml: так ловится и случай, когда карта
 * обещает поисковику страницу, которой на хостинге нет.
 */
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = (process.argv[2] || 'https://l2gm.com').replace(/\/$/, '')
const ROOT = resolve(__dirname, '..', '.output', 'public')
const UA = 'Mozilla/5.0 (compatible; l2gm-deploy-check)'
const CONCURRENCY = 8
const ERROR_TITLE = 'Страница не найдена'

/** Пути всех собранных страниц: api/ и служебные оболочки пропускаем. */
function builtPaths(dir = ROOT) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...builtPaths(full))
    else if (name === 'index.html') {
      const rel = relative(ROOT, full).split(sep).join('/').replace(/index\.html$/, '')
      out.push(`/${rel}`)
    }
  }
  return out
}

const paths = new Set()
if (existsSync(ROOT)) {
  for (const p of builtPaths()) {
    if (p.startsWith('/api/') || p.startsWith('/comments-api/')) continue
    paths.add(p)
  }
}

// Живая карта сайта: и сама по себе проверка (пустая карта = битый деплой),
// и источник адресов, если сборки рядом нет.
const sitemapRes = await fetch(`${BASE}/sitemap.xml`, { headers: { 'user-agent': UA } })
const sitemapXml = sitemapRes.ok ? await sitemapRes.text() : ''
const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
const failures = []

if (locs.length < 50) {
  failures.push(`sitemap.xml отдал ${locs.length} адресов — сайт после деплоя недоступен или карта битая`)
}
for (const loc of locs) {
  const path = loc.replace(/^https?:\/\/[^/]+/, '')
  if (!path.includes('.xml')) paths.add(path)
}

const queue = [...paths].sort()
console.log(`Проверяю ${queue.length} адресов на ${BASE}`)

async function check(path) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: { 'user-agent': UA },
        redirect: 'follow',
        signal: AbortSignal.timeout(25000),
      })
      const html = await res.text()
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ''
      if (!res.ok) {
        if (attempt === 2) return `HTTP ${res.status} — ${path}`
        continue
      }
      if (!title) return `без <title> — ${path}`
      if (title.includes(ERROR_TITLE) || html.includes('data-error-page')) {
        return `страница ошибки вместо контента — ${path}`
      }
      return null
    } catch (e) {
      // Одиночный сетевой сбой не должен красить деплой — вторая попытка.
      if (attempt === 2) return `${e.message} — ${path}`
    }
  }
}

let cursor = 0
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < queue.length) {
      const problem = await check(queue[cursor++])
      if (problem) failures.push(problem)
    }
  }),
)

if (failures.length) {
  console.error(`\nЖивой сайт отдаёт битые страницы — ${failures.length} шт.:`)
  for (const f of failures.sort()) console.error(`  • ${f}`)
  process.exit(1)
}

console.log(`OK: проверено ${queue.length} адресов, все отдают 200 и свой title`)
