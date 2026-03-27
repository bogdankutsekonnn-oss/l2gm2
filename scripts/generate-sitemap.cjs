// Генерация sitemap.xml для статического хостинга
const fs = require('fs')
const path = require('path')

const SITE_URL = 'https://l2gm.com'

const chronicles = ['c4', 'interlude', 'interlude-plus', 'classic', 'high-five-plus', 'high-five', 'epilogue', 'essence', 'crusade']
const rates = ['x1', 'x3', 'x7', 'x10', 'x20', 'x50', 'x100', 'x500', 'x1200', 'x10000', 'x50000', 'x100000']
const tags = ['today', 'l2top', 'pvp', 'gve', 'foreign', 'low-rate', 'mid-rate', 'multicraft', 'multiprof']

const today = new Date().toISOString().split('T')[0]

const pages = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/faq/', changefreq: 'monthly', priority: '0.6' },
  { loc: '/about/', changefreq: 'monthly', priority: '0.5' },
  { loc: '/placement/', changefreq: 'monthly', priority: '0.7' },
]

// Теги
tags.forEach(tag => {
  pages.push({ loc: `/${tag}/`, changefreq: 'daily', priority: '0.8' })
})

// Хроники
chronicles.forEach(c => {
  pages.push({ loc: `/chronicle/${c}/`, changefreq: 'daily', priority: '0.9' })
})

// Рейты
rates.forEach(r => {
  pages.push({ loc: `/rate/${r}/`, changefreq: 'daily', priority: '0.8' })
})

// Комбинации хроника + рейт
chronicles.forEach(c => {
  rates.forEach(r => {
    pages.push({ loc: `/chronicle/${c}/rate/${r}/`, changefreq: 'daily', priority: '0.7' })
  })
})

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`

// Записываем в public/ (для dev) и в dist/ (если есть, для продакшена)
const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
fs.writeFileSync(publicPath, xml, 'utf-8')

console.log(`Sitemap generated: ${pages.length} URLs -> ${publicPath}`)
