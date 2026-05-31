// Yandex.Metrika + Google Analytics 4
// Грузятся через @nuxt/scripts с триггером onNuxtReady — после гидрации,
// не блокируют LCP/FCP. В dev отключены чтобы не флудить продовую аналитику.

const YM_ID = 109541411
const GA_ID = 'G-PKPBEQWJ1J'

export default defineNuxtPlugin(() => {
  if (!import.meta.env.PROD) return

  // ── Google Analytics 4 ──
  useScriptGoogleAnalytics({
    id: GA_ID,
    scriptOptions: { trigger: 'onNuxtReady' },
  })

  // ── Yandex.Metrika ──
  // Стаб-очередь регистрируем сразу: вызовы ym() копятся в очереди,
  // пока tag.js не подгрузится (по триггеру onNuxtReady) и не обработает их.
  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments)
  }
  window.ym.l = +new Date()
  window.ym(YM_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    accurateTrackBounce: true,
    trackLinks: true,
  })

  useScript(
    {
      key: 'yandexMetrika',
      src: `https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}`,
    },
    {
      trigger: 'onNuxtReady',
      use: () => ({ ym: window.ym }),
    },
  )

  // ── SPA route tracking ──
  // GA4 и Метрика сами не ловят navigate() в SPA, дёргаем вручную
  const router = useRouter()
  router.afterEach((to) => {
    if (window.ym) window.ym(YM_ID, 'hit', to.fullPath)
    if (window.gtag) window.gtag('event', 'page_view', { page_path: to.fullPath })
  })
})
