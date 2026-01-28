<template>
  <div class="rate-page">
    <Breadcrumbs />
    <div class="page-header">
      <h1>{{ h1 }}</h1>
    </div>

    <div class="page-layout">
      <div class="servers-column">
        <div v-if="filteredServers.length > 0">
          <div
            v-for="(servers, category) in categorizedServers"
            :key="category"
            class="server-category"
          >
            <h2 class="category-title">{{ category }}</h2>
            <div class="servers-grid">
              <ServerCard
                v-for="server in servers"
                :key="server.id"
                :server="server"
              />
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

    <SeoSection
      :title="`Новые сервера л2 ${rateText} с большим онлайном`"
      :text="seoText"
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
  generateSeoText,
  getCanonicalUrl,
} = useSeo()
const { categorizeServers } = await import('~/utils/dateUtils.js')

const rateSlug = route.params.rate
const rates = getRates()
const rate = rates.find((r) => r.slug === rateSlug)
const rateText = rate?.name || rateSlug

const filters = { rate: rateSlug }
const filteredServers = getServers(filters)
const categorizedServers = categorizeServers(filteredServers)

const title = generateTitle(filters)
const h1 = generateH1(filters)
const description = generateDescription(filters)
const seoText = generateSeoText(filters)

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ],
  link: [{ rel: 'canonical', href: getCanonicalUrl(route.path) }],
})
</script>

<style scoped>
.rate-page {
  padding: var(--spacing-lg) 0;
}
</style>
