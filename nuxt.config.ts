// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  css: ['~/assets/css/main.css'],

  // Основной URL сайта
  site: {
    url: 'https://l2gm.com',
    name: 'L2GM - Анонсы серверов Lineage 2',
  },

  // Sitemap конфигурация
  sitemap: {
    strictNuxtContentPaths: true,
  },

  // Robots.txt конфигурация
  robots: {
    groups: [
      {
        userAgent: ['*'],
        disallow: ['/'],
      },
    ],
    sitemap: [],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'L2GM - Анонсы серверов Lineage 2',
      meta: [
        // Основные мета-теги
        {
          name: 'description',
          content:
            'L2GM - актуальные анонсы серверов Lineage 2. Новые серверы л2 всех хроник и рейтов с датами открытия.',
        },
        {
          name: 'keywords',
          content:
            'lineage 2, л2, сервера lineage 2, анонсы серверов л2, новые серверы l2, interlude, high five, открытие сервера',
        },
        { name: 'author', content: 'L2GM' },
        { name: 'robots', content: 'noindex, nofollow' },

        // Open Graph (Facebook, VK, Telegram)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'L2GM' },
        { property: 'og:locale', content: 'ru_RU' },
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

  // Cloudflare Pages
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: false,
      routes: [],
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: 'https://l2gm.com',
    },
  },
})
