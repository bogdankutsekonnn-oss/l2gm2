<template>
  <div class="top-banner">
    <img
      v-if="bannerImage"
      :src="bannerImage"
      alt="Рекламный баннер"
      class="banner-image"
      @error="handleImageError"
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
const bannerImage = ref('/images/banner.jpg') // или null для показа placeholder

const handleImageError = () => {
  // Если изображение не загрузилось, показываем placeholder
  console.warn('Баннер не загружен. Проверьте путь:', bannerImage.value)
  bannerImage.value = null
}
</script>

<style scoped>
.top-banner {
  width: 100vw;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  aspect-ratio: 1920 / 600;
  background: var(--bg-surface);
  overflow: hidden;
  min-height: 200px;
  z-index: 1;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}

.banner-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--text-disabled);
  font-size: var(--font-sm);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.banner-size {
  font-size: var(--font-xs);
}
</style>
