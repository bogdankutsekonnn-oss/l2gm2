#!/usr/bin/env node
/**
 * IndexNow: сообщаем Яндексу (и через api.indexnow.org — Bing и остальным),
 * какие страницы обновились. Запускается из .github/workflows/deploy.yml
 * после смоук-теста, руками — так:
 *
 *   node scripts/indexnow.mjs --all                        # все адреса из карты
 *   node scripts/indexnow.mjs --before /tmp/sitemap-before.xml
 *
 * Адреса берём из собранной карты (.output/public/sitemap.xml):
 *   --all     — все (пуш в main: могли поменяться статьи и шаблоны);
 *   без него  — страницы с changefreq=daily (списки серверов, они меняются при
 *               каждом ребилде и синке) плюс адреса, которых не было в живой
 *               карте до заливки (--before) — например, новая хроника.
 *
 * Ключ лежит в public/<KEY>.txt: по протоколу он публичный, это не секрет.
 * Ошибка отправки деплой не роняет — только предупреждение в логе.
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITEMAP = resolve(__dirname, '..', '.output', 'public', 'sitemap.xml')
const HOST = 'l2gm.com'
const KEY = 'de343f0e2dbbec2b6e2d71967896826c'
const ENDPOINTS = ['https://yandex.com/indexnow', 'https://api.indexnow.org/indexnow']

const args = process.argv.slice(2)
const ALL = args.includes('--all')
const beforeIdx = args.indexOf('--before')
const BEFORE = beforeIdx >= 0 ? args[beforeIdx + 1] : null

/** [{ loc, changefreq }] из sitemap.xml. */
function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1]?.trim(),
    changefreq: (m[1].match(/<changefreq>([^<]+)<\/changefreq>/) || [])[1]?.trim(),
  })).filter((u) => u.loc)
}

if (!existsSync(SITEMAP)) {
  console.warn(`::warning::IndexNow: нет ${SITEMAP}, отправлять нечего`)
  process.exit(0)
}
const urls = parseSitemap(readFileSync(SITEMAP, 'utf8'))

let selected
if (ALL) {
  selected = urls.map((u) => u.loc)
} else {
  const before = BEFORE && existsSync(BEFORE)
    ? new Set(parseSitemap(readFileSync(BEFORE, 'utf8')).map((u) => u.loc))
    : null
  selected = urls
    .filter((u) => u.changefreq === 'daily' || (before && before.size && !before.has(u.loc)))
    .map((u) => u.loc)
}
selected = [...new Set(selected)].filter((loc) => new URL(loc).host === HOST)

if (!selected.length) {
  console.log('IndexNow: новых и обновлённых адресов нет')
  process.exit(0)
}

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: selected,
})

console.log(`IndexNow: отправляем ${selected.length} адрес(ов)`)
for (const endpoint of ENDPOINTS) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body,
    })
    // 200 — принято, 202 — принято, ключ ещё проверяется.
    if (res.ok) console.log(`  ${endpoint}: ${res.status}`)
    else console.warn(`::warning::IndexNow ${endpoint}: ${res.status} ${(await res.text()).slice(0, 200)}`)
  } catch (e) {
    console.warn(`::warning::IndexNow ${endpoint}: ${e.message}`)
  }
}
