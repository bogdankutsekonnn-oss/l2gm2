<template>
  <div class="chronicle-page">
    <div class="page-header">
      <h1>{{ h1 }}</h1>
    </div>

    <div class="page-layout">
      <div class="servers-column">
        <div v-if="filteredServers.length > 0">
          <div v-for="(servers, category) in categorizedServers" :key="category" class="server-category">
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

    <div class="seo-section">
      <h2>Новые сервера л2 {{ chronicleName }} с большим онлайном</h2>
      <div class="seo-text">
        <p v-for="(paragraph, index) in seoTextParagraphs" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { getServers, getChronicles } = useFilters()
const { generateTitle, generateH1, generateDescription, generateSeoText, getCanonicalUrl } = useSeo()
const { categorizeServers } = await import('~/utils/dateUtils.js')

const chronicleSlug = route.params.chronicle
const chronicles = getChronicles()
const chronicle = chronicles.find(c => c.slug === chronicleSlug)
const chronicleName = chronicle?.name || ''

const filters = { chronicle: chronicleSlug }
const filteredServers = getServers(filters)
const categorizedServers = categorizeServers(filteredServers)

const title = generateTitle(filters)
const h1 = generateH1(filters)
const description = generateDescription(filters)
const seoText = generateSeoText(filters)
const seoTextParagraphs = seoText.split('\n\n').filter(p => p.trim())

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description }
  ],
  link: [
    { rel: 'canonical', href: getCanonicalUrl(route.path) }
  ]
})
</script>

<style scoped>
.chronicle-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: var(--font-h1);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.page-layout {
  display: grid;
  grid-template-columns: 894px 240px;
  gap: 24px;
  margin-bottom: var(--spacing-xxl);
}

.servers-column {
  width: 894px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.server-category {
  margin-bottom: var(--spacing-lg);
}

.category-title {
  font-size: var(--font-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.servers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.filters-column {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.no-servers {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-secondary);
}

.seo-section {
  margin-top: var(--spacing-xxl);
  padding: var(--spacing-xl);
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
}

.seo-section h2 {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.seo-text {
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.8;
}

.seo-text p {
  margin-bottom: var(--spacing-md);
}

@media (max-width: 1024px) {
  .page-layout {
    grid-template-columns: 1fr;
  }
  
  .filters-column {
    position: static;
  }
  
  .servers-grid {
    grid-template-columns: 1fr;
  }
}
</style>
