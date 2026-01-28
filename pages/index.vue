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

    <SeoSection
      title="Новые сервера л2 с большим онлайном"
      :text="seoText"
    />
  </div>
</template>

<script setup>
const { getServers } = useFilters()
const { generateSeoText } = useSeo()
const { categorizeServers } = await import('~/utils/dateUtils.js')

const servers = getServers()
const categorizedServers = categorizeServers(servers)

const seoText = generateSeoText()

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
