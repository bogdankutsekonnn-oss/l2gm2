<template>
  <a
    :href="server.url"
    :class="['server-card', `server-card--${cardStatus}`]"
    target="_blank"
    rel="noopener noreferrer"
  >
    <SparksEffect v-if="cardStatus === 'premium'" />

    <!-- Десктопный layout -->
    <div class="server-card__left">
      <div class="server-card__status">
        <img
          :src="`/images/status/${cardStatus}.png`"
          :alt="statusText"
          class="server-card__status-img"
        />
      </div>

      <span class="server-card__name">{{ server.name }}</span>

      <div v-if="server.icons?.length" class="server-card__badges">
        <img
          v-for="badge in server.icons"
          :key="badge"
          :src="`/images/badges/${badge}.png`"
          :alt="badgeText(badge)"
          :title="badgeText(badge)"
          class="server-card__badge"
        />
      </div>
    </div>

    <div class="server-card__right">
      <span class="server-card__rate">x{{ server.rate }}</span>
      <span class="server-card__chronicle">{{ server.chronicle }}</span>
      <div :class="['server-card__date', dateInfo.dateClass]">
        {{ dateInfo.text }}
      </div>
    </div>

    <!-- Мобильный layout -->
    <div class="server-card__mobile">
      <!-- Левая колонка: иконка + рейт -->
      <div class="server-card__mobile-left">
        <div class="server-card__status">
          <img
            :src="`/images/status/${cardStatus}.png`"
            :alt="statusText"
            class="server-card__status-img"
          />
        </div>
        <span class="server-card__mobile-rate">x{{ server.rate }}</span>
      </div>

      <!-- Центр: название + хроника -->
      <div class="server-card__mobile-center">
        <span class="server-card__name">{{ server.name }}</span>
        <span class="server-card__mobile-chronicle">{{ server.chronicle }}</span>
      </div>

      <!-- Правая колонка: дата + бейджи -->
      <div class="server-card__mobile-right">
        <div :class="['server-card__date', dateInfo.dateClass]">
          {{ dateInfo.text }}
        </div>
        <div v-if="server.icons?.length" class="server-card__badges">
          <img
            v-for="badge in server.icons"
            :key="badge"
            :src="`/images/badges/${badge}.png`"
            :alt="badgeText(badge)"
            :title="badgeText(badge)"
            class="server-card__badge"
          />
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
import { formatServerDate } from '~/utils/dateUtils'

const props = defineProps({
  server: {
    type: Object,
    required: true,
  },
})

const dateInfo = computed(() => formatServerDate(props.server.startDate))

// Маппинг cardType из JSON в status для отображения
const cardStatus = computed(() => {
  const typeMap = {
    premium: 'premium',
    vip: 'vip',
    top: 'top',
    basic: 'regular',
  }
  return typeMap[props.server.cardType] || 'regular'
})

const statusText = computed(() => {
  const statusMap = {
    premium: 'Premium',
    vip: 'VIP',
    top: 'TOP',
    regular: '',
  }
  return statusMap[cardStatus.value] || ''
})

const badgeText = (badge) => {
  const badgeMap = {
    recommended: 'Рекомендуем',
    'hot-start': 'Горячий старт',
    'bonus-start': 'Бонус старт',
    obt: 'ОБТ',
  }
  return badgeMap[badge] || badge
}
</script>

<style scoped>
.server-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  background: #121416;
  border: 1px solid #262829;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
}

.server-card__left {
  display: flex;
  align-items: center;
}

.server-card__status {
  width: 32px;
  height: 32px;
  margin: 4px 4px 4px 6px;
  flex-shrink: 0;
}

.server-card__status-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.server-card__name {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  text-decoration: none;
  font-size: 13px;
  text-transform: uppercase;
  white-space: nowrap;
}


.server-card__badges {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
}

.server-card__badge {
  width: 16px;
  height: 16px;
  object-fit: contain;
  cursor: help;
}

.server-card__right {
  display: flex;
  align-items: center;
  padding-right: 6px;
}

.server-card__rate,
.server-card__chronicle,
.server-card__date {
  color: var(--text-secondary);
  font-size: 13px;
  white-space: nowrap;
  text-transform: uppercase;
  text-align: center;
}

.server-card__rate {
  width: 60px;
}

.server-card__chronicle {
  width: 100px;
}

.server-card__date {
  width: 70px;
}

.server-card__date--accent {
  background: #06080A;
  border-radius: 64px;
  height: 20px;
  padding: 0 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.server-card__date--today {
  background: #FE3600;
  border-radius: 64px;
  height: 20px;
  padding: 0 8px;
  font-size: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Мобильный layout — скрыт по умолчанию */
.server-card__mobile {
  display: none;
}

@media (max-width: 1024px) {
  /* Скрываем десктопные блоки */
  .server-card__left,
  .server-card__right {
    display: none;
  }

  /* Показываем мобильный */
  .server-card__mobile {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 6px 10px;
    gap: 8px;
  }

  .server-card__mobile-left .server-card__status {
    margin: 0;
  }

  .server-card {
    height: auto;
  }

  .server-card__mobile-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  .server-card__mobile-rate {
    color: var(--text-secondary);
    font-size: 11px;
    text-transform: uppercase;
    white-space: nowrap;
    text-align: center;
  }

  .server-card__mobile-center {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-width: 0;
    text-align: center;
    align-items: center;
  }

  .server-card__mobile-center .server-card__name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-size: 12px;
  }

  .server-card__mobile-chronicle {
    color: var(--text-secondary);
    font-size: 11px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .server-card__mobile-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  .server-card__mobile-right .server-card__date {
    width: auto;
  }

  .server-card__mobile-right .server-card__badges {
    margin-left: 0;
  }
}

/* Status variants */
.server-card--top {
  background: #1B1D1F;
}

.server-card--vip {
  background: linear-gradient(90deg, #5E0000 0%, #1B1D1F 100%);
}

.server-card--premium {
  position: relative;
  background: linear-gradient(90deg, #53005E 0%, #1B1D1F 100%);
  overflow: hidden;
}

.server-card--premium .server-card__left,
.server-card--premium .server-card__right {
  position: relative;
  z-index: 2;
}
</style>
