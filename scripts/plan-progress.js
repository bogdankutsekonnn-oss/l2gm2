#!/usr/bin/env node
// Пересчитывает блок «Прогресс» в docs/plan-rabot.md по галочкам недель.
// Запуск: node scripts/plan-progress.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const PLAN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'plan-rabot.md')
const START = /<!-- progress:start[^>]*-->/
const END = '<!-- progress:end -->'
const WIDTH = 20

const bar = (done, total) => {
  const full = total ? Math.round((done / total) * WIDTH) : 0
  return '█'.repeat(full) + '░'.repeat(WIDTH - full)
}

const text = fs.readFileSync(PLAN, 'utf8')
const weeksPart = text.slice(text.indexOf('## План на 12 недель'), text.indexOf('## Банк тем'))

// Неделя → [сделано, всего]; дата начала берётся из заголовка для «текущей».
const weeks = []
let cur = null
for (const line of weeksPart.split('\n')) {
  const h = line.match(/^### (.+)$/)
  if (h) {
    cur = { title: h[1].trim(), done: 0, total: 0 }
    weeks.push(cur)
    continue
  }
  const box = line.match(/^- \[( |x)\]/)
  if (box && cur) {
    cur.total++
    if (box[1] === 'x') cur.done++
  }
}

const done = weeks.reduce((s, w) => s + w.done, 0)
const total = weeks.reduce((s, w) => s + w.total, 0)
const pct = (d, t) => (t ? Math.round((d / t) * 100) : 0)

const lines = [
  `**Весь план: ${bar(done, total)} ${done}/${total} (${pct(done, total)}%)**`,
  '',
  '| Неделя | Прогресс | Сделано |',
  '|---|---|---|',
  ...weeks.map((w) => {
    const name = w.title.split(' — ')[0]
    const mark = w.total && w.done === w.total ? ' ✅' : ''
    return `| ${name}${mark} | \`${bar(w.done, w.total)}\` | ${w.done}/${w.total} |`
  }),
  '',
  `_Обновлено: ${new Date().toISOString().slice(0, 10)}_`,
]

const s = text.match(START)
const e = text.indexOf(END)
if (!s || e < 0) throw new Error('Не найдены маркеры progress:start / progress:end')
const out = text.slice(0, s.index + s[0].length) + '\n' + lines.join('\n') + '\n' + text.slice(e)
fs.writeFileSync(PLAN, out)
console.log(`Прогресс: ${done}/${total}`)
