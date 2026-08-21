#!/usr/bin/env node
// Заведение пользователя админки (таблица admin_users на Timeweb).
//
// Пароль хэшится bcrypt'ом на стороне PHP, поэтому напрямую в phpMyAdmin
// пользователя не добавить — только через public/api/add-user.php. Скрипт
// дёргает его по HTTP мастер-токеном, чтобы не лазить на сервер по SSH.
//
//   node scripts/add-admin-user.js <логин> [пароль]
//
// Пароль можно не писать в командной строке — тогда скрипт спросит его
// и введённое не будет видно на экране (и не осядет в истории shell).
//
// Мастер-токен берётся из ADMIN_TOKEN в окружении, иначе из
// public/api/secrets.php (файл в .gitignore, лежит только локально).

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SECRETS_PATH = path.join(__dirname, '..', 'public', 'api', 'secrets.php')
const API_BASE = process.env.API_BASE || 'https://l2gm.com/api'
const MIN_PASSWORD = 6

function fail(msg) {
  console.error('✗ ' + msg)
  process.exit(1)
}

function readToken() {
  if (process.env.ADMIN_TOKEN) return process.env.ADMIN_TOKEN
  if (!fs.existsSync(SECRETS_PATH)) {
    fail(`не нашёл ${SECRETS_PATH}.\n  Положи туда secrets.php или запусти с ADMIN_TOKEN=... в окружении.`)
  }
  const m = fs.readFileSync(SECRETS_PATH, 'utf8').match(/define\(\s*'ADMIN_TOKEN'\s*,\s*'([^']+)'/)
  if (!m) fail(`в ${SECRETS_PATH} нет define('ADMIN_TOKEN', ...)`)
  return m[1]
}

// Спрятанный ввод: readline пишет промпт сам, поэтому глушим всё остальное.
function askPassword(prompt) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    let muted = false
    rl._writeToOutput = function (chunk) {
      if (!muted) rl.output.write(chunk)
    }
    rl.question(prompt, answer => {
      rl.close()
      process.stdout.write('\n')
      resolve(answer)
    })
    muted = true
  })
}

async function api(url, options) {
  let res
  try {
    res = await fetch(url, options)
  } catch (e) {
    fail(`сеть недоступна: ${e.message}`)
  }
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    fail(`сервер ответил не JSON (HTTP ${res.status}):\n${text.slice(0, 300)}`)
  }
  return { res, data }
}

const username = (process.argv[2] || '').trim()
if (!username) {
  console.error('Использование: node scripts/add-admin-user.js <логин> [пароль]')
  process.exit(1)
}

const token = readToken()
let password = process.argv[3]
if (password === undefined) {
  password = await askPassword(`Пароль для ${username}: `)
}
if (password.length < MIN_PASSWORD) {
  fail(`пароль короче ${MIN_PASSWORD} символов — add-user.php такой не примет`)
}

// 1. Создаём (или перезаписываем пароль, если логин уже занят)
const created = await api(`${API_BASE}/add-user.php`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
})

if (!created.res.ok) {
  if (created.res.status === 401) {
    fail('мастер-токен не подошёл. Проверь ADMIN_TOKEN в secrets.php — он должен совпадать с тем, что лежит на проде.')
  }
  fail(`add-user.php: ${created.data.error || 'HTTP ' + created.res.status}`)
}

if (created.data.updated) {
  console.log(`⚠ Логин "${username}" уже существовал — перезаписал ему пароль.`)
} else {
  console.log(`✓ Пользователь "${username}" создан (id ${created.data.id}).`)
}

// 2. Тут же проверяем, что этим паролем реально пускает
const login = await api(`${API_BASE}/auth.php?action=login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
})

if (!login.res.ok) {
  fail(`пользователь записан, но вход не сработал: ${login.data.error || 'HTTP ' + login.res.status}`)
}

// Проверочную сессию сразу гасим, чтобы не висела лишняя запись 30 дней
await fetch(`${API_BASE}/auth.php?action=logout`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + login.data.token },
}).catch(() => {})

console.log(`✓ Вход проверен — можно логиниться на ${API_BASE.replace(/\/api$/, '')}/api/admin-merchants.html`)
