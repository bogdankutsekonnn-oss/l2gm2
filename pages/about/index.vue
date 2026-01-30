<template>
  <div class="about-page">
    <Breadcrumbs />
    <div class="page-header">
      <h1>О нас</h1>
      <h2>L2GM - ваш надежный источник информации о серверах Lineage 2</h2>
    </div>

    <div class="about-content">
      <section class="about-section">
        <h3>Наша миссия</h3>
        <p>
          Мы создали L2GM для того, чтобы игроки Lineage 2 могли легко находить 
          качественные серверы, которые соответствуют их предпочтениям. Наш сайт 
          предоставляет актуальную информацию о новых и существующих серверах, 
          их характеристиках и датах открытия.
        </p>
      </section>

      <section class="about-section">
        <h3>Что мы предлагаем</h3>
        <ul class="features-list">
          <li>Актуальный список серверов всех хроник и рейтов</li>
          <li>Удобная система фильтрации по различным параметрам</li>
          <li>SEO-оптимизированные страницы для лучшего поиска</li>
          <li>Честная модерация и проверка серверов</li>
          <li>Новости и статьи о Lineage 2</li>
        </ul>
      </section>

      <section class="about-section">
        <h3>Для владельцев серверов</h3>
        <p>
          Если вы владелец сервера Lineage 2, вы можете добавить его на наш сайт 
          бесплатно или выбрать один из платных тарифов для более заметного размещения. 
          Мы предлагаем различные варианты продвижения: от обычного размещения до 
          премиум статуса с приоритетным отображением.
        </p>
      </section>

      <section class="about-section">
        <h3>Контакты</h3>
        <p>
          Если у вас есть вопросы или предложения, свяжитесь с нами:
        </p>
        <div class="contact-links">
          <a href="https://t.me/l2gm" target="_blank" class="contact-link">
            Telegram
          </a>
          <a href="mailto:info@l2gm.com" class="contact-link">
            Email
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const { getCanonicalUrl } = useSeo()
const canonicalUrl = getCanonicalUrl('/about')

useHead({
  title: 'О нас | L2GM - анонсы серверов Lineage 2',
  meta: [
    {
      name: 'description',
      content: 'L2GM - платформа для поиска серверов Lineage 2. Актуальные анонсы, удобные фильтры, честная модерация. Размещение серверов для владельцев.'
    },
    { name: 'keywords', content: 'l2gm, о нас, lineage 2, анонсы серверов, размещение серверов л2' },
    // Open Graph
    { property: 'og:title', content: 'О нас | L2GM' },
    { property: 'og:description', content: 'L2GM - платформа для поиска серверов Lineage 2. Актуальные анонсы, удобные фильтры, честная модерация.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    // Twitter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'О нас | L2GM' },
    { name: 'twitter:description', content: 'L2GM - платформа для поиска серверов Lineage 2.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<style scoped>
.about-page {
  padding: var(--spacing-lg) 0;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xxl);
  text-align: center;
}

.page-header h1 {
  font-size: var(--font-h1);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.page-header h2 {
  font-size: var(--font-h2);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxl);
}

.about-section {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.about-section h3 {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.about-section p {
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.features-list li {
  color: var(--text-secondary);
  font-size: var(--font-base);
  padding-left: var(--spacing-lg);
  position: relative;
}

.features-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--status-success);
  font-weight: var(--font-bold);
}

.contact-links {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.contact-link {
  background: var(--primary-main);
  color: var(--primary-contrast);
  padding: 12px 24px;
  border-radius: 26px;
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  transition: background 0.2s;
  display: inline-block;
}

.contact-link:hover {
  background: var(--primary-hover);
}
</style>
