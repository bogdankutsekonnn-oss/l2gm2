export default defineNuxtRouteMiddleware((to) => {
  const { path, query, hash } = to

  // Collapse multiple slashes (e.g. //about/// → /about/)
  const collapsed = path.replace(/\/{2,}/g, '/')

  // Add trailing slash if missing (skip root "/" and file extensions)
  const hasExtension = /\.\w+$/.test(collapsed)
  const needsTrailingSlash = !hasExtension && !collapsed.endsWith('/')
  const normalized = needsTrailingSlash ? collapsed + '/' : collapsed

  if (normalized !== path) {
    return navigateTo({ path: normalized, query, hash }, { redirectCode: 301 })
  }
})
