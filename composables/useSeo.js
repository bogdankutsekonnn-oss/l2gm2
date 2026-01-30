import chroniclesData from '~/data/chronicles.json'
import ratesData from '~/data/rates.json'

export const useSeo = () => {
  const generateTitle = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Анонсы серверов Lineage 2 ${chronicle?.name || ''} ${rateName} | L2GM`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Анонсы серверов Lineage 2 ${chronicle?.name || ''} | L2GM`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Анонсы серверов Lineage 2 ${rateName} | L2GM`
    }
    return 'Анонсы серверов Lineage 2 | L2GM'
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

  // Описания для разных хроник
  const chronicleDescriptions = {
    'interlude': 'Interlude — золотая классика Lineage 2, любимая многими игроками за баланс классов и атмосферу. Эта хроника идеально подходит как для новичков, так и для ветеранов.',
    'high-five': 'High Five — одна из самых популярных хроник с развитой системой подклассов и множеством контента. Отличный выбор для тех, кто ценит глубокий геймплей.',
    'c4': 'C4 — легендарная хроника с хардкорным геймплеем и сложной прокачкой. Выбор настоящих олдскульных игроков.',
    'gracia-final': 'Gracia Final — хроника с красивой графикой и интересными нововведениями. Подойдёт любителям современного геймплея.',
    'epilogue': 'Epilogue — финальная версия классических хроник с максимумом контента и возможностей.',
    'freya': 'Freya — хроника с обновлённой боевой системой и новыми территориями для исследования.',
  }

  // Описания для разных рейтов
  const rateDescriptions = {
    'low': 'Лоу рейт серверы (x1-x20) — для тех, кто любит долгую и вдумчивую прокачку. Здесь каждый уровень имеет значение, а достижения ощущаются по-настоящему.',
    'mid': 'Мид рейт серверы (x50-x100) — золотая середина между хардкором и комфортом. Достаточно быстрая прокачка, но с сохранением интереса к развитию персонажа.',
    'high': 'Хай рейт серверы (x100+) — быстрый старт и максимум экшена. Идеально для тех, кто хочет сразу окунуться в PvP и осады.',
  }

  // Определяем тип рейта
  const getRateType = (rateSlug) => {
    if (!rateSlug) return null

    // Если это диапазон
    if (rateSlug.includes('-')) {
      const parts = rateSlug.split('-')
      const max = parseInt(parts[1].replace('x', ''))
      if (max <= 20) return 'low'
      if (max <= 100) return 'mid'
      return 'high'
    }

    // Если это конкретный рейт
    const rate = ratesData.find(r => r.slug === rateSlug)
    if (rate?.range) {
      const parts = rate.range.split('-')
      const max = parseInt(parts[1].replace('x', ''))
      if (max <= 20) return 'low'
      if (max <= 100) return 'mid'
      return 'high'
    }

    return null
  }

  const generateSeoText = (filters = {}) => {
    const paragraphs = []

    const chronicle = filters.chronicle ? chroniclesData.find(c => c.slug === filters.chronicle) : null
    const rate = filters.rate ? ratesData.find(r => r.slug === filters.rate) : null
    const rateName = rate?.name || filters.rate
    const rateType = getRateType(filters.rate)

    // Первый параграф - вступление под конкретную страницу
    if (chronicle && rate) {
      paragraphs.push(`Ищете сервер Lineage 2 ${chronicle.name} с рейтами ${rateName}? На L2GM собраны лучшие проекты с проверенным качеством и стабильным онлайном. Мы ежедневно обновляем список анонсов, чтобы вы всегда были в курсе новых открытий.`)
    } else if (chronicle) {
      paragraphs.push(`Добро пожаловать в раздел серверов Lineage 2 ${chronicle.name}! Здесь вы найдёте актуальные анонсы проектов на этой хронике с разными рейтами и особенностями. Выбирайте сервер по душе и начинайте приключение.`)
    } else if (rate) {
      paragraphs.push(`Серверы Lineage 2 с рейтами ${rateName} — отличный выбор для игроков, которые знают чего хотят. В этом разделе собраны проекты разных хроник с указанными рейтами.`)
    } else {
      paragraphs.push(`L2GM — ваш надёжный гид в мире серверов Lineage 2. Мы собрали анонсы лучших проектов всех хроник и рейтов, чтобы вы могли легко найти идеальный сервер для игры.`)
    }

    // Второй параграф - описание хроники (если выбрана)
    if (chronicle && chronicleDescriptions[chronicle.slug]) {
      paragraphs.push(chronicleDescriptions[chronicle.slug])
    }

    // Третий параграф - описание рейтов (если выбраны)
    if (rateType && rateDescriptions[rateType]) {
      paragraphs.push(rateDescriptions[rateType])
    }

    // Четвёртый параграф - о премиум серверах
    paragraphs.push(`В верхней части списка закреплены Премиум серверы — это проекты с гарантированным качеством, стабильной работой и активным сообществом. Выбирая такой сервер, вы получаете уверенность в долгосрочной игре.`)

    // Пятый параграф - о функционале сайта
    if (chronicle || rate) {
      paragraphs.push(`Используйте фильтры для более точного поиска: выберите нужную хронику, диапазон рейтов или конкретную дату открытия. Календарь поможет найти серверы, стартующие в удобное для вас время.`)
    } else {
      paragraphs.push(`Удобная система фильтров поможет быстро найти подходящий проект. Выбирайте по хроникам, рейтам или дате открытия. Календарь покажет все ближайшие старты серверов.`)
    }

    // Шестой параграф - о типах серверов
    paragraphs.push(`На L2GM представлены серверы различных направлений: классические PvE проекты для любителей прокачки, динамичные PvP серверы для ценителей сражений, а также GvE, RvR, мультипрофа и другие интересные концепции.`)

    // Седьмой параграф - призыв к действию
    if (chronicle && rate) {
      paragraphs.push(`Следите за обновлениями раздела ${chronicle.name} ${rateName} — новые серверы появляются регулярно. Добавьте страницу в закладки, чтобы не пропустить интересный проект!`)
    } else if (chronicle) {
      paragraphs.push(`Раздел ${chronicle.name} регулярно пополняется новыми серверами. Заходите чаще, чтобы первыми узнавать об интересных проектах на любимой хронике!`)
    } else if (rate) {
      paragraphs.push(`Серверы с рейтами ${rateName} открываются регулярно. Следите за анонсами на L2GM, чтобы не пропустить старт нового проекта!`)
    } else {
      paragraphs.push(`Новые серверы появляются каждый день. Оставайтесь с L2GM, чтобы всегда быть в курсе самых свежих анонсов Lineage 2!`)
    }

    return paragraphs.join('\n\n')
  }

  // SEO текст для страницы даты
  const generateDateSeoText = (dateString) => {
    const paragraphs = []

    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ]

    const [year, month, day] = dateString.split('-').map(Number)
    const formattedDate = `${day} ${months[month - 1]} ${year}`

    // Определяем относительную дату
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(year, month - 1, day)
    targetDate.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      paragraphs.push(`Сегодня открываются новые серверы Lineage 2! Не упустите шанс начать игру с первого дня — это лучшее время для старта, когда все игроки на равных условиях.`)
      paragraphs.push(`Серверы, открывающиеся сегодня, собирают максимальный онлайн в первые часы. Присоединяйтесь к сообществу и займите своё место в новом мире.`)
    } else if (diffDays === 1) {
      paragraphs.push(`Завтра стартуют новые серверы Lineage 2! Самое время подготовиться к открытию: изучите информацию о проектах и выберите подходящий.`)
      paragraphs.push(`Старт сервера с первого дня — это возможность быть в числе лидеров. Не откладывайте выбор на последний момент.`)
    } else if (diffDays > 1) {
      paragraphs.push(`${formattedDate} состоится открытие серверов Lineage 2. У вас есть время изучить проекты и подготовиться к старту.`)
      paragraphs.push(`Следите за анонсами — информация о серверах может обновляться. Добавьте страницу в закладки, чтобы не пропустить важные детали.`)
    } else {
      paragraphs.push(`Серверы, открывшиеся ${formattedDate}. Некоторые проекты всё ещё набирают игроков — возможно, вы найдёте интересный сервер с активным сообществом.`)
      paragraphs.push(`Даже после старта можно успешно влиться в игру. Изучите онлайн и отзывы, чтобы выбрать стабильный проект.`)
    }

    paragraphs.push(`На L2GM вы найдёте серверы разных хроник и рейтов. Используйте календарь для поиска проектов на конкретную дату или фильтры для более точного подбора.`)

    return paragraphs.join('\n\n')
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
    generateDateSeoText,
    getCanonicalUrl
  }
}
