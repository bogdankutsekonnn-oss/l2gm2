<template>
  <div class="tag-page">
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
      :links="relatedTagLinks"
    />
  </div>
</template>

<script setup>
import { getOrderedCategories, pluralServers, getCategoryDate } from '~/utils/dateUtils.js'
import tagsData from '~/data/tags.json'

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
  generateBreadcrumbJsonLd,
  generateCollectionPageJsonLd,
  generateTagDescription,
  generateTagTitle,
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

const filteredServers = computed(() => getServers(filters))
const categories = computed(() => getOrderedCategories(filteredServers.value))

const relatedTagLinks = computed(() =>
  tagsData
    .filter((t) => t.slug !== tagSlug)
    .map((t) => ({ to: `/${t.slug}/`, text: t.name }))
)

// JSON-LD
const tagTitle = generateTagTitle(tagSlug)
const tagDescription = generateTagDescription(tagSlug)
const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: tagData.name, url: `/${tagSlug}` }
])
const collectionJsonLd = generateCollectionPageJsonLd(tagTitle, tagDescription, `/${tagSlug}`, filteredServers.value)

// Мета-теги
const meta = generateTagFullMeta(tagSlug)
meta.script = [
  { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
  { type: 'application/ld+json', innerHTML: JSON.stringify(collectionJsonLd) },
]
useHead(meta)
</script>

<style scoped>
.tag-page {
  padding: var(--spacing-lg) 0;
}
</style>
