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
      <div class="ad-banner">
        <div class="ad-placeholder">
          <span>Реклама</span>
          <span class="ad-size">282x470px</span>
        </div>
      </div>
    </div>

    <div class="filter-divider"></div>

    <div class="filter-section">
      <h3 class="filter-title">Подобрать сервер</h3>
      <div class="server-finder">
        <select v-model="selectedChronicle" class="select">
          <option value="">Хроники</option>
          <option
            v-for="chronicle in chronicles"
            :key="chronicle.id"
            :value="chronicle.slug"
          >
            {{ chronicle.name }}
          </option>
        </select>
        <select v-model="selectedRate" class="select">
          <option value="">Рейты</option>
          <option v-for="rate in rates" :key="rate.id" :value="rate.slug">
            {{ rate.name }}
          </option>
        </select>
        <NuxtLink :to="getFinderUrl()" class="btn-primary">
          Подобрать сервер
        </NuxtLink>
      </div>
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
        <span
          v-for="tag in tags"
          :key="tag"
          class="filter-chip filter-chip-tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getChronicles, getRates } = useFilters()
const route = useRoute()

const chronicles = getChronicles()
const rates = getRates()
const selectedChronicle = ref('')
const selectedRate = ref('')

const tags = [
  'Сегодня',
  'Топ сервера л2',
  'RVR',
  'Зарубежный',
  'Low рейты',
  'GVE',
  'Mid рейты',
  'Мультикрафт',
  'Мультипрофа',
  'x50000',
  'x100000',
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
  width: 240px;
  display: flex;
  flex-direction: column;
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
  cursor: default;
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

</style>
