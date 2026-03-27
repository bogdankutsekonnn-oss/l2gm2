<template>
  <div class="about-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Политика конфиденциальности</h1>
      </div>

      <div class="page-layout">
        <div class="servers-column">
          <div class="about-content">
            <section class="about-section">
              <h2>Общие положения</h2>
              <p>
                Настоящая Политика конфиденциальности описывает, какие данные собирает сайт L2GM
                (l2gm.com), как они используются, хранятся и защищаются. Используя наш сайт,
                вы соглашаетесь с условиями данной политики.
              </p>
            </section>

            <section class="about-section">
              <h2>Какие данные мы собираем</h2>
              <p>
                При посещении сайта автоматически собирается следующая техническая информация:
                IP-адрес, тип и версия браузера (User-Agent), дата и время посещения, просматриваемые
                страницы. Эти данные собираются автоматически при взаимодействии с сайтом.
              </p>
              <p>
                При переходе на сервер через ссылку на нашем сайте (через /api/out.php) мы фиксируем
                факт клика: идентификатор сервера, IP-адрес, время перехода и User-Agent. Это необходимо
                для ведения статистики кликов по серверам.
              </p>
              <p>
                Мы также используем файлы cookie для обеспечения работы сайта и сохранения
                пользовательских настроек. Подробнее — на странице
                <NuxtLink to="/cookies/">Файлы Cookie</NuxtLink>.
              </p>
            </section>

            <section class="about-section">
              <h2>Цели сбора данных</h2>
              <p>
                Собранные данные используются для следующих целей: обеспечение корректной работы
                сайта и его функций, ведение статистики посещений и анализ аудитории, подсчёт кликов
                и переходов на серверы для отображения статистики, улучшение качества сервиса
                и пользовательского опыта, выявление и предотвращение технических проблем.
              </p>
            </section>

            <section class="about-section">
              <h2>Хранение и защита данных</h2>
              <p>
                Собранные данные хранятся на защищённых серверах. Мы принимаем разумные технические
                и организационные меры для защиты информации от несанкционированного доступа,
                изменения или уничтожения. Доступ к данным имеет ограниченный круг лиц,
                непосредственно связанных с администрированием сайта.
              </p>
              <p>
                Мы не продаём и не передаём персональные данные третьим лицам, за исключением
                случаев, предусмотренных законодательством.
              </p>
            </section>

            <section class="about-section">
              <h2>Сторонние сервисы</h2>
              <p>
                Для отображения шрифтов сайт использует сервис Google Fonts. При загрузке шрифтов
                серверы Google могут получать ваш IP-адрес и техническую информацию о браузере.
                Обработка данных Google регулируется их собственной политикой конфиденциальности.
              </p>
            </section>

            <section class="about-section">
              <h2>Права пользователей</h2>
              <p>
                Вы имеете право запросить информацию о данных, которые мы храним в связи с вашими
                посещениями, а также потребовать их удаления. Для этого свяжитесь с нами по электронной
                почте <a href="mailto:info@l2gm.com">info@l2gm.com</a> с указанием вашего запроса.
                Мы обработаем обращение в разумные сроки.
              </p>
            </section>

            <section class="about-section">
              <h2>Контакты</h2>
              <p>
                По всем вопросам, связанным с конфиденциальностью и обработкой данных, вы можете
                обратиться к нам:
              </p>
              <p>
                Email: <a href="mailto:info@l2gm.com">info@l2gm.com</a><br>
                Telegram: <a href="https://t.me/DamonLaptev" target="_blank" rel="noopener">@DamonLaptev</a>
              </p>
              <p>
                Последнее обновление: 27.03.2026
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
const canonicalUrl = getCanonicalUrl('/privacy/')

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: 'Политика конфиденциальности', url: '/privacy/' },
])

useHead({
  title: 'Политика конфиденциальности | L2GM',
  meta: [
    {
      name: 'description',
      content: 'Политика конфиденциальности L2GM. Узнайте, какие данные мы собираем, как их используем и защищаем.',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Политика конфиденциальности | L2GM' },
    { property: 'og:description', content: 'Политика конфиденциальности сайта L2GM — анонсы серверов Lineage 2.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Политика конфиденциальности | L2GM' },
    { name: 'twitter:description', content: 'Политика конфиденциальности сайта L2GM.' },
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
