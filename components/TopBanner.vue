<template>
  <div class="top-banner">
    <img
      v-if="bannerImage"
      :src="bannerImage"
      alt="Рекламный баннер"
      class="banner-image"
    />
    <div v-else class="banner-placeholder">
      <span>Рекламный баннер</span>
      <span class="banner-size">1920x600px</span>
    </div>
  </div>
</template>

<script setup>
// Путь к изображению баннера
// Разместите изображение в папке public/images/banner.jpg
// Или используйте внешнюю ссылку
const bannerImage = '/images/banner.jpg' // или null для показа placeholder
</script>

<style scoped>
.top-banner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto var(--spacing-lg);
  padding: 0 var(--spacing-lg);
  aspect-ratio: 1920 / 600;
  background: var(--bg-surface);
  border-radius: var(--radius-base);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.banner-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-disabled);
  font-size: var(--font-sm);
}

.banner-size {
  font-size: var(--font-xs);
}
</style>
