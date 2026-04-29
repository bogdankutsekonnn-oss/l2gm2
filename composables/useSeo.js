import chroniclesData from '~/data/chronicles.json'
import ratesData from '~/data/rates.json'

export const useSeo = () => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://l2gm.com'

  // Получить SEO-название хроники (с "с дополнениями" вместо "+")
  const getChronicleSeoName = (chronicle) => {
    return chronicle?.seoName || chronicle?.name || ''
  }

  // Получить русское название хроники
  const getChronicleSeoNameRu = (chronicle) => {
    return chronicle?.seoNameRu || chronicle?.nameRu || ''
  }

  // Короткое название для title (до 70 символов)
  const getChronicleTitleName = (chronicle) => {
    return chronicle?.titleName || chronicle?.name || ''
  }
  const getChronicleTitleNameRu = (chronicle) => {
    return chronicle?.titleNameRu || chronicle?.nameRu || ''
  }

  // Склейка "Interlude (Интерлюд)" для description (длинная форма)
  const getChronicleFullName = (chronicle) => {
    const en = getChronicleSeoName(chronicle)
    const ru = getChronicleSeoNameRu(chronicle)
    return ru ? `${en} (${ru})` : en
  }

  // Склейка для title (короткая форма)
  const getChronicleTitleFull = (chronicle) => {
    const en = getChronicleTitleName(chronicle)
    const ru = getChronicleTitleNameRu(chronicle)
    return ru ? `${en} (${ru})` : en
  }

  const generateTitle = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Сервера Л2 ${getChronicleTitleFull(chronicle)} ${rateName} — анонсы 2026 | L2GM`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Сервера Lineage 2 ${getChronicleTitleFull(chronicle)} — анонсы Л2 | L2GM`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Сервера Lineage 2 ${rateName} — список серверов Л2 ${rateName} | L2GM`
    }
    return 'Сервера Lineage 2 2026 — анонсы, даты старта, список новых Л2 | L2GM'
  }

  const generateH1 = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Сервера Lineage 2 ${getChronicleSeoName(chronicle)} ${rateName}`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      return `Сервера Lineage 2 ${getChronicleSeoName(chronicle)}`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Сервера Lineage 2 с рейтами ${rateName}`
    }
    return 'Новые сервера Lineage 2 — анонсы, даты старта, рейты'
  }

  const generateDescription = (filters = {}) => {
    if (filters.chronicle && filters.rate) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      const ru = getChronicleSeoNameRu(chronicle)
      return `Сервера Lineage 2 ${getChronicleSeoName(chronicle)} ${rateName} 2026 — анонсы и даты открытия. Список новых Л2${ru ? ' ' + ru : ''} ${rateName} с описанием и онлайном на L2GM!`
    } else if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      const ru = getChronicleSeoNameRu(chronicle)
      return `Новые сервера Lineage 2 ${getChronicleSeoName(chronicle)} с рейтами x1, x10, x50, x100, x1200. Анонсы Л2${ru ? ' ' + ru : ''} — PvP, Craft, Low Rate. Даты открытия на L2GM!`
    } else if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      return `Сервера Lineage 2 с рейтами ${rateName} — анонсы новых Л2 ${rateName} всех хроник: Interlude, High Five, Classic, Essence. Даты старта на L2GM!`
    }
    return 'Анонсы серверов Lineage 2 2026 с датами старта. Новые сервера Л2 всех хроник и рейтов — Interlude, High Five, Essence. Выбирай лучший проект на L2GM!'
  }

  // Генерация ключевых слов
  const generateKeywords = (filters = {}) => {
    const keywords = [
      'lineage 2', 'l2', 'л2', 'ла2', 'линейдж 2', 'лайнейдж 2',
      'сервера lineage 2', 'серверы lineage 2', 'сервера л2', 'сервера ла2',
      'анонсы серверов lineage 2', 'анонсы л2', 'новые сервера',
      'даты открытия серверов', 'даты старта серверов l2', 'открытие сервера lineage 2',
      'старт серверов lineage 2', 'когда открывается сервер l2',
      'рейтинг серверов lineage 2', 'топ серверов l2', 'топ серверов lineage 2',
      'бесплатные сервера l2', 'приват сервера lineage 2'
    ]

    if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      if (chronicle) {
        const en = chronicle.name.toLowerCase()
        keywords.push(
          `lineage 2 ${en}`,
          `сервера lineage 2 ${en}`,
          `сервера ${en}`,
          `l2 ${en}`
        )
        if (chronicle.nameRu) {
          const ru = chronicle.nameRu.toLowerCase()
          keywords.push(
            `сервера л2 ${ru}`,
            `сервера ла2 ${ru}`,
            `л2 ${ru}`,
            `${ru} сервера`
          )
        }
      }
    }

    if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      keywords.push(
        `lineage 2 ${rateName}`,
        `сервера lineage 2 ${rateName}`,
        `сервера ${rateName}`,
        `л2 ${rateName}`,
        `сервера л2 ${rateName}`
      )
    }

    if (!filters.chronicle && !filters.rate) {
      keywords.push(
        'interlude', 'интерлюд', 'high five', 'хай файв',
        'essence', 'эссенс', 'classic', 'классик',
        'открытие сервера', 'анонсы л2', 'приват сервера lineage 2'
      )
    }

    return [...new Set(keywords)].join(', ')
  }

  // Описания для разных хроник
  const chronicleDescriptions = {
    'interlude': 'Interlude — золотая эпоха Lineage 2, завоевавшая сердца миллионов игроков. Эта хроника славится идеальным балансом классов, атмосферным PvP и незабываемыми осадами замков. Здесь сформировались легендарные кланы и прошли самые эпичные битвы в истории игры.',
    'high-five': 'High Five — вершина развития классического Lineage 2 с максимальным количеством контента. Развитая система подклассов, множество эпических боссов, территориальные войны и огромный выбор экипировки. Идеальный баланс между сложностью и доступностью.',
    'c4': 'C4 (Scions of Destiny) — легендарная хроника для настоящих хардкорщиков. Сложная прокачка, ценность каждого уровня, олдскульная механика крафта и PvP без компромиссов. Если вы помните времена, когда 76 уровень был пределом мечтаний — эта хроника для вас.',
    'gracia-final': 'Gracia Final — хроника, объединившая лучшее из классики и современности. Обновлённая графика, новые локации, система трансформаций и улучшенный интерфейс. Отличный выбор для тех, кто хочет классический геймплей в современной обёртке.',
    'gracia-epilogue': 'Gracia Epilogue — финальная глава саги Gracia с полным набором контента. Территория Hellbound, новые рейдбоссы, улучшенная система олимпиады и множество квестов. Одна из самых насыщенных хроник в истории Lineage 2.',
    'epilogue': 'Epilogue — завершение классической эпохи Lineage 2. Максимум контента, все классы, полная система подклассов и certification skills. Для тех, кто хочет получить полный классический опыт игры.',
    'freya': 'Freya — хроника с обновлённой боевой системой и впечатляющим контентом. Ледяная королева Freya, новые инстансы, улучшенные осады и Territory War. Динамичный геймплей для любителей активного PvE и PvP.',
    'goddess-of-destruction': 'Goddess of Destruction — революционное обновление с системой пробуждения классов (Awakening). Новая система скилов, переработанный баланс и свежий взгляд на привычную игру. Для тех, кто готов к переменам.',
    'classic': 'Classic — возвращение к истокам Lineage 2 в официальном исполнении. Хардкорная прокачка, баланс ранних хроник и ностальгическая атмосфера. Идеально для ветеранов и тех, кто хочет почувствовать дух оригинальной игры.',
    'essence': 'Essence — современная интерпретация Lineage 2 с ускоренным геймплеем. Быстрая прокачка, удобный интерфейс, авто-охота и фокус на PvP контенте. Для занятых игроков, которые ценят своё время.',
  }

  // Описания для разных рейтов
  const rateDescriptions = {
    'low': 'Лоу рейт сервера (x1-x15) — настоящий хардкор для ценителей. Каждый уровень здесь — маленькая победа, а топовая экипировка — результат месяцев упорного труда. На таких серверах формируются крепкие кланы, где каждый игрок на счету. Экономика стабильна, а PvP имеет реальные последствия. Если вы готовы вложить время и получить незабываемый опыт — лоу рейт ваш выбор.',
    'mid': 'Мид рейт сервера (x15-x100) — золотая середина мира Lineage 2. Комфортная прокачка без утомительного гринда, но с сохранением ценности достижений. Вы успеете насладиться всеми этапами игры: от первых шагов в Talking Island до эпических осад. Оптимальный выбор для игроков с ограниченным временем, которые не хотят жертвовать глубиной геймплея.',
    'high': 'PvP сервера (x100+) — чистый экшен без лишних прелюдий. Быстрый старт, топовая экипировка в первые дни и сразу в бой! Идеально для любителей PvP, осад и клановых войн. Если вы цените динамику и хотите сразу окунуться в эндгейм контент — PvP рейты созданы для вас.',
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
    const chronicleSeoName = getChronicleSeoName(chronicle)
    const rate = filters.rate ? ratesData.find(r => r.slug === filters.rate) : null
    const rateName = rate?.name || filters.rate
    const rateType = getRateType(filters.rate)

    // Вступительный абзац
    if (chronicle && rate) {
      paragraphs.push(`Ищете сервер Lineage 2 ${chronicleSeoName} с рейтами ${rateName}? На этой странице собраны актуальные анонсы проектов с проверенным качеством и стабильным онлайном. L2GM ежедневно обновляет информацию, чтобы вы видели только действующие сервера.`)
    } else if (chronicle) {
      paragraphs.push(`На этой странице собраны все актуальные сервера Lineage 2 на хронике ${chronicleSeoName} — от лоу рейтов до хай рейтов, от хардкорных PvP проектов до уютных PvE серверов.`)
    } else if (rate) {
      paragraphs.push(`Сервера Lineage 2 с рейтами ${rateName} — выбор игроков, которые точно знают, какой темп игры им подходит. В этом разделе собраны проекты всех популярных хроник: Interlude, High Five, Essence и другие.`)
    } else {
      paragraphs.push(`L2GM — портал анонсов серверов Lineage 2. Мы помогаем игрокам найти подходящий сервер среди сотен проектов. Здесь собраны сервера всех хроник — от легендарного Interlude (Интерлюд) до современного Essence (Эссенс), от хардкорных x1 до динамичных x10000.`)
    }

    // Описание хроники
    if (chronicle && chronicleDescriptions[chronicle.slug]) {
      paragraphs.push(chronicleDescriptions[chronicle.slug])
    }

    // Описание рейтов
    if (rateType && rateDescriptions[rateType]) {
      paragraphs.push(rateDescriptions[rateType])
    }

    // Блок про качество
    paragraphs.push(`В верхней части списка закреплены Премиум сервера — проекты с подтверждённой репутацией, стабильным онлайном и активным сообществом. Выбирая сервер с Premium-статусом, вы получаете гарантию качественной игры.`)

    // Блок о разнообразии серверов (только для главной)
    if (!chronicle && !rate) {
      paragraphs.push(`На L2GM представлено всё многообразие серверов Lineage 2: классические PvE проекты, PvP сервера, Craft-ориентированные проекты, а также сервера с уникальными концепциями — GvE, RvR, мультипрофа и кастомные.`)
    }

    // Блок про удобство поиска
    if (chronicle || rate) {
      paragraphs.push(`Используйте фильтры для точного поиска: выберите хронику, диапазон рейтов или дату открытия. Календарь покажет все ближайшие старты, чтобы вы могли спланировать возвращение в мир Lineage 2.`)
    } else {
      paragraphs.push(`Фильтруйте сервера по хроникам, рейтам или датам открытия. Каждый анонс содержит подробную информацию: хроника, рейты, особенности и дата старта.`)
    }

    // Призыв к действию
    if (chronicle && rate) {
      paragraphs.push(`Раздел ${chronicleSeoName} ${rateName} регулярно пополняется новыми проектами. Добавьте страницу в закладки, чтобы не пропустить старт интересного сервера.`)
    } else if (chronicle) {
      paragraphs.push(`Сервера ${chronicleSeoName} — это особенная атмосфера и преданное сообщество. Следите за обновлениями, чтобы не пропустить открытие нового проекта на любимой хронике.`)
    } else if (rate) {
      paragraphs.push(`Сервера с рейтами ${rateName} стартуют регулярно. Следите за календарём открытий и выбирайте проекты, которые подходят именно вам.`)
    } else {
      paragraphs.push(`L2GM обновляется ежедневно. Заходите к нам регулярно, следите за анонсами и находите сервера, которые подходят именно вам. Приятной игры!`)
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

    const weekDays = [
      'воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'
    ]

    const [year, month, day] = dateString.split('-').map(Number)
    const formattedDate = `${day} ${months[month - 1]} ${year}`
    const targetDate = new Date(year, month - 1, day)
    const weekDay = weekDays[targetDate.getDay()]

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    targetDate.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      paragraphs.push(`Сегодня, ${formattedDate}, открываются новые сервера Lineage 2! Это ваш шанс начать игру с первого дня вместе с тысячами других игроков. Старт на новом сервере — уникальная возможность: все на равных, экономика чистая, а клановые войны только начинаются.`)
      paragraphs.push(`Сервера, стартующие сегодня, собирают максимальный онлайн в первые часы после открытия. Именно сейчас формируются топовые кланы и закладываются основы будущих альянсов. Присоединяйтесь к сообществу и займите своё место в новом мире Lineage 2!`)
      paragraphs.push(`Совет от L2GM: изучите особенности каждого сервера перед выбором. Обратите внимание на хронику, рейты, наличие доната и специальные условия старта. Удачного открытия!`)
    } else if (diffDays === 1) {
      paragraphs.push(`Завтра, ${formattedDate}, стартуют новые сервера Lineage 2! Самое время подготовиться к открытию: изучите информацию о проектах, выберите класс и соберите пати. Заранее спланированный старт — залог успешной игры.`)
      paragraphs.push(`Начать играть с первого дня сервера — это возможность оказаться в числе лидеров. Пока другие раскачиваются, вы уже будете строить клан, захватывать споты и готовиться к первым осадам. Не откладывайте подготовку на последний момент!`)
      paragraphs.push(`На этой странице собраны все сервера Lineage 2, открывающиеся завтра. Информация обновляется регулярно — добавляйте страницу в закладки, чтобы не пропустить важные детали.`)
    } else if (diffDays > 1 && diffDays <= 7) {
      paragraphs.push(`В ${weekDay}, ${formattedDate}, запланировано открытие серверов Lineage 2. До старта осталось ${diffDays} ${diffDays === 2 || diffDays === 3 || diffDays === 4 ? 'дня' : 'дней'} — достаточно времени, чтобы изучить проекты, найти клан и подготовиться к игре.`)
      paragraphs.push(`Сервера, открывающиеся в ближайшие дни, уже набирают аудиторию. На форумах обсуждаются планы на старт, формируются группы и альянсы. Присоединяйтесь к обсуждениям, чтобы найти единомышленников!`)
      paragraphs.push(`Следите за обновлениями — информация о серверах может дополняться. На L2GM вы всегда найдёте актуальные данные о предстоящих открытиях.`)
    } else if (diffDays > 7) {
      paragraphs.push(`${formattedDate} состоится открытие серверов Lineage 2. Хотя до старта ещё есть время, уже сейчас можно изучить проекты и выбрать подходящий. Чем раньше вы определитесь, тем лучше подготовитесь.`)
      paragraphs.push(`Анонсы серверов на эту дату могут обновляться — администрации проектов постепенно раскрывают детали. Добавьте страницу в закладки и возвращайтесь ближе к дате, чтобы узнать все подробности.`)
    } else {
      paragraphs.push(`${formattedDate} состоялось открытие серверов Lineage 2. Многие проекты всё ещё активны и продолжают набирать игроков — возможно, среди них есть сервер, который вам подойдёт.`)
      paragraphs.push(`Начинать играть на сервере после старта — нормальная практика. Главное — выбрать стабильный проект с активным онлайном и дружелюбным сообществом. Изучите информацию о серверах и присоединяйтесь к игре!`)
      paragraphs.push(`Если вы ищете сервер с более ранним стартом, используйте календарь L2GM для поиска проектов на нужную дату.`)
    }

    paragraphs.push(`L2GM — актуальный рейтинг серверов Lineage 2 с удобным календарём открытий. Выбирайте сервера по хроникам, рейтам или датам старта. Желаем вам найти идеальный проект и получить удовольствие от игры!`)

    return paragraphs.join('\n\n')
  }

  const getCanonicalUrl = (path) => {
    // Ensure trailing slash for canonical URLs
    const normalizedPath = path.endsWith('/') || path === '/' ? path : path + '/'
    return `${siteUrl}${normalizedPath}`
  }

  // JSON-LD разметка для главной страницы
  const generateHomeJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'L2GM',
      description: 'Анонсы серверов Lineage 2 всех хроник и рейтов',
      url: siteUrl,
      inLanguage: 'ru',
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
      inLanguage: 'ru',
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
      sameAs: [
        'https://t.me/DamonLaptev'
      ]
    }
  }

  // JSON-LD BreadcrumbList
  const generateBreadcrumbJsonLd = (items = []) => {
    // items: [{ name: 'Главная', url: '/' }, { name: 'Interlude', url: '/chronicle/interlude' }]
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: getCanonicalUrl(item.url)
      }))
    }
  }

  // JSON-LD CollectionPage для страниц с фильтрами
  const generateCollectionPageJsonLd = (title, description, path, servers = []) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: description,
      url: getCanonicalUrl(path),
      inLanguage: 'ru',
      isPartOf: {
        '@type': 'WebSite',
        name: 'L2GM',
        url: siteUrl
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: servers.length,
        itemListElement: servers.slice(0, 10).map((server, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Event',
            name: `Открытие сервера ${server.name}`,
            description: `Lineage 2 ${server.chronicle || ''}, рейты: x${server.rate || ''}`,
            startDate: server.startDate,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            location: {
              '@type': 'VirtualLocation',
              url: server.url || siteUrl
            }
          }
        }))
      }
    }
  }

  // JSON-LD Event разметка для серверов (как у L2-Top)
  const generateServerEventsJsonLd = (servers = []) => {
    const events = servers.slice(0, 10).map(server => ({
      '@type': 'Event',
      name: `Открытие сервера ${server.name}`,
      description: `Запуск сервера Lineage 2 ${server.name}. Хроника: ${server.chronicle}, рейты: ${server.rate}`,
      startDate: server.startDate,
      endDate: server.startDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      location: {
        '@type': 'VirtualLocation',
        url: server.url || siteUrl
      },
      organizer: {
        '@type': 'Organization',
        name: server.name,
        url: server.url || siteUrl
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'RUB',
        availability: 'https://schema.org/InStock',
        url: server.url || siteUrl
      }
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: events.map((event, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: event
      }))
    }
  }

  // JSON-LD ImageObject для превью
  const generateImageJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      url: `${siteUrl}/og-image.jpg`,
      width: 1200,
      height: 630,
      caption: 'L2GM - Анонсы серверов Lineage 2'
    }
  }

  // OG и Twitter мета-теги (общие для всех страниц)
  const getOgImageMeta = () => {
    const ogImageUrl = `${siteUrl}/og-image.jpg`
    return [
      { property: 'og:image', content: ogImageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: ogImageUrl },
    ]
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
        { property: 'og:site_name', content: 'L2GM' },
        ...getOgImageMeta(),

        // Twitter
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ]
    }
  }

  // =====================
  // FAQ генерация
  // =====================

  const chronicleFaqDescriptions = {
    'interlude': 'Interlude — золотая эпоха Lineage 2 с идеальным балансом классов, атмосферным PvP и легендарными осадами замков.',
    'interlude-plus': 'Interlude с дополнениями — расширенная версия Interlude с дополнительным контентом, новыми зонами и улучшенным балансом.',
    'high-five': 'High Five — вершина классической Lineage 2 с максимальным контентом, подклассами, территориальными войнами и огромным выбором экипировки.',
    'high-five-plus': 'High Five с дополнениями — расширенная версия High Five с дополнительным контентом и улучшениями.',
    'c4': 'C4 (Scions of Destiny) — хардкорная хроника с олдскульной механикой, сложной прокачкой и ценностью каждого уровня.',
    'classic': 'Classic — возвращение к истокам Lineage 2 с хардкорной прокачкой и ностальгической атмосферой ранних хроник.',
    'essence': 'Essence — современная версия Lineage 2 с быстрой прокачкой, авто-охотой и фокусом на PvP контенте.',
    'epilogue': 'Epilogue — завершение классической эпохи с максимумом контента, всеми классами и полной системой подклассов.',
    'crusade': 'Crusade — одна из ранних хроник Lineage 2 с уникальной атмосферой и классическим геймплеем.',
  }

  const rateRangeDescriptions = {
    'low': { range: 'x1–x15', desc: 'хардкорная прокачка, стабильная экономика и крепкие кланы' },
    'mid': { range: 'x15–x100', desc: 'комфортный темп без гринда с сохранением глубины геймплея' },
    'high': { range: 'x100+', desc: 'быстрый старт, мгновенный доступ к эндгейму и чистый PvP' },
  }

  const generateFaqItems = (filters = {}) => {
    const items = []
    const chronicle = filters.chronicle ? chroniclesData.find(c => c.slug === filters.chronicle) : null
    const chronicleName = getChronicleSeoName(chronicle)
    const chronicleNameRu = getChronicleSeoNameRu(chronicle)
    const rate = filters.rate ? ratesData.find(r => r.slug === filters.rate) : null
    const rateName = rate?.name || filters.rate || ''
    const rateType = getRateType(filters.rate)
    const rateInfo = rateType ? rateRangeDescriptions[rateType] : null
    const chronicleDesc = chronicle ? (chronicleFaqDescriptions[chronicle.slug] || '') : ''

    if (chronicle && rate) {
      // Combo: chronicle + rate
      items.push({
        question: `Какие сервера Lineage 2 ${chronicleName} ${rateName} открываются в 2026 году?`,
        answer: `На L2GM собраны все актуальные анонсы серверов ${chronicleName} с рейтами ${rateName}. Список обновляется ежедневно — вы видите только серверы, которые откроются в ближайшие 30 дней или уже недавно стартовали.`
      })
      items.push({
        question: `Чем отличается ${chronicleName} ${rateName} от других комбинаций?`,
        answer: `${chronicleDesc} Рейт ${rateName} определяет скорость прокачки: ${rateInfo ? rateInfo.desc : 'баланс между скоростью и хардкором'}. Именно эта комбинация хроники и рейта подходит игрокам, которые ценят ${rateType === 'low' ? 'хардкорный геймплей на классической хронике' : rateType === 'high' ? 'динамичный PvP на проверенной хронике' : 'комфортный темп на любимой хронике'}.`
      })
      items.push({
        question: `Как выбрать лучший сервер ${chronicleName} ${rateName}?`,
        answer: `Обратите внимание на серверы со статусом Premium и VIP — это проекты с подтверждённой репутацией. Также смотрите на дату старта: серверы, открывающиеся в ближайшие дни, обычно собирают максимальный онлайн.`
      })
      items.push({
        question: `Что означает рейт ${rateName} на сервере ${chronicleName}?`,
        answer: `Рейт ${rateName} означает, что опыт, адена и дроп увеличены в ${rateName.replace('x', '')} раз по сравнению с официальным сервером. ${rateInfo ? `Серверы с рейтами ${rateInfo.range} — это ${rateInfo.desc}.` : ''}`
      })
    } else if (chronicle) {
      // Only chronicle
      items.push({
        question: `Какие сервера Lineage 2 ${chronicleName} открываются в 2026 году?`,
        answer: `На L2GM представлены все серверы ${chronicleName} с актуальными датами открытия. ${chronicleDesc} Используйте фильтры по рейтам для точного подбора.`
      })
      items.push({
        question: `Чем ${chronicleName} отличается от других хроник Lineage 2?`,
        answer: chronicleDesc || `${chronicleName} — одна из популярных хроник Lineage 2, каждая из которых предлагает уникальный игровой опыт с собственным балансом и контентом.`
      })
      items.push({
        question: `Какие рейты популярны на серверах ${chronicleName}?`,
        answer: `На серверах ${chronicleName} встречаются все типы рейтов: от хардкорных x1–x3 до PvP-серверов x1000+. Наиболее популярны x1–x10 (лоу рейт) и x50–x100 (мид рейт). Используйте фильтр «Подобрать сервер» на этой странице для выбора нужного рейта.`
      })
      items.push({
        question: `Как добавить свой сервер ${chronicleName} на L2GM?`,
        answer: `Перейдите на страницу «Добавить сервер» и заполните форму. Базовое размещение бесплатное. Для выделения в списке доступны статусы Premium и VIP — подробности на странице «Реклама».`
      })
      if (chronicleNameRu) {
        items.push({
          question: `${chronicleNameRu} — это то же самое, что ${chronicleName}?`,
          answer: `Да, ${chronicleNameRu} — это русское название хроники ${chronicleName} в Lineage 2. На L2GM вы найдёте серверы по обоим названиям.`
        })
      }
    } else if (rate) {
      // Only rate
      items.push({
        question: `Что означает рейт ${rateName} на серверах Lineage 2?`,
        answer: `Рейт ${rateName} означает, что скорость получения опыта, адены и дропа увеличена в ${rateName.replace('x', '')} раз. ${rateInfo ? `Серверы ${rateInfo.range} — это ${rateInfo.desc}.` : ''}`
      })
      items.push({
        question: `Какие хроники доступны с рейтами ${rateName}?`,
        answer: `Серверы ${rateName} доступны на всех популярных хрониках: Interlude, High Five, Classic, Essence и других. Используйте фильтр хроник на этой странице, чтобы выбрать нужную.`
      })
      items.push({
        question: `Для кого подходят серверы с рейтами ${rateName}?`,
        answer: rateInfo ? `Серверы ${rateInfo.range} подходят игрокам, которые ценят ${rateInfo.desc}. ${rateType === 'low' ? 'Здесь каждый уровень — маленькая победа, а топовая экипировка — результат месяцев игры.' : rateType === 'high' ? 'Это идеальный выбор для PvP-ориентированных игроков.' : 'Это золотая середина между хардкором и казуальным геймплеем.'}` : `Серверы ${rateName} подойдут игрокам, которые ищут определённый темп прокачки в Lineage 2.`
      })
      items.push({
        question: `Как часто появляются новые серверы Lineage 2 ${rateName}?`,
        answer: `Новые серверы с рейтами ${rateName} появляются регулярно. L2GM обновляется ежедневно — добавьте страницу в закладки, чтобы не пропустить интересный проект.`
      })
    } else {
      // Home page
      items.push({
        question: 'Что такое L2GM и как выбрать сервер Lineage 2?',
        answer: 'L2GM — это портал анонсов серверов Lineage 2 с ежедневным обновлением. Здесь собраны серверы всех хроник и рейтов с датами открытия. Используйте фильтры по хроникам и рейтам или календарь для поиска подходящего проекта.'
      })
      items.push({
        question: 'Какие хроники Lineage 2 самые популярные в 2026 году?',
        answer: 'Наиболее популярные хроники: Interlude (Интерлюд) — золотой стандарт PvP, High Five (Хай Файв) — максимум PvE контента, Essence (Эссенс) — современный ускоренный геймплей, Classic (Классик) — хардкорная ностальгия. Каждая хроника представлена на L2GM с актуальными серверами.'
      })
      items.push({
        question: 'Что означают рейты x1, x50, x1200 на серверах?',
        answer: 'Рейт — это множитель скорости прокачки. x1 — официальный темп (хардкор), x50 — комфортная середина, x1200+ — мгновенный доступ к эндгейму и PvP. Чем выше рейт, тем быстрее вы достигнете максимального уровня.'
      })
      items.push({
        question: 'Что такое Premium и VIP статус серверов на L2GM?',
        answer: 'Premium и VIP — это статусы платного размещения. Серверы с этими статусами закреплены в верхней части списка и выделены визуально. Это проекты с подтверждённой репутацией и стабильным онлайном.'
      })
      items.push({
        question: 'Как добавить свой сервер Lineage 2 на L2GM?',
        answer: 'Перейдите на страницу «Добавить сервер», заполните форму с данными о проекте. Базовое размещение бесплатное. Для выделения в списке доступны статусы Premium ($19/мес) и VIP ($9/мес) — подробности на странице «Реклама».'
      })
    }

    return items
  }

  // JSON-LD FAQPage schema
  const generateFaqJsonLd = (faqItems) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
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
    getOgImageMeta,
    generateHomeJsonLd,
    generateServerListJsonLd,
    generateOrganizationJsonLd,
    generateServerEventsJsonLd,
    generateImageJsonLd,
    generateBreadcrumbJsonLd,
    generateCollectionPageJsonLd,
    generateFullMeta,
    generateFaqItems,
    generateFaqJsonLd,
  }
}
