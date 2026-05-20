<template>
  <article
    class="news-card"
    itemscope
    itemtype="https://schema.org/NewsArticle"
  >
    <NuxtLink :to="`/news/${article.slug}/`" class="news-card__image-link">
      <div class="news-card__image">
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
          class="news-card__img"
        />
        <div
          v-else
          class="news-card__placeholder"
          :style="{ background: getPlaceholderColor(article.slug) }"
        >
          <svg v-if="article.videoUrl" class="news-card__play-icon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span v-else class="news-card__placeholder-icon">L2</span>
        </div>
        <meta itemprop="image" :content="imageUrl" />
      </div>
    </NuxtLink>
    <div class="news-card__body">
      <time
        class="news-card__date"
        :datetime="article.date"
        itemprop="datePublished"
      >
        {{ formatDate(article.date) }}
      </time>
      <NuxtLink :to="`/news/${article.slug}/`" class="news-card__title-link">
        <h3 class="news-card__title" itemprop="headline">{{ article.title }}</h3>
      </NuxtLink>
      <p class="news-card__description">{{ article.description }}</p>
    </div>
    <link itemprop="url" :href="`https://l2gm.com/news/${article.slug}/`" />
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
.news-card {
  background: transparent;
  transition: transform 0.2s;
}

.news-card:hover {
  transform: translateY(-2px);
}

.news-card__image-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.news-card__title-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.news-card__title-link:hover .news-card__title {
  color: var(--primary-main);
}

.news-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
}

.news-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.news-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-card__play-icon {
  color: rgba(255, 255, 255, 0.2);
}

.news-card__placeholder-icon {
  font-size: 40px;
  font-weight: var(--font-bold);
  color: rgba(255, 255, 255, 0.12);
  letter-spacing: 6px;
}

.news-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-xs);
}

.news-card__date {
  font-size: var(--font-sm);
  color: var(--text-disabled);
}

.news-card__title {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
  margin-top: 4px;
}

.news-card__description {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
