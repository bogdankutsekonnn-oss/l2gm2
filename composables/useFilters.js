import serversJson from '~/data/servers.json'
import chroniclesData from '~/data/chronicles.json'
import ratesData from '~/data/rates.json'
import { isPlacementExpired } from '~/utils/dateUtils'
import { serverKey } from '~/utils/serverTracking'

// Production-URL для админ-API. На билде в GitHub Actions (nuxt generate) фетч
// идёт по этому адресу, результат запекается в HTML — это даёт SEO для серверов,
// добавленных через админку.
const ADMIN_API_URL = 'https://l2gm.com/api/servers.php'

// SSG-payload содержит данные на момент билда — рефетчим один раз за визит.
let refreshedOnClient = false

export const useFilters = () => {
  // useAsyncData с уникальным ключом — дедуплицирует фетч между компонентами
  // и переносит данные через payload SSG → клиент (без повторного запроса).
  // id-ам префикс `api_`, чтобы не пересекались с числовыми id из servers.json.
  const { data: apiServers, refresh } = useAsyncData(
    'admin-servers',
    async () => {
      try {
        const data = await $fetch(ADMIN_API_URL, { timeout: 5000 })
        if (!Array.isArray(data) || data.length === 0) return null
        return data.map(s => ({ ...s, id: `api_${s.id}` }))
      } catch {
        return null
      }
    },
    { default: () => null },
  )

  // Payload запечён при деплое, поэтому без рефетча клиент не видит серверов,
  // апрувнутых в админке после билда. Обновляем список после загрузки страницы.
  if (import.meta.client && !refreshedOnClient) {
    refreshedOnClient = true
    onNuxtReady(() => refresh())
  }

  const getServers = (filters = {}) => {
    // Сервера из админ-базы существуют в двух копиях: ежечасный синк кладёт их
    // в servers.json, и они же приходят из API. API свежее (правки в админке
    // видны сразу) — json-дубли выкидываем по ключу url|хроника|рейт.
    let source = serversJson
    if (apiServers.value) {
      const apiKeys = new Set(apiServers.value.map(serverKey))
      source = [
        ...serversJson.filter(s => !apiKeys.has(serverKey(s))),
        ...apiServers.value,
      ]
    }

    // Не показываем серверы, которые открылись больше 30 дней назад
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    let filtered = source.filter(s => new Date(s.startDate) >= thirtyDaysAgo)

    if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      if (chronicle) {
        filtered = filtered.filter(s => s.chronicle === chronicle.name)
      }
    }

    if (filters.rate) {
      // Handle rate ranges like "x1-x20"
      if (filters.rate.includes('-')) {
        // Parse range like "x1-x20" -> [1, 20]
        const parts = filters.rate.split('-')
        const min = parseInt(parts[0].replace('x', ''))
        const max = parseInt(parts[1].replace('x', ''))
        filtered = filtered.filter(s => {
          if (s.rate == null) return false
          const rateNum = typeof s.rate === 'number' ? s.rate : parseInt(String(s.rate).replace('x', ''))
          return rateNum >= min && rateNum <= max
        })
      } else {
        // Handle exact rate match (e.g. "x1" or 1)
        const rateNum = parseInt(filters.rate.replace('x', ''))
        const exactMatch = filtered.filter(s => {
          if (s.rate == null) return false
          const serverRate = typeof s.rate === 'number' ? s.rate : parseInt(String(s.rate).replace('x', ''))
          return serverRate === rateNum
        })
        if (exactMatch.length > 0) {
          filtered = exactMatch
        }
      }
    }

    // Фильтр по дате (сегодня)
    if (filters.today) {
      const today = new Date().toISOString().split('T')[0]
      filtered = filtered.filter(s => s.startDate === today)
    }

    // Фильтр по дате (завтра)
    if (filters.tomorrow) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      filtered = filtered.filter(s => s.startDate === tomorrowStr)
    }

    // Фильтр по дате (эта неделя — ближайшие 7 дней включая сегодня)
    if (filters.thisWeek) {
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const weekEnd = new Date(now)
      weekEnd.setDate(weekEnd.getDate() + 6)
      const weekEndStr = weekEnd.toISOString().split('T')[0]
      filtered = filtered.filter(s => s.startDate >= todayStr && s.startDate <= weekEndStr)
    }

    // Фильтр: недавно открывшиеся (за последние 7 дней)
    if (filters.recentlyOpened) {
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      const weekAgoStr = weekAgo.toISOString().split('T')[0]
      filtered = filtered.filter(s => s.startDate >= weekAgoStr && s.startDate <= todayStr)
    }

    // Фильтр по типу карточки (топ/vip/premium) — исключаем истёкшие
    if (filters.top) {
      filtered = filtered.filter(s => {
        if (isPlacementExpired(s)) return false
        return s.cardType === 'premium' || s.cardType === 'vip-plus' || s.cardType === 'vip' || s.cardType === 'top'
      })
    }

    // Фильтр по типу сервера
    if (filters.serverType) {
      filtered = filtered.filter(s => s.serverType === filters.serverType)
    }

    // Фильтр по региону (зарубежный)
    if (filters.foreign) {
      filtered = filtered.filter(s => s.region === 'foreign')
    }

    // Фильтр low rate (x1-x10)
    if (filters.lowRate) {
      filtered = filtered.filter(s => {
        if (s.rate == null) return false
        const rateNum = typeof s.rate === 'number' ? s.rate : parseInt(String(s.rate).replace('x', ''))
        return rateNum >= 1 && rateNum <= 10
      })
    }

    // Фильтр mid rate (x10-x100)
    if (filters.midRate) {
      filtered = filtered.filter(s => {
        if (s.rate == null) return false
        const rateNum = typeof s.rate === 'number' ? s.rate : parseInt(String(s.rate).replace('x', ''))
        return rateNum > 10 && rateNum <= 100
      })
    }

    // Фильтр pvp rate (x100+)
    if (filters.pvpRate) {
      filtered = filtered.filter(s => {
        if (s.rate == null) return false
        const rateNum = typeof s.rate === 'number' ? s.rate : parseInt(String(s.rate).replace('x', ''))
        return rateNum >= 100
      })
    }

    // Фильтр GvE (по категории сервера)
    if (filters.gve) {
      filtered = filtered.filter(s => s.category === 'gve')
    }

    // Фильтр multicraft
    if (filters.multicraft) {
      filtered = filtered.filter(s => s.features?.includes('multicraft'))
    }

    // Фильтр multiprof
    if (filters.multiprof) {
      filtered = filtered.filter(s => s.features?.includes('multiprof'))
    }

    return filtered
  }

  const getChronicles = () => {
    return chroniclesData
  }

  const getRates = () => {
    return ratesData
  }

  const getRateRanges = () => {
    const ranges = new Set()
    ratesData.forEach(rate => {
      if (rate.range) {
        ranges.add(rate.range)
      }
    })
    return Array.from(ranges)
  }

  return {
    getServers,
    getChronicles,
    getRates,
    getRateRanges,
    apiServers,
  }
}
