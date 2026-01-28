<template>
  <div class="server-card">
    <div class="server-card-content">
      <span
        v-if="server.status"
        :class="['status-badge', `status-${server.status}`]"
        :title="statusText"
      >
        <component :is="getStatusIcon(server.status)" />
      </span>
      <a
        :href="server.url"
        class="server-name"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ server.name }}
      </a>
      <div class="server-badges">
        <span
          v-for="badge in server.badges"
          :key="badge"
          :class="['badge-icon', `badge-${badge}`]"
          :title="badgeText(badge)"
        >
          <component :is="getBadgeIcon(badge)" />
        </span>
      </div>
      <span class="rate">{{ server.rate }}</span>
      <span class="chronicle">{{ server.chronicle }}</span>
      <div class="server-date" :class="{ 'is-accent': dateInfo.isAccent }">
        {{ dateInfo.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatServerDate } from '~/utils/dateUtils'
import { h } from 'vue'

const props = defineProps({
  server: {
    type: Object,
    required: true,
  },
})

const dateInfo = computed(() => formatServerDate(props.server.startDate))

const statusText = computed(() => {
  const statusMap = {
    premium: 'PREM',
    vip: 'VIP',
    top: 'TOP',
  }
  return statusMap[props.server.status] || ''
})

// Функция для получения SVG иконки статуса
const getStatusIcon = (status) => {
  return h('img', {
    src: `/images/status/${status}.svg`,
    alt: statusText.value,
    width: 24,
    height: 24,
    style: 'display: block; object-fit: contain;',
  })
}

const badgeText = (badge) => {
  const badgeMap = {
    recommended: 'Рекомендуем',
    'hot-start': 'Горячий старт',
    'bonus-start': 'Бонус старт',
  }
  return badgeMap[badge] || badge
}

// Функция для получения иконки бейджа
const getBadgeIcon = (badge) => {
  // Вариант 1: Использовать изображения из папки public
  // Раскомментируйте, если хотите использовать изображения:
  // return h('img', {
  //   src: `/images/badges/${badge}.svg`,
  //   alt: badgeText(badge),
  //   width: 16,
  //   height: 16
  // })

  // Вариант 2: Использовать разные SVG для каждого бейджа
  const iconMap = {
    recommended: () =>
      h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [
        h('path', {
          d: 'M8 0l1.5 3 3.5 0.5-2.5 2.5 0.5 3.5L8 8l-2.5 1.5 0.5-3.5-2.5-2.5 3.5-0.5L8 0z',
          fill: 'currentColor',
        }),
      ]),
    'hot-start': () =>
      h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [
        h('path', {
          d: 'M8 2l1 2 2 0.5-1.5 1.5 0.5 2L8 7l-2 1 0.5-2-1.5-1.5 2-0.5L8 2z',
          fill: 'currentColor',
        }),
        h('circle', { cx: 8, cy: 12, r: 1, fill: 'currentColor' }),
      ]),
    'bonus-start': () =>
      h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [
        h('circle', { cx: 8, cy: 8, r: 6, fill: 'currentColor' }),
      ]),
  }

  // Возвращаем иконку для бейджа или дефолтную
  return (
    iconMap[badge] ||
    (() =>
      h('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, [
        h('circle', { cx: 8, cy: 8, r: 6, fill: 'currentColor' }),
      ]))
  )
}
</script>

<style scoped>
.server-card {
  background: var(--secondary-main);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.server-card-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  overflow: hidden;
}

.status-badge img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.status-premium {
  /* Фон и скругление убраны */
}

.status-vip {
  /* Фон и скругление убраны */
}

.status-top {
  /* Фон и скругление убраны */
}

.server-name {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  text-decoration: none;
  font-size: 13px;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

.server-name:hover {
  color: var(--primary-main);
}

.server-badges {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.badge-icon {
  width: 16px;
  height: 16px;
  color: var(--status-warning);
  cursor: help;
  flex-shrink: 0;
}

.rate,
.chronicle {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  white-space: nowrap;
  flex-shrink: 0;
}

.server-date {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: auto;
}

.server-date.is-accent {
  background: var(--primary-main);
  color: var(--primary-contrast);
  font-weight: var(--font-semibold);
}
</style>
