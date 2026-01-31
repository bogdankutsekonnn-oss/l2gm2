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
    // Базовые высокочастотные ключевые слова из статистики Яндекс Вордстат
    const baseKeywords = [
      // Топ запросы (48000+ запросов)
      'ла2', 'л2', 'lineage 2', 'l2',
      'сервера л2', 'сервера ла2', 'lineage 2 сервера',
      // Высокочастотные (1000+ запросов)
      'л2 топ', 'ла2 топ', 'l2 top', 'топ серверов л2',
      'новые сервера л2', 'новые сервера ла2', 'анонсы серверов л2',
      'открытие серверов л2', 'рейтинг серверов л2',
      // Хроники (2000+ запросов)
      'л2 интерлюд', 'ла2 интерлюд', 'lineage 2 interlude',
      'л2 хф', 'ла2 хф', 'lineage 2 high five',
      'л2 эссенс', 'ла2 эссенс', 'lineage 2 essence',
      // Популярные запросы (500+ запросов)
      'сайты л2', 'сайты lineage 2',
      'лучшие сервера л2', 'пвп сервера л2',
      'сервера л2 мультипрофа', 'онлайн серверов л2'
    ]

    // Ключевые слова для конкретных хроник (из Вордстат)
    const chronicleKeywords = {
      'interlude': [
        'л2 интерлюд', 'ла2 интерлюд', 'интерлюд',
        'lineage 2 interlude', 'lineage 2 interlude сервера',
        'сервера интерлюд', 'сервера л2 интерлюд', 'сервера ла2 интерлюд',
        'новые сервера л2 интерлюд', 'топ сервера л2 интерлюд',
        'пвп сервера л2 интерлюд', 'линейдж интерлюд', 'линейдж 2 интерлюд'
      ],
      'high-five': [
        'л2 хф', 'ла2 хф', 'л2 high five', 'lineage 2 high five',
        'сервера л2 хф', 'сервера л2 high five', 'lineage 2 high',
        'хай файв л2', 'high five сервер'
      ],
      'essence': [
        'л2 эссенс', 'ла2 эссенс', 'l2 essence', 'lineage 2 essence',
        'сервера л2 эссенс', 'эссенс сервер'
      ],
      'classic': [
        'л2 классик', 'ла2 классик', 'l2 classic', 'lineage 2 classic',
        'классик сервер', 'сервера л2 классик'
      ],
      'c4': ['л2 с4', 'l2 c4', 'lineage 2 c4', 'chronicles 4'],
      'gracia-final': ['л2 грация', 'gracia final', 'l2 gracia'],
      'freya': ['л2 фрея', 'l2 freya', 'lineage 2 freya'],
      'epilogue': ['л2 эпилог', 'l2 epilogue', 'epilogue сервер'],
    }

    // Ключевые слова для рейтов
    const rateKeywords = {
      'low': ['лоу рейт л2', 'x1 сервер', 'хардкор л2', 'low rate l2', 'lineage 2 interlude x1'],
      'mid': ['мид рейт л2', 'средние рейты л2', 'mid rate l2'],
      'high': ['хай рейт л2', 'high rate l2', 'фан сервер л2'],
    }

    if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      if (chronicle) {
        baseKeywords.push(
          `lineage 2 ${chronicle.name.toLowerCase()}`,
          `сервер л2 ${chronicle.name.toLowerCase()}`,
          `${chronicle.name.toLowerCase()} сервер`,
          `л2 ${chronicle.name.toLowerCase()}`
        )
        // Добавляем специфичные ключи для хроники
        if (chronicleKeywords[chronicle.slug]) {
          baseKeywords.push(...chronicleKeywords[chronicle.slug])
        }
      }
    }

    if (filters.rate) {
      const rate = ratesData.find(r => r.slug === filters.rate)
      const rateName = rate?.name || filters.rate
      const rateType = getRateType(filters.rate)

      baseKeywords.push(
        `сервер л2 ${rateName}`,
        `lineage 2 ${rateName}`,
        `${rateName} сервер`
      )
      // Добавляем специфичные ключи для типа рейта
      if (rateType && rateKeywords[rateType]) {
        baseKeywords.push(...rateKeywords[rateType])
      }
    }

    // Убираем дубликаты
    const uniqueKeywords = [...new Set(baseKeywords)]
    return uniqueKeywords.join(', ')
  }

  // Описания для разных хроник (с ключевыми словами из Яндекс Вордстат)
  const chronicleDescriptions = {
    'interlude': 'Сервера ла2 интерлюд — это золотая эпоха Lineage 2, которая завоевала сердца миллионов игроков. Л2 интерлюд и lineage 2 interlude славятся идеальным балансом классов интерлюд, атмосферным интерлюде пвп и незабываемыми осадами замков. На сервера интерлюд сформировались легендарные кланы, здесь прошли самые эпичные битвы линейдж интерлюд. Ищете новые сервера л2 интерлюд или топ сервера л2 интерлюд? Выбирайте на L2GM!',
    'high-five': 'Сервера л2 хф (High Five) — вершина развития классического Lineage 2 с максимальным контентом. Л2 high five и lineage 2 high five предлагают развитую систему подклассов, множество эпических боссов, территориальные войны и огромный выбор сетов. Сервера л2 high five — идеальный баланс между сложностью и доступностью.',
    'c4': 'Сервера л2 C4 (Scions of Destiny) — легендарная хроника для настоящих хардкорщиков. Сложная прокачка, ценность каждого уровня л2, олдскульная механика крафта и PvP без компромиссов. Если вы помните времена, когда 76 лвл был пределом мечтаний — сервер л2 C4 для вас.',
    'gracia-final': 'Сервера л2 Gracia Final — хроника, объединившая лучшее из классики и современности. Обновлённая графика, новые локации Gracia, система трансформаций и улучшенный интерфейс. Отличный выбор для тех, кто хочет классический геймплей lineage 2 в современной обёртке.',
    'gracia-epilogue': 'Сервера л2 Gracia Epilogue — финальная глава саги Gracia с полным набором контента. Территория Hellbound, новые рейдбоссы, улучшенная система олимпиады и множество квестов л2. Одна из самых насыщенных хроник в истории Lineage 2.',
    'epilogue': 'Сервера л2 Epilogue — завершение классической эпохи Lineage 2. Максимум контента, все классы л2, полная система саба л2 и certification skills. Для тех, кто хочет получить полный классический опыт игры в линейдж.',
    'freya': 'Сервера л2 Freya — хроника с обновлённой боевой системой и впечатляющим контентом. Ледяная королева Freya, новые инстансы, улучшенные осады и Territory War. Динамичный геймплей для любителей активного PvE и PvP в lineage 2.',
    'goddess-of-destruction': 'Сервера л2 Goddess of Destruction — революционное обновление с пробуждением классов л2 (Awakening). Новая система скилов л2, переработанный баланс профы л2 и свежий взгляд на привычную игру. Для тех, кто готов к переменам.',
    'classic': 'Сервера л2 классик (Classic) — возвращение к истокам Lineage 2 в официальном исполнении. Хардкорная прокачка, классовый баланс ранних хроник и ностальгическая атмосфера. Сервера ла2 классик идеально для олдфагов и тех, кто хочет почувствовать дух оригинальной игры.',
    'essence': 'Сервера ла2 эссенс (Essence) — современная интерпретация Lineage 2 с ускоренным геймплеем. Быстрая прокачка, удобный интерфейс, авто-охота и фокус на PvP контенте. Lineage 2 essence и l2 essence — для занятых игроков, которые ценят своё время.',
  }

  // Описания для разных рейтов
  const rateDescriptions = {
    'low': 'Лоу рейт серверы (x1-x15) — настоящий хардкор для ценителей. Каждый уровень здесь — маленькая победа, а топовая экипировка — результат месяцев упорного труда. На таких серверах формируются крепкие кланы, где каждый игрок на счету. Экономика стабильна, а PvP имеет реальные последствия. Если вы готовы вложить время и получить незабываемый опыт — лоу рейт ваш выбор.',
    'mid': 'Мид рейт серверы (x15-x100) — золотая середина мира Lineage 2. Комфортная прокачка без утомительного гринда, но с сохранением ценности достижений. Вы успеете насладиться всеми этапами игры: от первых шагов в Talking Island до эпических осад. Оптимальный выбор для игроков с ограниченным временем, которые не хотят жертвовать глубиной геймплея.',
    'high': 'Хай рейт серверы (x100+) — чистый экшен без лишних прелюдий. Быстрый старт, топовая экипировка в первые дни и сразу в бой! Идеально для любителей PvP, осад и клановых войн. Если вы цените динамику и хотите сразу окунуться в эндгейм контент — хай рейты созданы для вас.',
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

    // Вступительный абзац
    if (chronicle && rate) {
      paragraphs.push(`Ищете сервер Lineage 2 ${chronicle.name} с рейтами ${rateName}? Вы попали по адресу! L2GM — это актуальный топ серверов л2 и ла2, где собраны лучшие сервера lineage 2 с проверенным качеством и стабильным онлайном. Мы ежедневно мониторим новые сервера л2, проверяем информацию и обновляем рейтинг серверов л2, чтобы вы всегда видели только актуальные проекты.`)
    } else if (chronicle) {
      paragraphs.push(`Добро пожаловать в раздел серверов Lineage 2 ${chronicle.name}! На этой странице собраны все актуальные анонсы серверов л2 на данной хронике — от лоу рейтов до хай рейтов, от хардкорных пвп сервера л2 до уютных PvE проектов. L2GM — один из лучших сайтов lineage 2 для поиска серверов ла2.`)
    } else if (rate) {
      paragraphs.push(`Сервера Lineage 2 с рейтами ${rateName} — выбор игроков, которые точно знают, какой темп игры им подходит. В этом разделе топ серверов л2 собраны проекты всех популярных хроник: ла2 интерлюд, л2 хф, ла2 эссенс и другие. Каждый сервер л2 проверен на актуальность.`)
    } else {
      paragraphs.push(`Добро пожаловать на L2GM — ваш надёжный топ серверов л2 и путеводитель в мире Lineage 2! Мы создали этот сайт lineage 2, чтобы помочь игрокам найти идеальный сервер среди сотен анонсов. Здесь собраны сервера ла2 всех хроник — от легендарного ла2 интерлюд до современного л2 эссенс, от хардкорных x1 до динамичных x10000.`)
    }

    // Описание хроники
    if (chronicle && chronicleDescriptions[chronicle.slug]) {
      paragraphs.push(chronicleDescriptions[chronicle.slug])
    }

    // Описание рейтов
    if (rateType && rateDescriptions[rateType]) {
      paragraphs.push(rateDescriptions[rateType])
    }

    // Блок про качество и проверку серверов
    paragraphs.push(`Почему тысячи игроков выбирают L2GM? Мы не просто собираем анонсы серверов л2 — мы следим за качеством. В верхней части рейтинга закреплены Премиум сервера ла2 — проекты с подтверждённой репутацией, стабильным онлайном серверов л2 и активным комьюнити. Выбирая сервер с Premium-статусом, вы получаете гарантию качественной игры без неприятных сюрпризов. Среди лучших серверов л2 вы найдёте проекты на любой вкус.`)

    // Блок о разнообразии серверов
    if (!chronicle && !rate) {
      paragraphs.push(`На L2GM представлено всё многообразие серверов Lineage 2. Здесь вы найдёте сервера ла2 интерлюд для ценителей классики, л2 хф и lineage 2 high five для любителей максимального контента, ла2 эссенс для динамичного геймплея. Классические PvE проекты, хардкорные пвп сервера л2, Craft-ориентированные проекты, а также уникальные концепции: GvE, RvR, сервера л2 мультипрофа и кастомные серверы.`)
    }

    // Блок про удобство поиска
    if (chronicle || rate) {
      paragraphs.push(`Используйте систему фильтров L2GM для точного поиска: выберите нужную хронику, диапазон рейтов или конкретную дату открытия серверов л2. Интерактивный календарь покажет все ближайшие старты и открытие серверов л2, чтобы вы могли спланировать своё возвращение в мир Lineage 2.`)
    } else {
      paragraphs.push(`Удобная навигация L2GM поможет быстро найти подходящий сервер ла2. Фильтруйте по хроникам — ла2 интерлюд, л2 хф, л2 классик, ла2 эссенс и другие. Выбирайте рейты — от хардкорных x1 до максимальных x10000. Смотрите календарь открытий серверов л2, чтобы не пропустить старт интересного проекта. Каждый анонс содержит подробную информацию: хроника, рейты, особенности, дата старта и ссылка на сервер lineage 2.`)
    }

    // Блок про сообщество и обновления
    paragraphs.push(`Рейтинг серверов л2 L2GM обновляется ежедневно. Новые сервера ла2 добавляются сразу после проверки, устаревшие анонсы удаляются автоматически. Мы стремимся предоставить игрокам только актуальную информацию о серверах lineage 2, чтобы вы не тратили время на закрытые или заброшенные проекты.`)

    // Призыв к действию
    if (chronicle && rate) {
      paragraphs.push(`Раздел ${chronicle.name} ${rateName} регулярно пополняется новыми проектами. Добавьте страницу в закладки или подпишитесь на наш Telegram-канал, чтобы первыми узнавать о старте интересных серверов л2. Удачной игры и до встречи в мире Lineage 2!`)
    } else if (chronicle) {
      paragraphs.push(`Сервера ${chronicle.name} — это особенная атмосфера и преданное комьюнити. Следите за обновлениями раздела, чтобы не пропустить открытие нового проекта л2 на любимой хронике. L2GM — ваш надёжный сайт л2 для поиска серверов!`)
    } else if (rate) {
      paragraphs.push(`Сервера л2 с рейтами ${rateName} стартуют регулярно. Заходите на L2GM, следите за календарём открытий и выбирайте проекты, которые подходят именно вам. Желаем удачи в поисках идеального сервера Lineage 2!`)
    } else {
      paragraphs.push(`L2GM — это не просто л2 топ, это сообщество игроков, которые любят Lineage 2 так же сильно, как и вы. Заходите к нам регулярно, следите за анонсами серверов л2 и находите проекты своей мечты. Приятной игры и до встречи в мире Аден!`)
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
      paragraphs.push(`Сегодня, ${formattedDate}, открываются новые серверы Lineage 2! Это ваш шанс начать игру с первого дня вместе с тысячами других игроков. Старт на новом сервере — уникальная возможность: все на равных, экономика чистая, а клановые войны только начинаются.`)
      paragraphs.push(`Серверы, стартующие сегодня, собирают максимальный онлайн в первые часы после открытия. Именно сейчас формируются топовые кланы и закладываются основы будущих альянсов. Присоединяйтесь к сообществу и займите своё место в новом мире Lineage 2!`)
      paragraphs.push(`Совет от L2GM: изучите особенности каждого сервера перед выбором. Обратите внимание на хронику, рейты, наличие доната и специальные условия старта. Удачного открытия!`)
    } else if (diffDays === 1) {
      paragraphs.push(`Завтра, ${formattedDate}, стартуют новые серверы Lineage 2! Самое время подготовиться к открытию: изучите информацию о проектах, выберите класс и соберите пати. Заранее спланированный старт — залог успешной игры.`)
      paragraphs.push(`Начать играть с первого дня сервера — это возможность оказаться в числе лидеров. Пока другие раскачиваются, вы уже будете строить клан, захватывать споты и готовиться к первым осадам. Не откладывайте подготовку на последний момент!`)
      paragraphs.push(`На этой странице собраны все серверы Lineage 2, открывающиеся завтра. Информация обновляется регулярно — добавляйте страницу в закладки, чтобы не пропустить важные детали.`)
    } else if (diffDays > 1 && diffDays <= 7) {
      paragraphs.push(`В ${weekDay}, ${formattedDate}, запланировано открытие серверов Lineage 2. До старта осталось ${diffDays} ${diffDays === 2 || diffDays === 3 || diffDays === 4 ? 'дня' : 'дней'} — достаточно времени, чтобы изучить проекты, найти клан и подготовиться к игре.`)
      paragraphs.push(`Серверы, открывающиеся в ближайшие дни, уже набирают аудиторию. На форумах обсуждаются планы на старт, формируются группы и альянсы. Присоединяйтесь к обсуждениям, чтобы найти единомышленников!`)
      paragraphs.push(`Следите за обновлениями — информация о серверах может дополняться. На L2GM вы всегда найдёте актуальные данные о предстоящих открытиях.`)
    } else if (diffDays > 7) {
      paragraphs.push(`${formattedDate} состоится открытие серверов Lineage 2. Хотя до старта ещё есть время, уже сейчас можно изучить проекты и выбрать подходящий. Чем раньше вы определитесь, тем лучше подготовитесь.`)
      paragraphs.push(`Анонсы серверов на эту дату могут обновляться — администрации проектов постепенно раскрывают детали. Добавьте страницу в закладки и возвращайтесь ближе к дате, чтобы узнать все подробности.`)
    } else {
      paragraphs.push(`${formattedDate} состоялось открытие серверов Lineage 2. Многие проекты всё ещё активны и продолжают набирать игроков — возможно, среди них есть сервер, который вам подойдёт.`)
      paragraphs.push(`Начинать играть на сервере после старта — нормальная практика. Главное — выбрать стабильный проект с активным онлайном и дружелюбным сообществом. Изучите информацию о серверах и присоединяйтесь к игре!`)
      paragraphs.push(`Если вы ищете сервер с более ранним стартом, используйте календарь L2GM для поиска проектов на нужную дату.`)
    }

    paragraphs.push(`L2GM — актуальный рейтинг серверов Lineage 2 с удобным календарём открытий. Выбирайте серверы по хроникам, рейтам или датам старта. Желаем вам найти идеальный проект и получить удовольствие от игры!`)

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
      sameAs: [
        'https://t.me/l2gm'
      ]
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
    generateServerEventsJsonLd,
    generateImageJsonLd,
    generateFullMeta
  }
}
