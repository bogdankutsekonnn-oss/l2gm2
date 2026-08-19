// Пользовательская авторизация (Google / Яндекс / Email / Telegram).
// Единый аккаунт, bearer-токен в localStorage. Бэкенд — PHP /auth-api/.
const TOKEN_KEY = 'l2gm_user_token'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const base = config.public.authApi || '/auth-api'

  const user = useState('auth_user', () => null)
  const token = useState('auth_token', () => null)
  const ready = useState('auth_ready', () => false)

  const setToken = (t) => {
    token.value = t || null
    if (import.meta.client) {
      if (t) localStorage.setItem(TOKEN_KEY, t)
      else localStorage.removeItem(TOKEN_KEY)
    }
  }

  const loadFromStorage = () => {
    if (import.meta.client && !token.value) {
      const t = localStorage.getItem(TOKEN_KEY)
      if (t) token.value = t
    }
  }

  const authFetch = (path, opts = {}) => {
    const headers = { ...(opts.headers || {}) }
    if (token.value) headers.Authorization = `Bearer ${token.value}`
    return $fetch(`${base}${path}`, { ...opts, headers })
  }

  // Гидрация: если есть токен — тянем профиль
  const fetchMe = async () => {
    if (!token.value) {
      user.value = null
      ready.value = true
      return
    }
    try {
      const res = await authFetch('/me.php')
      user.value = res.user
    } catch (e) {
      // токен протух — чистим
      setToken(null)
      user.value = null
    }
    ready.value = true
  }

  // OAuth — уходим на PHP-эндпоинт, дальше редиректы провайдера
  const startGoogle = () => { if (import.meta.client) window.location.href = `${base}/google/start.php` }
  const startYandex = () => { if (import.meta.client) window.location.href = `${base}/yandex/start.php` }

  // Email
  const loginEmail = async (email, password) => {
    const res = await $fetch(`${base}/email/login.php`, { method: 'POST', body: { email, password } })
    setToken(res.token)
    user.value = res.user
    return res
  }
  const registerEmail = (email, password, name) =>
    $fetch(`${base}/email/register.php`, { method: 'POST', body: { email, password, name } })
  const requestReset = (email) =>
    $fetch(`${base}/email/request-reset.php`, { method: 'POST', body: { email } })
  const resetPassword = async (resetToken, password) => {
    const res = await $fetch(`${base}/email/reset.php`, { method: 'POST', body: { token: resetToken, password } })
    setToken(res.token)
    user.value = res.user
    return res
  }

  // Telegram (данные Login Widget)
  const loginTelegram = async (tgData) => {
    const res = await $fetch(`${base}/telegram.php`, { method: 'POST', body: tgData })
    setToken(res.token)
    user.value = res.user
    return res
  }

  // Обмен одноразового кода из OAuth-редиректа на токен
  const exchangeCode = async (code) => {
    const res = await $fetch(`${base}/session.php?action=exchange`, { method: 'POST', body: { code } })
    setToken(res.token)
    user.value = res.user
    return res
  }

  const logout = async () => {
    try { await authFetch('/logout.php', { method: 'POST' }) } catch (e) { /* всё равно чистим локально */ }
    setToken(null)
    user.value = null
  }

  return {
    user, token, ready,
    setToken, loadFromStorage, fetchMe,
    startGoogle, startYandex,
    loginEmail, registerEmail, requestReset, resetPassword,
    loginTelegram, exchangeCode, logout,
  }
}

// Управление модалкой входа (единый инстанс в layout)
export const useAuthModal = () => {
  const state = useState('auth_modal', () => ({ open: false, mode: 'login' }))
  const open = (mode = 'login') => { state.value = { open: true, mode } }
  const close = () => { state.value = { ...state.value, open: false } }
  return { state, open, close }
}
