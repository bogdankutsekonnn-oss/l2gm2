import { queryCollection } from '@nuxt/content/server'
import tagsData from '~/data/tags.json'
import chroniclesData from '~/data/chronicles.json'
import ratesData from '~/data/rates.json'

const BLOG_CATEGORY_SLUGS = ['novosti', 'gajdy', 'obzory', 'stati']

export default defineSitemapEventHandler(async (event) => {
  const articles = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .all()

  const blogUrls = articles.map((a: any) => ({
    loc: `/blog/${a.slug}/`,
    lastmod: a.date,
    changefreq: 'monthly',
    priority: 0.8,
    _i18nTransform: true,
  }))

  const categoryUrls = BLOG_CATEGORY_SLUGS.map((slug) => ({
    loc: `/blog/${slug}/`,
    changefreq: 'weekly',
    priority: 0.7,
  }))

  // Тег-страницы (today, pvp, low-rate, new и т.д.)
  const tagUrls = tagsData.map((tag: any) => ({
    loc: `/${tag.slug}/`,
    changefreq: 'daily',
    priority: 0.8,
  }))

  // Страницы хроник (/chronicle/interlude/, /chronicle/high-five/ и т.д.)
  const chronicleUrls = chroniclesData.map((c: any) => ({
    loc: `/chronicle/${c.slug}/`,
    changefreq: 'weekly',
    priority: 0.7,
  }))

  // Страницы рейтов (/rate/x1/, /rate/x50/ и т.д.)
  const rateUrls = ratesData.map((r: any) => ({
    loc: `/rate/${r.slug}/`,
    changefreq: 'weekly',
    priority: 0.7,
  }))

  return [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/rating/', changefreq: 'daily', priority: 0.8 },
    ...tagUrls,
    ...chronicleUrls,
    ...rateUrls,
    { loc: '/blog/', changefreq: 'daily', priority: 0.9 },
    ...categoryUrls,
    ...blogUrls,
    { loc: '/placement/', changefreq: 'monthly', priority: 0.6 },
    { loc: '/about/', changefreq: 'monthly', priority: 0.4 },
    { loc: '/faq/', changefreq: 'monthly', priority: 0.5 },
  ]
})
