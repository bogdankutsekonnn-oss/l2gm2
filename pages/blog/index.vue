<template>
  <div class="blog-page">
    <div class="page-header">
      <h1>Новости Lineage 2</h1>
      <h2>Актуальные новости, статьи и обзоры о Lineage 2</h2>
    </div>

    <div class="blog-layout">
      <aside class="blog-sidebar">
        <div class="sidebar-section">
          <h3>Категории</h3>
          <nav class="category-nav">
            <NuxtLink to="/blog?category=news" class="category-link">Новости</NuxtLink>
            <NuxtLink to="/blog?category=articles" class="category-link">Статьи</NuxtLink>
            <NuxtLink to="/blog?category=reviews" class="category-link">Обзоры</NuxtLink>
          </nav>
        </div>

        <!-- TODO: Добавить страницы топиков позже
        <div class="sidebar-section">
          <h3>Топик</h3>
          <nav class="topic-nav">
            <NuxtLink to="/blog/topic/evolution" class="topic-link">Эволюция серий Lineage 2</NuxtLink>
            <NuxtLink to="/blog/topic/new-servers" class="topic-link">Новые сервера Lineage 2</NuxtLink>
            <NuxtLink to="/blog/topic/decline" class="topic-link">Как погибала lineage 2</NuxtLink>
            <NuxtLink to="/blog/topic/guides" class="topic-link">Гайды Lineage 2</NuxtLink>
            <button class="btn-show-more" @click="showMoreTopics = !showMoreTopics">
              Показать ещё
            </button>
            <div v-if="showMoreTopics" class="more-topics">
              <NuxtLink to="/blog/topic/strategy" class="topic-link">Стратегии</NuxtLink>
              <NuxtLink to="/blog/topic/pvp" class="topic-link">PvP гайды</NuxtLink>
            </div>
          </nav>
        </div>
        -->
      </aside>

      <main class="blog-content">
        <div class="posts-grid">
          <article
            v-for="post in posts"
            :key="post.id"
            class="post-card"
          >
            <div class="post-image">
              <img :src="post.image" :alt="post.title" />
            </div>
            <div class="post-tag" :class="`tag-${post.category}`">
              {{ getCategoryName(post.category) }}
            </div>
            <h3 class="post-title">
              <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
            </h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-date">{{ formatDate(post.date) }}</div>
          </article>
        </div>

        <button class="btn-load-more" @click="loadMore">
          Загрузить ещё
        </button>
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const showMoreTopics = ref(false)

// TODO: Добавить статьи позже
const posts = ref([
  // {
  //   id: 1,
  //   title: 'Новые сервера Lineage 2 в январе 2026',
  //   excerpt: 'Обзор самых интересных серверов, открывшихся в этом месяце',
  //   category: 'news',
  //   slug: 'new-servers-january-2026',
  //   date: '2026-01-25',
  //   image: '/images/blog/placeholder.jpg'
  // },
  // {
  //   id: 2,
  //   title: 'Гайд по прокачке персонажа на low rate серверах',
  //   excerpt: 'Подробное руководство по эффективной прокачке на серверах с низким рейтом',
  //   category: 'articles',
  //   slug: 'leveling-guide-low-rate',
  //   date: '2026-01-20',
  //   image: '/images/blog/placeholder.jpg'
  // },
  // {
  //   id: 3,
  //   title: 'Обзор сервера L2Reborn',
  //   excerpt: 'Детальный разбор одного из самых популярных серверов',
  //   category: 'reviews',
  //   slug: 'l2reborn-review',
  //   date: '2026-01-15',
  //   image: '/images/blog/placeholder.jpg'
  // }
])

const getCategoryName = (category) => {
  const names = {
    news: 'Новость',
    articles: 'Статья',
    reviews: 'Обзор'
  }
  return names[category] || category
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadMore = () => {
  // TODO: Implement load more functionality
  console.log('Load more posts')
}

const { getCanonicalUrl } = useSeo()
const canonicalUrl = getCanonicalUrl('/blog')

useHead({
  title: 'Блог Lineage 2 | Новости, гайды и обзоры серверов - L2GM',
  meta: [
    {
      name: 'description',
      content: 'Блог L2GM: новости Lineage 2, гайды по прокачке, обзоры серверов, стратегии PvP и PvE. Полезные статьи для игроков л2.'
    },
    { name: 'keywords', content: 'блог lineage 2, новости л2, гайды lineage 2, обзоры серверов, стратегии l2' },
    // Open Graph
    { property: 'og:title', content: 'Блог Lineage 2 | L2GM' },
    { property: 'og:description', content: 'Новости, гайды и обзоры серверов Lineage 2.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    // Twitter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Блог Lineage 2 | L2GM' },
    { name: 'twitter:description', content: 'Новости, гайды и обзоры серверов Lineage 2.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<style scoped>
.blog-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: var(--spacing-xxl);
  text-align: center;
}

.page-header h1 {
  font-size: var(--font-h1);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.page-header h2 {
  font-size: var(--font-h2);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.blog-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.sidebar-section {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
}

.sidebar-section h3 {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.category-nav,
.topic-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.category-link,
.topic-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-base);
  transition: color 0.2s;
  padding: var(--spacing-xs) 0;
}

.category-link:hover,
.topic-link:hover,
.category-link.router-link-active,
.topic-link.router-link-active {
  color: var(--primary-main);
}

.btn-show-more {
  background: none;
  border: none;
  color: var(--primary-main);
  cursor: pointer;
  font-size: var(--font-sm);
  padding: var(--spacing-xs) 0;
  text-align: left;
  margin-top: var(--spacing-sm);
}

.more-topics {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.blog-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
}

.post-card {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
}

.post-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--bg-main);
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  margin: var(--spacing-md);
  margin-bottom: 0;
}

.tag-news {
  background: var(--primary-main);
  color: var(--primary-contrast);
}

.tag-articles {
  background: var(--status-success);
  color: var(--text-primary);
}

.tag-reviews {
  background: var(--status-warning);
  color: var(--text-primary);
}

.post-title {
  padding: 0 var(--spacing-md);
  margin: var(--spacing-md) 0;
}

.post-title a {
  color: var(--text-primary);
  text-decoration: none;
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  transition: color 0.2s;
}

.post-title a:hover {
  color: var(--primary-main);
}

.post-excerpt {
  padding: 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.post-date {
  padding: 0 var(--spacing-md) var(--spacing-md);
  color: var(--text-disabled);
  font-size: var(--font-xs);
}

.btn-load-more {
  background: var(--secondary-main);
  color: var(--secondary-contrast);
  padding: 15px 24px;
  border-radius: 26px;
  border: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  cursor: pointer;
  transition: background 0.2s;
  align-self: center;
  margin-top: var(--spacing-lg);
}

.btn-load-more:hover {
  background: var(--secondary-hover);
}

@media (max-width: 1024px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
