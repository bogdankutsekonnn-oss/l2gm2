<template>
  <div class="home-page">
    <Breadcrumbs />
    <div class="page-header">
      <h1>Анонсы серверов Lineage 2</h1>
    </div>

    <div class="page-layout">
      <div class="servers-column">
        <div class="categories-grid">
          <!-- Левая колонка (будущее) -->
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

          <!-- Правая колонка (прошлое) -->
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
const { getOrderedCategories } = await import('~/utils/dateUtils.js')

const servers = getServers()
const categories = getOrderedCategories(servers)

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
