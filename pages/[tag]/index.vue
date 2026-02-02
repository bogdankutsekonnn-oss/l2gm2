<template>
  <div class="tag-page">
    <div class="page-wrapper">
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
          <p>{{ emptyMessage }}</p>
        </div>
      </div>

      <div class="filters-column">
        <FiltersPanel />
      </div>
    </div>
    </div>

    <SeoSection
      :title="seoTitle"
      :text="seoText"
    />
  </div>
</template>

<script setup>
import { getOrderedCategories } from '~/utils/dateUtils.js'

const route = useRoute()
const { getServers } = useFilters()
const {
  getTagData,
  generateTagH1,
  generateTagSeoText,
  generateTagSeoTitle,
  getTagFilter,
  getTagEmptyMessage,
  generateTagFullMeta,
} = useSeo()

const tagSlug = route.params.tag
const tagData = getTagData(tagSlug)

// Если тег не найден — редирект на 404
if (!tagData) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена'
  })
}

// SEO данные
const h1 = generateTagH1(tagSlug)
const seoText = generateTagSeoText(tagSlug)
const seoTitle = generateTagSeoTitle(tagSlug)
const emptyMessage = getTagEmptyMessage(tagSlug)

// Формируем фильтр на основе типа тега
const filterKey = getTagFilter(tagSlug)
const filters = {}
if (filterKey) {
  filters[filterKey] = true
}

const filteredServers = getServers(filters)
const categories = getOrderedCategories(filteredServers)

// Мета-теги
const meta = generateTagFullMeta(tagSlug)
useHead(meta)
</script>

<style scoped>
.tag-page {
  padding: var(--spacing-lg) 0;
}
</style>
