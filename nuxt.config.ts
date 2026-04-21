// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/robots', '@nuxtjs/sitemap', '@nuxt/image', '@nuxt/content'],

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    xsl: false,
    autoLastmod: true,
    strictNuxtContentPaths: true,
    // Исключаем chronicle/<x>/rate/<y>/ — это фильтры хроники, canonical ведёт на /chronicle/<x>/
    // trailing slash в URL берётся из site.trailingSlash: true
    exclude: ['/chronicle/*/rate/**'],
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

  css: ['~/assets/css/main.css'],

  // Основной URL сайта
  site: {
    url: 'https://l2gm.com',
    name: 'L2GM - Анонсы серверов Lineage 2',
    trailingSlash: true,
  },

  // Robots.txt конфигурация
  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/'],
        disallow: ['/thanks', '/add-server'],
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
      title: 'L2GM - Анонсы серверов Lineage 2',
      meta: [
        // Основные мета-теги
        {
          name: 'description',
          content:
            'Анонсы серверов Lineage 2 2026 с датами старта. Новые сервера Л2 всех хроник и рейтов — Interlude, High Five, Essence. Выбирай лучший проект на L2GM!',
        },
        {
          name: 'keywords',
          content:
            'lineage 2, л2, ла2, сервера lineage 2, сервера л2, анонсы серверов, новые сервера л2, новые сервера l2, interlude, интерлюд, high five, хай файв, essence, эссенс, classic, классик',
        },
        { name: 'author', content: 'L2GM' },
        { name: 'robots', content: 'index, follow' },

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
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap',
          onload: "this.onload=null;this.rel='stylesheet'",
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
      failOnError: false,
      crawlLinks: false,
      routes: [
        '/',
        '/rating/',
        '/sitemap.xml',
        '/robots.txt',
        '/blog/',
        '/blog/rss.xml',
        '/blog/top-serverov-lineage-2-2026/',
        '/blog/interlude-vs-high-five/',
        '/blog/kak-vybrat-rejt-servera/',
        '/blog/chto-takoe-pvp-server-lineage-2/',
        '/blog/novye-servera-lineage-2-aprel-2026/',
        '/placement/',
        '/about/',
        '/add-server/',
        '/faq/',
        '/thanks/',
        // Tags
        '/today/',
        '/l2top/',
        '/pvp/',
        '/gve/',
        '/foreign/',
        '/low-rate/',
        '/mid-rate/',
        '/multicraft/',
        '/multiprof/',
        // Chronicles
        '/chronicle/c4/',
        '/chronicle/interlude/',
        '/chronicle/interlude-plus/',
        '/chronicle/classic/',
        '/chronicle/high-five-plus/',
        '/chronicle/high-five/',
        '/chronicle/epilogue/',
        '/chronicle/essence/',
        '/chronicle/crusade/',
        // Rates
        '/rate/x1/',
        '/rate/x3/',
        '/rate/x7/',
        '/rate/x10/',
        '/rate/x20/',
        '/rate/x50/',
        '/rate/x100/',
        '/rate/x500/',
        '/rate/x1200/',
        '/rate/x10000/',
        '/rate/x50000/',
        '/rate/x100000/',
        // Chronicle + Rate combinations
        ...['c4', 'interlude', 'interlude-plus', 'classic', 'high-five-plus', 'high-five', 'epilogue', 'essence', 'crusade']
          .flatMap(c => ['x1', 'x3', 'x7', 'x10', 'x20', 'x50', 'x100', 'x500', 'x1200', 'x10000', 'x50000', 'x100000']
            .map(r => `/chronicle/${c}/rate/${r}/`)),
      ],
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: 'https://l2gm.com',
    },
  },
})
