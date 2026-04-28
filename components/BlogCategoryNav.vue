<template>
  <nav class="blog-filters" aria-label="Категории блога">
    <NuxtLink
      to="/blog/"
      class="blog-filter"
      :class="{ 'blog-filter--active': activeSlug === null }"
    >
      Все
    </NuxtLink>
    <NuxtLink
      v-for="cat in categories"
      :key="cat.slug"
      :to="`/blog/${cat.slug}/`"
      class="blog-filter"
      :class="{ 'blog-filter--active': activeSlug === cat.slug }"
    >
      {{ cat.name }}
    </NuxtLink>
  </nav>
</template>

<script setup>
defineProps({
  activeSlug: { type: String, default: null },
})

const { getCategories } = useBlogCategories()
const categories = getCategories()
</script>

<style scoped>
.blog-filters {
  display: flex;
  gap: var(--spacing-sm);
  margin: var(--spacing-lg) 4px var(--spacing-xl);
  flex-wrap: wrap;
}

.blog-filter {
  background: var(--secondary-main);
  color: var(--secondary-contrast);
  padding: 10px 20px;
  border-radius: 26px;
  border: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.blog-filter:hover {
  background: var(--secondary-hover);
}

.blog-filter--active {
  background: var(--primary-main);
  color: var(--primary-contrast);
}
</style>
