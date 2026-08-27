#!/usr/bin/env node
// Уведомления в Telegram: заявки на добавление сервера и письма из формы «О нас».
//
// Почему не с хостинга: Timeweb не пускает исходящие на api.telegram.org —
// соединение на 443 виснет по таймауту (http_code 0, «Connection timed out»).
// public/api/contact.php из-за этого слал в пустоту, а формы на сайте сбой
// глотали: заявки молча оседали в базе, письма пропадали совсем. Раннеры
// GitHub Actions до телеги достают — отправляем отсюда.
//
// Обе очереди читаются из админского API и отправляются по курсору: всё, чей
// id больше отмеченного, считается новым. Курсоры лежат в
// .github/notified-applications.json и коммитятся обратно в репозиторий.
//
// Запускается по расписанию из .github/workflows/notify-applications.yml.
// Коды выхода: 0 — новых нет; 10 — отправлено, курсор сдвинут (воркфлоу
// коммитит файл); 11 — отправлено частично, потом обрыв (коммитим и роняем);
// 1 — не отправлено ничего из-за ошибки.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_BASE = process.env.API_BASE || 'https://l2gm.com/api'
const STATE_PATH = path.join(__dirname, '..', '.github', 'notified-applications.json')
// База телеги вынесена в переменную по той же причине, что API_BASE, — чтобы
// скрипт можно было прогнать против заглушки, не трогая боевой чат.
const TG_API_BASE = process.env.TG_API_BASE || 'https://api.telegram.org'
// chat_id не секрет — то же значение, что в public/api/config.php.
const CHAT_ID = process.env.TG_CHAT_ID || '8847413262'
const BOT_TOKEN = process.env.ZAYAVKI_BOT_TOKEN || ''
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

if (!BOT_TOKEN) {
  console.error('Нет ZAYAVKI_BOT_TOKEN — отправить некому.')
  process.exit(1)
}
if (!ADMIN_TOKEN) {
  console.error('Нет ADMIN_TOKEN — API отдаёт только публичные данные.')
  process.exit(1)
}

// Протухший ADMIN_TOKEN нельзя молча приравнивать к «сеть моргнула»: письма
// перестанут приходить, а запуски останутся зелёными — ровно та беда, из-за
// которой уведомления и потерялись в первый раз.
class AuthError extends Error {}

function readState() {
  try {
    const raw = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'))
    return {
      lastNotifiedId: Number(raw.lastNotifiedId) || 0,
      lastContactId: Number(raw.lastContactId) || 0,
    }
  } catch {
    return { lastNotifiedId: 0, lastContactId: 0 }
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n')
}

async function apiGet(pathAndQuery) {
  const res = await fetch(`${API_BASE}${pathAndQuery}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
  })
  if (res.status === 401 || res.status === 403) {
    throw new AuthError(`API отверг ADMIN_TOKEN (${res.status}) — обнови секрет`)
  }
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('API вернул не массив')
  return data
}

// Без parse_mode: имена серверов и текст писем регулярно содержат *, _ и
// скобки, на которых Markdown у телеги разваливается и сообщение не уходит.
async function sendTelegram(text) {
  const res = await fetch(`${TG_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, disable_web_page_preview: true }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${body.slice(0, 300)}`)
}

const list = (v) => (Array.isArray(v) && v.length ? v.join(', ') : '—')

const STREAMS = [
  {
    label: 'заявок',
    cursorKey: 'lastNotifiedId',
    async fetch() {
      const all = await apiGet('/servers.php?all=1')
      return all.filter((s) => s.status === 'pending')
    },
    format: (s) =>
      [
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
      ].join('\n'),
  },
  {
    label: 'писем',
    cursorKey: 'lastContactId',
    // since отсекает уже отправленное на стороне базы — таблица растёт, а
    // тянуть её целиком каждые полчаса незачем.
    fetch: (cursor) => apiGet(`/messages.php?since=${cursor}`),
    format: (m) =>
      [
        '📩 Сообщение с сайта (О нас)',
        '',
        `Имя: ${m.name || '—'}`,
        `Контакт: ${m.reply || '—'}`,
        '',
        m.message || '—',
      ].join('\n'),
  },
]

const state = readState()
const before = JSON.stringify(state)
let failure = null
let totalSent = 0

for (const stream of STREAMS) {
  if (failure) break

  let items
  try {
    items = await stream.fetch(state[stream.cursorKey])
  } catch (e) {
    if (e instanceof AuthError) {
      failure = e
      break
    }
    // API прилёг — не роняем расписание, попробуем через полчаса. Курсор не
    // двигаем, так что ничего не потеряется.
    console.error(`Не удалось получить ${stream.label}: ${e.message}`)
    continue
  }

  const fresh = items
    .filter((i) => Number(i.id) > state[stream.cursorKey])
    .sort((a, b) => a.id - b.id)

  if (fresh.length === 0) {
    console.log(`Новых ${stream.label} нет (последнее — #${state[stream.cursorKey]}).`)
    continue
  }

  // Курсор двигаем по мере отправки: если телега отвалится на середине,
  // отправленное не продублируется, а остаток уйдёт следующим запуском.
  let sent = 0
  for (const item of fresh) {
    try {
      await sendTelegram(stream.format(item))
    } catch (e) {
      failure = e
      break
    }
    state[stream.cursorKey] = Number(item.id)
    sent++
    totalSent++
  }
  console.log(`Отправлено ${stream.label}: ${sent} из ${fresh.length} (до #${state[stream.cursorKey]}).`)
}

const changed = JSON.stringify(state) !== before
if (changed) writeState(state)

if (failure) {
  console.error(`Отправка оборвалась: ${failure.message}`)
  process.exit(totalSent > 0 ? 11 : 1)
}

process.exit(changed ? 10 : 0)
