<template>
  <div class="seo-section">
    <h2>{{ title }}</h2>
    <div class="seo-text">
      <p v-for="(paragraph, index) in paragraphs" :key="index">
        {{ paragraph }}
      </p>
    </div>
    <div v-if="links?.length" class="seo-links">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="seo-links__item">
        {{ link.text }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  links: {
    type: Array,
    default: () => [],
  },
})

const paragraphs = computed(() =>
  props.text.split('\n\n').filter((p) => p.trim())
)
</script>

<style scoped>
.seo-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: var(--spacing-md);
}

.seo-links__item {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.seo-links__item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}
</style>
