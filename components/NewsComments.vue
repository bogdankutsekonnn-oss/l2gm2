<template>
  <section class="comments" aria-labelledby="comments-title">
    <h2 id="comments-title" class="comments__title">
      Комментарии<span v-if="comments.length" class="comments__count">{{ comments.length }}</span>
    </h2>

    <!-- Список комментариев -->
    <div v-if="comments.length" class="comments__list">
      <article v-for="c in comments" :key="c.id" class="comment">
        <img
          v-if="c.photo_url"
          :src="c.photo_url"
          :alt="displayName(c)"
          class="comment__avatar"
          width="40"
          height="40"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        <div v-else class="comment__avatar comment__avatar--placeholder">
          {{ initial(c) }}
        </div>
        <div class="comment__body">
          <div class="comment__head">
            <span class="comment__author">{{ displayName(c) }}</span>
            <a
              v-if="c.username"
              :href="`https://t.me/${c.username}`"
              target="_blank"
              rel="noopener noreferrer"
              class="comment__username"
            >@{{ c.username }}</a>
            <time class="comment__date" :datetime="c.created_at">{{ formatDate(c.created_at) }}</time>
          </div>
          <p class="comment__text">{{ c.text }}</p>
        </div>
      </article>
    </div>
    <p v-else-if="!loading" class="comments__empty">
      Пока нет комментариев. Будьте первым!
    </p>

    <!-- Форма / авторизация -->
    <div class="comments__compose">
      <!-- Не вошёл -->
      <div v-if="!user" class="comments__auth">
        <p class="comments__hint">Войдите через Telegram, чтобы оставить комментарий:</p>
        <div ref="widgetContainer" class="comments__tg-widget"></div>
        <p v-if="!botName" class="comments__warn">
          Виджет не настроен: укажите имя бота в настройках.
        </p>
      </div>

      <!-- Вошёл, но не подписан -->
      <div v-else-if="!subscribed" class="comments__gate">
        <p class="comments__hint">
          Чтобы комментировать, подпишитесь на наш Telegram-канал.
        </p>
        <div class="comments__gate-actions">
          <a
            :href="`https://t.me/${channel}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
          >Подписаться на канал</a>
          <button type="button" class="comments__recheck" :disabled="rechecking" @click="recheck">
            {{ rechecking ? 'Проверяем…' : 'Я подписался' }}
          </button>
        </div>
        <p v-if="gateError" class="comments__warn">Подписка не найдена. Подпишитесь и попробуйте снова.</p>
      </div>

      <!-- Вошёл и подписан -->
      <form v-else class="comments__form" @submit.prevent="submit">
        <div class="comments__form-head">
          <img
            v-if="user.photo_url"
            :src="user.photo_url"
            :alt="user.first_name"
            class="comment__avatar"
            width="40"
            height="40"
            referrerpolicy="no-referrer"
          />
          <div v-else class="comment__avatar comment__avatar--placeholder">
            {{ (user.first_name || '?').charAt(0) }}
          </div>
          <span class="comments__me">{{ user.first_name }} {{ user.last_name }}</span>
          <button type="button" class="comments__logout" @click="logout">Выйти</button>
        </div>
        <textarea
          v-model="draft"
          class="comments__textarea"
          rows="3"
          maxlength="2000"
          placeholder="Ваш комментарий…"
          :disabled="sending"
        ></textarea>
        <div class="comments__form-foot">
          <span class="comments__counter">{{ draft.length }}/2000</span>
          <button type="submit" class="btn-primary" :disabled="sending || !draft.trim()">
            {{ sending ? 'Отправка…' : 'Отправить' }}
          </button>
        </div>
        <p v-if="sendError" class="comments__warn">{{ sendError }}</p>
      </form>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  newsSlug: { type: String, required: true },
})

const config = useRuntimeConfig()
const apiBase = config.public.commentsApi || '/comments-api'
const botName = config.public.tgBotName || ''
const channel = config.public.tgChannel || 'l2gm_official'

const comments = ref([])
const loading = ref(true)
const user = ref(null)
const token = ref('')
const subscribed = ref(false)

const draft = ref('')
const sending = ref(false)
const sendError = ref('')
const rechecking = ref(false)
const gateError = ref(false)

const widgetContainer = ref(null)

const STORAGE_KEY = 'l2gm_tg_comments'

function displayName(c) {
  return `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Гость'
}
function initial(c) {
  return (c.first_name || '?').charAt(0).toUpperCase()
}
function formatDate(s) {
  const d = new Date((s || '').replace(' ', 'T'))
  if (isNaN(d)) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`
}

async function loadComments() {
  loading.value = true
  try {
    const res = await fetch(`${apiBase}/list.php?news=${encodeURIComponent(props.newsSlug)}`)
    const data = await res.json()
    comments.value = Array.isArray(data.comments) ? data.comments : []
  } catch (e) {
    comments.value = []
  } finally {
    loading.value = false
  }
}

function restoreSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    if (saved?.token && saved?.user) {
      token.value = saved.token
      user.value = saved.user
      subscribed.value = Boolean(saved.subscribed)
    }
  } catch (e) {
    /* ignore */
  }
}

function saveSession() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: token.value,
      user: user.value,
      subscribed: subscribed.value,
    }))
  } catch (e) {
    /* ignore */
  }
}

async function onTelegramAuth(tgUser) {
  try {
    const res = await fetch(`${apiBase}/auth.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tgUser),
    })
    const data = await res.json()
    if (data.token) {
      token.value = data.token
      user.value = data.user
      subscribed.value = Boolean(data.subscribed)
      saveSession()
    }
  } catch (e) {
    /* ignore */
  }
}

async function recheck() {
  rechecking.value = true
  gateError.value = false
  try {
    const res = await fetch(`${apiBase}/recheck.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value }),
    })
    const data = await res.json()
    subscribed.value = Boolean(data.subscribed)
    saveSession()
    if (!subscribed.value) gateError.value = true
  } catch (e) {
    gateError.value = true
  } finally {
    rechecking.value = false
  }
}

async function submit() {
  const text = draft.value.trim()
  if (!text) return
  sending.value = true
  sendError.value = ''
  try {
    const res = await fetch(`${apiBase}/add.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value, news: props.newsSlug, text }),
    })
    const data = await res.json()
    if (data.comment) {
      comments.value.push(data.comment)
      draft.value = ''
    } else if (data.error === 'not_subscribed') {
      subscribed.value = false
      saveSession()
    } else if (data.error === 'too_fast') {
      sendError.value = 'Слишком часто. Подождите немного.'
    } else if (data.error === 'unauthorized') {
      logout()
      sendError.value = 'Сессия истекла, войдите заново.'
    } else {
      sendError.value = 'Не удалось отправить комментарий.'
    }
  } catch (e) {
    sendError.value = 'Ошибка сети. Попробуйте позже.'
  } finally {
    sending.value = false
  }
}

function logout() {
  user.value = null
  token.value = ''
  subscribed.value = false
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    /* ignore */
  }
  // вернуть виджет
  nextTick(mountWidget)
}

function mountWidget() {
  if (!botName || !widgetContainer.value || user.value) return
  widgetContainer.value.innerHTML = ''
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://telegram.org/js/telegram-widget.js?22'
  s.setAttribute('data-telegram-login', botName)
  s.setAttribute('data-size', 'medium')
  s.setAttribute('data-userpic', 'true')
  s.setAttribute('data-request-access', 'write')
  s.setAttribute('data-onauth', 'onTelegramAuth(user)')
  widgetContainer.value.appendChild(s)
}

onMounted(() => {
  window.onTelegramAuth = onTelegramAuth
  restoreSession()
  loadComments()
  if (!user.value) nextTick(mountWidget)
})

watch(user, (val) => {
  if (!val) nextTick(mountWidget)
})
</script>

<style scoped>
.comments {
  max-width: 800px;
  margin: var(--spacing-xxl) auto 0;
  padding: var(--spacing-xl) var(--spacing-md) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.comments__title {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.comments__count {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-disabled);
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

.comments__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.comment {
  display: flex;
  gap: var(--spacing-md);
}

.comment__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment__avatar--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-main);
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  font-size: var(--font-lg);
}

.comment__body {
  flex: 1;
  min-width: 0;
}

.comment__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: 4px;
}

.comment__author {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--font-sm);
}

.comment__username {
  font-size: var(--font-xs);
  color: var(--text-disabled);
  text-decoration: none;
}

.comment__username:hover {
  color: var(--primary-main);
}

.comment__date {
  font-size: var(--font-xs);
  color: var(--text-disabled);
  margin-left: auto;
}

.comment__text {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.comments__empty {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.comments__compose {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  padding: var(--spacing-lg);
}

.comments__hint {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.comments__warn {
  margin: var(--spacing-sm) 0 0;
  color: #ff6b5e;
  font-size: var(--font-sm);
}

.comments__gate-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.comments__recheck {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: var(--text-primary);
  padding: 10px 18px;
  border-radius: var(--radius-full);
  font-family: inherit;
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: background 0.2s;
}

.comments__recheck:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}

.comments__recheck:disabled {
  opacity: 0.6;
  cursor: default;
}

.comments__form-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.comments__me {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--font-sm);
}

.comments__logout {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--text-disabled);
  font-size: var(--font-xs);
  cursor: pointer;
  font-family: inherit;
  text-decoration: underline;
}

.comments__logout:hover {
  color: var(--text-primary);
}

.comments__textarea {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  color: var(--text-primary);
  font-family: inherit;
  font-size: var(--font-base);
  resize: vertical;
  box-sizing: border-box;
}

.comments__textarea:focus {
  outline: none;
  border-color: var(--primary-main);
}

.comments__form-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-md);
  gap: var(--spacing-md);
}

.comments__counter {
  font-size: var(--font-xs);
  color: var(--text-disabled);
}

@media (max-width: 640px) {
  .comments {
    padding: var(--spacing-lg) var(--spacing-xs) 0;
  }

  .comments__compose {
    padding: var(--spacing-md);
  }
}
</style>
