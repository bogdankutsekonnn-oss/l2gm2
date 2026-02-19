<template>
  <div class="filters-panel">
    <div class="filter-section">
      <h3 class="filter-title">Хроники</h3>
      <div class="filter-chips">
        <NuxtLink
          v-for="chronicle in chronicles"
          :key="chronicle.id"
          :to="getChronicleUrl(chronicle.slug)"
          class="filter-chip"
          :class="{ 'is-active': isChronicleActive(chronicle.slug) }"
        >
          {{ chronicle.name }}
        </NuxtLink>
      </div>
    </div>

    <div class="filter-divider"></div>

    <div class="filter-section">
      <h3 class="filter-title">Подобрать сервер</h3>
      <div class="server-finder">
        <div class="select-wrap">
          <select id="chronicle-select" name="chronicle" v-model="selectedChronicle" class="select">
            <option value="">Все хроники</option>
            <option
              v-for="chronicle in chronicles"
              :key="chronicle.id"
              :value="chronicle.slug"
            >
              {{ chronicle.name }}
            </option>
          </select>
          <select id="rate-select" name="rate" v-model="selectedRate" class="select">
            <option value="">Все рейты</option>
            <option v-for="range in rateRanges" :key="range" :value="range">
              {{ range }}
            </option>
          </select>
        </div>
        <NuxtLink :to="getFinderUrl()" class="btn-primary">
          Подобрать сервер
        </NuxtLink>
      </div>
    </div>

    <div class="filter-divider"></div>

    <div class="filter-section">
      <NuxtLink to="/" class="ad-banner">
        <div class="ad-placeholder">
          <span>Реклама</span>
          <span class="ad-size">282x470px</span>
        </div>
      </NuxtLink>
    </div>

    <div class="filter-divider"></div>

    <div class="filter-section">
      <h3 class="filter-title">Рейты</h3>
      <div class="filter-chips">
        <NuxtLink
          v-for="rate in rates"
          :key="rate.id"
          :to="getRateUrl(rate.slug)"
          class="filter-chip"
          :class="{ 'is-active': isRateActive(rate.slug) }"
        >
          {{ rate.name }}
        </NuxtLink>
      </div>
    </div>

    <div class="filter-divider"></div>

    <div class="filter-section">
      <div class="filter-chips">
        <NuxtLink
          v-for="tag in tags"
          :key="tag.url"
          :to="tag.url"
          class="filter-chip filter-chip-tag"
        >
          {{ tag.name }}
        </NuxtLink>
      </div>
    </div>

    <div class="filter-divider"></div>

    <div class="filter-section">
      <ClientOnly>
        <CalendarFilter :servers="allServers" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
const { getChronicles, getRates, getServers } = useFilters()
const route = useRoute()

const chronicles = getChronicles()
const rates = getRates()
const allServers = getServers()
const selectedChronicle = ref('')
const selectedRate = ref('')

// Уникальные ренжи рейтов
const rateRanges = computed(() => {
  const ranges = new Set()
  rates.forEach((rate) => {
    if (rate.range) {
      ranges.add(rate.range)
    }
  })
  return Array.from(ranges)
})

const tags = [
  { name: 'Сегодня', url: '/today' },
  { name: 'Топ сервера л2', url: '/l2top' },
  { name: 'PvP сервера', url: '/pvp' },
  { name: 'GVE', url: '/gve' },
  { name: 'Зарубежный', url: '/foreign' },
  { name: 'Low рейты', url: '/low-rate' },
  { name: 'Mid рейты', url: '/mid-rate' },
  { name: 'Мультикрафт', url: '/multicraft' },
  { name: 'Мультипрофа', url: '/multiprof' },
]

const getChronicleUrl = (slug) => {
  return `/chronicle/${slug}`
}

const getRateUrl = (slug) => {
  return `/rate/${slug}`
}

const getFinderUrl = () => {
  if (selectedChronicle.value && selectedRate.value) {
    return `/chronicle/${selectedChronicle.value}/rate/${selectedRate.value}`
  } else if (selectedChronicle.value) {
    return `/chronicle/${selectedChronicle.value}`
  } else if (selectedRate.value) {
    return `/rate/${selectedRate.value}`
  }
  return '/'
}

const isChronicleActive = (slug) => {
  return route.params.chronicle === slug
}

const isRateActive = (slug) => {
  return route.params.rate === slug
}
</script>

<style scoped>
.filters-panel {
  width: 270px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .filters-panel {
    width: 100%;
  }
}

.filter-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: var(--spacing-md) 0;
}

.filter-divider:first-child,
.filter-divider:last-child {
  display: none;
}

.filter-title {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.filter-chip {
  display: inline-block;
  padding: 8px 16px;
  background: var(--secondary-main);
  color: var(--secondary-contrast);
  border-radius: var(--radius-full);
  text-decoration: none;
  font-size: var(--font-sm);
  transition: all 0.2s;
}

.filter-chip:hover {
  background: var(--secondary-hover);
}

.filter-chip.is-active {
  background: var(--primary-main);
  color: var(--primary-contrast);
}

.filter-chip-tag {
  cursor: pointer;
}

.ad-banner {
  width: 100%;
  aspect-ratio: 282 / 470;
  background: var(--bg-main);
  border-radius: var(--radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.ad-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-disabled);
  font-size: var(--font-sm);
}

.ad-size {
  font-size: var(--font-xs);
}

.server-finder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.server-finder .select-wrap .select:first-child {
  flex: 1.1;
}

.server-finder .select-wrap .select:last-child {
  flex: 0.9;
}
</style>
