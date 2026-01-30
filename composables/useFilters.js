import serversData from '~/data/servers.json'
import chroniclesData from '~/data/chronicles.json'
import ratesData from '~/data/rates.json'

export const useFilters = () => {
  const getServers = (filters = {}) => {
    let filtered = [...serversData]
    
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
          const rateNum = typeof s.rate === 'number' ? s.rate : parseInt(s.rate.replace('x', ''))
          return rateNum >= min && rateNum <= max
        })
      } else {
        // Handle exact rate match (e.g. "x1" or 1)
        const rateNum = parseInt(filters.rate.replace('x', ''))
        const exactMatch = filtered.filter(s => {
          const serverRate = typeof s.rate === 'number' ? s.rate : parseInt(s.rate.replace('x', ''))
          return serverRate === rateNum
        })
        if (exactMatch.length > 0) {
          filtered = exactMatch
        }
      }
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
    getRateRanges
  }
}
