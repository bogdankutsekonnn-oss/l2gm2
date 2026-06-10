<template>
  <div class="rating-page">
    <Breadcrumbs />
    <div class="page-header">
      <h1>Рейтинг серверов Lineage 2</h1>
      <h2>Топ новых серверов Л2 всех хроник и рейтов</h2>
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
            <a
              :href="buildServerHref(server)"
              class="server-name"
              target="_blank"
              rel="sponsored nofollow noopener"
              @click="trackServerClick(server)"
            >
              {{ server.name }}
            </a>
            <div class="server-details">
              <span class="server-chronicle">{{ server.chronicle }}</span>
              <span class="server-rate">{{ server.rate }}</span>
            </div>
          </div>
          <div v-if="server.online || server.rating" class="rating-stats">
            <div v-if="server.online" class="stat-item">
              <span class="stat-label">Онлайн</span>
              <span class="stat-value">{{ server.online }}</span>
            </div>
            <div v-if="server.rating" class="stat-item">
              <span class="stat-label">Рейтинг</span>
              <span class="stat-value">{{ server.rating }}</span>
            </div>
          </div>
          <div v-else class="rating-stats">
            <div class="stat-item">
              <span class="stat-label">Старт</span>
              <span class="stat-value">{{ formatStartDate(server.startDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rating-note">
        <p>
          В верхней части рейтинга — сервера Lineage 2 со статусами Premium, VIP и TOP:
          проекты с подтверждённой репутацией и стабильным онлайном. Далее идут новые
          сервера Л2 всех хроник — от Interlude и High Five до Essence. Список
          обновляется ежедневно: здесь только актуальные проекты, открывшиеся недавно
          или готовящиеся к старту.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { buildServerHref, trackServerClick } from '~/utils/serverTracking'

const { getServers } = useFilters()

const activeFilter = ref('all')

const ratingFilters = [
  { id: 'all', name: 'Все' },
  { id: 'premium', name: 'Premium' },
  { id: 'vip', name: 'VIP' },
  { id: 'top', name: 'TOP' }
]

const allServers = computed(() => getServers())
const ratedServers = computed(() => {
  let filtered = [...allServers.value]

  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(s => s.cardType === activeFilter.value)
  }

  // Сортируем по типу размещения (premium > vip-plus > vip > top > остальные)
  const statusOrder = { premium: 1, 'vip-plus': 2, vip: 3, top: 4 }
  filtered.sort((a, b) => {
    const aOrder = statusOrder[a.cardType] || 99
    const bOrder = statusOrder[b.cardType] || 99
    return aOrder - bOrder
  })

  return filtered
})

const formatStartDate = (dateString) => {
  if (!dateString) return ''
  const [y, m, d] = dateString.split('-')
  return `${d}.${m}.${y}`
}

const { generateBreadcrumbJsonLd, getCanonicalUrl, getOgImageMeta } = useSeo()

const ratingBreadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: 'Рейтинг', url: '/rating/' },
])

const ratingTitle = 'Рейтинг серверов Л2 2026 — топ серверов Lineage 2 | L2GM'
const ratingDescription = 'Рейтинг серверов Л2 2026 — топ новых серверов Lineage 2 всех хроник и рейтов. Premium и VIP проекты с проверенной репутацией и стабильным онлайном на L2GM.'
const ratingCanonical = getCanonicalUrl('/rating/')

useHead({
  title: ratingTitle,
  meta: [
    { name: 'description', content: ratingDescription },
    // Заготовка под будущий раздел рейтинга с голосованием — до его запуска
    // страницу не индексируем (и не включаем в sitemap, см. __sitemap__/urls.ts),
    // чтобы не каннибализировать главную тонким дублем списка серверов.
    { name: 'robots', content: 'noindex, nofollow' },
    // Open Graph
    { property: 'og:title', content: ratingTitle },
    { property: 'og:description', content: ratingDescription },
    { property: 'og:url', content: ratingCanonical },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    ...getOgImageMeta(),
    // Twitter
    { name: 'twitter:title', content: ratingTitle },
    { name: 'twitter:description', content: ratingDescription },
  ],
  link: [
    { rel: 'canonical', href: ratingCanonical },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(ratingBreadcrumbJsonLd) },
  ],
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
