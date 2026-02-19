<template>
  <div class="home-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Анонсы серверов Lineage 2</h1>
      </div>

      <div class="page-layout">
      <div class="servers-column">
        <ClientOnly>
          <div class="categories-grid">
            <!-- Левая колонка — будущие разделы -->
            <div class="category-col">
              <div
                v-for="category in leftCategories"
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

            <!-- Правая колонка — прошлые разделы -->
            <div class="category-col">
              <div
                v-for="category in rightCategories"
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
        </ClientOnly>
      </div>

      <div class="filters-column">
        <FiltersPanel />
      </div>
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
const {
  generateSeoText,
  generateDescription,
  generateKeywords,
  getCanonicalUrl,
  getOgImageMeta,
  generateHomeJsonLd,
  generateOrganizationJsonLd,
  generateServerEventsJsonLd,
} = useSeo()
import { categorizeServers, FUTURE_CATEGORIES, PAST_CATEGORIES } from '~/utils/dateUtils.js'

const servers = getServers()
const categorized = computed(() => categorizeServers(servers))

const leftCategories = computed(() =>
  FUTURE_CATEGORIES
    .filter(name => categorized.value[name]?.length)
    .map(name => ({ name, servers: categorized.value[name] }))
)

const rightCategories = computed(() =>
  PAST_CATEGORIES
    .filter(name => categorized.value[name]?.length)
    .map(name => ({ name, servers: categorized.value[name] }))
)

const seoText = generateSeoText()
const description = generateDescription()
const keywords = generateKeywords()
const canonicalUrl = getCanonicalUrl('/')

// JSON-LD разметка
const homeJsonLd = generateHomeJsonLd()
const orgJsonLd = generateOrganizationJsonLd()
const eventsJsonLd = generateServerEventsJsonLd(servers)

useHead({
  title: 'Анонсы серверов Lineage 2 | L2GM - новые серверы л2',
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    // Open Graph
    { property: 'og:title', content: 'Анонсы серверов Lineage 2 | L2GM' },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    ...getOgImageMeta(),
    // Twitter
    { name: 'twitter:title', content: 'Анонсы серверов Lineage 2 | L2GM' },
    { name: 'twitter:description', content: description },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(homeJsonLd),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(orgJsonLd),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(eventsJsonLd),
    },
  ],
})
</script>

<style scoped>
.home-page {
  padding: var(--spacing-lg) 0;
}

.categories-rows {
  display: flex;
  flex-direction: column;
}
</style>
