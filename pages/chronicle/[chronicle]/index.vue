<template>
  <div class="chronicle-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>{{ h1 }}</h1>
        <ClientOnly>
          <span v-if="filteredServers.length" class="servers-count">Найдено {{ filteredServers.length }} {{ pluralServers(filteredServers.length) }}</span>
        </ClientOnly>
      </div>

      <MobileFilters />

      <div class="page-layout">
      <div class="servers-column">
        <div v-if="filteredServers.length > 0" class="categories-grid">
          <div class="category-col">
            <div
              v-for="category in categories.leftColumn"
              :key="category.name"
              class="server-category"
            >
              <h2 :class="['category-title', { 'category-title--top': isTopCategory(category.name) }]">
                {{ category.name }}
                <span v-if="getCategoryDate(category.name, now)" class="category-date">{{ getCategoryDate(category.name, now) }}</span>
              </h2>
              <div class="servers-grid">
                <ServerCard
                  v-for="server in category.servers"
                  :key="server.id"
                  :server="server"
                />
              </div>
            </div>
          </div>
          <div class="category-col">
            <div
              v-for="category in categories.rightColumn"
              :key="category.name"
              class="server-category"
            >
              <h2 :class="['category-title', { 'category-title--top': isTopCategory(category.name) }]">
                {{ category.name }}
                <span v-if="getCategoryDate(category.name, now)" class="category-date">{{ getCategoryDate(category.name, now) }}</span>
              </h2>
              <div class="servers-grid">
                <ServerCard
                  v-for="server in category.servers"
                  :key="server.id"
                  :server="server"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="neighborServers.length" class="chronicle-fallback">
          <p class="chronicle-fallback__note">
            Сейчас анонсов на {{ chronicleName }} нет. Ближайшие старты на похожих хрониках —
            <template v-for="(n, i) in neighborChronicles" :key="n.slug">
              <NuxtLink :to="`/chronicle/${n.slug}/`">{{ n.name }}</NuxtLink><template v-if="i < neighborChronicles.length - 1">, </template>
            </template>:
          </p>
          <div class="servers-grid">
            <ServerCard
              v-for="server in neighborServers"
              :key="server.id"
              :server="server"
            />
          </div>
        </div>
        <div v-else class="no-servers">
          <p>Сервера не найдены</p>
        </div>
      </div>

      <div class="filters-column">
        <FiltersPanel />
      </div>
    </div>
    </div>

    <SeoSection
      :title="`Сервера Lineage 2 ${chronicleName}`"
      :text="seoText"
      :links="relatedChronicleLinks"
      :combo-links="comboRateLinks"
      :combo-links-title="`${chronicleName} по рейтам`"
    />

    <RelatedArticles
      v-if="chronicleArticles.length"
      :title="`Гайды и статьи по ${chronicleName}`"
      :articles="chronicleArticles"
    />

    <FaqBlock :items="faqItems" />
  </div>
</template>

<script setup>
import blogIndex from '~/data/blog-index.json'
import serversJson from '~/data/servers.json'
import { CHRONICLE_NEIGHBORS, isChronicleEmpty } from '~/utils/chronicleCoverage.js'

const route = useRoute()
const { getServers, getChronicles, getRates } = useFilters()
const {
  generateTitle,
  generateH1,
  generateDescription,
  generateKeywords,
  generateSeoText,
  getCanonicalUrl,
  getOgImageMeta,
  generateBreadcrumbJsonLd,
  generateCollectionPageJsonLd,
  generateFaqItems,
  generateFaqJsonLd,
} = useSeo()
import { getOrderedCategories, pluralServers, getCategoryDate, isTopCategory } from '~/utils/dateUtils.js'

const chronicleSlug = route.params.chronicle
const chronicles = getChronicles()
const chronicle = chronicles.find((c) => c.slug === chronicleSlug)
const chronicleName = chronicle?.name || ''

const filters = { chronicle: chronicleSlug }
const filteredServers = computed(() => getServers(filters))
const now = useNow()
const categories = computed(() => getOrderedCategories(filteredServers.value, now.value))

// Пустая хроника (utils/chronicleCoverage.js): noindex + старты соседей.
const chronicleEmpty = isChronicleEmpty(chronicle, serversJson, now.value)
const neighborChronicles = (CHRONICLE_NEIGHBORS[chronicleSlug] || [])
  .map((slug) => chronicles.find((c) => c.slug === slug))
  .filter(Boolean)
const neighborServers = computed(() => {
  if (filteredServers.value.length) return []
  const today = new Date(now.value).toISOString().slice(0, 10)
  return neighborChronicles
    .flatMap((c) => getServers({ chronicle: c.slug }))
    .filter((s) => s.startDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 12)
})

const rates = getRates()

const relatedChronicleLinks = computed(() =>
  chronicles
    .filter((c) => c.slug !== chronicleSlug)
    .map((c) => ({ to: `/chronicle/${c.slug}/`, text: `Сервера ${c.name}` }))
)

const comboRateLinks = computed(() =>
  rates.map((r) => ({
    to: `/chronicle/${chronicleSlug}/rate/${r.slug}/`,
    text: `${chronicleName} ${r.name}`
  }))
)

// Статьи блога по теме хроники — матчим название (en/ru) в заголовке и slug.
// Для «плюсовых» хроник (Interlude+) ищем по базовому имени без «+».
const chronicleArticles = (() => {
  const needles = [chronicle?.name, chronicle?.nameRu]
    .filter(Boolean)
    .map((n) => n.replace(/\+$/, '').toLowerCase())
  if (!needles.length) return []
  return blogIndex
    .filter((article) => {
      const haystack = `${article.title} ${article.slug}`.toLowerCase()
      return needles.some((needle) => haystack.includes(needle))
    })
    .slice(0, 4)
})()

const title = generateTitle(filters)
const h1 = generateH1(filters)
const description = generateDescription(filters)
const keywords = generateKeywords(filters)
const seoText = generateSeoText(filters)
const faqItems = generateFaqItems(filters)
const faqJsonLd = generateFaqJsonLd(faqItems)
const canonicalUrl = getCanonicalUrl(route.path)
const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: chronicleName, url: `/chronicle/${chronicleSlug}` }
])
const collectionJsonLd = generateCollectionPageJsonLd(title, description, route.path, filteredServers.value)

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    ...getOgImageMeta(),
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    // Пока на хронике нет серверов — вне индекса (и вне sitemap, см.
    // server/api/__sitemap__/urls.ts); ссылки по странице поисковик обходит.
    ...(chronicleEmpty ? [{ name: 'robots', content: 'noindex, follow' }] : []),
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(collectionJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(faqJsonLd) },
  ],
})
</script>

<style scoped>
.chronicle-page {
  padding: var(--spacing-lg) 0;
}

.chronicle-fallback__note {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  line-height: 1.5;
}

.chronicle-fallback__note a {
  color: var(--text-primary);
}
</style>
