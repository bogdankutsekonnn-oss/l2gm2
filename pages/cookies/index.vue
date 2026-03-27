<template>
  <div class="about-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Файлы Cookie</h1>
      </div>

      <div class="page-layout">
        <div class="servers-column">
          <div class="about-content">
            <section class="about-section">
              <h2>Что такое файлы cookie</h2>
              <p>
                Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве
                при посещении веб-сайтов. Они помогают сайту запоминать ваши предпочтения и обеспечивают
                корректную работу различных функций. L2GM использует файлы cookie для улучшения вашего
                опыта на сайте.
              </p>
            </section>

            <section class="about-section">
              <h2>Типы используемых cookie</h2>
              <p>
                <strong>Необходимые cookie.</strong> Эти файлы обеспечивают базовую работу сайта.
                К ним относятся сессионные cookie, которые поддерживают работу сайта во время вашего
                визита, а также cookie авторизации для администраторов. Без этих файлов сайт не сможет
                функционировать корректно. Они не могут быть отключены.
              </p>
              <p>
                <strong>Аналитические cookie.</strong> Мы можем использовать аналитические cookie для сбора
                обезличенной статистики посещений. Эти данные помогают нам понимать, как пользователи
                взаимодействуют с сайтом, и улучшать его работу.
              </p>
              <p>
                <strong>Функциональные cookie.</strong> Эти файлы запоминают ваши предпочтения — например,
                выбранные фильтры по хроникам и рейтам серверов, согласие на использование cookie
                и другие пользовательские настройки. Благодаря им вам не нужно настраивать параметры
                при каждом посещении.
              </p>
            </section>

            <section class="about-section">
              <h2>Сторонние cookie</h2>
              <p>
                Для отображения шрифтов на сайте мы используем сервис Google Fonts. При загрузке
                шрифтов Google может устанавливать свои файлы cookie и собирать определённую техническую
                информацию (IP-адрес, тип браузера). Подробнее об обработке данных Google можно
                узнать в их политике конфиденциальности.
              </p>
            </section>

            <section class="about-section">
              <h2>Управление файлами cookie</h2>
              <p>
                Вы можете управлять файлами cookie через настройки вашего браузера. Большинство
                современных браузеров позволяют блокировать или удалять cookie. Обратите внимание,
                что отключение cookie может повлиять на функциональность сайта.
              </p>
              <p>
                Как управлять cookie в популярных браузерах: откройте настройки браузера, перейдите
                в раздел конфиденциальности или безопасности, найдите параметры управления файлами cookie.
                Вы можете удалить существующие cookie, заблокировать все или некоторые cookie,
                а также настроить исключения для отдельных сайтов.
              </p>
            </section>

            <section class="about-section">
              <h2>Контакты</h2>
              <p>
                Если у вас есть вопросы относительно использования файлов cookie на нашем сайте,
                вы можете связаться с нами:
              </p>
              <p>
                Email: <a href="mailto:info@l2gm.com">info@l2gm.com</a><br>
                Telegram: <a href="https://t.me/DamonLaptev" target="_blank" rel="noopener">@DamonLaptev</a>
              </p>
            </section>
          </div>
        </div>

        <div class="filters-column">
          <FiltersPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getCanonicalUrl, generateBreadcrumbJsonLd } = useSeo()
const canonicalUrl = getCanonicalUrl('/cookies/')

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: 'Файлы Cookie', url: '/cookies/' },
])

useHead({
  title: 'Файлы Cookie | L2GM',
  meta: [
    {
      name: 'description',
      content: 'Политика использования файлов cookie на сайте L2GM. Узнайте, какие cookie мы используем и как ими управлять.',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Файлы Cookie | L2GM' },
    { property: 'og:description', content: 'Политика использования файлов cookie на сайте L2GM.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Файлы Cookie | L2GM' },
    { name: 'twitter:description', content: 'Политика использования файлов cookie на сайте L2GM.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
  ],
})
</script>

<style scoped>
.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.about-section {
  background: #1B1D1F;
  border-radius: 8px;
  padding: var(--spacing-xl);
}

.about-section h2 {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.about-section p {
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.7;
  margin: 0;
}

.about-section p + p {
  margin-top: var(--spacing-md);
}

.about-section p a {
  color: var(--primary-main);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.about-section p a:hover {
  color: var(--primary-hover);
}

.about-section p strong {
  color: var(--text-primary);
}
</style>
