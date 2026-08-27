// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Автоматически собираем роуты всех статей блога из content/blog/*.md
// чтобы при добавлении новой статьи не нужно было править prerender.routes вручную.
// Конвенция: имя файла = slug статьи.
const blogArticleRoutes = readdirSync(resolve(__dirname, 'content/blog'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => `/blog/${f.replace(/\.md$/, '')}/`)

const newsArticleRoutes = readdirSync(resolve(__dirname, 'content/news'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => `/news/${f.replace(/\.md$/, '')}/`)

// Лёгкий индекс статей блога (title/slug/category/date) для блоков перелинковки
// на лендингах хроник (RelatedArticles.vue). Генерируем при каждой сборке из
// frontmatter, чтобы не тянуть queryCollection/sqlite-worker на нелендинговые
// страницы (см. комментарий в Breadcrumbs.vue). Файл в .gitignore.
const blogIndex = readdirSync(resolve(__dirname, 'content/blog'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const raw = readFileSync(resolve(__dirname, 'content/blog', f), 'utf8')
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    const field = (name: string) =>
      fm.match(new RegExp(`^${name}:\\s*['"]?(.*?)['"]?\\s*$`, 'm'))?.[1] ?? ''
    return {
      slug: f.replace(/\.md$/, ''),
      title: field('title'),
      category: field('category'),
      date: field('date'),
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))
writeFileSync(
  resolve(__dirname, 'data/blog-index.json'),
  JSON.stringify(blogIndex, null, 2) + '\n',
)

// Маршруты фильтров берём из тех же data/*.json, что и карта сайта
// (server/api/__sitemap__/urls.ts). Пока списки дублировались руками, карта
// обещала поисковикам страницы, которых сборка не создавала: /chronicle/freya/,
// /chronicle/god/ и ещё 5 хроник отдавали 404 (найдено смоук-тестом 19.08.2026).
const readJson = (rel: string) =>
  JSON.parse(readFileSync(resolve(__dirname, rel), 'utf8'))
const tagRoutes = readJson('data/tags.json').map((t: any) => `/${t.slug}/`)
const chronicleSlugs = readJson('data/chronicles.json').map((c: any) => c.slug)
const rateSlugs = readJson('data/rates.json').map((r: any) => r.slug)
const chronicleRoutes = chronicleSlugs.map((s: string) => `/chronicle/${s}/`)
const rateRoutes = rateSlugs.map((s: string) => `/rate/${s}/`)
const chronicleRateRoutes = chronicleSlugs.flatMap((c: string) =>
  rateSlugs.map((r: string) => `/chronicle/${c}/rate/${r}/`),
)

// Категории блога (статичный список — соответствует composables/useBlogCategories.js)
const blogCategoryRoutes = ['novosti', 'gajdy', 'obzory', 'stati'].map(
  (slug) => `/blog/${slug}/`,
)

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/robots', '@nuxtjs/sitemap', '@nuxt/image', '@nuxt/content', '@nuxt/scripts'],

  // Инлайн CSS компонентов в HTML — устраняет render-blocking CSS-запросы
  // (Lighthouse показывал ~150мс задержки LCP из-за внешних FiltersPanel.css,
  // ServerCard.css, Breadcrumbs.css и т.д.)
  features: {
    inlineStyles: true,
  },

  // Инлайним payload в HTML вместо отдельных _payload.json.
  // Иначе префетч NuxtLink в dev пытается грузить /rate/x50/_payload.json и т.п.,
  // которых в dev-режиме нет — сервер отдаёт HTML и в консоль сыплются
  // "Cannot load payload ... is not valid JSON". Для статики это безопасно.
  experimental: {
    payloadExtraction: false,
  },

  // Отключаем CSS code-splitting: иначе Nuxt 3.21 создаёт отдельные файлы
  // (FiltersPanel.css, ServerCard.css ...) и inlineStyles их не инлайнит.
  // С cssCodeSplit:false весь scoped CSS собирается в один entry.css,
  // который уже корректно инлайнится в <head>.
  vite: {
    build: {
      cssCodeSplit: false,
    },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    xsl: false,
    autoLastmod: true,
    strictNuxtContentPaths: true,
    // Исключаем chronicle/<x>/rate/<y>/ — это фильтры хроники, canonical ведёт на /chronicle/<x>/
    // /rating/ — заготовка раздела рейтинга в noindex до его запуска
    // trailing slash в URL берётся из site.trailingSlash: true
    exclude: ['/chronicle/*/rate/**', '/rating/'],
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
    },
  },
  image: {
    quality: 80,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    densities: [1, 2],
    presets: {
      blogCard: {
        modifiers: {
          format: 'webp',
          quality: 80,
          fit: 'cover',
          width: 400,
          height: 225,
        },
      },
      blogHero: {
        modifiers: {
          format: 'webp',
          quality: 85,
          fit: 'cover',
          width: 1200,
          height: 630,
        },
      },
    },
  },

  css: [],

  // Основной URL сайта
  site: {
    url: 'https://l2gm.com',
    name: 'L2GM — Сервера Lineage 2',
    trailingSlash: true,
  },

  // Robots.txt конфигурация
  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/'],
        // /200.html и /404.html — служебные оболочки статической сборки
        // (пустой SPA-шелл с дефолтным title). Ни на что не ссылаются, но
        // лежат в корне и теоретически краулятся: закрываем, заодно модуль
        // проставляет им noindex в мету — это ловит гейт scripts/check-build.mjs.
        disallow: ['/thanks', '/add-server', '/200.html', '/404.html'],
      },
    ],
    sitemap: ['https://l2gm.com/sitemap.xml'],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'L2GM — Сервера Lineage 2',
      meta: [
        // Основные мета-теги
        {
          name: 'description',
          content:
            'Новые сервера Lineage 2 2026 с датами старта. Топ серверов Л2 всех хроник и рейтов — Interlude, High Five, Essence. Выбирай лучший проект на L2GM!',
        },
        {
          name: 'keywords',
          content:
            'lineage 2, л2, ла2, сервера lineage 2, сервера л2, анонсы серверов, новые сервера л2, новые сервера l2, interlude, интерлюд, high five, хай файв, essence, эссенс, classic, классик',
        },
        { name: 'author', content: 'L2GM' },
        // Мету robots не задаём глобально: её проставляет @nuxtjs/robots
        // (index, follow, max-image-preview:large... на обычных страницах и
        // noindex там, где страница закрыта). Глобальная «index, follow»
        // конфликтовала с noindex на error.vue — страница ошибки уезжала в
        // статику сразу с двумя противоположными директивами.

        // Open Graph (Facebook, VK, Telegram)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'L2GM' },
        { property: 'og:locale', content: 'ru_RU' },
        // Сайт для всей русскоязычной аудитории СНГ, не только РФ
        { property: 'og:locale:alternate', content: 'ru_UA' },
        { property: 'og:locale:alternate', content: 'ru_BY' },
        { property: 'og:locale:alternate', content: 'ru_KZ' },
        { property: 'og:locale:alternate', content: 'ru_MD' },
        { property: 'og:image', content: 'https://l2gm.com/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://l2gm.com/og-image.jpg' },

        // Дополнительные мета-теги
        { name: 'theme-color', content: '#06080a' },
        { name: 'msapplication-TileColor', content: '#06080a' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap',
          media: 'print',
          onload: "this.media='all'",
        },
        // Favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/favicon/favicon-96x96.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicon/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
  },

  // Static generation for Timeweb hosting
  nitro: {
    preset: 'static',
    prerender: {
      // Ошибка пререндера должна ронять сборку, а не запекать error.vue внутрь
      // HTML страницы: такая страница уезжает на прод с кодом 200 и заголовком
      // «Страница не найдена». Так 13 страниц (статьи блога, новости, теги,
      // /chronicle/c1/) попали в индекс Яндекса 12-13.08.2026 — по брендовому
      // запросу выдача показывала title 404-страницы. Статьи бросают 404, если
      // @nuxt/content не отдал документ (BlogArticlePage.vue, NewsArticlePage.vue),
      // и на флаки sqlite-воркера это ловится только здесь.
      failOnError: true,
      crawlLinks: false,
      routes: [
        '/',
        '/rating/',
        '/sitemap.xml',
        '/robots.txt',
        '/news/',
        '/news/rss.xml',
        ...newsArticleRoutes,
        '/blog/',
        '/blog/rss.xml',
        ...blogArticleRoutes,
        ...blogCategoryRoutes,
        '/placement/',
        '/about/',
        '/add-server/',
        '/faq/',
        '/thanks/',
        // Юридические страницы: есть в pages/, попадают в sitemap автоматически
        '/cookies/',
        '/privacy/',
        '/terms/',
        ...tagRoutes,
        ...chronicleRoutes,
        ...rateRoutes,
        // Фильтры хроника+рейт: в sitemap исключены, canonical ведёт на хронику
        ...chronicleRateRoutes,
      ],
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: 'https://l2gm.com',
      // Комментарии в новостях (Telegram-логин)
      commentsApi: '/comments-api',
      // Имя бота-комментатора без @ (создать через @BotFather,
      // сделать админом канала). Пока пусто — виджет логина не показывается.
      tgBotName: 'l2gm_comment_bot',
    },
  },
})
