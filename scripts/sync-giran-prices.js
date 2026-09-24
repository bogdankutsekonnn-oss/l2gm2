#!/usr/bin/env node
// Автозабор цен рынка с GiranInfo (giran.info, Lu4) в таблицу resources админки.
// Разрешение от владельцев GiranInfo есть — цены только для внутренней админки.
//
// giran.info/api/prices?server=Gamma отдаёт JSON по сессии Telegram-логина
// (без неё — 401). Сессию берём из cookie браузера: секрет GIRAN_COOKIE —
// целиком значение заголовка Cookie запроса к giran.info. Cookie протухает —
// тогда шлём предупреждение в Telegram и роняем job.
//
// Поля строки GiranInfo: s — продажа, b — скупка; m — медиана, e — лучшее
// предложение (у продажи минимум, у скупки максимум). Ложатся так:
//   sell_avg ← s.m, sell_min ← s.e, buy_avg ← b.m, buy_max ← b.e.
// Позиции, которых у GiranInfo нет (шоты, самоцветы, части Maestro…), не трогаем.
//
// Запускается по расписанию из .github/workflows/sync-giran-prices.yml.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const GIRAN_BASE = process.env.GIRAN_BASE || 'https://giran.info'
const GIRAN_SERVER = process.env.GIRAN_SERVER || 'Gamma'
const GIRAN_COOKIE = process.env.GIRAN_COOKIE || ''
const API_BASE = process.env.API_BASE || 'https://l2gm.com/api'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''
const TG_API_BASE = process.env.TG_API_BASE || 'https://api.telegram.org'
// chat_id не секрет — то же значение, что в public/api/config.php.
const CHAT_ID = process.env.TG_CHAT_ID || '8847413262'
const BOT_TOKEN = process.env.ZAYAVKI_BOT_TOKEN || ''

const SEED_PATH = path.join(__dirname, '..', 'public', 'api', 'prices-seed.json')

// Названия, которые у GiranInfo записаны иначе, чем у нас (после normName).
const ALIASES = {
  'crystal d grade': 'crystal-d',
  'crystal c grade': 'crystal-c',
  'crystal b grade': 'crystal-b',
  'crystal a grade': 'crystal-a',
}

// "High-Grade Suede" / "High Grade Suede", "Artisan's Frame" → одно и то же.
const normName = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

async function sendTelegram(text) {
  if (!BOT_TOKEN) return
  try {
    const res = await fetch(`${TG_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, disable_web_page_preview: true }),
    })
    if (!res.ok) console.error(`Telegram ${res.status}: ${(await res.text()).slice(0, 300)}`)
  } catch (e) {
    console.error('Telegram недоступен:', e.message)
  }
}

async function fail(msg, { notify = false } = {}) {
  console.error(msg)
  if (notify) await sendTelegram(`⚠️ Цены GiranInfo не обновились\n\n${msg}`)
  process.exit(1)
}

async function fetchGiran() {
  const url = `${GIRAN_BASE}/api/prices?server=${encodeURIComponent(GIRAN_SERVER)}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Cookie: GIRAN_COOKIE,
      'User-Agent': 'Mozilla/5.0 (l2gm price sync)',
    },
  })
  const text = await res.text()
  let data = null
  try { data = JSON.parse(text) } catch {}

  if (res.status === 401) {
    await fail(
      'GiranInfo не пускает (401): cookie протухла. Зайди на giran.info через Telegram ' +
      'и обнови секрет GIRAN_COOKIE в GitHub.',
      { notify: true },
    )
  }
  if (!res.ok || !data) await fail(`GiranInfo ответил ${res.status}: ${text.slice(0, 300)}`, { notify: true })
  if (data.tier === 'none') {
    await fail(
      'GiranInfo пускает, но доступа к ценам нет (tier=none) — проверь подписку на @GiranInfo ' +
      'у аккаунта, чья cookie в GIRAN_COOKIE.',
      { notify: true },
    )
  }
  return data
}

function toFields(row) {
  const s = row.s || {}
  const b = row.b || {}
  const out = {}
  if (s.m != null) out.sell_avg = Math.round(s.m)
  if (s.e != null) out.sell_min = Math.round(s.e)
  if (b.m != null) out.buy_avg = Math.round(b.m)
  if (b.e != null) out.buy_max = Math.round(b.e)
  return out
}

async function main() {
  if (!GIRAN_COOKIE) await fail('Нет GIRAN_COOKIE — нечем авторизоваться на giran.info.')
  if (!ADMIN_TOKEN) await fail('Нет ADMIN_TOKEN — нечем писать в админку.')

  const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'))
  const slugByName = { ...ALIASES }
  for (const r of seed) slugByName[normName(r.name)] = r.slug

  const data = await fetchGiran()
  const rows = data.items || {}

  const items = {}
  const unmatched = []
  for (const [name, row] of Object.entries(rows)) {
    const slug = slugByName[normName(name)]
    if (!slug) { unmatched.push(name); continue }
    const fields = toFields(row)
    if (Object.keys(fields).length) items[slug] = fields
  }

  console.log(
    `GiranInfo: сервер ${data.server || GIRAN_SERVER}, срез от ${data.as_of || '—'}, ` +
    `позиций ${Object.keys(rows).length}, сопоставлено ${Object.keys(items).length}`,
  )
  if (unmatched.length) console.log(`Нет в нашей таблице: ${unmatched.join(', ')}`)
  if (!Object.keys(items).length) await fail('Ни одной позиции не сопоставилось — формат GiranInfo поменялся?', { notify: true })

  const res = await fetch(`${API_BASE}/prices.php?action=bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify({ items }),
  })
  const body = await res.text()
  if (!res.ok) await fail(`Админка ответила ${res.status}: ${body.slice(0, 300)}`, { notify: true })

  const r = JSON.parse(body)
  console.log(`Записано: ресурсов изменилось ${r.updated}, полей ${r.fields}`)
  if (r.unknown?.length) console.log(`Slug не найден в базе: ${r.unknown.join(', ')}`)
}

main().catch((e) => fail(`Автозабор цен упал: ${e.message}`, { notify: true }))
