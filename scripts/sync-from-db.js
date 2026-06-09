#!/usr/bin/env node
// Синк серверов из админ-базы (MySQL на Timeweb) в data/servers.json.
//
// Тянет approved-сервера из публичного API (/api/servers.php — отдаёт только
// status=approved) и мёржит их в servers.json:
//   - существующий сервер (совпал по ключу url|chronicle|rate) — обновляем
//     дату старта и платные поля (фаза-серверы меняют дату, владельцы — тариф);
//   - новый — добавляем с новым локальным id.
//
// Скрейпленные сервера (которых нет в базе) НЕ трогаем и НЕ удаляем — за их
// чистку отвечает scripts/update-servers.js (старше месяца).
//
// Запускается по расписанию из .github/workflows/sync-servers.yml.

import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SERVERS_PATH = path.join(__dirname, '..', 'data', 'servers.json')
const API_URL = process.env.SERVERS_API_URL || 'https://l2gm.com/api/servers.php'

// Ключ дедупликации — тот же, что в update-servers.js, чтобы синк и
// еженедельный скрейп схлопывали дубли одинаково.
function normalizeUrl(url) {
  if (!url) return ''
  return String(url)
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
}

function serverKey(s) {
  return `${normalizeUrl(s.url)}|${s.chronicle}|${s.category ?? s.rate}`
}

async function fetchApproved() {
  const res = await fetch(API_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('API вернул не массив')
  return data
}

const existing = JSON.parse(fs.readFileSync(SERVERS_PATH, 'utf8'))
const before = JSON.stringify(existing)

let dbServers
try {
  dbServers = await fetchApproved()
} catch (e) {
  // API недоступен — не трогаем json, выходим без изменений (без ошибки,
  // чтобы расписание не падало на каждом сбое сети).
  console.error(`Не удалось получить сервера из API: ${e.message}`)
  console.log('Изменений нет (API недоступен).')
  process.exit(0)
}

const byKey = new Map(existing.map((s) => [serverKey(s), s]))
let maxId = existing.reduce((m, s) => Math.max(m, s.id || 0), 0)
const todayStr = new Date().toISOString().split('T')[0]

let added = 0
let updated = 0

for (const db of dbServers) {
  const entry = {
    name: (db.name || '').toUpperCase(),
    url: db.url,
    chronicle: db.chronicle,
    rate: db.rate ?? null,
    startDate: db.startDate,
    cardType: db.cardType || 'basic',
    icons: Array.isArray(db.icons) ? db.icons : [],
    avatarUrl: db.avatarUrl ?? null,
    description: db.description ?? null,
    expiresAt: db.expiresAt ?? null,
    ...(db.category ? { category: db.category } : {}),
  }

  const key = serverKey(db)
  const found = byKey.get(key)

  if (found) {
    // Обновляем поля, которыми управляет админка. Не затираем то, чего в
    // базе нет (avatarUrl/description), чтобы не потерять данные из json.
    const patch = {
      startDate: entry.startDate,
      cardType: entry.cardType,
      icons: entry.icons,
      expiresAt: entry.expiresAt,
      name: entry.name,
      ...(entry.avatarUrl != null ? { avatarUrl: entry.avatarUrl } : {}),
      ...(entry.description != null ? { description: entry.description } : {}),
      ...(entry.category ? { category: entry.category } : {}),
    }
    const changed = Object.keys(patch).some(
      (k) => JSON.stringify(found[k]) !== JSON.stringify(patch[k]),
    )
    if (changed) {
      Object.assign(found, patch)
      updated++
    }
  } else {
    maxId++
    const fresh = {
      id: maxId,
      name: entry.name,
      url: entry.url,
      chronicle: entry.chronicle,
      rate: entry.rate,
      startDate: entry.startDate,
      cardType: entry.cardType,
      icons: entry.icons,
      avatarUrl: entry.avatarUrl,
      ownerId: null,
      description: entry.description,
      createdAt: todayStr,
      expiresAt: entry.expiresAt,
      ...(entry.category ? { category: entry.category } : {}),
    }
    existing.push(fresh)
    byKey.set(key, fresh)
    added++
  }
}

// Сортировка как в update-servers.js: по дате старта, затем по id.
existing.sort((a, b) => {
  const da = new Date(a.startDate)
  const db = new Date(b.startDate)
  if (da < db) return -1
  if (da > db) return 1
  return a.id - b.id
})

const after = JSON.stringify(existing)
const changed = before !== after

if (changed) {
  fs.writeFileSync(SERVERS_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8')
}

console.log('\n=== Sync from DB ===')
console.log(`  API:      ${API_URL}`)
console.log(`  Из базы:  ${dbServers.length} approved`)
console.log(`  Added:    ${added}`)
console.log(`  Updated:  ${updated}`)
console.log(`  Total:    ${existing.length} servers`)
console.log(changed ? '\nservers.json обновлён.' : '\nИзменений нет.')

// Код выхода для CI: 0 = нет изменений, 10 = есть изменения (нужен коммит+деплой).
process.exit(changed ? 10 : 0)
