<template>
  <section v-if="articles.length" class="related-articles">
    <h2 class="related-articles__title">{{ title }}</h2>
    <div class="related-articles__grid">
      <NuxtLink
        v-for="article in articles"
        :key="article.slug"
        :to="`/blog/${article.slug}/`"
        class="related-articles__card"
      >
        <span class="related-articles__category">{{ article.category }}</span>
        <span class="related-articles__name">{{ article.title }}</span>
        <span class="related-articles__date">{{ formatDate(article.date) }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  // [{ slug, title, category, date }] — из data/blog-index.json
  articles: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

const formatDate = (dateString) => {
  if (!dateString) return ''
  const [y, m, d] = dateString.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}
</script>

<style scoped>
.related-articles {
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xl);
  margin-top: var(--spacing-md);
}

.related-articles__title {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.related-articles__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.related-articles__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--bg-main);
  border-radius: var(--radius-base);
  padding: var(--spacing-md);
  text-decoration: none;
  transition: background 0.2s;
}

.related-articles__card:hover {
  background: rgba(255, 255, 255, 0.06);
}

.related-articles__category {
  color: var(--primary-main);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.related-articles__name {
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  line-height: 1.4;
}

.related-articles__date {
  color: var(--text-disabled);
  font-size: var(--font-sm);
}

@media (max-width: 768px) {
  .related-articles__grid {
    grid-template-columns: 1fr;
  }
}
</style>
