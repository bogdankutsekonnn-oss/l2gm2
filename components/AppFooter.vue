<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-nav">
          <NuxtLink to="/">Анонсы</NuxtLink>
          <NuxtLink to="/rating">Рейтинг</NuxtLink>
          <NuxtLink to="/advertisement">Размещение</NuxtLink>
          <NuxtLink to="/blog">Блог</NuxtLink>
          <NuxtLink to="/about">О нас</NuxtLink>
          <NuxtLink to="/faq">FAQ</NuxtLink>
        </div>
        <div class="footer-actions">
          <NuxtLink to="/add-server" class="btn-primary">
            Добавить сервер
          </NuxtLink>
          <a href="https://t.me/l2gm" class="btn-telegram" target="_blank">
            Telegram
          </a>
          <a href="mailto:info@l2gm.com" class="btn-email">
            Email
          </a>
        </div>
        <div class="footer-links">
          <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
          <NuxtLink to="/terms">Пользовательское соглашение</NuxtLink>
          <NuxtLink to="/sitemap">Карта сайта</NuxtLink>
          <NuxtLink to="/cookies">Файлы Cookie</NuxtLink>
        </div>
        <div class="footer-copyright">
          © 2026 L2GM.com
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--bg-surface);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-xxl) 0 var(--spacing-lg);
  margin-top: var(--spacing-xxl);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.footer-nav {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.footer-nav a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-base);
}

.footer-nav a:hover {
  color: var(--text-primary);
}

.footer-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--primary-main);
  color: var(--primary-contrast);
  padding: 15px 24px;
  border-radius: 26px;
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
}

.btn-telegram,
.btn-email {
  background: var(--secondary-main);
  color: var(--secondary-contrast);
  padding: 15px 24px;
  border-radius: 26px;
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
}

.footer-links {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-sm);
}

.footer-copyright {
  color: var(--text-disabled);
  font-size: var(--font-sm);
  margin-top: var(--spacing-md);
}
</style>
