<template>
  <div class="profile-page">
    <div class="profile-breadcrumbs">
      <Breadcrumbs />
    </div>

    <div v-if="user" class="profile-card">
      <div class="profile-head">
        <img
          v-if="user.photo_url"
          :src="user.photo_url"
          :alt="displayName"
          class="profile-avatar"
          width="72"
          height="72"
          referrerpolicy="no-referrer"
        />
        <span v-else class="profile-avatar profile-avatar--ph">{{ initial }}</span>
        <div>
          <h1 class="profile-name">{{ displayName }}</h1>
          <p v-if="user.email" class="profile-email">
            {{ user.email }}
            <span v-if="user.email_verified" class="profile-badge">подтверждён</span>
          </p>
        </div>
      </div>

      <div class="profile-section">
        <h2>Способы входа</h2>
        <div class="profile-providers">
          <span v-for="p in providers" :key="p.id" class="profile-provider" :class="{ 'is-active': user.providers.includes(p.id) }">
            {{ p.name }}
            <span v-if="user.providers.includes(p.id)" class="profile-provider__dot">✓</span>
          </span>
        </div>
      </div>

      <button type="button" class="btn-secondary profile-logout" @click="onLogout">Выйти</button>
    </div>

    <div v-else-if="ready" class="profile-card profile-card--empty">
      <p>Вы не вошли в аккаунт.</p>
      <button type="button" class="btn-primary" @click="openModal('login')">Войти</button>
    </div>

    <div v-else class="profile-card profile-card--empty">
      <div class="profile-spinner"></div>
    </div>
  </div>
</template>

<script setup>
const { user, ready, logout } = useAuth()
const { open: openModal } = useAuthModal()
const router = useRouter()

const providers = [
  { id: 'google', name: 'Google' },
  { id: 'yandex', name: 'Яндекс' },
  { id: 'email', name: 'Email' },
  { id: 'telegram', name: 'Telegram' },
]

const displayName = computed(() => user.value?.display_name || user.value?.email || 'Профиль')
const initial = computed(() => (displayName.value || '?').trim().charAt(0).toUpperCase())

useHead({
  title: 'Профиль — L2GM',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

async function onLogout() {
  await logout()
  router.replace('/')
}
</script>

<style scoped>
.profile-page {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md) var(--spacing-xxl);
}
.profile-breadcrumbs { margin-bottom: var(--spacing-md); }

.profile-card {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xxl);
}
.profile-card--empty { text-align: center; }
.profile-card--empty p { color: var(--text-secondary); margin-bottom: var(--spacing-lg); }

.profile-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}
.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}
.profile-avatar--ph {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-main);
  color: #fff;
  font-size: 30px;
  font-weight: var(--font-bold);
}
.profile-name {
  font-size: var(--font-h2);
  color: var(--text-primary);
  margin-bottom: 4px;
}
.profile-email {
  color: var(--text-secondary);
  font-size: var(--font-base);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
.profile-badge {
  font-size: var(--font-xs);
  background: rgba(40, 167, 69, 0.15);
  color: var(--status-success);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.profile-section { margin-bottom: var(--spacing-xl); }
.profile-section h2 {
  font-size: var(--font-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}
.profile-providers { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); }
.profile-provider {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-disabled);
  font-size: var(--font-sm);
}
.profile-provider.is-active { color: var(--text-primary); border-color: rgba(255, 255, 255, 0.25); }
.profile-provider__dot { color: var(--status-success); font-weight: var(--font-bold); }

.profile-logout { width: 100%; }

.profile-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: var(--primary-main);
  border-radius: 50%;
  margin: var(--spacing-lg) auto;
  animation: pspin 0.8s linear infinite;
}
@keyframes pspin { to { transform: rotate(360deg); } }
</style>
