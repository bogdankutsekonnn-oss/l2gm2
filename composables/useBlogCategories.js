// Категории блога. Используются:
// - на категорийных страницах /blog/<slug>/ для SEO-блока
// - в крошках для перехода Главная › Блог › Категория › Статья
// - в карточках статей для кликабельного бейджа категории
const CATEGORIES = [
  {
    name: 'Новости',
    slug: 'novosti',
    cssClass: 'news',
    h1: 'Новости Lineage 2 — анонсы серверов и обновления',
    title: 'Новости Lineage 2 — свежие анонсы серверов и обновления | L2GM',
    description: 'Свежие новости Lineage 2 в 2026 году: анонсы открытия серверов, обновления крупных проектов, события на хрониках Interlude, High Five, Essence, Classic.',
    keywords: 'новости lineage 2, анонсы серверов l2, новости l2, обновления lineage 2, свежие сервера лайнейдж 2',
    intro: 'Раздел «Новости» собирает свежие анонсы открытия серверов Lineage 2, обновления крупных проектов и важные события в комьюнити. Здесь публикуются актуальные старты на хрониках Interlude, High Five, Essence и Classic — чтобы вы не пропустили интересный сервер.',
  },
  {
    name: 'Гайды',
    slug: 'gajdy',
    cssClass: 'guides',
    h1: 'Гайды Lineage 2 — прокачка, классы, фарм и PvP',
    title: 'Гайды Lineage 2 — прокачка, классы, экономика и PvP | L2GM',
    description: 'Подробные гайды по Lineage 2: выбор класса, прокачка персонажа, фарм адены, PvP-механики, осады, олимпиада. Для новичков и опытных игроков на Interlude, High Five и других хрониках.',
    keywords: 'гайды lineage 2, гайды l2, прокачка lineage 2, классы lineage 2, фарм адены, гайды интерлюд, гайды хай файв',
    intro: 'В разделе «Гайды» — практические руководства по Lineage 2: выбор класса под стиль игры, оптимальные споты для прокачки, способы заработка адены, тактика PvP и подготовка к осадам. Материалы написаны с расчётом на актуальные сервера 2026 года и реальный опыт игроков.',
  },
  {
    name: 'Обзоры',
    slug: 'obzory',
    cssClass: 'reviews',
    h1: 'Обзоры серверов Lineage 2 — топы и сравнения',
    title: 'Обзоры серверов Lineage 2 — топы, сравнения, рейтинги | L2GM',
    description: 'Обзоры серверов Lineage 2: топы по онлайну, сравнение проектов, рейтинги хроник Interlude и High Five. Аналитика для выбора лучшего сервера в 2026 году.',
    keywords: 'обзоры серверов lineage 2, топ серверов l2, рейтинг серверов lineage 2, лучшие сервера l2, обзор интерлюд, обзор хай файв',
    intro: 'В разделе «Обзоры» собраны разборы популярных серверов Lineage 2: топы по онлайну, сравнения проектов по балансу, донату и активности комьюнити. Если вы выбираете, на каком сервере играть в 2026 году — здесь готовая аналитика по самым свежим стартам.',
  },
  {
    name: 'Статьи',
    slug: 'stati',
    cssClass: 'articles',
    h1: 'Статьи о Lineage 2 — хроники, механики, аналитика',
    title: 'Статьи о Lineage 2 — хроники, механики, аналитика | L2GM',
    description: 'Аналитические статьи о Lineage 2: сравнение хроник Interlude и High Five, разбор механик, лор вселенной, тенденции серверов 2026 года.',
    keywords: 'статьи lineage 2, lineage 2 статьи, лайнейдж 2 статьи, хроники lineage 2, сравнение хроник l2, механики lineage 2',
    intro: 'В разделе «Статьи» — аналитика и сравнения по Lineage 2: разбор хроник Interlude, High Five, Essence, Classic, обзоры игровых механик и тенденции рынка серверов. Глубокие материалы для тех, кто хочет понимать игру за пределами базовых гайдов.',
  },
]

const NAME_TO_CATEGORY = Object.fromEntries(CATEGORIES.map((c) => [c.name, c]))
const SLUG_TO_CATEGORY = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]))

export const useBlogCategories = () => {
  const getCategories = () => CATEGORIES

  const getCategoryByName = (name) => NAME_TO_CATEGORY[name] || null
  const getCategoryBySlug = (slug) => SLUG_TO_CATEGORY[slug] || null

  const isCategorySlug = (slug) => Boolean(SLUG_TO_CATEGORY[slug])

  const getCategorySlug = (name) => NAME_TO_CATEGORY[name]?.slug || null
  const getCategoryName = (slug) => SLUG_TO_CATEGORY[slug]?.name || null

  return {
    getCategories,
    getCategoryByName,
    getCategoryBySlug,
    isCategorySlug,
    getCategorySlug,
    getCategoryName,
  }
}
