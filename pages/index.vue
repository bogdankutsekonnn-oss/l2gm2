<template>
  <div class="home-page">
    <div class="page-header">
      <h1>Анонсы серверов Lineage 2</h1>
    </div>

    <div class="page-layout">
      <div class="servers-column">
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
const seoTextParagraphs = seoText.split('\n\n').filter(p => p.trim())

useHead({
  title: 'Анонсы серверов Lineage 2 - L2GM',
  meta: [
    {
      name: 'description',
      content: 'Анонсы серверов Lineage 2 всех рейтов и хроник. Не пропустите открытие серверов л2 уже сегодня!'
    }
  ]
})
</script>

<style scoped>
.home-page {
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
