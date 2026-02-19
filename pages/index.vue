<template>
  <div class="home-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Анонсы серверов Lineage 2</h1>
      </div>

      <!-- Кнопка фильтров (только мобильный) -->
      <button class="filters-mobile-btn" @click="filtersOpen = true">
        <span>Фильтры</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.7657 2.25C18.5589 2.25 19.2311 2.24837 19.7588 2.32032C20.3051 2.3948 20.8277 2.56278 21.2276 3.00293C21.6309 3.44696 21.7406 3.98232 21.7491 4.5293C21.7572 5.05251 21.6714 5.70577 21.5733 6.46875C21.5396 6.73048 21.4891 6.98386 21.3838 7.23731C21.2769 7.49462 21.1297 7.71384 20.9463 7.93164C19.9666 9.09554 18.145 11.1988 15.5811 13.1143C15.5397 13.1453 15.4875 13.2191 15.4776 13.3291C15.2292 16.0745 14.9991 17.5956 14.8516 18.3828C14.6802 19.2969 13.9734 19.9345 13.3721 20.3701C13.0561 20.599 12.7217 20.8045 12.4258 20.9844C12.1183 21.1714 11.8643 21.3237 11.6592 21.4688C11.1143 21.8541 10.4884 21.81 10.0215 21.5381C9.57904 21.2803 9.25185 20.8088 9.18754 20.2656C9.05017 19.1052 8.79283 16.7563 8.51176 13.3223C8.50264 13.2123 8.45014 13.1378 8.40825 13.1064C5.84963 11.1935 4.03206 9.09402 3.05375 7.93164C2.87044 7.71384 2.72318 7.4946 2.61625 7.23731C2.51097 6.98387 2.46048 6.73047 2.4268 6.46875C2.32865 5.70577 2.24292 5.05251 2.25102 4.5293C2.25949 3.98232 2.36918 3.44696 2.7725 3.00293C3.17236 2.56278 3.69501 2.3948 4.24125 2.32032C4.76897 2.24837 5.44118 2.25 6.23442 2.25H17.7657ZM6.23442 3.75C5.39762 3.75 4.84701 3.75179 4.44438 3.80664C4.06028 3.85901 3.94392 3.9445 3.88285 4.01172C3.82532 4.07511 3.7557 4.18717 3.75004 4.55274C3.74404 4.94235 3.81006 5.46852 3.9141 6.27735C3.93942 6.47409 3.96764 6.58063 4.00102 6.66114C4.03289 6.73785 4.08485 6.82757 4.20121 6.96582C5.15951 8.10442 6.88867 10.0975 9.30668 11.9053C9.71951 12.2139 9.96553 12.6955 10.0069 13.2002L10.211 15.5566C10.4072 17.7068 10.5763 19.2325 10.6778 20.0898C10.681 20.1165 10.6918 20.1473 10.712 20.1777C10.7327 20.2089 10.7569 20.2308 10.7764 20.2422C10.7801 20.2444 10.7835 20.2459 10.7862 20.2471C10.7879 20.246 10.7906 20.2458 10.793 20.2441L11.21 19.9697C11.3554 19.8789 11.504 19.7888 11.6465 19.7022C11.9433 19.5217 12.2307 19.3447 12.4922 19.1553C13.0456 18.7544 13.3193 18.4136 13.377 18.1064L13.4942 17.4141C13.6264 16.5669 13.7992 15.2301 13.9834 13.1934C14.0287 12.6945 14.2742 12.2191 14.6836 11.9131C17.1066 10.103 18.8393 8.10585 19.7989 6.96582C19.9152 6.82757 19.9672 6.73784 19.9991 6.66114C20.0324 6.58064 20.0607 6.4741 20.086 6.27735C20.19 5.46852 20.256 4.94235 20.25 4.55274C20.2444 4.18717 20.1748 4.07511 20.1172 4.01172C20.0562 3.9445 19.9398 3.85901 19.5557 3.80664C19.1531 3.75179 18.6025 3.75 17.7657 3.75H6.23442Z" fill="currentColor"/>
        </svg>
      </button>

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

      <!-- Десктопная колонка фильтров -->
      <div class="filters-column">
        <FiltersPanel />
      </div>

      <!-- Мобильный drawer -->
      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="filtersOpen" class="filters-drawer-overlay" @click.self="filtersOpen = false">
            <div class="filters-drawer">
              <div class="filters-drawer__header">
                <span>Фильтры</span>
                <button class="filters-drawer__close" @click="filtersOpen = false">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <div class="filters-drawer__body">
                <FiltersPanel />
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
    </div>

    <SeoSection
      title="Новые сервера л2 с большим онлайном"
      :text="seoText"
    />
  </div>
</template>

<script setup>
import { categorizeServers, FUTURE_CATEGORIES, PAST_CATEGORIES } from '~/utils/dateUtils.js'

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

const filtersOpen = ref(false)

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

/* Кнопка фильтров — только мобильный */
.filters-mobile-btn {
  display: none;
}

/* Drawer overlay */
.filters-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.filters-drawer {
  width: 100%;
  max-height: 85dvh;
  background: var(--bg-surface);
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filters-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  flex-shrink: 0;
}

.filters-drawer__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-base);
  transition: color 0.2s;
}

.filters-drawer__close:hover {
  color: var(--text-primary);
}

.filters-drawer__body {
  overflow-y: auto;
  padding: 16px 20px 32px;
}

/* Анимация drawer */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-active .filters-drawer,
.drawer-leave-active .filters-drawer {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .filters-drawer,
.drawer-leave-to .filters-drawer {
  transform: translateY(100%);
}

@media (max-width: 1024px) {
  .filters-mobile-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 20px;
    background: var(--secondary-main);
    color: var(--secondary-contrast);
    border: none;
    border-radius: var(--radius-button);
    font-size: var(--font-base);
    font-weight: var(--font-semibold);
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s;
    margin: 16px 16px 16px;
    width: calc(100% - 32px);
  }

  .filters-mobile-btn:hover {
    background: var(--secondary-hover);
  }
}
</style>
