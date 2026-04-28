<template>
  <div class="article-page page-wrapper">
    <Teleport to="body">
      <div
        class="reading-progress"
        role="progressbar"
        :aria-valuenow="Math.round(readingProgress)"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="reading-progress__bar" :style="{ width: `${readingProgress}%` }"></div>
      </div>
    </Teleport>
    <Breadcrumbs />

    <article
      v-if="article"
      class="article"
      itemscope
      :itemtype="articleSchemaType"
    >
      <div class="page-header">
        <div class="article__meta-top">
          <NuxtLink
            v-if="categorySlug"
            :to="`/blog/${categorySlug}/`"
            class="article__category"
            :class="`article__category--${getCategoryClass(article.category)}`"
            itemprop="articleSection"
          >
            {{ article.category }}
          </NuxtLink>
          <span
            v-else
            class="article__category"
            :class="`article__category--${getCategoryClass(article.category)}`"
            itemprop="articleSection"
          >
            {{ article.category }}
          </span>
          <time
            class="article__date"
            :datetime="article.date"
            itemprop="datePublished"
          >
            {{ formatDate(article.date) }}
          </time>
          <span class="article__reading-time" :aria-label="`Время чтения ${readingTime} минут`">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ readingTime }} мин чтения
          </span>
        </div>
        <h1 itemprop="headline">{{ article.title }}</h1>
      </div>

      <figure v-if="article.image" class="article__hero">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          width="1200"
          height="630"
          fit="cover"
          loading="eager"
          format="webp"
          quality="85"
          sizes="sm:100vw md:100vw lg:900px xl:1100px"
          class="article__hero-img"
        />
      </figure>

      <meta itemprop="dateModified" :content="article.date" />
      <meta itemprop="description" :content="article.description" />
      <meta itemprop="image" :content="fullImageUrl" />
      <meta itemprop="inLanguage" content="ru-RU" />
      <meta itemprop="wordCount" :content="wordCount" />
      <meta itemprop="timeRequired" :content="`PT${readingTime}M`" />
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

      <nav
        v-if="tableOfContents.length >= 2"
        class="article-toc"
        aria-labelledby="toc-title"
      >
        <div id="toc-title" class="article-toc__title">Содержание</div>
        <ol class="article-toc__list">
          <li v-for="item in tableOfContents" :key="item.id" class="article-toc__item">
            <a :href="`#${item.id}`" class="article-toc__link">{{ item.text }}</a>
          </li>
        </ol>
      </nav>

      <div class="article__content" itemprop="articleBody">
        <ContentRenderer :value="article" />
      </div>

      <div v-if="faqItems.length" class="article-faq-wrapper">
        <FaqBlock :items="faqItems" />
      </div>

      <div class="article-share" aria-label="Поделиться статьёй">
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
        aria-label="Навигация по статьям"
      >
        <NuxtLink
          v-if="prevArticle"
          :to="`/blog/${prevArticle.slug}/`"
          class="article-nav__link article-nav__link--prev"
        >
          <span class="article-nav__dir">&larr; Предыдущая</span>
          <span class="article-nav__title">{{ prevArticle.title }}</span>
        </NuxtLink>
        <span v-else class="article-nav__placeholder"></span>
        <NuxtLink
          v-if="nextArticle"
          :to="`/blog/${nextArticle.slug}/`"
          class="article-nav__link article-nav__link--next"
        >
          <span class="article-nav__dir">Следующая &rarr;</span>
          <span class="article-nav__title">{{ nextArticle.title }}</span>
        </NuxtLink>
        <span v-else class="article-nav__placeholder"></span>
      </nav>

      <div class="article__footer">
        <NuxtLink to="/blog/" class="btn-primary article__back">Все статьи блога</NuxtLink>
      </div>
    </article>

    <section v-if="relatedArticles.length" class="related-block" aria-labelledby="related-title">
      <h2 id="related-title" class="related-block__title">Читайте также</h2>
      <div class="related-grid">
        <BlogCard
          v-for="item in relatedArticles"
          :key="item.slug"
          :article="item"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  slug: { type: String, required: true },
})

const { getCategorySlug } = useBlogCategories()

const { data: article } = await useAsyncData(`blog-${props.slug}`, () =>
  queryCollection('blog')
    .where('slug', '=', props.slug)
    .first()
)

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Статья не найдена' })
}

const categorySlug = computed(() => getCategorySlug(article.value.category))

// Все статьи для блока "Читайте также"
const { data: allArticles } = await useAsyncData(
  `blog-all-${props.slug}`,
  () => queryCollection('blog').order('date', 'DESC').all()
)

const relatedArticles = computed(() => {
  const list = (allArticles.value || []).filter((a) => a.slug !== props.slug)
  const sameCategory = list.filter((a) => a.category === article.value.category)
  const otherCategory = list.filter((a) => a.category !== article.value.category)
  return [...sameCategory, ...otherCategory].slice(0, 3)
})

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
  () => `https://l2gm.com/blog/${article.value.slug}/`
)
const fullImageUrl = computed(
  () => `https://l2gm.com${article.value.image || '/logo.svg'}`
)

const articleSchemaType = computed(() => {
  if (article.value.category === 'Новости') return 'https://schema.org/NewsArticle'
  return 'https://schema.org/BlogPosting'
})

const getCategoryClass = (category) => {
  const map = {
    'Новости': 'news',
    'Статьи': 'articles',
    'Гайды': 'guides',
    'Обзоры': 'reviews',
    'Лор': 'lore',
  }
  return map[category] || 'default'
}

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

// --- AST утилиты ---

function collectText(node, out = []) {
  if (node == null) return out
  if (typeof node === 'string' || typeof node === 'number') {
    out.push(String(node))
    return out
  }
  if (Array.isArray(node)) {
    if (typeof node[0] === 'string') {
      const children = node.slice(2)
      for (const child of children) collectText(child, out)
    } else {
      for (const item of node) collectText(item, out)
    }
    return out
  }
  if (typeof node === 'object') {
    if (node.value != null) collectText(node.value, out)
    if (node.children != null) collectText(node.children, out)
  }
  return out
}

const cyrMap = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',
  к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
  х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'
}
function slugify(str) {
  return String(str)
    .toLowerCase()
    .split('')
    .map((ch) => cyrMap[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function collectH2(node, out = []) {
  if (!node) return out
  if (Array.isArray(node)) {
    if (typeof node[0] === 'string' && node[0].toLowerCase() === 'h2') {
      const propsNode = (typeof node[1] === 'object' && node[1]) || {}
      const textParts = []
      for (const child of node.slice(2)) collectText(child, textParts)
      const text = textParts.join('').trim()
      if (text) {
        const id = propsNode.id || slugify(text)
        out.push({ id, text })
      }
    }
    for (const child of node) collectH2(child, out)
    return out
  }
  if (typeof node === 'object') {
    if (node.value != null) collectH2(node.value, out)
    if (node.children != null) collectH2(node.children, out)
  }
  return out
}

const articleText = computed(() => {
  const body = article.value?.body
  if (!body) return ''
  const parts = []
  collectText(body, parts)
  return parts.join(' ')
})

const wordCount = computed(() => {
  return articleText.value
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .length
})

const readingTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 200)))

const tableOfContents = computed(() => {
  const body = article.value?.body
  if (!body) return []
  return collectH2(body)
})

// --- Прогресс-бар ---
const readingProgress = ref(0)

function updateReadingProgress() {
  const doc = document.documentElement
  const scrollTop = doc.scrollTop || document.body.scrollTop
  const scrollHeight = doc.scrollHeight - doc.clientHeight
  if (scrollHeight <= 0) {
    readingProgress.value = 0
    return
  }
  const pct = (scrollTop / scrollHeight) * 100
  readingProgress.value = Math.max(0, Math.min(100, pct))
}

onMounted(() => {
  updateReadingProgress()
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  window.addEventListener('resize', updateReadingProgress, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', updateReadingProgress)
    window.removeEventListener('resize', updateReadingProgress)
  }
})

// --- Шеринг ---
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

const breadcrumbItems = computed(() => {
  const items = [
    { name: 'Анонсы серверов Lineage 2', url: '/' },
    { name: 'Блог', url: '/blog/' },
  ]
  if (categorySlug.value) {
    items.push({
      name: article.value.category,
      url: `/blog/${categorySlug.value}/`,
    })
  }
  items.push({
    name: article.value.title,
    url: `/blog/${article.value.slug}/`,
  })
  return items
})

const breadcrumbJsonLd = computed(() => generateBreadcrumbJsonLd(breadcrumbItems.value))

const schemaTypeName = computed(() =>
  article.value.category === 'Новости' ? 'NewsArticle' : 'BlogPosting'
)

const articleJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': schemaTypeName.value,
  headline: article.value.title,
  description: article.value.description,
  image: [fullImageUrl.value],
  datePublished: article.value.date,
  dateModified: article.value.date,
  articleSection: article.value.category,
  inLanguage: 'ru-RU',
  wordCount: wordCount.value,
  timeRequired: `PT${readingTime.value}M`,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.article__content p'],
  },
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
}))

const faqItems = computed(() =>
  (article.value.faq || []).map((item) => ({
    question: item.q,
    answer: item.a,
  }))
)

const faqJsonLd = computed(() => {
  if (!faqItems.value.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.value.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
})

const articleKeywords = computed(() => {
  const base = 'lineage 2, l2, лайнейдж 2, л2, блог l2gm'
  return `${article.value.title.toLowerCase()}, ${article.value.category.toLowerCase()} lineage 2, ${base}`
})

useHead({
  title: `${article.value.title} | Блог L2GM`,
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
    { property: 'og:image:type', content: 'image/webp' },
    { property: 'og:site_name', content: 'L2GM' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'article:published_time', content: article.value.date },
    { property: 'article:modified_time', content: article.value.date },
    { property: 'article:section', content: article.value.category },
    { property: 'article:author', content: 'L2GM' },
    { property: 'article:tag', content: article.value.category },
    { property: 'article:tag', content: 'Lineage 2' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@l2gm' },
    { name: 'twitter:title', content: article.value.title },
    { name: 'twitter:description', content: article.value.description },
    { name: 'twitter:image', content: fullImageUrl.value },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd.value) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(articleJsonLd.value) },
    ...(faqJsonLd.value
      ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(faqJsonLd.value) }]
      : []),
  ],
})
</script>

<style>
.reading-progress {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  z-index: 101;
  pointer-events: none;
}

.reading-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-main), #ff7a3d);
  transition: width 0.08s linear;
  box-shadow: 0 0 8px rgba(254, 54, 0, 0.5);
  width: 0;
}

@media (max-width: 1024px) {
  .reading-progress {
    top: 57px;
  }
}
</style>

<style scoped>
.article-page {
  padding: var(--spacing-lg);
  min-height: 60vh;
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

.article__category {
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(187, 187, 187, 0.5);
  text-decoration: none;
  transition: color 0.2s;
}

a.article__category:hover {
  color: var(--text-primary);
}

.article__date {
  font-size: var(--font-sm);
  color: var(--text-disabled);
}

.article__reading-time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-sm);
  color: var(--text-disabled);
}

.article-toc {
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
}

.article-toc__title {
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.article-toc__list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: toc;
}

.article-toc__item {
  counter-increment: toc;
  padding: 4px 0;
}

.article-toc__item::before {
  content: counter(toc) '. ';
  color: var(--text-disabled);
  font-size: var(--font-sm);
}

.article-toc__link {
  color: var(--text-primary);
  text-decoration: none;
  font-size: var(--font-base);
  transition: color 0.2s;
}

.article-toc__link:hover {
  color: var(--primary-main);
  text-decoration: underline;
}

.article__hero {
  max-width: 1100px;
  margin: var(--spacing-lg) auto var(--spacing-xl);
  padding: 0 4px;
}

.article__hero-img {
  width: 100%;
  height: auto;
  aspect-ratio: 1200 / 630;
  object-fit: cover;
  display: block;
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

.article__content :deep(h2) {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: #fff;
  margin-top: var(--spacing-xxl);
  margin-bottom: var(--spacing-md);
  line-height: 1.3;
  scroll-margin-top: 100px;
  text-decoration: none;
  border: none;
}

.article__content :deep(h2 a),
.article__content :deep(h2 a:hover) {
  color: #fff;
  text-decoration: none;
  border: none;
}

.article__content :deep(h3) {
  font-size: var(--font-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
  scroll-margin-top: 100px;
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

.article__content :deep(code) {
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--text-primary);
}

.article__content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
  margin: var(--spacing-lg) 0;
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

.article-faq-wrapper {
  max-width: 800px;
  margin: var(--spacing-xxl) auto 0;
  padding: 0 4px;
}

.article-faq-wrapper :deep(.faq-block) {
  background: transparent;
  padding: 0;
  margin-top: 0;
}

.related-block {
  margin-top: var(--spacing-xxl);
  padding: 4px;
}

.related-block__title {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-lg);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-sm);
}

@media (max-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .related-grid {
    grid-template-columns: minmax(0, 1fr);
  }

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

  .article-toc {
    padding: var(--spacing-sm) var(--spacing-md);
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
