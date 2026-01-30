<template>
  <div class="date-page">
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
</template>

<script setup>
const route = useRoute()
const { getServers } = useFilters()
const { getOrderedCategories } = await import('~/utils/dateUtils.js')

const dateSlug = route.params.date

// Фильтруем сервера по дате
const allServers = getServers()
const filteredServers = allServers.filter(server => server.startDate === dateSlug)

// Категоризация серверов
const categories = getOrderedCategories(filteredServers)

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

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
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
