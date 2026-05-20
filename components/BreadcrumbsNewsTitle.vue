<template>
  <span>{{ title }}</span>
</template>

<script setup>
const props = defineProps({
  slug: { type: String, required: true },
})

const { data: article } = await useAsyncData(
  `breadcrumb-news-${props.slug}`,
  () => queryCollection('news').where('slug', '=', props.slug).first(),
)

const title = computed(() => article.value?.title || '')
</script>
