<template>
  <div class="calendar-filter">
    <!-- Заголовок с навигацией по месяцам -->
    <div class="calendar-header">
      <button class="nav-btn" @click="prevMonth">&lt;</button>
      <span class="month-title">{{ monthName }} {{ currentYear }}</span>
      <button class="nav-btn" @click="nextMonth">&gt;</button>
    </div>

    <!-- Дни недели -->
    <div class="calendar-weekdays">
      <span v-for="day in weekDays" :key="day" class="weekday">{{ day }}</span>
    </div>

    <!-- Сетка дней -->
    <div class="calendar-days">
      <NuxtLink
        v-for="(day, index) in calendarDays"
        :key="index"
        :to="day.hasServers ? `/date/${day.fullDate}` : undefined"
        :class="[
          'day-cell',
          {
            'other-month': !day.isCurrentMonth,
            'has-servers': day.hasServers,
            'is-selected': isDateSelected(day.fullDate),
            'is-today': day.isToday
          }
        ]"
        :tabindex="day.hasServers ? 0 : -1"
      >
        {{ day.date }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  servers: {
    type: Array,
    required: true
  }
})

const route = useRoute()

// Текущий отображаемый месяц/год
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Названия месяцев
const monthNames = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
]

// Дни недели
const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

// Название текущего месяца
const monthName = computed(() => monthNames[currentMonth.value])

// Даты с серверами (Set для быстрого поиска)
const serverDates = computed(() => {
  const dates = new Set()
  props.servers.forEach(server => {
    if (server.startDate) {
      dates.add(server.startDate)
    }
  })
  return dates
})

// Проверка выбранной даты из URL
const isDateSelected = (fullDate) => {
  return route.params.date === fullDate
}

// Генерация дней календаря
const calendarDays = computed(() => {
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Первый день месяца
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  // Последний день месяца
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)

  // День недели первого дня (0 = воскресенье, нам нужно 0 = понедельник)
  let startWeekDay = firstDay.getDay() - 1
  if (startWeekDay < 0) startWeekDay = 6

  // Добавляем дни предыдущего месяца
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()
  for (let i = startWeekDay - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i
    const fullDate = formatDateString(currentYear.value, currentMonth.value - 1, date)
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      hasServers: serverDates.value.has(fullDate),
      isToday: false
    })
  }

  // Добавляем дни текущего месяца
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const fullDate = formatDateString(currentYear.value, currentMonth.value, date)
    const dayDate = new Date(currentYear.value, currentMonth.value, date)
    dayDate.setHours(0, 0, 0, 0)

    days.push({
      date,
      fullDate,
      isCurrentMonth: true,
      hasServers: serverDates.value.has(fullDate),
      isToday: dayDate.getTime() === today.getTime()
    })
  }

  // Добавляем дни следующего месяца до заполнения сетки (6 рядов = 42 дня)
  const remainingDays = 42 - days.length
  for (let date = 1; date <= remainingDays; date++) {
    const fullDate = formatDateString(currentYear.value, currentMonth.value + 1, date)
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      hasServers: serverDates.value.has(fullDate),
      isToday: false
    })
  }

  return days
})

// Форматирование даты в строку YYYY-MM-DD
function formatDateString(year, month, day) {
  // Корректируем месяц если вышли за пределы
  const date = new Date(year, month, day)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Навигация по месяцам
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}
</script>

<style scoped>
.calendar-filter {
  background: var(--bg-main);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.nav-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: var(--font-lg);
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}

.nav-btn:hover {
  color: var(--text-primary);
}

.month-title {
  color: var(--text-primary);
  font-weight: var(--font-medium);
  text-transform: capitalize;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: var(--spacing-xs);
}

.weekday {
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  padding: 4px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  cursor: default;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  text-decoration: none;
  pointer-events: none;
}

.day-cell.other-month {
  color: var(--text-muted, rgba(255, 255, 255, 0.3));
}

.day-cell.is-today {
  border: 1px solid var(--primary-main);
}

.day-cell.has-servers {
  color: var(--text-primary);
  cursor: pointer;
  pointer-events: auto;
}

.day-cell.has-servers:hover {
  background: var(--bg-surface);
}

.day-cell.is-selected {
  background: var(--primary-main);
  color: var(--primary-contrast);
}
</style>
