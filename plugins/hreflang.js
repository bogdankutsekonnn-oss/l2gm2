// Глобальный плагин: добавляет hreflang="ru" + x-default на каждую страницу.
// Сайт одноязычный (рус), но hreflang="ru" (без привязки к стране) — сигнал
// Google/Яндекс, что контент рассчитан на всех русскоговорящих (РФ, Беларусь,
// Казахстан, Украина, Молдова и т.д.), а не только на российский рынок.
//
// Используем key на link-тегах, чтобы страницы с кросс-каноникалом
// (напр. /chronicle/*/rate/*/ → /chronicle/*/) могли переопределить href
// через свой useHead с теми же ключами.
export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://l2gm.com').replace(/\/$/, '')

  const canonicalPath = computed(() => {
    const p = route.path
    return p.endsWith('/') || p === '/' ? p : `${p}/`
  })

  const href = computed(() => `${siteUrl}${canonicalPath.value}`)

  useHead({
    link: [
      { rel: 'alternate', hreflang: 'ru', href: href, key: 'hreflang-ru' },
      { rel: 'alternate', hreflang: 'x-default', href: href, key: 'hreflang-x-default' },
    ],
  })
})
