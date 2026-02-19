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
const PAID_TYPES = new Set(['premium', 'vip', 'top'])

// Применить лимиты: 1 premium + до 10 остальных
const applyColumnLimits = (servers) => {
  const premium = servers.filter(s => s.cardType === 'premium').slice(0, 1)
  const others = servers.filter(s => s.cardType !== 'premium').slice(0, 10)
  return [...premium, ...others]
}

const sortByDate = (a, b) => {
  const dateA = new Date(a.startDate || '1970-01-01')
  const dateB = new Date(b.startDate || '1970-01-01')
  return dateB - dateA // новые сначала
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
    const effectiveType = (server.expiresAt && parseServerDate(server.expiresAt) < today)
      ? 'basic'
      : server.cardType
    const isPaid = PAID_TYPES.has(effectiveType)
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

  // «Скоро откроются» и «Уже открылись»: лимит 1 premium + 10 остальных, сортировка по дате
  const premiumsOpen = categories['Скоро откроются'].filter(s => s.cardType === 'premium')
  const othersOpen = categories['Скоро откроются'].filter(s => s.cardType !== 'premium').sort(sortByDate)
  categories['Скоро откроются'] = applyColumnLimits([...premiumsOpen, ...othersOpen])

  const premiumsDone = categories['Уже открылись'].filter(s => s.cardType === 'premium')
  const othersDone = categories['Уже открылись'].filter(s => s.cardType !== 'premium').sort(sortByDate)
  categories['Уже открылись'] = applyColumnLimits([...premiumsDone, ...othersDone])

  // Остальные разделы — по дате
  ;['Завтра', 'Ближайшие 7 дней', 'Через неделю и более', 'Предыдущие 7 дней', 'Неделю назад и более'].forEach(cat => {
    categories[cat] = categories[cat].sort(sortByDate)
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
