<template>
  <div class="chronicle-rate-page">
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
              <h2 class="category-title">
                {{ category.name }}
                <span v-if="getCategoryDate(category.name)" class="category-date">{{ getCategoryDate(category.name) }}</span>
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
              <h2 class="category-title">
                {{ category.name }}
                <span v-if="getCategoryDate(category.name)" class="category-date">{{ getCategoryDate(category.name) }}</span>
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
      :title="`Сервера Lineage 2 ${chronicleName} ${rateText}`"
      :text="seoText"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const { getServers, getChronicles, getRates } = useFilters()
const {
  generateTitle,
  generateH1,
  generateDescription,
  generateSeoText,
  getCanonicalUrl,
  getOgImageMeta,
  generateBreadcrumbJsonLd,
  generateCollectionPageJsonLd,
} = useSeo()
import { getOrderedCategories, pluralServers, getCategoryDate } from '~/utils/dateUtils.js'

const chronicleSlug = route.params.chronicle
const rateSlug = route.params.rate

const chronicles = getChronicles()
const rates = getRates()

const chronicle = chronicles.find((c) => c.slug === chronicleSlug)
const rate = rates.find((r) => r.slug === rateSlug)

const chronicleName = chronicle?.name || ''
// Если это ренж (содержит "-"), показываем как есть, иначе ищем в рейтах
const rateText = rateSlug.includes('-') ? rateSlug : (rate?.name || rateSlug)

const filters = {
  chronicle: chronicleSlug,
  rate: rateSlug,
}
const filteredServers = computed(() => getServers(filters))
const categories = computed(() => getOrderedCategories(filteredServers.value))

const title = generateTitle(filters)
const h1 = generateH1(filters)
const description = generateDescription(filters)
const seoText = generateSeoText(filters)

const canonicalUrl = getCanonicalUrl(route.path)
const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: chronicleName, url: `/chronicle/${chronicleSlug}` },
  { name: rateText, url: `/chronicle/${chronicleSlug}/rate/${rateSlug}` }
])
const collectionJsonLd = generateCollectionPageJsonLd(title, description, route.path, filteredServers.value)

useHead({
  title,
  meta: [
    { name: 'description', content: description },
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
.chronicle-rate-page {
  padding: var(--spacing-lg) 0;
}
</style>
