<template>
  <header class="app-header" :class="{ 'is-sticky': isSticky }">
    <div class="container">
      <div class="header-content">
        <div class="header-left">
          <NuxtLink to="/" class="logo">
            <span>L2GM</span>
          </NuxtLink>
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
      </div>
    </div>
  </header>
</template>

<script setup>
const isSticky = ref(false)

onMounted(() => {
  const handleScroll = () => {
    isSticky.value = window.scrollY > 0
  }
  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped>
.app-header {
  background: var(--bg-surface);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.app-header.is-sticky {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
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

.btn-primary {
  background: var(--primary-main);
  color: var(--primary-contrast);
  padding: 12px 20px;
  border-radius: 36px;
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover);
}
</style>
