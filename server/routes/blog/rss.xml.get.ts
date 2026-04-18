import { queryCollection } from '@nuxt/content/server'

const SITE_URL = 'https://l2gm.com'

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const articles = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .all()

  const buildDate = new Date().toUTCString()

  const items = articles
    .map((a: any) => {
      const url = `${SITE_URL}/blog/${a.slug}/`
      const pubDate = a.date ? new Date(a.date).toUTCString() : buildDate
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.description || '')}</description>
      <category>${escapeXml(a.category || '')}</category>
      <pubDate>${pubDate}</pubDate>
      <author>info@l2gm.com (L2GM)</author>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Блог L2GM — Lineage 2</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Новости, гайды и обзоры серверов Lineage 2</description>
    <language>ru</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <image>
      <url>${SITE_URL}/logo.svg</url>
      <title>L2GM</title>
      <link>${SITE_URL}/</link>
    </image>
${items}
  </channel>
</rss>
`

  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  return xml
})
