<template>
  <NuxtLink to="/" class="top-banner">
    <NuxtImg
      v-if="bannerImage"
      :src="bannerImage"
      alt="Рекламный баннер"
      class="banner-image"
      format="webp"
      quality="80"
      loading="lazy"
      @error="handleImageError"
    />
    <div v-else class="banner-placeholder">
      <span>Рекламный баннер</span>
      <span class="banner-size">1920x600px</span>
    </div>
    <div class="banner-gradient"></div>
  </NuxtLink>
</template>

<script setup>
const bannerImage = ref('/branding-section.jpg')

const handleImageError = () => {
  // Если изображение не загрузилось, показываем placeholder
  console.warn('Баннер не загружен. Проверьте путь:', bannerImage.value)
  bannerImage.value = null
}
</script>

<style scoped>
.top-banner {
  display: block;
  width: 1920px;
  height: 1080px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 70px; /* После шапки */
  overflow: hidden;
  z-index: 0;
  pointer-events: auto;
}

@media (max-width: 1024px) {
  .top-banner {
    top: 57px;
  }
}

.banner-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(to bottom, transparent, var(--bg-main));
  pointer-events: none;
  z-index: 2;
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
