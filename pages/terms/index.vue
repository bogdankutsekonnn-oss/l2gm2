<template>
  <div class="about-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Пользовательское соглашение</h1>
      </div>

      <div class="page-layout">
        <div class="servers-column">
          <div class="about-content">
            <section class="about-section">
              <h2>1. Общие положения</h2>
              <p>
                Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между
                администрацией сайта L2GM (l2gm.com) и пользователями сайта. L2GM — это платформа
                для размещения анонсов и рейтинга серверов Lineage 2.
              </p>
              <p>
                Используя сайт, вы подтверждаете, что ознакомились с условиями настоящего Соглашения
                и принимаете их в полном объёме. Если вы не согласны с каким-либо пунктом,
                пожалуйста, воздержитесь от использования сайта.
              </p>
            </section>

            <section class="about-section">
              <h2>2. Предоставляемые услуги</h2>
              <p>
                L2GM предоставляет следующие услуги: размещение анонсов серверов Lineage 2 с указанием
                хроники, рейтов, даты открытия и другой информации; фильтрация и поиск серверов
                по различным параметрам (хроника, рейты, дата старта, теги); ведение рейтинга серверов
                на основе статистики и активности; календарь открытий серверов.
              </p>
              <p>
                Администрация оставляет за собой право изменять, дополнять или прекращать
                предоставление любых услуг без предварительного уведомления.
              </p>
            </section>

            <section class="about-section">
              <h2>3. Обязанности пользователей</h2>
              <p>
                Пользователи обязуются не размещать спам, рекламу и нежелательный контент на сайте;
                не предоставлять заведомо ложную информацию о серверах; не предпринимать попыток
                нарушить работу сайта (DDoS-атаки, инъекции, эксплуатация уязвимостей);
                не использовать автоматизированные средства для массового сбора данных с сайта;
                не выдавать себя за администрацию L2GM или других сервисов.
              </p>
              <p>
                При добавлении сервера владелец обязуется предоставлять достоверную информацию
                о проекте: корректную хронику, рейты, дату открытия и рабочий адрес сайта сервера.
              </p>
            </section>

            <section class="about-section">
              <h2>4. Правила размещения серверов</h2>
              <p>
                Размещение серверов осуществляется через форму добавления на сайте. Базовое размещение
                может быть бесплатным, премиальные и VIP-размещения являются платными услугами.
                Условия и стоимость размещения указаны на
                <NuxtLink to="/placement/">странице размещения</NuxtLink>.
              </p>
              <p>
                Администрация L2GM оставляет за собой право модерировать размещённые серверы:
                редактировать информацию для соответствия стандартам сайта, отклонять или удалять
                серверы, нарушающие правила, а также приостанавливать размещение без возврата средств
                в случае грубых нарушений.
              </p>
            </section>

            <section class="about-section">
              <h2>5. Ограничение ответственности</h2>
              <p>
                L2GM является информационной площадкой и не несёт ответственности за качество,
                стабильность и работоспособность размещённых серверов Lineage 2; за действия
                администрации серверов и их отношения с игроками; за возможные убытки, возникшие
                в результате использования информации с сайта; за временную недоступность сайта
                по техническим причинам.
              </p>
              <p>
                Вся информация о серверах предоставляется их владельцами. L2GM прилагает разумные
                усилия для проверки данных, но не гарантирует их полную достоверность.
              </p>
            </section>

            <section class="about-section">
              <h2>6. Интеллектуальная собственность</h2>
              <p>
                Дизайн сайта, логотип, тексты, программный код и другие элементы L2GM являются
                интеллектуальной собственностью администрации сайта и защищены соответствующим
                законодательством. Копирование, распространение или использование материалов сайта
                без письменного разрешения запрещено.
              </p>
              <p>
                Lineage 2 является зарегистрированной торговой маркой компании NCSOFT Corporation.
                L2GM не аффилирован с NCSOFT и не претендует на права, связанные с данной торговой маркой.
              </p>
            </section>

            <section class="about-section">
              <h2>7. Изменения в Соглашении</h2>
              <p>
                Администрация L2GM вправе вносить изменения в настоящее Соглашение в любое время
                без предварительного уведомления. Актуальная версия Соглашения всегда доступна
                на данной странице. Продолжая использовать сайт после внесения изменений,
                вы принимаете обновлённые условия.
              </p>
            </section>

            <section class="about-section">
              <h2>8. Контакты</h2>
              <p>
                По всем вопросам, связанным с настоящим Соглашением, вы можете обратиться
                к администрации:
              </p>
              <p>
                Email: <a href="mailto:info@l2gm.com">info@l2gm.com</a><br>
                Telegram: <a href="https://t.me/DamonLaptev" target="_blank" rel="noopener">@DamonLaptev</a>
              </p>
              <p>
                Дата вступления в силу: 27.03.2026
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
const canonicalUrl = getCanonicalUrl('/terms/')

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: 'Пользовательское соглашение', url: '/terms/' },
])

useHead({
  title: 'Пользовательское соглашение | L2GM',
  meta: [
    {
      name: 'description',
      content: 'Пользовательское соглашение сайта L2GM. Условия использования платформы анонсов серверов Lineage 2.',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Пользовательское соглашение | L2GM' },
    { property: 'og:description', content: 'Пользовательское соглашение сайта L2GM — платформы анонсов серверов Lineage 2.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Пользовательское соглашение | L2GM' },
    { name: 'twitter:description', content: 'Пользовательское соглашение сайта L2GM.' },
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
