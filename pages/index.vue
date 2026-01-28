<template>
  <div class="home-page">
    <div class="page-header">
      <h1>Анонсы серверов Lineage 2</h1>
    </div>

    <div class="page-layout">
      <div class="servers-column">
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

      <div class="filters-column">
        <FiltersPanel />
      </div>
    </div>

    <div class="seo-section">
      <h2>Новые сервера л2 с большим онлайном</h2>
      <div class="seo-text">
        <p v-for="(paragraph, index) in seoTextParagraphs" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getServers } = useFilters()
const { generateSeoText } = useSeo()
const { categorizeServers } = await import('~/utils/dateUtils.js')

const servers = getServers()
const categorizedServers = categorizeServers(servers)

const seoText = generateSeoText()
const seoTextParagraphs = seoText.split('\n\n').filter((p) => p.trim())

useHead({
  title: 'Анонсы серверов Lineage 2 - L2GM',
  meta: [
    {
      name: 'description',
      content:
        'Анонсы серверов Lineage 2 всех рейтов и хроник. Не пропустите открытие серверов л2 уже сегодня!',
    },
  ],
})
</script>

<style scoped>
.home-page {
  padding: var(--spacing-lg) 0;
}
</style>
