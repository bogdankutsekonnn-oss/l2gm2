<template>
  <div class="rate-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>{{ h1 }}</h1>
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
              <h2 class="category-title">{{ category.name }}</h2>
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
              <h2 class="category-title">{{ category.name }}</h2>
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
        <div v-else class="no-servers">
          <p>Серверы не найдены</p>
        </div>
      </div>

      <div class="filters-column">
        <FiltersPanel />
      </div>
    </div>
    </div>

    <SeoSection
      :title="`Серверы Lineage 2 ${rateText}`"
      :text="seoText"
      :links="relatedRateLinks"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const { getServers, getRates } = useFilters()
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
} = useSeo()
import { getOrderedCategories } from '~/utils/dateUtils.js'

const rateSlug = route.params.rate
const rates = getRates()
const rate = rates.find((r) => r.slug === rateSlug)
// Если это ренж (содержит "-"), показываем как есть, иначе ищем в рейтах
const rateText = rateSlug.includes('-') ? rateSlug : (rate?.name || rateSlug)

const relatedRateLinks = computed(() =>
  rates
    .filter((r) => r.slug !== rateSlug)
    .map((r) => ({ to: `/rate/${r.slug}/`, text: `Серверы ${r.name}` }))
)

const filters = { rate: rateSlug }
const filteredServers = getServers(filters)
const categories = getOrderedCategories(filteredServers)

const title = generateTitle(filters)
const h1 = generateH1(filters)
const description = generateDescription(filters)
const keywords = generateKeywords(filters)
const seoText = generateSeoText(filters)
const canonicalUrl = getCanonicalUrl(route.path)
const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: rateText, url: `/rate/${rateSlug}` }
])
const collectionJsonLd = generateCollectionPageJsonLd(title, description, route.path, filteredServers)

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
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(collectionJsonLd) },
  ],
})
</script>

<style scoped>
.rate-page {
  padding: var(--spacing-lg) 0;
}
</style>
