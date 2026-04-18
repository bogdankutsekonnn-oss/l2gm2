<template>
  <article
    class="blog-card"
    itemscope
    itemtype="https://schema.org/BlogPosting"
  >
    <NuxtLink :to="`/blog/${article.slug}/`" class="blog-card__link">
      <div class="blog-card__image">
        <NuxtImg
          v-if="article.image"
          :src="article.image"
          :alt="article.title"
          width="400"
          height="225"
          fit="cover"
          loading="lazy"
          format="webp"
          quality="80"
          sizes="sm:100vw md:50vw lg:33vw xl:25vw"
          class="blog-card__img"
        />
        <div
          v-else
          class="blog-card__placeholder"
          :style="{ background: getPlaceholderColor(article.slug) }"
        >
          <span class="blog-card__placeholder-icon">L2</span>
        </div>
        <meta itemprop="image" :content="imageUrl" />
      </div>
      <div class="blog-card__body">
        <span
          class="blog-card__category"
          :class="`blog-card__category--${getCategoryClass(article.category)}`"
          itemprop="articleSection"
        >
          {{ article.category }}
        </span>
        <h3 class="blog-card__title" itemprop="headline">{{ article.title }}</h3>
        <time
          class="blog-card__date"
          :datetime="article.date"
          itemprop="datePublished"
        >
          {{ formatDate(article.date) }}
        </time>
      </div>
      <link itemprop="url" :href="`https://l2gm.com/blog/${article.slug}/`" />
    </NuxtLink>
  </article>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const imageUrl = computed(
  () => `https://l2gm.com${props.article.image || '/logo.svg'}`
)

const getCategoryClass = (category) => {
  const map = {
    'Новости': 'news',
    'Статьи': 'articles',
    'Гайды': 'guides',
    'Обзоры': 'reviews',
    'Лор': 'lore',
  }
  return map[category] || 'default'
}

const getPlaceholderColor = (slug) => {
  const colors = [
    'linear-gradient(135deg, #1a1c2e 0%, #2d1f3d 100%)',
    'linear-gradient(135deg, #1c2e1a 0%, #1f3d2d 100%)',
    'linear-gradient(135deg, #2e1a1a 0%, #3d1f2d 100%)',
    'linear-gradient(135deg, #1a2e2e 0%, #1f2d3d 100%)',
    'linear-gradient(135deg, #2e2e1a 0%, #3d2d1f 100%)',
  ]
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}
</script>

<style scoped>
.blog-card {
  background: transparent;
  transition: transform 0.2s;
}

.blog-card:hover {
  transform: translateY(-2px);
}

.blog-card__link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.blog-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
}

.blog-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.blog-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blog-card__placeholder-icon {
  font-size: 40px;
  font-weight: var(--font-bold);
  color: rgba(255, 255, 255, 0.12);
  letter-spacing: 6px;
}

.blog-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-xs);
}

.blog-card__category {
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
  color: rgba(187, 187, 187, 0.5);
}

.blog-card__title {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
  margin-top: 4px;
}

.blog-card__date {
  font-size: var(--font-sm);
  color: var(--text-disabled);
  margin-top: 4px;
}
</style>
