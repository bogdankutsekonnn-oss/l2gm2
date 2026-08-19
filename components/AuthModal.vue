<template>
  <Teleport to="body">
    <Transition name="auth-fade">
      <div v-if="state.open" class="auth-overlay" @click.self="close">
        <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
          <button class="auth-close" aria-label="Закрыть" @click="close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <h2 id="auth-title" class="auth-title">
            {{ mode === 'register' ? 'Регистрация' : mode === 'reset' ? 'Восстановление пароля' : 'Вход на L2GM' }}
          </h2>

          <!-- Успех: письмо отправлено -->
          <div v-if="notice" class="auth-notice">
            <div class="auth-notice__icon">✓</div>
            <p>{{ notice }}</p>
          </div>

          <template v-else>
            <!-- Соцсети (не показываем в режиме сброса) -->
            <div v-if="mode !== 'reset'" class="auth-social">
              <button class="auth-social__btn" type="button" @click="startGoogle">
                <span class="auth-social__ic" aria-hidden="true">G</span>
                Войти через Google
              </button>
              <button class="auth-social__btn auth-social__btn--ya" type="button" @click="startYandex">
                <span class="auth-social__ic" aria-hidden="true">Я</span>
                Войти через Яндекс
              </button>
              <div ref="tgWidget" class="auth-tg"></div>
            </div>

            <div v-if="mode !== 'reset'" class="auth-sep"><span>или по почте</span></div>

            <!-- Формы email -->
            <form class="auth-form" @submit.prevent="submit">
              <input
                v-if="mode === 'register'"
                v-model="name"
                class="input"
                type="text"
                placeholder="Имя"
                autocomplete="name"
              />
              <input
                v-model="email"
                class="input"
                type="email"
                placeholder="Email"
                autocomplete="email"
                required
              />
              <input
                v-if="mode !== 'reset'"
                v-model="password"
                class="input"
                type="password"
                :placeholder="mode === 'register' ? 'Пароль (мин. 6 символов)' : 'Пароль'"
                :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
                required
              />

              <p v-if="error" class="auth-error">{{ error }}</p>

              <button class="btn-primary auth-submit" type="submit" :disabled="busy">
                {{ busy ? 'Подождите…'
                  : mode === 'register' ? 'Зарегистрироваться'
                  : mode === 'reset' ? 'Отправить ссылку'
                  : 'Войти' }}
              </button>
            </form>

            <!-- Переключатели режимов -->
            <div class="auth-links">
              <template v-if="mode === 'login'">
                <button type="button" class="auth-link" @click="setMode('reset')">Забыли пароль?</button>
                <span>Нет аккаунта?
                  <button type="button" class="auth-link" @click="setMode('register')">Регистрация</button>
                </span>
              </template>
              <template v-else>
                <button type="button" class="auth-link" @click="setMode('login')">← Назад ко входу</button>
              </template>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const { state, close } = useAuthModal()
const { startGoogle, startYandex, loginEmail, registerEmail, requestReset, loginTelegram } = useAuth()

const config = useRuntimeConfig()
const botName = config.public.tgBotName || ''

const mode = computed(() => state.value.mode || 'login')

const name = ref('')
const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')
const notice = ref('')

const tgWidget = ref(null)

function setMode(m) {
  state.value = { ...state.value, mode: m }
}

function resetFields() {
  error.value = ''
  notice.value = ''
  busy.value = false
}

const ERRORS = {
  bad_email: 'Некорректный email.',
  weak_password: 'Пароль слишком короткий (мин. 6 символов).',
  email_taken: 'Этот email уже зарегистрирован. Попробуйте войти.',
  invalid_credentials: 'Неверный email или пароль.',
  not_verified: 'Почта не подтверждена. Проверьте письмо.',
  too_many_requests: 'Слишком много попыток. Попробуйте позже.',
  bad_request: 'Проверьте введённые данные.',
}
function msg(e) {
  const code = e?.data?.error
  return ERRORS[code] || 'Что-то пошло не так. Попробуйте позже.'
}

async function submit() {
  error.value = ''
  busy.value = true
  try {
    if (mode.value === 'login') {
      await loginEmail(email.value.trim(), password.value)
      close()
    } else if (mode.value === 'register') {
      await registerEmail(email.value.trim(), password.value, name.value.trim())
      notice.value = 'Мы отправили письмо для подтверждения. Проверьте почту (и папку «Спам»).'
    } else if (mode.value === 'reset') {
      await requestReset(email.value.trim())
      notice.value = 'Если аккаунт существует, мы отправили ссылку для сброса пароля.'
    }
  } catch (e) {
    error.value = msg(e)
  } finally {
    busy.value = false
  }
}

// Telegram Login Widget
async function onTgAuth(tgUser) {
  try {
    await loginTelegram(tgUser)
    close()
  } catch (e) {
    error.value = 'Не удалось войти через Telegram.'
  }
}

function mountTgWidget() {
  if (!botName || !tgWidget.value) return
  tgWidget.value.innerHTML = ''
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://telegram.org/js/telegram-widget.js?22'
  s.setAttribute('data-telegram-login', botName)
  s.setAttribute('data-size', 'medium')
  s.setAttribute('data-userpic', 'true')
  s.setAttribute('data-request-access', 'write')
  s.setAttribute('data-onauth', 'onL2gmTgAuth(user)')
  tgWidget.value.appendChild(s)
}

onMounted(() => {
  if (import.meta.client) window.onL2gmTgAuth = onTgAuth
})

// Перемонтируем виджет и чистим поля при каждом открытии/смене режима
watch(() => [state.value.open, mode.value], () => {
  if (state.value.open) {
    resetFields()
    if (mode.value !== 'reset') nextTick(mountTgWidget)
  }
})
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.auth-modal {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-height: 90vh;
  overflow-y: auto;
}

.auth-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  transition: color 0.2s;
}
.auth-close:hover { color: var(--text-primary); }

.auth-title {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.auth-social {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: stretch;
}

.auth-social__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: var(--font-medium);
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
}
.auth-social__btn:hover { background: rgba(255, 255, 255, 0.1); }

.auth-social__ic {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: 13px;
  background: #fff;
  color: #ea4335;
}
.auth-social__btn--ya .auth-social__ic { background: #fc3f1d; color: #fff; }

.auth-tg {
  display: flex;
  justify-content: center;
  min-height: 4px;
  margin-top: 2px;
}

.auth-sep {
  text-align: center;
  margin: var(--spacing-md) 0;
  position: relative;
  color: var(--text-disabled);
  font-size: var(--font-sm);
}
.auth-sep::before,
.auth-sep::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 60px);
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}
.auth-sep::before { left: 0; }
.auth-sep::after { right: 0; }

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.auth-submit {
  width: 100%;
  margin-top: var(--spacing-xs);
}

.auth-error {
  color: var(--status-error);
  font-size: var(--font-sm);
  margin: 2px 0;
}

.auth-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: var(--spacing-md);
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

.auth-link {
  background: none;
  border: none;
  color: var(--primary-main);
  cursor: pointer;
  font-size: var(--font-sm);
  font-family: inherit;
  padding: 0;
}
.auth-link:hover { text-decoration: underline; }

.auth-notice {
  text-align: center;
  padding: var(--spacing-md) 0;
}
.auth-notice__icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--status-success);
  color: #fff;
  font-size: 30px;
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
}
.auth-notice p {
  color: var(--text-secondary);
  font-size: var(--font-base);
}

.auth-fade-enter-active,
.auth-fade-leave-active { transition: opacity 0.2s ease; }
.auth-fade-enter-from,
.auth-fade-leave-to { opacity: 0; }
</style>
