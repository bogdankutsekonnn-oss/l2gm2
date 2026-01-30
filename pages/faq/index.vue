<template>
  <div class="faq-page">
    <Breadcrumbs />
    <div class="page-header">
      <h1>Часто задаваемые вопросы</h1>
      <h2>Ответы на популярные вопросы о серверах Lineage 2</h2>
    </div>

    <div class="faq-content">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="faq-item"
      >
        <button
          class="faq-question"
          :class="{ 'is-open': openIndex === index }"
          @click="toggleFaq(index)"
        >
          <span>{{ faq.question }}</span>
          <span class="faq-icon">{{ openIndex === index ? '−' : '+' }}</span>
        </button>
        <div
          v-if="openIndex === index"
          class="faq-answer"
        >
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const openIndex = ref(null)

const faqs = [
  {
    question: 'Как добавить свой сервер на сайт?',
    answer: 'Для добавления сервера перейдите на страницу "Добавить сервер", заполните форму с информацией о вашем сервере (название, URL, хроники, рейты, дата старта) и укажите ваш email. После модерации ваш сервер появится на сайте.'
  },
  {
    question: 'Сколько стоит размещение сервера?',
    answer: 'У нас есть несколько тарифов размещения: Premium статус ($10/день), VIP статус ($10/день), обычное размещение ($10/день) и дополнительные акценты. Также доступно бесплатное размещение при условии размещения нашего баннера на вашем сайте. Подробнее на странице "Размещение".'
  },
  {
    question: 'Как часто обновляется список серверов?',
    answer: 'Список серверов обновляется ежедневно. Мы добавляем новую информацию о серверах, обновляем даты старта и актуализируем данные о рейтах и хрониках.'
  },
  {
    question: 'Что означают статусы PREM, VIP и TOP?',
    answer: 'PREM (Premium) - премиум размещение, сервер отображается выше всех остальных. VIP - вип статус с особым значком. TOP - топовый сервер, рекомендованный нами.'
  },
  {
    question: 'Как фильтровать серверы по хроникам и рейтам?',
    answer: 'Используйте панель фильтров справа на главной странице. Вы можете выбрать конкретную хронику или рейт, либо использовать комбинированные фильтры. Каждый фильтр ведет на отдельную SEO-страницу.'
  },
  {
    question: 'Можно ли изменить информацию о сервере после добавления?',
    answer: 'Да, вы можете связаться с нами через Telegram или Email (ссылки в футере) и запросить изменение информации о вашем сервере.'
  },
  {
    question: 'Как получить статус "Рекомендуем" для сервера?',
    answer: 'Статус "Рекомендуем" присваивается серверам, которые соответствуют нашим критериям качества: стабильная работа, хороший онлайн, активное сообщество. Также этот статус можно получить через платное размещение.'
  },
  {
    question: 'Что делать, если мой сервер не отображается на сайте?',
    answer: 'Проверьте, что вы правильно заполнили форму добавления сервера и прошли проверку reCaptcha. Если сервер все еще не появился, свяжитесь с нами для уточнения причины.'
  }
]

const toggleFaq = (index) => {
  if (openIndex.value === index) {
    openIndex.value = null
  } else {
    openIndex.value = index
  }
}

const { getCanonicalUrl } = useSeo()
const canonicalUrl = getCanonicalUrl('/faq')

// JSON-LD разметка FAQ
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
}

useHead({
  title: 'FAQ | Часто задаваемые вопросы о серверах Lineage 2 - L2GM',
  meta: [
    {
      name: 'description',
      content: 'Ответы на частые вопросы: как добавить сервер, стоимость размещения, статусы Premium и VIP, фильтрация серверов Lineage 2.'
    },
    { name: 'keywords', content: 'faq lineage 2, вопросы л2, добавить сервер, размещение сервера, vip статус' },
    // Open Graph
    { property: 'og:title', content: 'FAQ | L2GM' },
    { property: 'og:description', content: 'Ответы на частые вопросы о серверах Lineage 2 и работе сайта L2GM.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    // Twitter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'FAQ | L2GM' },
    { name: 'twitter:description', content: 'Ответы на частые вопросы о серверах Lineage 2.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqJsonLd),
    },
  ],
})
</script>

<style scoped>
.faq-page {
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

.faq-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.faq-item {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  padding: var(--spacing-lg);
  text-align: left;
  color: var(--text-primary);
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.faq-question:hover {
  background: rgba(255, 255, 255, 0.05);
}

.faq-question.is-open {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.faq-icon {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--primary-main);
  min-width: 24px;
  text-align: center;
}

.faq-answer {
  padding: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.8;
}

.faq-answer p {
  margin: 0;
}
</style>
