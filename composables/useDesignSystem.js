import designSystem from '~/docs/design-system.json'

export const useDesignSystem = () => {
  return {
    tokens: designSystem.tokens,
    components: designSystem.components,
    
    // Helper functions
    getColor: (path) => {
      const keys = path.split('.')
      let value = designSystem.tokens
      for (const key of keys) {
        value = value?.[key]
      }
      return value
    },
    
    getSpacing: (size) => {
      return designSystem.tokens.spacing[size] || size
    },
    
    getTypography: (size) => {
      return designSystem.tokens.typography.sizes[size] || size
    }
  }
}
