<template>
  <div class="reset-page">
    <div class="reset-box">
      <h1>Новый пароль</h1>

      <template v-if="done">
        <div class="reset-ok">✓</div>
        <p>Пароль изменён. Вы вошли в аккаунт.</p>
        <NuxtLink to="/profile/" class="btn-primary">В профиль</NuxtLink>
      </template>

      <template v-else-if="!token">
        <p class="reset-err">Ссылка недействительна или устарела.</p>
        <NuxtLink to="/" class="btn-primary">На главную</NuxtLink>
      </template>

      <form v-else class="reset-form" @submit.prevent="submit">
        <input
          v-model="password"
          class="input"
          type="password"
          placeholder="Новый пароль (мин. 6 символов)"
          autocomplete="new-password"
          required
        />
        <input
          v-model="confirm"
          class="input"
          type="password"
          placeholder="Повторите пароль"
          autocomplete="new-password"
          required
        />
        <p v-if="error" class="reset-err">{{ error }}</p>
        <button class="btn-primary" type="submit" :disabled="busy">
          {{ busy ? 'Сохраняем…' : 'Сохранить пароль' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const { resetPassword } = useAuth()
const route = useRoute()

const token = ref('')
const password = ref('')
const confirm = ref('')
const busy = ref(false)
const error = ref('')
const done = ref(false)

useHead({
  title: 'Сброс пароля — L2GM',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

onMounted(() => {
  token.value = String(route.query.token || '')
})

async function submit() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = 'Пароль слишком короткий (мин. 6 символов).'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Пароли не совпадают.'
    return
  }
  busy.value = true
  try {
    await resetPassword(token.value, password.value)
    done.value = true
  } catch (e) {
    error.value = e?.data?.error === 'token_expired'
      ? 'Ссылка устарела. Запросите сброс пароля заново.'
      : 'Не удалось изменить пароль. Попробуйте снова.'
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.reset-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) var(--spacing-md);
}
.reset-box {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-xxl);
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  text-align: center;
}
.reset-box h1 {
  font-size: var(--font-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}
.reset-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  text-align: left;
}
.reset-form .btn-primary { margin-top: var(--spacing-xs); }
.reset-err {
  color: var(--status-error);
  font-size: var(--font-sm);
  margin-bottom: var(--spacing-sm);
}
.reset-ok {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--status-success);
  color: #fff;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
}
.reset-box p { color: var(--text-secondary); margin-bottom: var(--spacing-lg); }
</style>
