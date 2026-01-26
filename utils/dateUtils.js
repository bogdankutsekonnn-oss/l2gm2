export const formatServerDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const serverDate = new Date(date)
  serverDate.setHours(0, 0, 0, 0)
  
  const diffTime = serverDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return { text: 'Сегодня', isAccent: true }
  } else if (diffDays === 1) {
    return { text: 'Завтра', isAccent: true }
  } else if (diffDays === -1) {
    return { text: 'Вчера', isAccent: true }
  } else if (diffDays > 7) {
    return { text: `Через неделю и более`, isAccent: false }
  } else if (diffDays < -7) {
    return { text: `Неделю назад и более`, isAccent: false }
  } else {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return { text: `${day}.${month}.${year}`, isAccent: false }
  }
}

export const categorizeServers = (servers) => {
  const categories = {
    'Скоро откроются': [],
    'Уже открылись': [],
    'Сегодня': [],
    'Завтра': [],
    'Вчера': [],
    'Через неделю и более': [],
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
    
    if (diffDays > 7) {
      categories['Скоро откроются'].push(server)
    } else if (diffDays < -7) {
      categories['Уже открылись'].push(server)
    } else if (diffDays === 0) {
      categories['Сегодня'].push(server)
    } else if (diffDays === 1) {
      categories['Завтра'].push(server)
    } else if (diffDays === -1) {
      categories['Вчера'].push(server)
    } else if (diffDays > 0 && diffDays <= 7) {
      categories['Скоро откроются'].push(server)
    } else {
      categories['Неделю назад и более'].push(server)
    }
  })
  
  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key]
    }
  })
  
  return categories
}
