<template>
  <header class="app-header" :class="{ 'is-sticky': isSticky }">
    <div class="container">
      <div class="header-content">
        <div class="header-left">
          <NuxtLink to="/" class="logo">
            <img src="/logo.svg" alt="L2GM - Анонсы серверов Lineage 2" />
          </NuxtLink>
        </div>
        <div>
          <nav class="nav-links">
            <NuxtLink to="/">Анонсы</NuxtLink>
            <NuxtLink to="/rating">Рейтинг</NuxtLink>
            <NuxtLink to="/advertisement">Размещение</NuxtLink>
            <NuxtLink to="/blog">Блог</NuxtLink>
            <NuxtLink to="/about">О нас</NuxtLink>
            <NuxtLink to="/faq">FAQ</NuxtLink>
          </nav>
        </div>
        <div class="header-right">
          <NuxtLink to="/add-server" class="btn-primary">
            Добавить сервер
          </NuxtLink>
        </div>

        <!-- Бургер (только мобильный) -->
        <button class="burger-btn" @click="menuOpen = true" aria-label="Открыть меню">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16H3V14H21V16ZM21 10H3V8H21V10Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Мобильное меню drawer -->
  <Teleport to="body">
    <Transition name="menu-drawer">
      <div v-if="menuOpen" class="mobile-menu-overlay" @click.self="menuOpen = false">
        <div class="mobile-menu">
          <div class="mobile-menu__header">
            <NuxtLink to="/" class="logo" @click="menuOpen = false">
              <img src="/logo.svg" alt="L2GM" />
            </NuxtLink>
            <button class="mobile-menu__close" @click="menuOpen = false" aria-label="Закрыть меню">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <nav class="mobile-menu__nav">
            <NuxtLink to="/" @click="menuOpen = false">Анонсы</NuxtLink>
            <NuxtLink to="/rating" @click="menuOpen = false">Рейтинг</NuxtLink>
            <NuxtLink to="/advertisement" @click="menuOpen = false">Размещение</NuxtLink>
            <NuxtLink to="/blog" @click="menuOpen = false">Блог</NuxtLink>
            <NuxtLink to="/about" @click="menuOpen = false">О нас</NuxtLink>
            <NuxtLink to="/faq" @click="menuOpen = false">FAQ</NuxtLink>
          </nav>
          <div class="mobile-menu__footer">
            <NuxtLink to="/add-server" class="btn-primary" @click="menuOpen = false">
              Добавить сервер
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const isSticky = ref(false)
const menuOpen = ref(false)

const handleScroll = () => {
  isSticky.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header {
  background: var(--bg-surface);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-md) 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.app-header.is-sticky {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.logo {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-base);
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--text-primary);
}

/* Бургер — только мобильный */
.burger-btn {
  display: none;
}

/* Мобильное меню */
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.mobile-menu {
  width: 280px;
  height: 100%;
  background: var(--bg-surface);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.mobile-menu__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.mobile-menu__close:hover {
  color: var(--text-primary);
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 4px;
  flex: 1;
}

.mobile-menu__nav a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-lg);
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: color 0.2s;
}

.mobile-menu__nav a:last-child {
  border-bottom: none;
}

.mobile-menu__nav a:hover,
.mobile-menu__nav a.router-link-active {
  color: var(--text-primary);
}

.mobile-menu__footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.mobile-menu__footer .btn-primary {
  width: 100%;
  display: block;
  text-align: center;
}

/* Анимация меню (справа) */
.menu-drawer-enter-active,
.menu-drawer-leave-active {
  transition: opacity 0.25s ease;
}

.menu-drawer-enter-active .mobile-menu,
.menu-drawer-leave-active .mobile-menu {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.menu-drawer-enter-from,
.menu-drawer-leave-to {
  opacity: 0;
}

.menu-drawer-enter-from .mobile-menu,
.menu-drawer-leave-to .mobile-menu {
  transform: translateX(100%);
}

@media (max-width: 1024px) {
  .burger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    margin-left: 16px;
    color: var(--text-primary);
  }

  .nav-links,
  .header-right {
    display: none;
  }
}
</style>
