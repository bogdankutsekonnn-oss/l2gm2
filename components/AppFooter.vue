<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <!-- Левая часть: логотип и копирайт -->
        <div class="footer-brand">
          <NuxtLink to="/" class="footer-logo">
            <img src="/logo.svg" alt="L2GM - Анонсы серверов Lineage 2" />
          </NuxtLink>
          <div class="footer-copyright">© 2025. L2GM.COM</div>
        </div>

        <!-- Правая часть: колонки + соцсети -->
        <div class="footer-right">
          <!-- Колонки с ссылками -->
          <div class="footer-columns">
            <!-- Рекламодателям -->
            <div class="footer-column">
              <h4 class="footer-column-title">РЕКЛАМОДАТЕЛЯМ</h4>
              <nav class="footer-column-links">
                <NuxtLink to="/advertisement">Размещение</NuxtLink>
                <NuxtLink to="/add-server">Добавить сервер</NuxtLink>
              </nav>
            </div>

            <!-- Информация -->
            <div class="footer-column">
              <h4 class="footer-column-title">ИНФОРМАЦИЯ</h4>
              <nav class="footer-column-links">
                <NuxtLink to="/">Анонс серверов</NuxtLink>
                <NuxtLink to="/about">О нас</NuxtLink>
              </nav>
            </div>

            <!-- Информация (правая) -->
            <div class="footer-column">
              <h4 class="footer-column-title">ИНФОРМАЦИЯ</h4>
              <nav class="footer-column-links">
                <NuxtLink to="/cookies">Файлы Cookie</NuxtLink>
                <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
                <NuxtLink to="/terms">Пользовательское соглашение</NuxtLink>
                <NuxtLink to="/sitemap">Карта сайта</NuxtLink>
              </nav>
            </div>
          </div>

          <!-- Социальные иконки -->
          <div class="footer-social">
            <a href="https://t.me/l2gm" target="_blank" class="social-link" aria-label="Telegram">
              <img src="/images/social/telegram.svg" alt="Telegram" width="40" height="40" />
            </a>
            <a href="mailto:info@l2gm.com" class="social-link" aria-label="Email">
              <img src="/images/social/mail.svg" alt="Email" width="40" height="40" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--bg-surface);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-xxl) 0;
  position: relative;
  z-index: 50;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.footer-right {
  display: flex;
  align-items: flex-start;
  gap: 64px;
}

.footer-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.footer-logo img {
  height: 32px;
  width: auto;
}

.footer-copyright {
  color: var(--text-disabled);
  font-size: var(--font-sm);
  margin-top: auto;
}

.footer-columns {
  display: flex;
  gap: 64px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer-column-title {
  color: var(--text-disabled);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.footer-column-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-column-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-sm);
  transition: color 0.2s;
}

.footer-column-links a:hover {
  color: var(--text-primary);
}

.footer-social {
  display: flex;
  gap: var(--spacing-sm);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.social-link:hover {
  opacity: 0.8;
}

.social-link img {
  display: block;
}

@media (max-width: 1024px) {
  .footer-content {
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .footer-brand {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .footer-right {
    width: 100%;
    flex-wrap: wrap;
    gap: var(--spacing-xl);
  }

  .footer-columns {
    flex-wrap: wrap;
    gap: var(--spacing-xl);
  }

  .footer-social {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .footer-brand {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .footer-right {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .footer-columns {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
}
</style>
