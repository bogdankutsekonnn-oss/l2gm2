import { queryCollection } from '@nuxt/content/server'

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

  return [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/blog/', changefreq: 'daily', priority: 0.9 },
    ...categoryUrls,
    { loc: '/placement/', changefreq: 'monthly', priority: 0.6 },
    { loc: '/about/', changefreq: 'monthly', priority: 0.4 },
    { loc: '/faq/', changefreq: 'monthly', priority: 0.5 },
    ...blogUrls,
  ]
})
