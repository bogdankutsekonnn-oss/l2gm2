<template>
  <div class="server-card">
    <div class="server-card-header">
      <span v-if="server.status" :class="['status-badge', `status-${server.status}`]">
        {{ statusText }}
      </span>
      <a :href="server.url" class="server-name" target="_blank" rel="noopener noreferrer">
        {{ server.name }}
      </a>
      <div class="server-badges">
        <span
          v-for="badge in server.badges"
          :key="badge"
          :class="['badge-icon', `badge-${badge}`]"
          :title="badgeText(badge)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" fill="currentColor"/>
          </svg>
        </span>
      </div>
    </div>
    <div class="server-card-body">
      <div class="server-info">
        <span class="rate">Рейты: {{ server.rate }}</span>
        <span class="chronicle">Хроники: {{ server.chronicle }}</span>
      </div>
      <div class="server-date" :class="{ 'is-accent': dateInfo.isAccent }">
        {{ dateInfo.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatServerDate } from '~/utils/dateUtils'

const props = defineProps({
  server: {
    type: Object,
    required: true
  }
})

const dateInfo = computed(() => formatServerDate(props.server.startDate))

const statusText = computed(() => {
  const statusMap = {
    premium: 'PREM',
    vip: 'VIP',
    top: 'TOP'
  }
  return statusMap[props.server.status] || ''
})

const badgeText = (badge) => {
  const badgeMap = {
    'recommended': 'Рекомендуем',
    'hot-start': 'Горячий старт',
    'bonus-start': 'Бонус старт'
  }
  return badgeMap[badge] || badge
}
</script>

<style scoped>
.server-card {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.server-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
}

.status-premium {
  background: var(--primary-main);
  color: var(--primary-contrast);
}

.status-vip {
  background: var(--status-warning);
  color: var(--text-primary);
}

.status-top {
  background: var(--status-success);
  color: var(--text-primary);
}

.server-name {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  text-decoration: none;
  font-size: var(--font-lg);
}

.server-name:hover {
  color: var(--primary-main);
}

.server-badges {
  display: flex;
  gap: var(--spacing-xs);
}

.badge-icon {
  width: 16px;
  height: 16px;
  color: var(--status-warning);
  cursor: help;
}

.server-card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.server-info {
  display: flex;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.server-date {
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.server-date.is-accent {
  background: var(--primary-main);
  color: var(--primary-contrast);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-semibold);
}
</style>
