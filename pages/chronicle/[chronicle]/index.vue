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
      :title="`Сервера Lineage 2 ${chronicleName}`"
      :text="seoText"
      :links="relatedChronicleLinks"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const { getServers, getChronicles } = useFilters()
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
import { getOrderedCategories, pluralServers, getCategoryDate } from '~/utils/dateUtils.js'

const chronicleSlug = route.params.chronicle
const chronicles = getChronicles()
const chronicle = chronicles.find((c) => c.slug === chronicleSlug)
const chronicleName = chronicle?.name || ''

const filters = { chronicle: chronicleSlug }
const filteredServers = computed(() => getServers(filters))
const categories = computed(() => getOrderedCategories(filteredServers.value))

const relatedChronicleLinks = computed(() =>
  chronicles
    .filter((c) => c.slug !== chronicleSlug)
    .map((c) => ({ to: `/chronicle/${c.slug}/`, text: `Сервера ${c.name}` }))
)

const title = generateTitle(filters)
const h1 = generateH1(filters)
const description = generateDescription(filters)
const keywords = generateKeywords(filters)
const seoText = generateSeoText(filters)
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
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(collectionJsonLd) },
  ],
})
</script>

<style scoped>
.chronicle-page {
  padding: var(--spacing-lg) 0;
}
</style>
