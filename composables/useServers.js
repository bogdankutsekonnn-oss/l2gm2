// composables/useServers.js
// Этот файл готов к миграции на Supabase
// Просто замени импорт и функции на запросы к Supabase

import serversData from '~/data/servers.json'
import chroniclesData from '~/data/chronicles.json'
import ratesData from '~/data/rates.json'

// === КОНФИГУРАЦИЯ ИСТОЧНИКА ДАННЫХ ===
// Переключи на 'supabase' когда будешь готов мигрировать
const DATA_SOURCE = 'json' // 'json' | 'supabase'

// === SUPABASE (раскомментируй когда подключишь) ===
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_ANON_KEY
// )

export const useServers = () => {
  /**
   * Получить серверы с фильтрами
   * @param {Object} filters - { chronicle, rate, status, tag }
   * @returns {Array} - отфильтрованные серверы
   */
  const getServers = async (filters = {}) => {
    if (DATA_SOURCE === 'supabase') {
      return await getServersFromSupabase(filters)
    }
    return getServersFromJson(filters)
  }

  /**
   * Получить сервер по ID
   * @param {number} id
   * @returns {Object|null}
   */
  const getServerById = async (id) => {
    if (DATA_SOURCE === 'supabase') {
      // const { data } = await supabase.from('servers').select('*').eq('id', id).single()
      // return data
    }
    return serversData.find(s => s.id === id) || null
  }

  /**
   * Получить серверы владельца (для личного кабинета)
   * @param {string} ownerId
   * @returns {Array}
   */
  const getServersByOwner = async (ownerId) => {
    if (DATA_SOURCE === 'supabase') {
      // const { data } = await supabase.from('servers').select('*').eq('ownerId', ownerId)
      // return data || []
    }
    return serversData.filter(s => s.ownerId === ownerId)
  }

  /**
   * Получить премиум серверы (для баннеров)
   * @returns {Array}
   */
  const getPremiumServers = async () => {
    if (DATA_SOURCE === 'supabase') {
      // const { data } = await supabase
      //   .from('servers')
      //   .select('*')
      //   .in('cardType', ['premium', 'vip-plus'])
      //   .order('cardType', { ascending: false })
      // return data || []
    }
    return serversData.filter(s => s.cardType === 'premium' || s.cardType === 'vip-plus')
  }

  /**
   * Типы карточек
   * basic - обычная (бесплатно)
   * vip - VIP (чёрный фон, белая рамка)
   * vip-plus - VIP+ (градиент рамка)
   * premium - Премиум (розовый градиент фон)
   */
  const CARD_TYPES = {
    basic: { priority: 4, name: 'Обычная' },
    vip: { priority: 3, name: 'VIP' },
    'vip-plus': { priority: 2, name: 'VIP+' },
    premium: { priority: 1, name: 'Премиум' },
  }

  /**
   * Платные иконки
   * recommended - Рекомендуем (от нас)
   * hot-start - Горячий старт
   * bonus-start - Бонус к старту
   * obt - ОБТ
   */
  const ICON_TYPES = {
    recommended: { name: 'Рекомендуем', icon: 'recommended.svg' },
    'hot-start': { name: 'Горячий старт', icon: 'hot-start.svg' },
    'bonus-start': { name: 'Бонус к старту', icon: 'bonus-start.svg' },
    obt: { name: 'ОБТ', icon: 'obt.svg' },
  }

  const getCardTypes = () => CARD_TYPES
  const getIconTypes = () => ICON_TYPES

  // === ВНУТРЕННИЕ ФУНКЦИИ ===

  const getServersFromJson = (filters) => {
    let filtered = [...serversData]

    // Фильтр по хронике
    if (filters.chronicle) {
      const chronicle = chroniclesData.find(c => c.slug === filters.chronicle)
      if (chronicle) {
        filtered = filtered.filter(s => s.chronicle === chronicle.name)
      }
    }

    // Фильтр по рейту/ренжу
    if (filters.rate) {
      if (filters.rate.includes('-')) {
        // Это ренж (x1-x10)
        const [min, max] = filters.rate.replace(/x/g, '').split('-').map(Number)
        filtered = filtered.filter(s => {
          const rateNum = parseInt(s.rate.replace('x', ''))
          return rateNum >= min && rateNum <= max
        })
      } else {
        // Конкретный рейт или slug из ratesData
        const rateData = ratesData.find(r => r.slug === filters.rate)
        if (rateData && rateData.range) {
          const [min, max] = rateData.range.replace(/x/g, '').split('-').map(Number)
          filtered = filtered.filter(s => {
            const rateNum = parseInt(s.rate.replace('x', ''))
            return rateNum >= min && rateNum <= max
          })
        } else {
          filtered = filtered.filter(s => s.rate === filters.rate)
        }
      }
    }

    // Фильтр по типу карточки
    if (filters.cardType) {
      filtered = filtered.filter(s => s.cardType === filters.cardType)
    }

    // Фильтр по иконке
    if (filters.icon) {
      filtered = filtered.filter(s => s.icons && s.icons.includes(filters.icon))
    }

    // Сортировка: premium > vip > top > остальные, потом по дате
    return sortServers(filtered)
  }

  const getServersFromSupabase = async (filters) => {
    // TODO: Реализовать когда подключим Supabase
    // let query = supabase.from('servers').select('*')
    //
    // if (filters.chronicle) {
    //   query = query.eq('chronicle', filters.chronicle)
    // }
    // if (filters.rate) {
    //   // Логика для ренжей
    // }
    // if (filters.status) {
    //   query = query.eq('status', filters.status)
    // }
    // if (filters.tag) {
    //   query = query.contains('tags', [filters.tag])
    // }
    //
    // const { data } = await query.order('startDate', { ascending: true })
    // return sortServers(data || [])

    return []
  }

  const sortServers = (servers) => {
    const cardTypePriority = {
      premium: 1,
      'vip-plus': 2,
      vip: 3,
      basic: 4,
    }

    return servers.sort((a, b) => {
      const priorityA = cardTypePriority[a.cardType] ?? 99
      const priorityB = cardTypePriority[b.cardType] ?? 99

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      // По дате старта
      return new Date(a.startDate) - new Date(b.startDate)
    })
  }

  return {
    getServers,
    getServerById,
    getServersByOwner,
    getPremiumServers,
    getCardTypes,
    getIconTypes,
  }
}
