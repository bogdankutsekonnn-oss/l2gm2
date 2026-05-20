<template>
  <NewsArticlePage :slug="slugParam" />
</template>

<script setup>
const route = useRoute()

const slugParam = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug
</script>
