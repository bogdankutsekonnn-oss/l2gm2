#!/usr/bin/env node
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '..', 'data')
const SERVERS_PATH = path.join(DATA_DIR, 'servers.json')
const NEW_SERVERS_PATH = path.join(DATA_DIR, 'new-servers.json')

function normalizeChronicle(chr) {
  if (!chr) return null
  const lower = chr.toLowerCase().trim()
  const map = {
    'c4': 'C4',
    'interlude': 'Interlude',
    'interlude+': 'Interlude+',
    'classic': 'Classic',
    'high five': 'High Five',
    'highfive': 'High Five',
    'hf': 'High Five',
    'high five+': 'High Five+',
    'highfive+': 'High Five+',
    'hf+': 'High Five+',
    'epilogue': 'Epilogue',
    'essence': 'Essence',
    'crusade': 'Crusade',
    'god': 'GoD',
    'goddess of destruction': 'GoD'
  }
  return map[lower] || null
}

function parseRate(rateStr) {
  if (typeof rateStr === 'number') return rateStr
  if (!rateStr) return null
  const s = String(rateStr).toLowerCase().replace(/\s/g, '').replace(/^x/, '')
  if (s.endsWith('k')) return parseInt(s) * 1000
  return parseInt(s) || null
}

function normalizeUrl(url) {
  if (!url) return ''
  let u = url.toLowerCase().trim()
  u = u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '')
  return u
}

function serverKey(s) {
  return `${normalizeUrl(s.url)}|${s.chronicle}|${s.category || s.rate}`
}

function isOlderThanOneMonth(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cutoff = new Date(today)
  cutoff.setMonth(cutoff.getMonth() - 1)
  const d = new Date(dateStr)
  return d < cutoff
}

if (!fs.existsSync(NEW_SERVERS_PATH)) {
  console.error('Error: data/new-servers.json not found')
  console.log('Create data/new-servers.json with an array of new server objects:')
  console.log('[{ "name": "...", "url": "...", "chronicle": "...", "rate": 100, "startDate": "2026-05-15" }]')
  process.exit(1)
}

const existing = JSON.parse(fs.readFileSync(SERVERS_PATH, 'utf8'))
const newServers = JSON.parse(fs.readFileSync(NEW_SERVERS_PATH, 'utf8'))

const existingKeys = new Set(existing.map(serverKey))
let maxId = Math.max(...existing.map(s => s.id), 0)
const todayStr = new Date().toISOString().split('T')[0]

let added = 0
let skipped = 0
let invalidChronicle = 0

for (const ns of newServers) {
  const chronicle = normalizeChronicle(ns.chronicle)
  if (!chronicle) {
    console.warn(`  Skip (unknown chronicle "${ns.chronicle}"): ${ns.name}`)
    invalidChronicle++
    continue
  }

  const isGve = ns.category === 'gve'
  const rate = isGve ? null : parseRate(ns.rate)
  if (!rate && !isGve) {
    console.warn(`  Skip (invalid rate "${ns.rate}"): ${ns.name}`)
    skipped++
    continue
  }

  let url = ns.url || ''
  if (url && !url.startsWith('http')) url = 'https://' + url

  const entry = {
    name: ns.name,
    url,
    chronicle,
    rate,
    startDate: ns.startDate,
    category: ns.category || undefined
  }

  const key = serverKey(entry)
  if (existingKeys.has(key)) {
    skipped++
    continue
  }

  maxId++
  existing.push({
    id: maxId,
    name: entry.name.toUpperCase(),
    url: entry.url,
    chronicle: entry.chronicle,
    rate: entry.rate,
    startDate: entry.startDate,
    cardType: 'basic',
    icons: [],
    avatarUrl: null,
    ownerId: null,
    description: null,
    createdAt: todayStr,
    expiresAt: null,
    ...(entry.category ? { category: entry.category } : {})
  })
  existingKeys.add(key)
  added++
}

let removed = 0
const filtered = existing.filter(s => {
  if (s.ownerId) return true
  if (isOlderThanOneMonth(s.startDate)) {
    removed++
    return false
  }
  return true
})

filtered.sort((a, b) => {
  const da = new Date(a.startDate)
  const db = new Date(b.startDate)
  if (da < db) return -1
  if (da > db) return 1
  return a.id - b.id
})

fs.writeFileSync(SERVERS_PATH, JSON.stringify(filtered, null, 2) + '\n', 'utf8')

console.log('\n=== Server Update Summary ===')
console.log(`  Added:    ${added}`)
console.log(`  Skipped:  ${skipped} (duplicates)`)
console.log(`  Invalid:  ${invalidChronicle} (unknown chronicle)`)
console.log(`  Removed:  ${removed} (older than 1 month)`)
console.log(`  Total:    ${filtered.length} servers`)
console.log('\nDone! Cleaned up data/new-servers.json')

fs.unlinkSync(NEW_SERVERS_PATH)
