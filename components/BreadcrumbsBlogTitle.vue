<template>
  <span>{{ title }}</span>
</template>

<script setup>
// Отдельный компонент для заголовка блог-статьи в хлебных крошках.
// Вынесено из Breadcrumbs.vue, чтобы queryCollection (и связанный
// sqlite3-worker ~200KB) попадал в отдельный async chunk и загружался
// только на /blog/<slug>/ страницах, а не на всех страницах сайта.
const props = defineProps({
  slug: { type: String, required: true },
})

const { data: article } = await useAsyncData(
  `breadcrumb-blog-${props.slug}`,
  () => queryCollection('blog').where('slug', '=', props.slug).first(),
)

const title = computed(() => article.value?.title || '')
</script>
