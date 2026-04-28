<template>
  <NuxtLink
    v-if="categorySlug && categoryName"
    :to="`/blog/${categorySlug}/`"
    class="breadcrumbs-link"
    itemprop="item"
  >
    <span itemprop="name">{{ categoryName }}</span>
  </NuxtLink>
</template>

<script setup>
// Отдельный компонент: ленивая подгрузка крошки-категории на /blog/<article>.
// queryCollection тащит ~200KB sqlite3-worker, поэтому держим в отдельном
// async chunk и подключаем только на странице блог-статьи.
const props = defineProps({
  slug: { type: String, required: true },
})

const { getCategorySlug } = useBlogCategories()

const { data: article } = await useAsyncData(
  `breadcrumb-blog-${props.slug}`,
  () => queryCollection('blog').where('slug', '=', props.slug).first(),
)

const categoryName = computed(() => article.value?.category || '')
const categorySlug = computed(() => getCategorySlug(categoryName.value))
</script>

<style scoped>
.breadcrumbs-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-base);
  transition: color 0.2s;
}

.breadcrumbs-link:hover {
  color: var(--text-primary);
}
</style>
