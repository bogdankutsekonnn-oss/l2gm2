<template>
  <div class="news-page page-wrapper">
    <Breadcrumbs />
    <div class="page-header">
      <h1>Новости серверов Lineage 2</h1>
    </div>

    <div class="news-grid">
      <NewsCard
        v-for="article in articles"
        :key="article.slug"
        :article="article"
      />
    </div>

    <div v-if="!articles?.length" class="news-empty">
      Новости скоро появятся
    </div>

    <SeoSection
      :title="seoTitle"
      :text="seoText"
      :links="seoLinks"
    />
  </div>
</template>

<script setup>
const { data: articles } = await useAsyncData('news-articles', () =>
  queryCollection('news')
    .order('date', 'DESC')
    .all()
)

const seoTitle = 'Новости серверов Lineage 2 — события и обновления'
const seoText = `Раздел «Новости серверов» — это лента актуальных событий из мира частных серверов Lineage 2. Здесь публикуются разборы ситуаций на популярных проектах, обзоры видео от ведущих контент-мейкеров L2-комьюнити, обновления баланса и важные события: смены администрации, ивенты, объединения и закрытия серверов.

Мы следим за тем, что происходит на крупнейших проектах Interlude, High Five, Essence и Classic, и рассказываем об этом в коротком формате — без воды, только факты и контекст. Если вы хотите быть в курсе происходящего в мире Lineage 2 — добавьте эту страницу в закладки или подпишитесь на RSS.

Новости обновляются регулярно. Каждый материал содержит ссылки на первоисточники — YouTube-ролики, официальные анонсы администраций и обсуждения в комьюнити. Выбирайте сервер осознанно, зная актуальную ситуацию на проекте.`

const seoLinks = [
  { to: '/', text: 'Новые сервера Л2' },
  { to: '/blog/', text: 'Блог' },
  { to: '/chronicle/interlude/', text: 'Сервера Interlude' },
  { to: '/chronicle/high-five/', text: 'Сервера High Five' },
  { to: '/chronicle/essence/', text: 'Сервера Essence' },
  // Ссылку на /rating/ вернуть при запуске раздела рейтинга (сейчас noindex-заготовка)
]

const { generateBreadcrumbJsonLd } = useSeo()

const breadcrumbItems = [
  { name: 'Сервера Lineage 2', url: '/' },
  { name: 'Новости серверов', url: '/news/' },
]

const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems)

useHead({
  title: 'Новости серверов Lineage 2 — события, обзоры, обновления | L2GM',
  link: [
    { rel: 'canonical', href: 'https://l2gm.com/news/' },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Новости серверов L2GM — RSS',
      href: 'https://l2gm.com/news/rss.xml',
    },
  ],
  meta: [
    { name: 'description', content: 'Свежие новости серверов Lineage 2: разборы ситуаций на популярных проектах, обзоры видео от комьюнити, обновления на Interlude, High Five, Essence.' },
    { name: 'keywords', content: 'новости lineage 2, новости серверов l2, новости л2, события lineage 2, обновления серверов l2' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Новости серверов Lineage 2' },
    { property: 'og:description', content: 'Свежие новости серверов Lineage 2: разборы, обзоры видео, обновления на популярных проектах.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://l2gm.com/news/' },
    { property: 'og:site_name', content: 'L2GM' },
    { property: 'og:locale', content: 'ru_RU' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Новости серверов Lineage 2' },
    { name: 'twitter:description', content: 'Свежие новости серверов Lineage 2: разборы, обзоры видео, обновления на популярных проектах.' },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
  ],
})
</script>

<style scoped>
.news-page {
  padding: var(--spacing-lg);
  min-height: 60vh;
}

.page-header {
  margin: 4px 4px var(--spacing-xl);
}

.page-header h1 {
  background: #1b1d1f;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--radius-sm);
  padding: 16px;
  font-size: var(--font-h1);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: 1.2;
  margin: 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-lg) var(--spacing-sm);
  margin: 0 4px;
}

.news-empty {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-xxl);
  font-size: var(--font-lg);
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .news-page {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .news-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .page-header h1 {
    font-size: 22px;
    padding: 12px;
  }
}
</style>
