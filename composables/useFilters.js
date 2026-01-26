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
      // Handle exact rate match first
      const exactMatch = filtered.filter(s => s.rate === filters.rate)
      if (exactMatch.length > 0) {
        filtered = exactMatch
      } else {
        // Handle rate ranges like "x1-x10" if no exact match
        if (filters.rate.includes('-')) {
          const [min, max] = filters.rate.replace('x', '').split('-').map(Number)
          filtered = filtered.filter(s => {
            const rateNum = parseInt(s.rate.replace('x', ''))
            return rateNum >= min && rateNum <= max
          })
        } else {
          // Try to find rate in ranges
          const rateData = ratesData.find(r => r.slug === filters.rate)
          if (rateData && rateData.range) {
            const [min, max] = rateData.range.replace('x', '').split('-').map(Number)
            filtered = filtered.filter(s => {
              const rateNum = parseInt(s.rate.replace('x', ''))
              return rateNum >= min && rateNum <= max
            })
          }
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
