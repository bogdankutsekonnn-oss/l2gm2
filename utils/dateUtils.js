// Получить текущую дату в московском времени (UTC+3)
const getMoscowToday = () => {
  const now = new Date()
  // Получаем UTC время и добавляем 3 часа для Москвы
  const moscowOffset = 3 * 60 * 60 * 1000
  const moscowTime = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000 + moscowOffset)
  moscowTime.setHours(0, 0, 0, 0)
  return moscowTime
}

// Парсить дату сервера (YYYY-MM-DD) как московское время
const parseServerDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

export const formatServerDate = (dateString) => {
  if (!dateString) return ''

  const date = parseServerDate(dateString)
  const today = getMoscowToday()

  const serverDate = new Date(date)
  serverDate.setHours(0, 0, 0, 0)

  const diffTime = serverDate - today
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  // Форматируем дату (без года)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const formattedDate = `${day}.${month}`

  if (diffDays === 0) {
    return { text: 'Сегодня', isAccent: true, dateClass: 'server-card__date--today' }
  } else if (diffDays === 1) {
    return { text: 'Завтра', isAccent: true, dateClass: 'server-card__date--accent' }
  } else if (diffDays === -1) {
    return { text: 'Вчера', isAccent: true, dateClass: 'server-card__date--accent' }
  } else {
    return { text: formattedDate, isAccent: false, dateClass: '' }
  }
}

// Категории для будущих серверов (левая колонка)
export const FUTURE_CATEGORIES = [
  'Скоро откроются',      // платные, дата >= сегодня
  'Завтра',               // все, завтра
  'Ближайшие 7 дней',     // все, 2-7 дней вперёд
  'Через неделю и более'  // все, >7 дней вперёд
]

// Категории для прошлых серверов (правая колонка)
export const PAST_CATEGORIES = [
  'Уже открылись',        // платные, дата < сегодня
  'Предыдущие 7 дней',    // все, 2-7 дней назад
  'Неделю назад и более'  // все, >7 дней назад
]

// Платные типы карточек
export const PAID_CARD_TYPES = new Set(['premium', 'vip'])

// Срок платного размещения (дней)
export const PLACEMENT_DURATION_DAYS = 30

/**
 * Рассчитать дату истечения размещения
 * @param {string} createdAt - дата создания (YYYY-MM-DD)
 * @param {string} cardType - тип карточки
 * @returns {string|null} - дата истечения или null для бесплатных
 */
export const calculateExpiresAt = (createdAt, cardType) => {
  if (!PAID_CARD_TYPES.has(cardType)) return null
  const date = parseServerDate(createdAt)
  date.setDate(date.getDate() + PLACEMENT_DURATION_DAYS)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Проверить, истекло ли размещение сервера
 * @param {Object} server - объект сервера с полем expiresAt
 * @returns {boolean}
 */
export const isPlacementExpired = (server) => {
  if (!server.expiresAt) return false
  const today = getMoscowToday()
  return parseServerDate(server.expiresAt) < today
}

// Сортировка по дате: ближайшие сначала (для будущих серверов)
const sortByDateAsc = (a, b) => {
  const dateA = new Date(a.startDate || '9999-12-31')
  const dateB = new Date(b.startDate || '9999-12-31')
  return dateA - dateB
}

// Сортировка по дате: недавние сначала (для прошлых серверов)
const sortByDateDesc = (a, b) => {
  const dateA = new Date(a.startDate || '1970-01-01')
  const dateB = new Date(b.startDate || '1970-01-01')
  return dateB - dateA
}

export const categorizeServers = (servers) => {
  const categories = {
    'Скоро откроются': [],
    'Завтра': [],
    'Ближайшие 7 дней': [],
    'Через неделю и более': [],
    'Уже открылись': [],
    'Предыдущие 7 дней': [],
    'Неделю назад и более': []
  }

  const today = getMoscowToday()

  servers.forEach(server => {
    // Если подписка истекла — считаем как basic
    const effectiveType = isPlacementExpired(server) ? 'basic' : server.cardType
    const isPaid = PAID_CARD_TYPES.has(effectiveType)
    // Передаём эффективный тип в объект для рендера карточки
    const s = effectiveType !== server.cardType ? { ...server, cardType: effectiveType } : server

    if (!server.startDate) {
      if (isPaid) categories['Скоро откроются'].push(s)
      return
    }

    const serverDate = parseServerDate(server.startDate)
    const diffTime = serverDate - today
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= 0) {
      // Платные → «Скоро откроются»
      if (isPaid) categories['Скоро откроются'].push(s)

      // Все → по временным разделам (сегодня только в «Скоро»)
      if (diffDays === 1) {
        categories['Завтра'].push(s)
      } else if (diffDays >= 2 && diffDays <= 7) {
        categories['Ближайшие 7 дней'].push(s)
      } else if (diffDays > 7) {
        categories['Через неделю и более'].push(s)
      }
    } else {
      // Платные → «Уже открылись»
      if (isPaid) categories['Уже открылись'].push(s)

      // Все → по временным разделам
      if (diffDays >= -7) {
        categories['Предыдущие 7 дней'].push(s)
      } else {
        categories['Неделю назад и более'].push(s)
      }
    }
  })

  // «Скоро откроются»: premium вверху, vip по дате (ближайшие сначала)
  {
    const cat = 'Скоро откроются'
    const premium = categories[cat].filter(s => s.cardType === 'premium').sort(sortByDateAsc)
    const vip = categories[cat].filter(s => s.cardType === 'vip').sort(sortByDateAsc)
    categories[cat] = [...premium, ...vip]
  }

  // «Уже открылись»: premium вверху, vip по дате (недавние сначала)
  {
    const cat = 'Уже открылись'
    const premium = categories[cat].filter(s => s.cardType === 'premium').sort(sortByDateDesc)
    const vip = categories[cat].filter(s => s.cardType === 'vip').sort(sortByDateDesc)
    categories[cat] = [...premium, ...vip]
  }

  // Будущие разделы — ближайшие даты сначала
  ;['Завтра', 'Ближайшие 7 дней', 'Через неделю и более'].forEach(cat => {
    categories[cat] = categories[cat].sort(sortByDateAsc)
  })

  // Прошлые разделы — недавние даты сначала
  ;['Предыдущие 7 дней', 'Неделю назад и более'].forEach(cat => {
    categories[cat] = categories[cat].sort(sortByDateDesc)
  })

  // Убираем пустые
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) delete categories[key]
  })

  return categories
}

// Получить категоризированные сервера в виде двух независимых колонок
export const getOrderedCategories = (servers) => {
  const categorized = categorizeServers(servers)

  const leftColumn = []
  const rightColumn = []

  // Левая колонка - будущие сервера
  FUTURE_CATEGORIES.forEach(category => {
    if (categorized[category]?.length > 0) {
      leftColumn.push({
        name: category,
        servers: categorized[category]
      })
    }
  })

  // Правая колонка - прошлые сервера
  PAST_CATEGORIES.forEach(category => {
    if (categorized[category]?.length > 0) {
      rightColumn.push({
        name: category,
        servers: categorized[category]
      })
    }
  })

  return { leftColumn, rightColumn }
}
