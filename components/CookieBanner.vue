<template>
  <Transition name="cookie-slide">
    <div v-if="isVisible" class="cookie-banner">
      <div class="cookie-banner__content">
        <p class="cookie-banner__text">
          Мы используем файлы cookie для улучшения работы сайта.
          <NuxtLink to="/cookies/" class="cookie-banner__link">Подробнее</NuxtLink>
        </p>
        <button class="cookie-banner__button" @click="acceptCookies">
          Принять
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const isVisible = ref(false)

onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const consent = localStorage.getItem('cookieConsent')
    if (consent !== 'true') {
      isVisible.value = true
    }
  }
})

const acceptCookies = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cookieConsent', 'true')
  }
  isVisible.value = false
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px;
  pointer-events: none;
}

.cookie-banner__content {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  background: #1B1D1F;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  pointer-events: all;
}

.cookie-banner__text {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.5;
  margin: 0;
}

.cookie-banner__link {
  color: var(--primary-main);
  text-decoration: underline;
  text-underline-offset: 2px;
  white-space: nowrap;
}

.cookie-banner__link:hover {
  color: var(--primary-hover);
}

.cookie-banner__button {
  flex-shrink: 0;
  padding: 8px 24px;
  background: var(--primary-main);
  color: #fff;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.cookie-banner__button:hover {
  background: var(--primary-hover);
}

/* Slide up animation */
.cookie-slide-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}

.cookie-slide-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}

.cookie-slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.cookie-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 640px) {
  .cookie-banner__content {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }

  .cookie-banner__button {
    width: 100%;
  }
}
</style>
