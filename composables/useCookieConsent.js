// Выбор посетителя по cookie: 'all' — можно грузить аналитику (Яндекс.Метрика),
// 'necessary' — только необходимое, null — выбор ещё не сделан.
// Хранится в localStorage 12 месяцев; сам выбор — «необходимые» данные,
// согласия не требует.

const STORAGE_KEY = 'cookieConsentV2'
const TTL_MS = 365 * 24 * 60 * 60 * 1000

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { value, at } = JSON.parse(raw)
    if (!['all', 'necessary'].includes(value)) return null
    if (!at || Date.now() - at > TTL_MS) return null
    return value
  } catch {
    return null
  }
}

export const useCookieConsent = () => {
  const consent = useState('cookie-consent', () => null)
  const loaded = useState('cookie-consent-loaded', () => false)
  const bannerOpen = useState('cookie-banner-open', () => false)

  // Читаем сохранённый выбор один раз на клиенте. Старый ключ cookieConsent
  // ('true') не учитываем: он давался баннеру без упоминания аналитики.
  const load = () => {
    if (!import.meta.client || loaded.value) return
    consent.value = readStored()
    loaded.value = true
    if (consent.value === null) bannerOpen.value = true
  }

  const choose = (value) => {
    consent.value = value
    bannerOpen.value = false
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, at: Date.now() }))
    } catch {
      // приватный режим / запрет хранилища — выбор действует до закрытия вкладки
    }
  }

  const openSettings = () => {
    bannerOpen.value = true
  }

  return { consent, loaded, bannerOpen, load, choose, openSettings }
}
