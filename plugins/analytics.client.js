// Яндекс.Метрика. Грузится только после согласия посетителя в cookie-баннере
// (composables/useCookieConsent.js). До согласия к mc.yandex.ru не уходит ни
// одного запроса. В dev отключена, чтобы не флудить продовую аналитику.
//
// Вебвизор выключен намеренно: он записывает ввод в формах (email и контакты
// в заявке на размещение), а политика конфиденциальности этого не описывает.

const YM_ID = 109541411

export default defineNuxtPlugin(() => {
  if (!import.meta.env.PROD) return

  const { consent, load } = useCookieConsent()
  const router = useRouter()
  let started = false

  const startMetrika = () => {
    if (started) return
    started = true

    // Стаб-очередь: вызовы ym() копятся, пока tag.js не подгрузится.
    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments)
    }
    window.ym.l = +new Date()
    window.ym(YM_ID, 'init', {
      ssr: true,
      webvisor: false,
      clickmap: true,
      accurateTrackBounce: true,
      trackLinks: true,
    })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}`
    document.head.appendChild(script)
  }

  // SPA-переходы Метрика сама не ловит — дёргаем вручную, но только если она запущена.
  router.afterEach((to) => {
    if (started && window.ym) window.ym(YM_ID, 'hit', to.fullPath)
  })

  onNuxtReady(() => {
    load()
    if (consent.value === 'all') startMetrika()

    watch(consent, (value, previous) => {
      if (value === 'all') {
        startMetrika()
      } else if (previous === 'all' && started) {
        // Согласие отозвано: уже загруженный скрипт выгрузить нельзя,
        // поэтому перезагружаем страницу — без согласия он не подключится.
        window.location.reload()
      }
    })
  })
})
