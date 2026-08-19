<template>
  <div class="user-menu">
    <!-- Не вошёл -->
    <button v-if="!user" type="button" class="user-menu__login" @click="openModal('login')">
      Войти
    </button>

    <!-- Вошёл -->
    <div v-else class="user-menu__account" ref="root">
      <button type="button" class="user-menu__avatar-btn" @click="toggle" :aria-expanded="open">
        <img
          v-if="user.photo_url"
          :src="user.photo_url"
          :alt="displayName"
          class="user-menu__avatar"
          width="32"
          height="32"
          referrerpolicy="no-referrer"
        />
        <span v-else class="user-menu__avatar user-menu__avatar--ph">{{ initial }}</span>
        <span v-if="showName" class="user-menu__name">{{ displayName }}</span>
      </button>

      <Transition name="user-menu-drop">
        <div v-if="open" class="user-menu__dropdown">
          <div class="user-menu__head">
            <div class="user-menu__head-name">{{ displayName }}</div>
            <div v-if="user.email" class="user-menu__head-email">{{ user.email }}</div>
          </div>
          <NuxtLink to="/profile/" class="user-menu__item" @click="open = false">Профиль</NuxtLink>
          <button type="button" class="user-menu__item user-menu__item--danger" @click="onLogout">Выйти</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Показывать имя рядом с аватаром (в мобильном меню — да, в шапке — нет)
  showName: { type: Boolean, default: false },
})

const { user, logout } = useAuth()
const { open: openModal } = useAuthModal()

const open = ref(false)
const root = ref(null)

const displayName = computed(() => user.value?.display_name || user.value?.email || 'Профиль')
const initial = computed(() => (displayName.value || '?').trim().charAt(0).toUpperCase())

function toggle() { open.value = !open.value }

async function onLogout() {
  open.value = false
  await logout()
}

function onClickOutside(e) {
  if (open.value && root.value && !root.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.user-menu { display: flex; align-items: center; }

.user-menu__login {
  background: var(--secondary-main);
  color: var(--text-primary);
  padding: 12px 20px;
  border-radius: var(--radius-button);
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
  white-space: nowrap;
}
.user-menu__login:hover { background: var(--secondary-hover); }

.user-menu__account { position: relative; }

.user-menu__avatar-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  font-family: inherit;
}

.user-menu__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.user-menu__avatar--ph {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-main);
  color: #fff;
  font-weight: var(--font-bold);
  font-size: var(--font-base);
}

.user-menu__name {
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: var(--font-medium);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  padding: 6px;
  z-index: 150;
}

.user-menu__head {
  padding: 8px 10px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 4px;
}
.user-menu__head-name {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-menu__head-email {
  color: var(--text-disabled);
  font-size: var(--font-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu__item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 10px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: var(--font-base);
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.user-menu__item:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
.user-menu__item--danger:hover { color: var(--status-error); }

.user-menu-drop-enter-active,
.user-menu-drop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.user-menu-drop-enter-from,
.user-menu-drop-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
