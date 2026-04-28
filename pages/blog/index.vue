<template>
  <div class="blog-page page-wrapper">
    <Breadcrumbs />
    <div class="page-header">
      <h1>Блог Lineage 2 — новости, гайды и обзоры серверов</h1>
    </div>

    <nav class="blog-filters" aria-label="Категории блога">
      <NuxtLink to="/blog/" class="blog-filter blog-filter--active">
        Все
      </NuxtLink>
      <NuxtLink
        v-for="cat in categories"
        :key="cat.slug"
        :to="`/blog/${cat.slug}/`"
        class="blog-filter"
      >
        {{ cat.name }}
      </NuxtLink>
    </nav>

    <div class="blog-grid">
      <BlogCard
        v-for="article in articles"
        :key="article.slug"
        :article="article"
      />
    </div>

    <div v-if="!articles?.length" class="blog-empty">
      Статьи скоро появятся
    </div>

    <SeoSection
      :title="seoTitle"
      :text="seoText"
      :links="seoLinks"
      :combo-links="seoComboLinks"
      combo-links-title="Популярные разделы"
    />
  </div>
</template>

<script setup>
const { getCategories } = useBlogCategories()
const categories = getCategories()

const { data: articles } = await useAsyncData('blog-articles', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .all()
)

// SEO-блок
const seoTitle = 'О блоге L2GM — всё о серверах Lineage 2'
const seoText = `Блог L2GM — это центр полезной информации для всех, кто играет в Lineage 2. Здесь собраны актуальные новости о выходе новых серверов, подробные гайды по прокачке персонажей, обзоры популярных проектов и статьи о лоре вселенной Л2. Мы следим за анонсами на всех популярных хрониках — Interlude, High Five, Essence, Classic — и помогаем игрокам не пропустить интересные старты.

В разделе «Новости» публикуем свежие анонсы открытия серверов Lineage 2, обновления на крупных проектах и важные события в комьюнити. «Гайды» помогут разобраться с выбором класса, рейта и стратегией прокачки как новичкам, так и опытным игрокам. В «Обзорах» разбираем топ-серверы по хроникам, сравниваем проекты по онлайну, донату и балансу. А в «Статьях» — аналитика, сравнения хроник и глубокие материалы о механиках Lineage 2.

Если вы ищете где почитать про Lineage 2 на русском — наш блог для вас. Новые материалы выходят регулярно, все статьи написаны с учётом реального опыта игроков на Interlude, High Five и других хрониках. Следите за обновлениями, выбирайте сервер по душе и играйте на лучших проектах Л2 2026 года.`

const seoLinks = [
  { to: '/', text: 'Анонсы серверов' },
  { to: '/chronicle/interlude/', text: 'Сервера Interlude' },
  { to: '/chronicle/high-five/', text: 'Сервера High Five' },
  { to: '/chronicle/essence/', text: 'Сервера Essence' },
  { to: '/chronicle/classic/', text: 'Сервера Classic' },
]

const seoComboLinks = [
  { to: '/rate/x1/', text: 'Low rate x1' },
  { to: '/rate/x50/', text: 'Mid rate x50' },
  { to: '/rate/x100/', text: 'Rate x100' },
  { to: '/rate/x1200/', text: 'High rate x1200' },
  { to: '/pvp/', text: 'PvP сервера' },
  { to: '/gve/', text: 'GvE сервера' },
  { to: '/low-rate/', text: 'Low-rate сервера' },
  { to: '/mid-rate/', text: 'Mid-rate сервера' },
  { to: '/placement/', text: 'Разместить сервер' },
]

const { generateBreadcrumbJsonLd } = useSeo()

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Анонсы серверов Lineage 2', url: '/' },
  { name: 'Блог', url: '/blog/' },
])

const itemListJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://l2gm.com/blog/#blog',
  name: 'Блог L2GM',
  description: 'Новости, гайды и обзоры серверов Lineage 2',
  url: 'https://l2gm.com/blog/',
  inLanguage: 'ru-RU',
  publisher: {
    '@type': 'Organization',
    name: 'L2GM',
    url: 'https://l2gm.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://l2gm.com/logo.svg',
    },
  },
  blogPost: (articles.value || []).map((a) => ({
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    url: `https://l2gm.com/blog/${a.slug}/`,
    articleSection: a.category,
    image: `https://l2gm.com${a.image}`,
    inLanguage: 'ru-RU',
    author: {
      '@type': 'Organization',
      name: 'L2GM',
    },
    publisher: {
      '@type': 'Organization',
      name: 'L2GM',
      logo: {
        '@type': 'ImageObject',
        url: 'https://l2gm.com/logo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://l2gm.com/blog/${a.slug}/`,
    },
  })),
}))

useHead({
  title: 'Блог Lineage 2 — новости, гайды и обзоры серверов Л2 | L2GM',
  link: [
    { rel: 'canonical', href: 'https://l2gm.com/blog/' },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Блог L2GM — RSS',
      href: 'https://l2gm.com/blog/rss.xml',
    },
  ],
  meta: [
    {
      name: 'description',
      content: 'Блог L2GM о Lineage 2: свежие анонсы серверов, гайды по прокачке, обзоры проектов Interlude, High Five и Essence, статьи о хрониках и PvP.',
    },
    {
      name: 'keywords',
      content: 'блог lineage 2, блог l2, статьи о lineage 2, гайды lineage 2, новости l2, обзоры серверов lineage 2, лайнейдж 2 блог, л2 статьи, интерлюд гайды, хай файв новости',
    },
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
    { name: 'author', content: 'L2GM' },
    { property: 'og:title', content: 'Блог Lineage 2 — новости, гайды и обзоры серверов Л2' },
    { property: 'og:description', content: 'Свежие анонсы серверов Lineage 2, гайды, обзоры и статьи о хрониках Interlude, High Five, Essence, Classic.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://l2gm.com/blog/' },
    { property: 'og:image', content: 'https://l2gm.com/logo.svg' },
    { property: 'og:site_name', content: 'L2GM' },
    { property: 'og:locale', content: 'ru_RU' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Блог Lineage 2 — новости и гайды | L2GM' },
    { name: 'twitter:description', content: 'Свежие анонсы серверов Lineage 2, гайды, обзоры и статьи о хрониках.' },
    { name: 'twitter:image', content: 'https://l2gm.com/logo.svg' },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(itemListJsonLd.value) },
  ],
})
</script>

<style scoped>
.blog-page {
  padding: var(--spacing-lg);
}

.blog-filters {
  display: flex;
  gap: var(--spacing-sm);
  margin: var(--spacing-lg) 4px var(--spacing-xl);
  flex-wrap: wrap;
}

.blog-filter {
  background: var(--secondary-main);
  color: var(--secondary-contrast);
  padding: 10px 20px;
  border-radius: 26px;
  border: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.blog-filter:hover {
  background: var(--secondary-hover);
}

.blog-filter--active {
  background: var(--primary-main);
  color: var(--primary-contrast);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
  padding: 4px;
}

.blog-empty {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-xxl) 0;
  font-size: var(--font-lg);
}

@media (max-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .blog-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.blog-page :deep(.seo-section) {
  padding: 0;
  background: transparent;
  margin-top: var(--spacing-xl);
}
</style>
