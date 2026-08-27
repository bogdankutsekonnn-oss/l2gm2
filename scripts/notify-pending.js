#!/usr/bin/env node
// Уведомления в Telegram о новых заявках на добавление сервера.
//
// Почему не с хостинга: Timeweb не пускает исходящие на api.telegram.org —
// соединение на 443 виснет по таймауту (http_code 0, «Connection timed out»).
// public/api/contact.php из-за этого шлёт в пустоту, а форма на сайте сбой
// глотает, поэтому заявки молча оседали в базе без единого сообщения в чат.
// Раннеры GitHub Actions до телеги достают — отправляем отсюда.
//
// Тянем все заявки из админского API, отбираем status=pending и шлём те, чей
// id больше последнего отправленного. Отметка лежит в
// .github/notified-applications.json и коммитится обратно в репозиторий.
//
// Запускается по расписанию из .github/workflows/notify-applications.yml.
// Код выхода 10 — отметка сдвинулась, воркфлоу коммитит файл.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_URL = process.env.SERVERS_API_URL || 'https://l2gm.com/api/servers.php'
const STATE_PATH = path.join(__dirname, '..', '.github', 'notified-applications.json')
// chat_id не секрет — то же значение, что в public/api/config.php.
const CHAT_ID = process.env.TG_CHAT_ID || '8847413262'
const BOT_TOKEN = process.env.ZAYAVKI_BOT_TOKEN || ''
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

if (!BOT_TOKEN) {
  console.error('Нет ZAYAVKI_BOT_TOKEN — заявки отправить некому.')
  process.exit(1)
}
if (!ADMIN_TOKEN) {
  console.error('Нет ADMIN_TOKEN — API заявок отдаёт только approved.')
  process.exit(1)
}

function readState() {
  try {
    const raw = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'))
    return Number(raw.lastNotifiedId) || 0
  } catch {
    return 0
  }
}

// Заявки приходят с автоинкрементным id, поэтому хватает одного числа:
// всё, что больше — новое. Одобрение и отклонение отметку не трогают.
function writeState(lastNotifiedId) {
  fs.writeFileSync(STATE_PATH, JSON.stringify({ lastNotifiedId }, null, 2) + '\n')
}

async function fetchApplications() {
  const res = await fetch(`${API_URL}?all=1`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
  })
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('API вернул не массив')
  return data
}

// Без parse_mode: названия серверов регулярно содержат *, _ и скобки, на
// которых Markdown у телеги разваливается и сообщение не уходит вовсе.
function formatMessage(s) {
  const list = (v) => (Array.isArray(v) && v.length ? v.join(', ') : '—')
  return [
    '🎮 Новая заявка на добавление сервера',
    '',
    `Название: ${s.name || '—'}`,
    `Сайт: ${s.url || '—'}`,
    `Хроники: ${s.chronicle || '—'}`,
    `Рейты: ${s.category || s.rate || '—'}`,
    `Дата открытия: ${s.startDate || '—'}`,
    `Тариф: ${s.cardType || '—'}`,
    `Тип сервера: ${list(s.serverTypes)}`,
    `Доп. значки: ${list(s.icons)}`,
    `Email: ${s.email || '—'}`,
    `Контакты: ${s.contacts || '—'}`,
    '',
    `Модерация: https://l2gm.com/api/admin-panel.html (заявка #${s.id})`,
  ].join('\n')
}

// База телеги вынесена в переменную по той же причине, что SERVERS_API_URL, —
// чтобы скрипт можно было прогнать против заглушки, не трогая боевой чат.
const TG_API_BASE = process.env.TG_API_BASE || 'https://api.telegram.org'

async function sendTelegram(text) {
  const res = await fetch(`${TG_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, disable_web_page_preview: true }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${body.slice(0, 300)}`)
}

let applications
try {
  applications = await fetchApplications()
} catch (e) {
  // API прилёг — не роняем расписание, попробуем через полчаса. Отметку не
  // двигаем, так что ни одна заявка не потеряется.
  console.error(`Не удалось получить заявки: ${e.message}`)
  process.exit(0)
}

const lastNotifiedId = readState()
const fresh = applications
  .filter((s) => s.status === 'pending' && Number(s.id) > lastNotifiedId)
  .sort((a, b) => a.id - b.id)

if (fresh.length === 0) {
  console.log(`Новых заявок нет (последняя отправленная — #${lastNotifiedId}).`)
  process.exit(0)
}

// Отметку двигаем по мере отправки: если телега отвалится на середине,
// отправленные не продублируются, а оставшиеся уйдут следующим запуском.
let sent = 0
let cursor = lastNotifiedId
let failure = null
for (const s of fresh) {
  try {
    await sendTelegram(formatMessage(s))
  } catch (e) {
    failure = e
    break
  }
  cursor = s.id
  sent++
}

if (cursor !== lastNotifiedId) writeState(cursor)
console.log(`Отправлено заявок: ${sent} из ${fresh.length} (до #${cursor}).`)

if (failure) {
  console.error(`Отправка оборвалась: ${failure.message}`)
  // 11 — часть ушла, отметку надо закоммитить, но запуск считаем упавшим,
  // чтобы обрыв был виден в Actions, а не терялся в зелёном логе.
  process.exit(sent > 0 ? 11 : 1)
}

process.exit(10)
