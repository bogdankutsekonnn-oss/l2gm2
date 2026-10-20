#!/usr/bin/env node
// Сбор анонсов с l2pick.com и l2oops.com → data/new-servers.json.
// Дальше как обычно: node scripts/update-servers.js (дедуп, перенос дат, чистка).
//
// Раньше это делалось пересказом WebFetch, и он путал домены (scryde.com
// вместо scryde.game). Здесь разбор идёт по разметке, без LLM.
//
//   node scripts/scrape-competitors.js          — собрать и записать
//   node scripts/scrape-competitors.js --dry    — только показать сводку
//
// Типы серверов берутся со страниц-категорий l2pick: /multicraft/,
// /multiproff/, /eng/ (зарубежные). VIP-блоки там одинаковые на всех
// страницах, поэтому для разметки типов они не используются.
// Мультискилл l2oops сознательно не считаем мультипрофой — это другое, а их
// «иностранные сервера» — смесь, где есть Scryde и Lu4; зарубежные берём только с l2pick.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_PATH = path.join(__dirname, '..', 'data', 'new-servers.json')
const SERVERS_PATH = path.join(__dirname, '..', 'data', 'servers.json')
const DRY = process.argv.includes('--dry')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

// Старты старше этого окна update-servers.js всё равно вычистит.
const MAX_AGE_DAYS = 31

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'ru' },
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return res.text()
}

const decodeEntities = (s) =>
  s
    .replace(/&#0?38;|&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const stripTags = (s) => decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

// «la2titan [допы]» → «la2titan»
const cleanName = (s) => stripTags(s).replace(/\[[^\]]*\]/g, '').replace(/\(.*?\)/g, '').trim()

const DOMAIN_RE = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i
const looksLikeDomain = (name) => DOMAIN_RE.test(name.replace(/^www\./i, ''))


// Убираем UTM и прочие хвосты, чтобы ключ url|chronicle|rate совпадал с базой.
function cleanUrl(raw) {
  try {
    const u = new URL(raw)
    for (const k of [...u.searchParams.keys()]) {
      if (k.startsWith('utm_') || k === 'ref' || k === 'lang') u.searchParams.delete(k)
    }
    const q = u.searchParams.toString()
    return `${u.protocol}//${u.host.toLowerCase()}${u.pathname === '/' ? '' : u.pathname}${q ? '?' + q : ''}`
  } catch {
    return null
  }
}

// «x50k» → 50000, «GVE» → категория. Всё, что не число и не GvE (RvR, PTS…),
// возвращаем как есть — update-servers.js такие записи пропустит.
function parseRateCell(text) {
  const t = text.trim()
  if (/^gve$/i.test(t)) return { rate: null, category: 'gve' }
  const m = t.toLowerCase().replace(/\s/g, '').match(/^x?(\d+(?:\.\d+)?)(k)?$/)
  if (!m) return { rate: t, category: undefined }
  const n = parseFloat(m[1]) * (m[2] ? 1000 : 1)
  return { rate: n >= 1 ? Math.round(n) : t, category: undefined }
}

// dd.mm.yy → yyyy-mm-dd
function parseShortDate(s) {
  const m = s.match(/(\d{2})\.(\d{2})\.(\d{2})/)
  return m ? `20${m[3]}-${m[2]}-${m[1]}` : null
}

// ---------- l2pick ----------
// Блок: <div class=titles>Секция …  затем <div class="server …"> с .name/.rate/.chronicle/.date.
// Ссылка: /out/?url=<base64 настоящего адреса>.
function parseL2pick(html) {
  const items = []
  const re = /class="?titles"?>([^<]*)|<div class="server[^"]*">([\s\S]*?<div class="date">[\s\S]*?<\/div>)/g
  let section = ''
  let m
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) {
      section = m[1].trim()
      continue
    }
    const block = m[2]
    const a = block.match(/<div class="name">[\s\S]*?<a([^>]*)>([\s\S]*?)<\/a>/)
    if (!a) continue
    const href = (a[1].match(/href="([^"]*)"/) || [])[1] || ''
    let target = null
    const b64 = href.match(/[?&]url=([^"&]+)/)
    if (b64) {
      try {
        target = decodeEntities(Buffer.from(decodeURIComponent(b64[1]), 'base64').toString('utf8'))
      } catch {}
    }
    items.push({
      source: 'l2pick',
      section,
      vip: /VIP/i.test(section),
      name: cleanName(a[2]),
      target,
      rateText: stripTags((block.match(/<div class="rate">([\s\S]*?)<\/div>/) || [])[1] || ''),
      chronicle: stripTags((block.match(/<div class="chronicle">([\s\S]*?)<\/div>/) || [])[1] || ''),
      startDate: parseShortDate((block.match(/<div class="date">([\s\S]*?)<\/div>/) || [])[1] || ''),
    })
  }
  return items
}

// ---------- l2oops ----------
// Секции — <h2>, карточка — <a … href="/api/out?out_id=N"> с именем в <span>,
// рейтом и хроникой в div и датой в <time dateTime>. Настоящий адрес только
// за редиректом /api/out.
function parseL2oops(html) {
  const items = []
  const parts = html.split(/<h2[^>]*>/)
  for (const part of parts.slice(1)) {
    const section = stripTags(part.split('</h2>')[0])
    const re = /<a[^>]*href="(\/api\/out\?out_id=\d+)"[^>]*>([\s\S]*?)<\/a>/g
    let m
    while ((m = re.exec(part))) {
      const inner = m[2]
      const name = (inner.match(/<span class="overflow-hidden[^"]*">([\s\S]*?)<\/span>/) || [])[1]
      const cells = [...inner.matchAll(/<div class="min-w-\[\d+px\] text-body-xs">([\s\S]*?)<\/div>/g)].map((c) =>
        stripTags(c[1]),
      )
      const date = (inner.match(/dateTime="(\d{4}-\d{2}-\d{2})"/i) || [])[1]
      if (!name || cells.length < 2 || !date) continue
      items.push({
        source: 'l2oops',
        section,
        vip: /Скоро Откроются|Бонус Старт|Уже Открылись/i.test(section),
        eternal: /Вечн/i.test(section),
        name: cleanName(name),
        outPath: m[1],
        rateText: cells[0],
        chronicle: cells[1],
        startDate: date,
      })
    }
  }
  return items
}

async function resolveL2oops(outPath) {
  try {
    const res = await fetch('https://l2oops.com' + outPath, {
      method: 'HEAD',
      redirect: 'manual',
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(15000),
    })
    return res.headers.get('location')
  } catch {
    return null
  }
}

// Бренд для склейки: «Euro-pvp.net», «euro-pvp» и «EURO-PVP» — один проект.
const brandKey = (name) =>
  name
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/\.[a-z]{2,10}$/, '')
    .replace(/[^a-z0-9а-яё]/g, '')

const chronicleKey = (c) => c.toLowerCase().replace(/\+$/, '').trim()

// Трекинговые ссылки (a.scrd.to/x5, go.edge-links.workers.dev/…) раскручиваем
// до конечного сайта, максимум 3 перехода.
async function followRedirects(url) {
  let cur = url
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(cur, {
        method: 'HEAD',
        redirect: 'manual',
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(15000),
      })
      const loc = res.headers.get('location')
      if (!loc || res.status < 300 || res.status >= 400) return cur
      cur = new URL(loc, cur).toString()
    } catch {
      return cur
    }
  }
  return cur
}

async function main() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() - MAX_AGE_DAYS)
  const minIso = minDate.toISOString().slice(0, 10)
  const todayIso = today.toISOString().slice(0, 10)

  const pages = {
    pickMain: 'https://l2pick.com/',
    pickMulticraft: 'https://l2pick.com/multicraft/',
    pickMultiprof: 'https://l2pick.com/multiproff/',
    pickEng: 'https://l2pick.com/eng/',
    oopsMain: 'https://l2oops.com/',
  }
  const html = {}
  for (const [k, url] of Object.entries(pages)) {
    try {
      html[k] = await fetchHtml(url)
    } catch (e) {
      console.warn(`  ! ${e.message}`)
      html[k] = ''
    }
    await sleep(700)
  }
  if (!html.pickMain && !html.oopsMain) {
    console.error('Обе главные недоступны — нечего разбирать')
    process.exit(1)
  }

  // VIP-блоки на страницах категорий одни и те же для всех страниц —
  // признаков типа они не дают, берём только списки по датам.
  const typed = (items, extra) => items.filter((it) => !it.vip).map((it) => ({ ...it, ...extra }))
  const pool = [
    ...parseL2pick(html.pickMain),
    ...typed(parseL2pick(html.pickMulticraft), { feature: 'multicraft' }),
    ...typed(parseL2pick(html.pickMultiprof), { feature: 'multiprof' }),
    ...typed(parseL2pick(html.pickEng), { region: 'foreign' }),
    ...parseL2oops(html.oopsMain),
  ].filter((it) => !it.eternal)
  console.log(`Разобрано карточек: ${pool.length}`)

  // Адреса из базы — по бренду: записи servers.json проверены прошлыми прогонами.
  const existing = JSON.parse(fs.readFileSync(SERVERS_PATH, 'utf8'))
  const knownUrl = new Map()
  for (const s of existing) if (!knownUrl.has(brandKey(s.name))) knownUrl.set(brandKey(s.name), s.url)

  // 1. Группируем по бренд|хроника(без «+»)|рейт.
  const groups = new Map()
  const skipped = []
  for (const it of pool) {
    if (!it.startDate || it.startDate < minIso || !it.name || !it.chronicle) continue
    const { rate, category } = parseRateCell(it.rateText)
    if (typeof rate !== 'number' && category !== 'gve') {
      skipped.push(`${it.name} (${it.rateText}, ${it.chronicle})`)
      continue
    }
    const key = `${brandKey(it.name)}|${chronicleKey(it.chronicle)}|${category || rate}`
    const g = groups.get(key) || { items: [], rate, category, features: new Set(), region: null }
    g.items.push(it)
    if (it.feature) g.features.add(it.feature)
    if (it.region) g.region = it.region
    groups.set(key, g)
  }

  // 2. Из группы — одна запись.
  const out = []
  let resolved = 0
  for (const g of groups.values()) {
    const items = g.items
    // Имя: доменное, если есть (по нему и ищем адрес), иначе первое.
    const name = (items.find((i) => looksLikeDomain(i.name)) || items[0]).name
    // Хроника — с главной l2pick, затем любая; дата — самая поздняя (перенос старта).
    const chronicle = (items.find((i) => i.source === 'l2pick') || items[0]).chronicle
    const startDate = items.map((i) => i.startDate).sort().at(-1)

    let url = knownUrl.get(brandKey(name)) || null
    if (!url && looksLikeDomain(name)) url = 'https://' + name.toLowerCase().replace(/^www\./, '')
    if (!url) {
      const t = items.find((i) => i.target)?.target
      if (t) {
        url = cleanUrl(await followRedirects(t))
        resolved++
      }
    }
    if (!url) {
      const o = items.find((i) => i.outPath)
      if (o) {
        const loc = await resolveL2oops(o.outPath)
        if (loc) url = cleanUrl(await followRedirects(loc))
        resolved++
        await sleep(500)
      }
    }
    // Адрес, добытый через редиректы, должен быть похож на имя: иначе это
    // промо-лендинг или чужой трекер (valhalla-age → 30-10-new-bonus-server.link).
    if (url && !knownUrl.has(brandKey(name)) && !looksLikeDomain(name)) {
      const host = new URL(url).hostname.replace(/[^a-z0-9]/g, '')
      if (!host.includes(brandKey(name).replace(/[^a-z0-9]/g, '').slice(0, 5))) {
        skipped.push(`${name} (адрес ${url} не похож на имя — проверить руками)`)
        continue
      }
    }
    if (!url) {
      skipped.push(`${name} (нет адреса)`)
      continue
    }

    const entry = { name, url, chronicle, rate: g.rate, startDate }
    if (g.category) entry.category = g.category
    if (g.features.size) entry.features = [...g.features].sort()
    if (g.region) entry.region = g.region
    out.push(entry)
  }

  out.sort((a, b) => a.startDate.localeCompare(b.startDate))
  const upcoming = out.filter((s) => s.startDate >= todayIso)

  console.log(`\nВ выгрузке: ${out.length} (будущих стартов: ${upcoming.length})`)
  console.log(`Адресов раскручено через редиректы: ${resolved}`)
  console.log(
    `С типами: мультикрафт ${out.filter((s) => s.features?.includes('multicraft')).length}, ` +
      `мультипрофа ${out.filter((s) => s.features?.includes('multiprof')).length}, ` +
      `зарубежные ${out.filter((s) => s.region === 'foreign').length}`,
  )
  if (skipped.length) console.log(`Пропущено (${skipped.length}): ${[...new Set(skipped)].join('; ')}`)

  if (DRY) {
    for (const s of upcoming)
      console.log(
        `  ${s.startDate}  ${s.name}  ${s.chronicle} x${s.rate ?? 'GvE'}  ${s.url}` +
          `${s.features ? '  [' + s.features.join(',') + ']' : ''}${s.region ? '  [' + s.region + ']' : ''}`,
      )
    return
  }
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`\nЗаписано в data/new-servers.json. Дальше: node scripts/update-servers.js`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
