<template>
  <div class="chronicle-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>{{ h1 }}</h1>
      </div>

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
      :title="`Новые сервера л2 ${chronicleName} с большим онлайном`"
      :text="seoText"
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
  generateServerListJsonLd,
} = useSeo()
import { getOrderedCategories } from '~/utils/dateUtils.js'

const chronicleSlug = route.params.chronicle
const chronicles = getChronicles()
const chronicle = chronicles.find((c) => c.slug === chronicleSlug)
const chronicleName = chronicle?.name || ''

const filters = { chronicle: chronicleSlug }
const filteredServers = getServers(filters)
const categories = getOrderedCategories(filteredServers)

const title = generateTitle(filters)
const h1 = generateH1(filters)
const description = generateDescription(filters)
const keywords = generateKeywords(filters)
const seoText = generateSeoText(filters)
const canonicalUrl = getCanonicalUrl(route.path)
const jsonLd = generateServerListJsonLd(filters, filteredServers)

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd),
    },
  ],
})
</script>

<style scoped>
.chronicle-page {
  padding: var(--spacing-lg) 0;
}
</style>
