<template>
  <div class="chronicle-rate-page">
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
      :title="`Новые сервера л2 ${chronicleName} ${rateText} с большим онлайном`"
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
} = useSeo()
import { getOrderedCategories } from '~/utils/dateUtils.js'

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
const filteredServers = getServers(filters)
const categories = getOrderedCategories(filteredServers)

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
    ...getOgImageMeta(),
  ],
  link: [{ rel: 'canonical', href: getCanonicalUrl(route.path) }],
})
</script>

<style scoped>
.chronicle-rate-page {
  padding: var(--spacing-lg) 0;
}
</style>
