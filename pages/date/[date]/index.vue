<template>
  <div class="date-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>{{ h1 }}</h1>
        <ClientOnly>
          <span v-if="filteredServers.length" class="servers-count">Найдено {{ filteredServers.length }} {{ pluralServers(filteredServers.length) }}</span>
        </ClientOnly>
      </div>

      <MobileFilters />

      <div class="page-layout">
      <div class="servers-column">
        <div v-if="filteredServers.length > 0" class="categories-grid">
          <div class="category-col">
            <div
              v-for="category in categories.leftColumn"
              :key="category.name"
              class="server-category"
            >
              <h2 class="category-title">
                {{ category.name }}
                <span v-if="getCategoryDate(category.name)" class="category-date">{{ getCategoryDate(category.name) }}</span>
              </h2>
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
              <h2 class="category-title">
                {{ category.name }}
                <span v-if="getCategoryDate(category.name)" class="category-date">{{ getCategoryDate(category.name) }}</span>
              </h2>
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
          <p>Сервера не найдены</p>
        </div>
      </div>

      <div class="filters-column">
        <FiltersPanel />
      </div>
    </div>
    </div>

    <SeoSection
      :title="`Сервера Lineage 2 на ${formattedDate}`"
      :text="seoText"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const { getServers } = useFilters()
const { generateDateSeoText, getCanonicalUrl, getOgImageMeta, generateBreadcrumbJsonLd } = useSeo()
import { getOrderedCategories, pluralServers, getCategoryDate } from '~/utils/dateUtils.js'

const dateSlug = route.params.date

// Фильтруем сервера по дате
const allServers = computed(() => getServers())
const filteredServers = computed(() => allServers.value.filter(server => server.startDate === dateSlug))

// Категоризация серверов
const categories = computed(() => getOrderedCategories(filteredServers.value))

// Форматирование даты для заголовка
const formatDateTitle = (dateString) => {
  if (!dateString) return ''

  const months = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ]

  const [year, month, day] = dateString.split('-').map(Number)
  const dayNum = parseInt(day, 10)
  const monthName = months[month - 1]

  return `${dayNum} ${monthName}`
}

// Определяем текст для заголовка (Сегодня, Завтра, Вчера или дата)
const getDateText = (dateString) => {
  if (!dateString) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [year, month, day] = dateString.split('-').map(Number)
  const targetDate = new Date(year, month - 1, day)
  targetDate.setHours(0, 0, 0, 0)

  const diffTime = targetDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Сегодня'
  } else if (diffDays === 1) {
    return 'Завтра'
  } else if (diffDays === -1) {
    return 'Вчера'
  } else {
    return formatDateTitle(dateString)
  }
}

const dateText = getDateText(dateSlug)
const formattedDate = formatDateTitle(dateSlug)
const h1 = `Сервера Lineage 2 | ${dateText}`
const title = `Сервера Lineage 2 ${formattedDate} | L2GM`
const description = `Список серверов Lineage 2 открывающихся ${formattedDate}. Не пропустите старт!`
const keywords = `lineage 2, л2, сервера ${formattedDate}, сервера л2 ${formattedDate}, открытие серверов, новые сервера l2, новые сервера л2`
const seoText = generateDateSeoText(dateSlug)
const canonicalUrl = getCanonicalUrl(route.path)

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: formattedDate, url: `/date/${dateSlug}` }
])

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    ...getOgImageMeta(),
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
  ],
})
</script>

<style scoped>
.date-page {
  padding: var(--spacing-lg) 0;
}

.no-servers {
  color: var(--text-secondary);
  text-align: center;
  padding: var(--spacing-xl);
}
</style>
