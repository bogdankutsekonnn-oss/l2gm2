// Клиентская гидрация авторизации: подхватываем токен из localStorage
// и тянем профиль при загрузке приложения (сайт статический, только клиент).
export default defineNuxtPlugin(async () => {
  const { loadFromStorage, fetchMe } = useAuth()
  loadFromStorage()
  await fetchMe()
})
