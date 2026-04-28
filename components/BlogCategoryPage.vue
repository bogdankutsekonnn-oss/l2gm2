<template>
  <div class="blog-category-page page-wrapper">
    <Breadcrumbs />
    <div class="page-header">
      <h1>{{ category.h1 }}</h1>
    </div>

    <BlogCategoryNav :active-slug="category.slug" />

    <div v-if="articles.length" class="blog-grid">
      <BlogCard
        v-for="article in articles"
        :key="article.slug"
        :article="article"
      />
    </div>

    <div v-else class="blog-empty">
      Статьи в этой категории скоро появятся
    </div>

    <SeoSection
      :title="category.seoTitle || `О разделе «${category.name}» — блог L2GM`"
      :text="seoText"
      :links="seoLinks"
      :combo-links="seoComboLinks"
      combo-links-title="Другие разделы блога"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  category: { type: Object, required: true },
})

const { getCategories } = useBlogCategories()

const { data: articlesRaw } = await useAsyncData(
  `blog-cat-${props.category.slug}`,
  () =>
    queryCollection('blog')
      .where('category', '=', props.category.name)
      .order('date', 'DESC')
      .all()
)

const articles = computed(() => articlesRaw.value || [])

const canonicalUrl = computed(
  () => `https://l2gm.com/blog/${props.category.slug}/`
)

const seoText = computed(() => {
  const paragraphs = [...(props.category.seoParagraphs || [])]
  if (articles.value.length) {
    paragraphs.push(
      `Сейчас в разделе ${articles.value.length} ${pluralize(articles.value.length, ['материал', 'материала', 'материалов'])} — переключайтесь между категориями через навигацию вверху страницы или возвращайтесь к общему списку блога.`
    )
  }
  return paragraphs.join('\n\n')
})

function pluralize(n, forms) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

const seoLinks = [
  { to: '/', text: 'Анонсы серверов' },
  { to: '/chronicle/interlude/', text: 'Сервера Interlude' },
  { to: '/chronicle/high-five/', text: 'Сервера High Five' },
  { to: '/chronicle/essence/', text: 'Сервера Essence' },
  { to: '/chronicle/classic/', text: 'Сервера Classic' },
]

const seoComboLinks = computed(() =>
  getCategories()
    .filter((c) => c.slug !== props.category.slug)
    .map((c) => ({ to: `/blog/${c.slug}/`, text: c.name }))
    .concat([
      { to: '/blog/', text: 'Все статьи' },
      { to: '/rate/x50/', text: 'Mid rate x50' },
      { to: '/pvp/', text: 'PvP сервера' },
      { to: '/low-rate/', text: 'Low-rate сервера' },
    ])
)

const { generateBreadcrumbJsonLd } = useSeo()

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Анонсы серверов Lineage 2', url: '/' },
  { name: 'Блог', url: '/blog/' },
  { name: props.category.name, url: `/blog/${props.category.slug}/` },
])

const collectionJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: props.category.h1,
  description: props.category.description,
  url: canonicalUrl.value,
  inLanguage: 'ru-RU',
  isPartOf: {
    '@type': 'WebSite',
    name: 'L2GM',
    url: 'https://l2gm.com',
  },
  hasPart: articles.value.map((a) => ({
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    url: `https://l2gm.com/blog/${a.slug}/`,
    image: `https://l2gm.com${a.image}`,
    inLanguage: 'ru-RU',
    author: { '@type': 'Organization', name: 'L2GM' },
  })),
}))

useHead({
  title: props.category.title,
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Блог L2GM — RSS',
      href: 'https://l2gm.com/blog/rss.xml',
    },
  ],
  meta: [
    { name: 'description', content: props.category.description },
    { name: 'keywords', content: props.category.keywords },
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
    { name: 'author', content: 'L2GM' },
    { property: 'og:title', content: props.category.h1 },
    { property: 'og:description', content: props.category.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:image', content: 'https://l2gm.com/logo.svg' },
    { property: 'og:site_name', content: 'L2GM' },
    { property: 'og:locale', content: 'ru_RU' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: props.category.h1 },
    { name: 'twitter:description', content: props.category.description },
    { name: 'twitter:image', content: 'https://l2gm.com/logo.svg' },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(collectionJsonLd.value) },
  ],
})
</script>

<style scoped>
.blog-category-page {
  padding: var(--spacing-lg);
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

.blog-category-page :deep(.seo-section) {
  padding: 0;
  background: transparent;
  margin-top: var(--spacing-xl);
}
</style>
