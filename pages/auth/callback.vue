<template>
  <div class="auth-callback">
    <div class="auth-callback__box">
      <template v-if="error">
        <div class="auth-callback__icon auth-callback__icon--err">✕</div>
        <h1>Не удалось войти</h1>
        <p>{{ error }}</p>
        <NuxtLink to="/" class="btn-primary">На главную</NuxtLink>
      </template>
      <template v-else>
        <div class="auth-callback__spinner"></div>
        <h1>Входим…</h1>
        <p>Секунду, завершаем авторизацию.</p>
      </template>
    </div>
  </div>
</template>

<script setup>
const { exchangeCode } = useAuth()
const route = useRoute()
const router = useRouter()

const error = ref('')

const ERRORS = {
  google_denied: 'Вход через Google отменён.',
  yandex_denied: 'Вход через Яндекс отменён.',
  bad_state: 'Сессия входа истекла. Попробуйте снова.',
  code_expired: 'Ссылка входа истекла. Попробуйте снова.',
}

useHead({
  title: 'Вход — L2GM',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

onMounted(async () => {
  if (route.query.error) {
    error.value = ERRORS[route.query.error] || 'Ошибка авторизации. Попробуйте ещё раз.'
    return
  }
  const code = route.query.code
  if (!code) {
    error.value = 'Отсутствует код авторизации.'
    return
  }
  try {
    await exchangeCode(code)
    router.replace('/profile/')
  } catch (e) {
    error.value = ERRORS[e?.data?.error] || 'Не удалось завершить вход. Попробуйте снова.'
  }
})
</script>

<style scoped>
.auth-callback {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) var(--spacing-md);
}
.auth-callback__box {
  text-align: center;
  max-width: 420px;
  padding: var(--spacing-xxl);
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
}
.auth-callback__box h1 {
  font-size: var(--font-h2);
  color: var(--text-primary);
  margin: var(--spacing-md) 0 var(--spacing-sm);
}
.auth-callback__box p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}
.auth-callback__spinner {
  width: 44px;
  height: 44px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: var(--primary-main);
  border-radius: 50%;
  margin: 0 auto;
  animation: acspin 0.8s linear infinite;
}
@keyframes acspin { to { transform: rotate(360deg); } }
.auth-callback__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: #fff;
}
.auth-callback__icon--err { background: var(--status-error); }
</style>
