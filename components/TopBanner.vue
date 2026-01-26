<template>
  <div class="top-banner">
    <div class="banner-placeholder">
      <span>Рекламный баннер</span>
      <span class="banner-size">1920x600px</span>
    </div>
  </div>
</template>

<style scoped>
.top-banner {
  width: 100%;
  aspect-ratio: 1920 / 600;
  background: var(--bg-surface);
  position: sticky;
  top: 80px;
  z-index: 10;
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-base);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.2);
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
