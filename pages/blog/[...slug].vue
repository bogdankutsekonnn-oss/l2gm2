<template>
  <BlogCategoryPage v-if="categoryData" :category="categoryData" />
  <BlogArticlePage v-else :slug="slugParam" />
</template>

<script setup>
const route = useRoute()

const slugParam = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug

const { isCategorySlug, getCategoryBySlug } = useBlogCategories()

const categoryData = isCategorySlug(slugParam)
  ? getCategoryBySlug(slugParam)
  : null
</script>
