<template>
  <div class="rating-page">
    <Breadcrumbs />
    <div class="page-header">
      <h1>Рейтинг серверов Lineage 2</h1>
      <h2>Топ серверов по популярности и качеству</h2>
    </div>

    <div class="rating-content">
      <div class="rating-filters">
        <button
          v-for="filter in ratingFilters"
          :key="filter.id"
          class="filter-btn"
          :class="{ 'is-active': activeFilter === filter.id }"
          @click="activeFilter = filter.id"
        >
          {{ filter.name }}
        </button>
      </div>

      <div class="servers-rating">
        <div
          v-for="(server, index) in ratedServers"
          :key="server.id"
          class="rating-item"
        >
          <div class="rating-position">{{ index + 1 }}</div>
          <div class="rating-server-info">
            <a :href="server.url" class="server-name" target="_blank">
              {{ server.name }}
            </a>
            <div class="server-details">
              <span class="server-chronicle">{{ server.chronicle }}</span>
              <span class="server-rate">{{ server.rate }}</span>
            </div>
          </div>
          <div class="rating-stats">
            <div class="stat-item">
              <span class="stat-label">Онлайн</span>
              <span class="stat-value">{{ server.online || 'N/A' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Рейтинг</span>
              <span class="stat-value">{{ server.rating || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rating-note">
        <p>
          Рейтинг формируется на основе множества факторов: онлайн сервера, 
          отзывов игроков, стабильности работы и активности сообщества. 
          Рейтинг обновляется ежедневно.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getServers } = useFilters()

const activeFilter = ref('all')

const ratingFilters = [
  { id: 'all', name: 'Все' },
  { id: 'premium', name: 'Premium' },
  { id: 'vip', name: 'VIP' },
  { id: 'top', name: 'TOP' }
]

// Mock data - в реальном проекте это будет из API
const allServers = getServers()
const ratedServers = computed(() => {
  let filtered = [...allServers]
  
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(s => s.status === activeFilter.value)
  }
  
  // Сортируем по статусу (premium > vip > top > остальные)
  const statusOrder = { premium: 1, vip: 2, top: 3 }
  filtered.sort((a, b) => {
    const aOrder = statusOrder[a.status] || 99
    const bOrder = statusOrder[b.status] || 99
    return aOrder - bOrder
  })
  
  return filtered
})

useHead({
  title: 'Рейтинг серверов Lineage 2 - L2GM',
  meta: [
    {
      name: 'description',
      content: 'Рейтинг лучших серверов Lineage 2. Топ серверов по популярности, онлайну и качеству.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})
</script>

<style scoped>
.rating-page {
  padding: var(--spacing-lg) 0;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xxl);
  text-align: center;
}

.page-header h1 {
  font-size: var(--font-h1);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.page-header h2 {
  font-size: var(--font-h2);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.rating-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.rating-filters {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.filter-btn {
  background: var(--secondary-main);
  color: var(--secondary-contrast);
  padding: 12px 24px;
  border-radius: 26px;
  border: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: var(--secondary-hover);
}

.filter-btn.is-active {
  background: var(--primary-main);
  color: var(--primary-contrast);
}

.servers-rating {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.rating-item {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: var(--spacing-lg);
  align-items: center;
}

.rating-position {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: var(--primary-main);
  text-align: center;
}

.rating-server-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.server-name {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  font-size: var(--font-lg);
  text-decoration: none;
  transition: color 0.2s;
}

.server-name:hover {
  color: var(--primary-main);
}

.server-details {
  display: flex;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.rating-stats {
  display: flex;
  gap: var(--spacing-xl);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.stat-label {
  color: var(--text-disabled);
  font-size: var(--font-xs);
  text-transform: uppercase;
}

.stat-value {
  color: var(--text-primary);
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
}

.rating-note {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  text-align: center;
}

.rating-note p {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .rating-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .rating-stats {
    justify-content: center;
  }
}
</style>
