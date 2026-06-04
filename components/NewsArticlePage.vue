<template>
  <div class="article-page page-wrapper">
    <Breadcrumbs />

    <article
      v-if="article"
      class="article"
      itemscope
      itemtype="https://schema.org/NewsArticle"
    >
      <div class="page-header">
        <div class="article__meta-top">
          <time
            class="article__date"
            :datetime="article.date"
            itemprop="datePublished"
          >
            {{ formatDate(article.date) }}
          </time>
          <time
            v-if="article.updated && article.updated !== article.date"
            class="article__updated"
            :datetime="article.updated"
          >
            · обновлено {{ formatDate(article.updated) }}
          </time>
        </div>
        <h1 itemprop="headline">{{ article.title }}</h1>
      </div>

      <figure v-if="article.image" class="article__hero">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          width="1200"
          loading="eager"
          format="webp"
          quality="85"
          sizes="sm:100vw md:100vw lg:900px xl:1100px"
          class="article__hero-img"
        />
      </figure>

      <meta itemprop="dateModified" :content="article.updated || article.date" />
      <meta itemprop="description" :content="article.description" />
      <meta itemprop="image" :content="fullImageUrl" />
      <meta itemprop="inLanguage" content="ru-RU" />
      <link itemprop="mainEntityOfPage" :href="canonicalUrl" />

      <div itemprop="author" itemscope itemtype="https://schema.org/Organization" style="display:none">
        <meta itemprop="name" content="L2GM" />
        <meta itemprop="url" content="https://l2gm.com" />
      </div>

      <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization" style="display:none">
        <meta itemprop="name" content="L2GM" />
        <meta itemprop="url" content="https://l2gm.com" />
        <div itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
          <meta itemprop="url" content="https://l2gm.com/logo.svg" />
          <meta itemprop="width" content="120" />
          <meta itemprop="height" content="24" />
        </div>
      </div>

      <div class="article__content" itemprop="articleBody">
        <ContentRenderer :value="article" />
      </div>

      <div v-if="youtubeId" class="article__video">
        <div class="article__video-label">Смотреть видео</div>
        <iframe
          :src="`https://www.youtube.com/embed/${youtubeId}`"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>

      <div class="article-share" aria-label="Поделиться новостью">
        <span class="article-share__label">Поделиться:</span>
        <button
          type="button"
          class="article-share__btn article-share__btn--tg"
          aria-label="Поделиться в Telegram"
          @click="shareTelegram"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
          </svg>
          Telegram
        </button>
        <button
          type="button"
          class="article-share__btn article-share__btn--vk"
          aria-label="Поделиться во ВКонтакте"
          @click="shareVk"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/>
          </svg>
          ВКонтакте
        </button>
        <button
          type="button"
          class="article-share__btn"
          :aria-label="copied ? 'Ссылка скопирована' : 'Скопировать ссылку'"
          @click="copyLink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              v-if="!copied"
              d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ copied ? 'Скопировано' : 'Ссылка' }}
        </button>
      </div>

      <nav
        v-if="prevArticle || nextArticle"
        class="article-nav"
        aria-label="Навигация по новостям"
      >
        <NuxtLink
          v-if="prevArticle"
          :to="`/news/${prevArticle.slug}/`"
          class="article-nav__link article-nav__link--prev"
        >
          <span class="article-nav__dir">&larr; Предыдущая</span>
          <span class="article-nav__title">{{ prevArticle.title }}</span>
        </NuxtLink>
        <span v-else class="article-nav__placeholder"></span>
        <NuxtLink
          v-if="nextArticle"
          :to="`/news/${nextArticle.slug}/`"
          class="article-nav__link article-nav__link--next"
        >
          <span class="article-nav__dir">Следующая &rarr;</span>
          <span class="article-nav__title">{{ nextArticle.title }}</span>
        </NuxtLink>
        <span v-else class="article-nav__placeholder"></span>
      </nav>

      <NewsComments :news-slug="article.slug" />

      <div class="article__footer">
        <NuxtLink to="/news/" class="btn-primary article__back">Все новости</NuxtLink>
      </div>
    </article>
  </div>
</template>

<script setup>
const props = defineProps({
  slug: { type: String, required: true },
})

const { data: article } = await useAsyncData(`news-${props.slug}`, () =>
  queryCollection('news')
    .where('slug', '=', props.slug)
    .first()
)

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Новость не найдена' })
}

const { data: allArticles } = await useAsyncData(
  `news-all-${props.slug}`,
  () => queryCollection('news').order('date', 'DESC').all()
)

const currentIndex = computed(() =>
  (allArticles.value || []).findIndex((a) => a.slug === props.slug)
)
const nextArticle = computed(() => {
  const list = allArticles.value || []
  const i = currentIndex.value
  return i > 0 ? list[i - 1] : null
})
const prevArticle = computed(() => {
  const list = allArticles.value || []
  const i = currentIndex.value
  return i >= 0 && i < list.length - 1 ? list[i + 1] : null
})

const canonicalUrl = computed(
  () => `https://l2gm.com/news/${article.value.slug}/`
)
const fullImageUrl = computed(
  () => `https://l2gm.com${article.value.image || '/logo.svg'}`
)

const youtubeId = computed(() => {
  const url = article.value.videoUrl
  if (!url) return null
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const copied = ref(false)

function shareTelegram() {
  const url = `https://t.me/share/url?url=${encodeURIComponent(canonicalUrl.value)}&text=${encodeURIComponent(article.value.title)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

function shareVk() {
  const url = `https://vk.com/share.php?url=${encodeURIComponent(canonicalUrl.value)}&title=${encodeURIComponent(article.value.title)}&description=${encodeURIComponent(article.value.description)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

async function copyLink() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(canonicalUrl.value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = canonicalUrl.value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('Copy failed', e)
  }
}

const { generateBreadcrumbJsonLd } = useSeo()

const breadcrumbItems = computed(() => [
  { name: 'Анонсы серверов Lineage 2', url: '/' },
  { name: 'Новости серверов', url: '/news/' },
  { name: article.value.title, url: `/news/${article.value.slug}/` },
])

const breadcrumbJsonLd = computed(() => generateBreadcrumbJsonLd(breadcrumbItems.value))

const articleJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: article.value.title,
  description: article.value.description,
  image: [fullImageUrl.value],
  datePublished: article.value.date,
  dateModified: article.value.updated || article.value.date,
  inLanguage: 'ru-RU',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': canonicalUrl.value,
  },
  author: {
    '@type': 'Organization',
    name: 'L2GM',
    url: 'https://l2gm.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'L2GM',
    url: 'https://l2gm.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://l2gm.com/logo.svg',
      width: 120,
      height: 24,
    },
  },
  ...(article.value.videoUrl ? {
    video: {
      '@type': 'VideoObject',
      name: article.value.title,
      description: article.value.description,
      embedUrl: `https://www.youtube.com/embed/${youtubeId.value}`,
      uploadDate: article.value.date,
    },
  } : {}),
}))

const articleKeywords = computed(() => {
  return `${article.value.title.toLowerCase()}, новости lineage 2, новости серверов l2, lineage 2, l2, лайнейдж 2, л2`
})

useHead({
  title: `${article.value.title} | Новости L2GM`,
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Новости серверов L2GM — RSS',
      href: 'https://l2gm.com/news/rss.xml',
    },
  ],
  meta: [
    { name: 'description', content: article.value.description },
    { name: 'keywords', content: articleKeywords.value },
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
    { name: 'author', content: 'L2GM' },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:image', content: fullImageUrl.value },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: article.value.title },
    { property: 'og:site_name', content: 'L2GM' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'article:published_time', content: article.value.date },
    { property: 'article:modified_time', content: article.value.date },
    { property: 'article:author', content: 'L2GM' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: article.value.title },
    { name: 'twitter:description', content: article.value.description },
    { name: 'twitter:image', content: fullImageUrl.value },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd.value) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(articleJsonLd.value) },
  ],
})
</script>

<style scoped>
.article-page {
  padding: var(--spacing-lg);
  min-height: 60vh;
}

.page-header {
  margin: 4px 4px var(--spacing-lg);
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

.article__meta-top {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 0 4px;
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.article__date {
  font-size: var(--font-sm);
  color: var(--text-disabled);
}

.article__updated {
  font-size: var(--font-sm);
  color: var(--text-disabled);
  font-style: italic;
}

.article__hero {
  max-width: 1100px;
  margin: var(--spacing-lg) auto var(--spacing-xl);
  padding: 0 4px;
}

.article__hero-img {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.article__video {
  max-width: 800px;
  margin: var(--spacing-xxl) auto 0;
  padding: 0 var(--spacing-md);
}

.article__video-label {
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.article__video iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.article__content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: var(--font-base);
}

.article__content :deep(img:not(.image-slider__img)) {
  display: block;
  width: 100%;
  height: auto;
  margin: var(--spacing-lg) auto;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.article__content :deep(h2) {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: #fff;
  margin-top: var(--spacing-xxl);
  margin-bottom: var(--spacing-md);
  line-height: 1.3;
}

.article__content :deep(h3) {
  font-size: var(--font-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
}

.article__content :deep(p) {
  margin-bottom: var(--spacing-md);
}

.article__content :deep(ul) {
  list-style: disc outside;
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-xl);
}

.article__content :deep(ol) {
  list-style: decimal outside;
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-xl);
}

.article__content :deep(li) {
  margin-bottom: var(--spacing-xs);
  color: var(--text-secondary);
}

.article__content :deep(li)::marker {
  color: var(--text-secondary);
}

.article__content :deep(strong) {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}

.article__content :deep(a) {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.article__content :deep(a:hover) {
  color: var(--primary-main);
  text-decoration: underline;
}

.article__content :deep(blockquote) {
  border-left: 3px solid var(--primary-main);
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-md) 0;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.article-share {
  max-width: 800px;
  margin: var(--spacing-xl) auto 0;
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.article-share__label {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin-right: var(--spacing-xs);
}

.article-share__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.article-share__btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.article-share__btn--tg:hover {
  background: rgba(42, 171, 238, 0.2);
  color: #2aabee;
}

.article-share__btn--vk:hover {
  background: rgba(0, 119, 255, 0.2);
  color: #4a76a8;
}

.article-nav {
  max-width: 800px;
  margin: var(--spacing-xxl) auto 0;
  padding: 0 var(--spacing-md);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.article-nav__link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all 0.2s;
  min-width: 0;
}

.article-nav__link:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
}

.article-nav__link--next {
  text-align: right;
  align-items: flex-end;
}

.article-nav__dir {
  font-size: var(--font-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--primary-main);
  font-weight: var(--font-semibold);
}

.article-nav__title {
  font-size: var(--font-sm);
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-nav__placeholder {
  display: block;
}

.article__footer {
  max-width: 800px;
  margin: var(--spacing-xl) auto 0;
  padding: var(--spacing-xl) var(--spacing-md) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.article__back {
  min-width: 220px;
}

@media (max-width: 640px) {
  .article-page {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .page-header h1 {
    font-size: 22px;
    padding: 12px;
  }

  .article__content {
    padding: 0 var(--spacing-xs);
  }

  .article__video {
    padding: 0 var(--spacing-xs);
  }

  .article-nav {
    grid-template-columns: minmax(0, 1fr);
  }

  .article-nav__link--next {
    text-align: left;
    align-items: flex-start;
  }
}
</style>
