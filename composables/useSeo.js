import chroniclesData from '~/data/chronicles.json'
import ratesData from '~/data/rates.json'

export const useSeo = () => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://l2gm.com'

  const generateTitle = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Серверы Lineage 2 ${chronicle?.name || ''} ${rateName} | L2GM`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Серверы Lineage 2 ${chronicle?.name || ''} | L2GM`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Серверы Lineage 2 ${rateName} | L2GM`
    }
    return 'Анонсы серверов Lineage 2 | L2GM'
  }

  const generateH1 = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Серверы Lineage 2 ${chronicle?.name || ''} ${rateName}`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Серверы Lineage 2 ${chronicle?.name || ''}`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Серверы Lineage 2 ${rateName}`
    }
    return 'Анонсы серверов Lineage 2'
  }

  const generateDescription = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Новые серверы Lineage 2 ${chronicle?.name || ''} с рейтами ${rateName}. Актуальный список анонсов с датами открытия. Выбирайте лучший сервер л2!`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Серверы Lineage 2 ${chronicle?.name || ''} - полный список анонсов. Новые проекты с актуальными датами открытия и онлайном.`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Серверы Lineage 2 с рейтами ${rateName}. Анонсы новых проектов всех хроник с датами старта.`
    }
    return 'L2GM - актуальные анонсы серверов Lineage 2. Новые серверы л2 всех хроник и рейтов с датами открытия. Найдите идеальный сервер!'
  }

  // Генерация ключевых слов
  const generateKeywords = (filters = {}) => {
    const baseKeywords = ['lineage 2', 'л2', 'сервера lineage 2', 'анонсы серверов', 'новые серверы l2']

    if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      if (chronicle) {
        baseKeywords.push(
          `lineage 2 ${chronicle.name.toLowerCase()}`,
          `сервер л2 ${chronicle.name.toLowerCase()}`,
          `${chronicle.name.toLowerCase()} сервер`
        )
      }
    }

    if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      baseKeywords.push(
        `сервер л2 ${rateName}`,
        `lineage 2 ${rateName}`,
        `${rateName} сервер`
      )
    }

    return baseKeywords.join(', ')
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

    if (rateSlug.includes('-')) {
      const parts = rateSlug.split('-')
      const max = parseInt(parts[1].replace('x', ''))
      if (max <= 20) return 'low'
      if (max <= 100) return 'mid'
      return 'high'
    }

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

    if (chronicle && rate) {
      paragraphs.push(`Ищете сервер Lineage 2 ${chronicle.name} с рейтами ${rateName}? На L2GM собраны лучшие проекты с проверенным качеством и стабильным онлайном. Мы ежедневно обновляем список анонсов, чтобы вы всегда были в курсе новых открытий.`)
    } else if (chronicle) {
      paragraphs.push(`Добро пожаловать в раздел серверов Lineage 2 ${chronicle.name}! Здесь вы найдёте актуальные анонсы проектов на этой хронике с разными рейтами и особенностями. Выбирайте сервер по душе и начинайте приключение.`)
    } else if (rate) {
      paragraphs.push(`Серверы Lineage 2 с рейтами ${rateName} — отличный выбор для игроков, которые знают чего хотят. В этом разделе собраны проекты разных хроник с указанными рейтами.`)
    } else {
      paragraphs.push(`L2GM — ваш надёжный гид в мире серверов Lineage 2. Мы собрали анонсы лучших проектов всех хроник и рейтов, чтобы вы могли легко найти идеальный сервер для игры.`)
    }

    if (chronicle && chronicleDescriptions[chronicle.slug]) {
      paragraphs.push(chronicleDescriptions[chronicle.slug])
    }

    if (rateType && rateDescriptions[rateType]) {
      paragraphs.push(rateDescriptions[rateType])
    }

    paragraphs.push(`В верхней части списка закреплены Премиум серверы — это проекты с гарантированным качеством, стабильной работой и активным сообществом. Выбирая такой сервер, вы получаете уверенность в долгосрочной игре.`)

    if (chronicle || rate) {
      paragraphs.push(`Используйте фильтры для более точного поиска: выберите нужную хронику, диапазон рейтов или конкретную дату открытия. Календарь поможет найти серверы, стартующие в удобное для вас время.`)
    } else {
      paragraphs.push(`Удобная система фильтров поможет быстро найти подходящий проект. Выбирайте по хроникам, рейтам или дате открытия. Календарь покажет все ближайшие старты серверов.`)
    }

    paragraphs.push(`На L2GM представлены серверы различных направлений: классические PvE проекты для любителей прокачки, динамичные PvP серверы для ценителей сражений, а также GvE, RvR, мультипрофа и другие интересные концепции.`)

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

  const getCanonicalUrl = (path) => {
    return `${siteUrl}${path}`
  }

  // JSON-LD разметка для главной страницы
  const generateHomeJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'L2GM',
      description: 'Анонсы серверов Lineage 2 всех хроник и рейтов',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  }

  // JSON-LD разметка для страницы списка серверов
  const generateServerListJsonLd = (filters = {}, servers = []) => {
    const title = generateTitle(filters)
    const description = generateDescription(filters)

    let path = '/'
    if (filters.chronicle && filters.rate) {
      path = `/chronicle/${filters.chronicle}/rate/${filters.rate}`
    } else if (filters.chronicle) {
      path = `/chronicle/${filters.chronicle}`
    } else if (filters.rate) {
      path = `/rate/${filters.rate}`
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: description,
      url: getCanonicalUrl(path),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: servers.length,
        itemListElement: servers.slice(0, 10).map((server, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'VideoGame',
            name: server.name,
            url: server.url,
            genre: 'MMORPG',
            gamePlatform: 'PC'
          }
        }))
      }
    }
  }

  // JSON-LD для организации
  const generateOrganizationJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'L2GM',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description: 'Портал анонсов серверов Lineage 2',
      sameAs: []
    }
  }

  // Полная SEO мета-разметка для страницы
  const generateFullMeta = (filters = {}, path = '/') => {
    const title = generateTitle(filters)
    const description = generateDescription(filters)
    const keywords = generateKeywords(filters)
    const canonicalUrl = getCanonicalUrl(path)

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },

        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: 'website' },

        // Twitter
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ]
    }
  }

  return {
    generateTitle,
    generateH1,
    generateDescription,
    generateKeywords,
    generateSeoText,
    generateDateSeoText,
    getCanonicalUrl,
    generateHomeJsonLd,
    generateServerListJsonLd,
    generateOrganizationJsonLd,
    generateFullMeta
  }
}
