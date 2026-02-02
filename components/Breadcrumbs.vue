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
const { getTagData } = useSeo()

// Форматирование даты для хлебных крошек
const formatDateForBreadcrumb = (dateString) => {
  if (!dateString) return ''

  const months = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ]

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
    const dayNum = parseInt(day, 10)
    const monthName = months[month - 1]
    return `${dayNum} ${monthName}`
  }
}

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
  const dateSlug = route.params.date
  const tagSlug = route.params.tag

  // Страница тега
  if (tagSlug) {
    const tagData = getTagData(tagSlug)
    if (tagData) {
      result.push({
        path: `/${tagSlug}`,
        title: tagData.name,
      })
      return result
    }
  }

  // Страница даты
  if (dateSlug) {
    const dateTitle = formatDateForBreadcrumb(dateSlug)
    result.push({
      path: `/date/${dateSlug}`,
      title: `Сервера Lineage 2 | ${dateTitle}`,
    })
    return result
  }

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
  padding: 8px 16px;
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
