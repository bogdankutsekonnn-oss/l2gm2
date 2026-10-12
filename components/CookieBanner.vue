<template>
  <Transition name="cookie-slide">
    <div v-if="bannerOpen" class="cookie-banner" role="dialog" aria-label="Настройки cookie">
      <div class="cookie-banner__content">
        <p class="cookie-banner__text">
          Мы используем файлы cookie, чтобы сайт работал, и — с вашего согласия —
          Яндекс.Метрику для статистики посещений.
          <NuxtLink to="/cookies/" class="cookie-banner__link">Подробнее</NuxtLink>
        </p>
        <div class="cookie-banner__actions">
          <button
            class="cookie-banner__button cookie-banner__button--secondary"
            @click="choose('necessary')"
          >
            Только необходимые
          </button>
          <button class="cookie-banner__button" @click="choose('all')">
            Принять
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// Состояние общее с plugins/analytics.client.js и ссылкой «Настройки cookie»
// в подвале — см. composables/useCookieConsent.js.
const { bannerOpen, load, choose } = useCookieConsent()

onMounted(load)
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
  /* Белый на текущем --primary-main (200, 40, 0) даёт ~5.6:1 — проходит WCAG AA.
     Чёрный текст остался со времён более яркого оранжевого, где белый давал 3.4. */
  color: #fff;
  font-size: var(--font-sm);
  font-weight: var(--font-semibold, 600);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.cookie-banner__button:hover {
  background: var(--primary-hover);
}

.cookie-banner__actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}

.cookie-banner__button--secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.cookie-banner__button--secondary:hover {
  background: rgba(255, 255, 255, 0.18);
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

  .cookie-banner__actions {
    width: 100%;
    flex-direction: column;
  }

  .cookie-banner__button {
    width: 100%;
  }
}
</style>
