import chroniclesData from '~/data/chronicles.json'
import ratesData from '~/data/rates.json'

export const useSeo = () => {
  const generateTitle = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Анонсы серверов Lineage 2 ${chronicle?.name || ''} ${rateName} - L2GM`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Анонсы серверов Lineage 2 ${chronicle?.name || ''} - L2GM`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Анонсы серверов Lineage 2 ${rateName} - L2GM`
    }
    return 'Анонсы серверов Lineage 2 - L2GM'
  }
  
  const generateH1 = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Анонсы серверов Lineage 2 ${chronicle?.name || ''} ${rateName}`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Анонсы серверов Lineage 2 ${chronicle?.name || ''}`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Анонсы серверов Lineage 2 ${rateName}`
    }
    return 'Анонсы серверов Lineage 2'
  }
  
  const generateDescription = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Анонсы серверов Lineage 2 ${chronicle?.name || ''} с рейтами ${rateName}. Актуальный список новых серверов с датами открытия.`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Анонсы серверов Lineage 2 ${chronicle?.name || ''}. Все новые серверы с актуальными датами открытия.`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Анонсы серверов Lineage 2 с рейтами ${rateName}. Новые серверы с большим онлайном.`
    }
    return 'Анонсы серверов Lineage 2 всех рейтов и хроник. Не пропустите открытие серверов л2 уже сегодня!'
  }
  
  const generateSeoText = (filters = {}) => {
    let text = ''
    
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      text = `Новые сервера л2 ${chronicle?.name || ''} с рейтами ${rateName} с большим онлайном.\n\n`
      text += `Анонсы серверов Lineage 2 ${chronicle?.name || ''} с рейтами ${rateName}. Не пропустите открытие серверов л2 уже сегодня!\n\n`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      text = `Новые сервера л2 ${chronicle?.name || ''} с большим онлайном.\n\n`
      text += `Анонсы серверов Lineage 2 ${chronicle?.name || ''}. Не пропустите открытие серверов л2 уже сегодня!\n\n`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      text = `Новые сервера л2 с рейтами ${rateName} с большим онлайном.\n\n`
      text += `Анонсы серверов Lineage 2 с рейтами ${rateName}. Не пропустите открытие серверов л2 уже сегодня!\n\n`
    } else {
      text = 'Новые сервера л2 с большим онлайном.\n\n'
      text += 'Анонсы серверов Lineage 2 всех рейтов и хроник. Не пропустите открытие серверов л2 уже сегодня!\n\n'
    }
    
    text += 'Здесь размещаются наиболее качественные проекты. Вверху списка закреплены Премиум сервера L2. Начиная играть на таком проекте вы можете быть уверены в его стабильности и хорошем онлайне.\n\n'
    text += 'Для удобства все новые сервера Lineage 2 составлены в список, который мы ежедневно актуализируем, добавляя в него самую последнюю информацию о новых открытиях. Удобный поисковый механизм позволит за несколько секунд найти подходящий вам проект. Анонсы серверов л2, закрепленные сверху, а так же те, которые имеют синий текст сервера, являются лучшими игровыми проектами на сегодняшний день.\n\n'
    text += 'Мы размещаем только основную информацию - это ссылка на проект, рейты, хроники и дата старта. С подробным описанием каждого сервера Линейдж 2 можно ознакомиться, перейдя на один из них. Там же можно найти и инструкции для входа в игру.\n\n'
    text += 'На нашем сайте вы сможете найти сервера ла2 различных концепций, таких как: PvP, крафт, low rate, GvE, RvR, пвп-крафт, мультикрафт, мультипрофа, классической версии игры и с дополнениями.\n\n'
    text += 'Оставайтесь с нами и вы будете в курсе новых открытий!'
    
    return text
  }
  
  const getCanonicalUrl = (route) => {
    const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://l2gm.com'
    return `${baseUrl}${route}`
  }
  
  return {
    generateTitle,
    generateH1,
    generateDescription,
    generateSeoText,
    getCanonicalUrl
  }
}
