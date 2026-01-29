<template>
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <ol
      class="breadcrumbs-list"
      itemscope
      itemtype="https://schema.org/BreadcrumbList"
    >
      <li
        v-for="(crumb, index) in crumbs"
        :key="index"
        class="breadcrumbs-item"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <NuxtLink
          v-if="crumb.isHome"
          :to="crumb.path"
          class="breadcrumbs-link breadcrumbs-home"
          itemprop="item"
        >
          <img src="/images/home.svg" alt="Главная" class="breadcrumbs-icon" />
          <span class="sr-only" itemprop="name">Главная</span>
        </NuxtLink>
        <template v-else>
          <span class="breadcrumbs-separator">/</span>
          <NuxtLink
            v-if="index < crumbs.length - 1"
            :to="crumb.path"
            class="breadcrumbs-link"
            itemprop="item"
          >
            <span itemprop="name">{{ crumb.title }}</span>
          </NuxtLink>
          <span v-else class="breadcrumbs-current" itemprop="name">
            {{ crumb.title }}
          </span>
        </template>
        <meta itemprop="position" :content="index + 1" />
      </li>
    </ol>
  </nav>
</template>

<script setup>
const route = useRoute()
const { getChronicles, getRates } = useFilters()

const staticPages = {
  '/about': 'О нас',
  '/advertisement': 'Размещение',
  '/faq': 'FAQ',
  '/rating': 'Рейтинг',
  '/add-server': 'Добавить сервер',
  '/thanks': 'Спасибо',
}

const crumbs = computed(() => {
  const result = [
    { path: '/', title: 'Главная', isHome: true },
    { path: '/', title: 'Анонсы серверов Lineage 2' },
  ]

  const currentPath = route.path

  // Проверяем статические страницы
  if (staticPages[currentPath]) {
    result.push({
      path: currentPath,
      title: staticPages[currentPath],
    })
    return result
  }

  const chronicleSlug = route.params.chronicle
  const rateSlug = route.params.rate

  if (chronicleSlug) {
    const chronicles = getChronicles()
    const chronicle = chronicles.find((c) => c.slug === chronicleSlug)
    const chronicleName = chronicle?.name || chronicleSlug
    result.push({
      path: `/chronicle/${chronicleSlug}`,
      title: `Сервера Lineage 2 ${chronicleName}`,
    })
  }

  if (rateSlug) {
    const rates = getRates()
    const rate = rates.find((r) => r.slug === rateSlug)

    if (chronicleSlug) {
      result.push({
        path: `/chronicle/${chronicleSlug}/rate/${rateSlug}`,
        title: rate?.name || rateSlug,
      })
    } else {
      result.push({
        path: `/rate/${rateSlug}`,
        title: rate?.name || rateSlug,
      })
    }
  }

  return result
})
</script>

<style scoped>
.breadcrumbs {
  margin-bottom: var(--spacing-md);
}

.breadcrumbs-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumbs-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.breadcrumbs-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-base);
  transition: color 0.2s;
}

.breadcrumbs-link:hover {
  color: var(--text-primary);
}

.breadcrumbs-home {
  display: flex;
  align-items: center;
}

.breadcrumbs-icon {
  width: 20px;
  height: 20px;
}

.breadcrumbs-separator {
  color: var(--text-secondary);
  font-size: var(--font-base);
}

.breadcrumbs-current {
  color: var(--text-primary);
  font-size: var(--font-base);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
