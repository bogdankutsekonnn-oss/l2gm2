<template>
  <div class="placement-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Размещение серверов</h1>
      </div>

      <div class="page-layout">
        <div class="servers-column placement-blocks">
          <div class="placement-contacts">
            <a
              href="https://t.me/L2gmcom"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-button contact-button--light"
            >
              <img src="/images/social/telegram.svg" alt="" width="18" height="18" />
              Telegram
            </a>
            <a href="mailto:info@l2gm.com" class="contact-button contact-button--light">
              <img src="/images/social/mail.svg" alt="" width="18" height="18" />
              Почта
            </a>
          </div>

          <ul class="slot-grid">
            <li v-for="slot in slots" :key="slot.id" class="slot-card">
              <div class="slot-card__head">
                <h2>{{ slot.title }}</h2>
                <span :class="['slot-status', `slot-status--${slot.status}`]">
                  {{ slot.status === 'busy' ? 'Занято' : 'Свободно' }}
                </span>
              </div>
              <p class="slot-card__description">{{ slot.description }}</p>
              <p v-if="slot.status === 'busy' && slot.freeFrom" class="slot-card__free-from">
                Место освободится: {{ slot.freeFrom }}
              </p>
              <div v-if="slot.preview" class="server-card-preview" @click.prevent>
                <ServerCard :server="slot.preview" />
              </div>
            </li>
          </ul>

          <p class="placement-note">
            Размещение регулируется <NuxtLink to="/rules/">Правилами размещения</NuxtLink>.
            Формат размещения не является оценкой или рекомендацией проекта.
          </p>
        </div>

        <div class="filters-column">
          <FiltersPanel />
        </div>
      </div>

      <SeoSection
        title="Размещение серверов на L2GM"
        :text="seoText"
        :links="placementLinks"
      />
    </div>
  </div>
</template>

<script setup>
// Статусы мест («Свободно» / «Занято» + дата) правятся в data/placement-slots.json.
import placementSlots from '~/data/placement-slots.json'

// Пример карточки для каждого формата — те же компоненты, что в каталоге.
const PREVIEWS = {
  premium: { name: 'S-Grade сервер', rate: 100, chronicle: 'High Five' },
  vip: { name: 'A-Grade сервер', rate: 50, chronicle: 'Interlude' },
  top: { name: 'B-Grade сервер', rate: 10, chronicle: 'Essence' },
  basic: { name: 'Обычный сервер', rate: 1, chronicle: 'Epilogue' },
}

const slots = placementSlots.map((slot) => ({
  ...slot,
  preview: slot.cardType
    ? {
        id: `placement-${slot.id}-preview`,
        ...PREVIEWS[slot.cardType],
        startDate: '',
        cardType: slot.cardType,
        icons: [],
        url: '',
      }
    : null,
}))

const seoText = `L2GM — каталог анонсов с календарём открытий. Анонс попадает в общий список, на страницы нужной версии игры и рейтов и показывается посетителям, которые ищут проект по дате старта.

На странице показаны все форматы размещения и их расположение на сайте: закреплённые места в начале списка, выделенные карточки в общем списке, баннер в шапке и баннер в боковой колонке. Для баннеров поддерживаются GIF, PNG и JPG.

Чтобы разместить анонс, отправьте заявку через форму или напишите нам в Telegram.`

const placementLinks = [
  { to: '/add-server/', text: 'Добавить сервер' },
  { to: '/', text: 'Новые сервера Л2' },
  { to: '/pvp/', text: 'PvP сервера' },
  { to: '/chronicle/interlude/', text: 'Сервера Interlude' },
  { to: '/chronicle/high-five/', text: 'Сервера High Five' },
  { to: '/chronicle/essence/', text: 'Сервера Essence' },
]

const { getCanonicalUrl, getOgImageMeta, generateBreadcrumbJsonLd } = useSeo()
const canonicalUrl = getCanonicalUrl('/placement/')

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: 'Размещение', url: '/placement/' },
])

useHead({
  title: 'Размещение серверов Lineage 2 | L2GM',
  meta: [
    {
      name: 'description',
      content: 'Форматы размещения анонса сервера Lineage 2 на L2GM: закреплённые места S-Grade, A-Grade и B-Grade, общий список и баннеры.'
    },
    { name: 'keywords', content: 'размещение сервера lineage 2, анонс сервера lineage 2, добавить сервер л2, s-grade статус, баннер lineage 2' },
    { property: 'og:title', content: 'Размещение серверов Lineage 2 | L2GM' },
    { property: 'og:description', content: 'Форматы размещения анонса на L2GM: S-Grade, A-Grade, B-Grade, общий список и баннеры.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    ...getOgImageMeta(),
    { name: 'twitter:title', content: 'Размещение серверов Lineage 2 | L2GM' },
    { name: 'twitter:description', content: 'Форматы размещения анонса на L2GM.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
  ],
})
</script>

<style scoped>
.placement-page {
  padding: var(--spacing-lg) 0;
  overflow-x: clip;
}

.placement-blocks {
  gap: var(--spacing-lg);
}

.placement-contacts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.contact-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-height: 44px;
  padding: 10px 20px;
  border: 0;
  font-size: var(--font-base);
  white-space: nowrap;
  text-decoration: none;
}

/* Кнопки связи — светлые, только на этой странице */
.contact-button--light {
  border-radius: var(--radius-button);
  background: #ffffff;
  color: #000000;
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: background 0.15s ease;
}

.contact-button--light:hover {
  background: #e6e6e6;
  color: #000000;
}

.contact-button:focus-visible {
  outline: 2px solid var(--text-primary);
  outline-offset: 3px;
}

.contact-button:active {
  transform: translateY(1px);
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);
  margin: 0;
  padding: 0;
  list-style: none;
}

.slot-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 0;
  padding: var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  background: #1b1d1f;
}

.slot-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.slot-card__head h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-lg);
  line-height: 1.3;
}

.slot-card__description,
.slot-card__free-from {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.5;
}

.slot-card__free-from {
  color: var(--text-disabled);
}

.slot-status {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  min-height: 22px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
}

.slot-status--free {
  background: rgba(40, 167, 69, 0.18);
  color: #59cb72;
}

.slot-status--busy {
  background: rgba(255, 112, 56, 0.18);
  color: #ff8a5c;
}

.server-card-preview {
  min-width: 0;
  margin-top: auto;
  padding-top: var(--spacing-sm);
}

.server-card-preview :deep(.server-card) {
  cursor: default;
}

.server-card-preview :deep(.server-card__date:empty::before) {
  color: var(--text-disabled);
  font-size: 10px;
  content: 'Не указано';
  text-transform: none;
}

.placement-note {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.6;
}

.placement-note a {
  color: var(--text-primary);
  text-decoration: underline;
}

@media (max-width: 800px) {
  .slot-grid {
    grid-template-columns: 1fr;
  }
}
</style>
