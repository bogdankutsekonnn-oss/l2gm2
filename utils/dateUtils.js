export const formatServerDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const serverDate = new Date(date)
  serverDate.setHours(0, 0, 0, 0)

  const diffTime = serverDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Форматируем дату
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const formattedDate = `${day}.${month}.${year}`

  if (diffDays === 0) {
    return { text: 'Сегодня', isAccent: true }
  } else if (diffDays === 1) {
    return { text: 'Завтра', isAccent: true }
  } else if (diffDays === -1) {
    return { text: 'Вчера', isAccent: true }
  } else {
    return { text: formattedDate, isAccent: false }
  }
}

// Категории для будущих серверов (левая колонка)
export const FUTURE_CATEGORIES = [
  'Скоро откроются',      // Сегодня
  'Завтра',               // Завтра
  'Ближайшие 7 дней',     // 2-7 дней вперёд
  'Через неделю и более'  // >7 дней вперёд
]

// Категории для прошлых серверов (правая колонка)
export const PAST_CATEGORIES = [
  'Уже открылись',        // Вчера
  'Предыдущие 7 дней',    // 2-7 дней назад
  'Неделю назад и более'  // >7 дней назад
]

// Ряды категорий для двухколоночного отображения
// [левая колонка (будущее), правая колонка (прошлое)]
export const CATEGORY_ROWS = [
  ['Скоро откроются', 'Уже открылись'],
  ['Завтра', 'Предыдущие 7 дней'],
  ['Ближайшие 7 дней', 'Неделю назад и более'],
  ['Через неделю и более', null]
]

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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  servers.forEach(server => {
    if (!server.startDate) {
      categories['Скоро откроются'].push(server)
      return
    }

    const serverDate = new Date(server.startDate)
    serverDate.setHours(0, 0, 0, 0)

    const diffTime = serverDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Сегодня - "Скоро откроются"
      categories['Скоро откроются'].push(server)
    } else if (diffDays === 1) {
      // Завтра
      categories['Завтра'].push(server)
    } else if (diffDays >= 2 && diffDays <= 7) {
      // 2-7 дней вперёд
      categories['Ближайшие 7 дней'].push(server)
    } else if (diffDays > 7) {
      // Более 7 дней вперёд
      categories['Через неделю и более'].push(server)
    } else if (diffDays === -1) {
      // Вчера - "Уже открылись"
      categories['Уже открылись'].push(server)
    } else if (diffDays >= -7 && diffDays <= -2) {
      // 2-7 дней назад
      categories['Предыдущие 7 дней'].push(server)
    } else if (diffDays < -7) {
      // Более 7 дней назад
      categories['Неделю назад и более'].push(server)
    }
  })

  // Сортировка внутри каждой категории
  // Будущие категории: ближайшие даты сначала (по возрастанию)
  // Прошлые категории: недавние сначала (по убыванию)

  FUTURE_CATEGORIES.forEach(category => {
    if (categories[category]) {
      categories[category].sort((a, b) => {
        const dateA = new Date(a.startDate || '9999-12-31')
        const dateB = new Date(b.startDate || '9999-12-31')
        return dateA - dateB // По возрастанию (ближайшие сначала)
      })
    }
  })

  PAST_CATEGORIES.forEach(category => {
    if (categories[category]) {
      categories[category].sort((a, b) => {
        const dateA = new Date(a.startDate || '1970-01-01')
        const dateB = new Date(b.startDate || '1970-01-01')
        return dateB - dateA // По убыванию (недавние сначала)
      })
    }
  })

  // Убираем пустые категории
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key]
    }
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
