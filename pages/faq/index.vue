<template>
  <div class="faq-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Часто задаваемые вопросы</h1>
      </div>

      <div class="page-layout">
        <div class="servers-column">
          <div class="faq-section">
            <div class="faq-list">
              <div
                v-for="(item, index) in faqItems"
                :key="index"
                :class="['faq-item', { 'faq-item--open': openFaq === index }]"
              >
                <button class="faq-item__header" @click="toggleFaq(index)">
                  <span class="faq-item__number">{{ index + 1 }}.</span>
                  <span class="faq-item__question">{{ item.question }}</span>
                  <span class="faq-item__icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4V20"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4 12H20"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <Transition name="faq-expand">
                  <div v-if="openFaq === index" class="faq-item__body">
                    <p v-html="item.answer"></p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <div class="filters-column">
          <FiltersPanel />
        </div>
      </div>

      <SeoSection
        title="FAQ — Часто задаваемые вопросы о L2GM"
        :text="seoText"
      />
    </div>
  </div>
</template>

<script setup>
const { getCanonicalUrl, generateBreadcrumbJsonLd } = useSeo()
const canonicalUrl = getCanonicalUrl('/faq/')

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: 'Частые вопросы', url: '/faq/' },
])

const openFaq = ref(null)

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}

const faqItems = [
  {
    question: 'Что такое L2GM и как это работает?',
    answer:
      'L2GM — это анонсер серверов Lineage 2. Мы собираем актуальные открытия и действующие проекты в одном месте, чтобы игрокам было проще находить интересные серверы, а администраторам — получать целевой трафик.<br><br>Пользователь заходит на сайт, выбирает подходящий сервер по хроникам, рейтам и дате старта, после чего переходит на сайт проекта. Владельцы серверов могут добавить свой анонс и выбрать формат размещения для большего охвата.',
  },
  {
    question: 'Для кого подходит L2GM?',
    answer:
      'L2GM подходит как для <strong>игроков</strong>, которые ищут новые серверы Lineage 2 для игры, так и для <strong>администраторов серверов</strong>, которые хотят привлечь игроков на свой проект. Игроки используют удобные фильтры по хроникам, рейтам и датам, а админы получают целевую аудиторию и статистику переходов.',
  },
  {
    question: 'Как найти подходящий сервер?',
    answer:
      'Используйте фильтры на главной странице: выберите нужную <strong>хронику</strong> (Interlude, High Five, Essence и др.), <strong>рейт</strong> (x1, x100, x1000 и т.д.) или воспользуйтесь <strong>календарём</strong> для поиска серверов по дате открытия. Также доступны теги: PvP, GVE, мультипрофа, лоу рейты и другие.',
  },
  {
    question: 'Как добавить свой сервер на сайт?',
    answer:
      'Перейдите на страницу <a href="/add-server/">Добавить сервер</a>, заполните форму с данными о вашем проекте и отправьте заявку. Все заявки проходят ручную модерацию. Для бесплатного размещения необходимо установить нашу кнопку на сайт сервера.',
  },
  {
    question: 'Какие данные нужны для добавления сервера?',
    answer:
      'Для добавления сервера потребуется: <strong>название</strong> проекта, <strong>ссылка</strong> на сайт, <strong>хроника</strong>, <strong>рейт</strong>, <strong>дата открытия</strong>, email для связи и контакт (Telegram/VK). Также можно выбрать тариф размещения и дополнительные бейджи (бонус-старт, ОБТ и др.).',
  },
  {
    question: 'Что означают рекламные форматы размещения?',
    answer:
      'Мы предлагаем несколько форматов: <strong>Бесплатный</strong> — базовая карточка в общем списке (нужна кнопка на сайте). <strong>VIP</strong> — выделенная карточка с приоритетом в списке. <strong>Premium</strong> — максимальная видимость с анимированной карточкой и верхней позицией. Подробности на странице <a href="/placement/">Размещение</a>.',
  },
  {
    question: 'Кому подойдёт Premium или VIP размещение?',
    answer:
      'Premium и VIP подойдут серверам, которые хотят <strong>максимальный охват</strong> на старте. Выделенное оформление карточки и приоритетная позиция в списке значительно увеличивают количество переходов. Это особенно эффективно для серверов, открывающихся в ближайшие дни.',
  },
  {
    question: 'Кому подойдёт обычное размещение?',
    answer:
      'Бесплатное размещение подойдёт серверам, которые только запускаются и хотят попробовать площадку. Ваш сервер появится в общем списке с базовой карточкой. Единственное условие — установить кнопку L2GM на сайт вашего сервера.',
  },
  {
    question: 'Кому подойдут баннеры и другие рекламные места?',
    answer:
      'Баннерная реклама подойдёт проектам, которые хотят <strong>максимальную узнаваемость</strong>. Баннеры размещаются в боковой панели и на видных местах сайта. Это эффективный инструмент для привлечения внимания к серверу ещё до момента открытия.',
  },
  {
    question: 'Как связаться с нами или предложить улучшение сервиса?',
    answer:
      'Вы можете написать нам в <a href="https://t.me/DamonLaptev" target="_blank" rel="noopener">Telegram</a>, на почту <a href="mailto:info@l2gm.com">info@l2gm.com</a> или через <a href="/about/">страницу контактов</a>. Мы открыты к предложениям и обратной связи!',
  },
]

// FAQPage JSON-LD schema for Google rich results
const stripHtml = (html) => html.replace(/<[^>]*>/g, '')

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: stripHtml(item.answer),
    },
  })),
}

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(faqJsonLd) },
  ],
})

const seoText = `Ответы на частые вопросы о работе L2GM — портала анонсов серверов Lineage 2. Узнайте, как добавить сервер, какие форматы размещения доступны, как найти подходящий проект для игры и как связаться с нами.

L2GM помогает игрокам быстро находить новые серверы по хроникам, рейтам и дате старта. Для администраторов серверов доступны бесплатные и платные форматы размещения с разным уровнем видимости и приоритета.

Если у вас остались вопросы, которых нет в этом разделе — напишите нам через Telegram или форму обратной связи.`

useHead({
  title: 'Частые вопросы (FAQ) | L2GM - анонсы серверов Lineage 2',
  meta: [
    {
      name: 'description',
      content: 'Ответы на частые вопросы о L2GM: как добавить сервер, форматы размещения, поиск серверов Lineage 2, тарифы и контакты.',
    },
    { name: 'keywords', content: 'l2gm faq, частые вопросы, lineage 2, добавить сервер, размещение серверов, анонсы серверов' },
    { property: 'og:title', content: 'Частые вопросы | L2GM' },
    { property: 'og:description', content: 'Ответы на частые вопросы о работе L2GM — портала анонсов серверов Lineage 2.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Частые вопросы | L2GM' },
    { name: 'twitter:description', content: 'Ответы на частые вопросы о работе L2GM.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<style scoped>
.faq-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: 0;
}

/* FAQ */
.faq-section {
  margin-top: var(--spacing-md);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.faq-item {
  background: #06080a;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.faq-item__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.2s;
}

.faq-item:not(.faq-item--open) .faq-item__header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.faq-item__number {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--primary-main);
  flex-shrink: 0;
  min-width: 24px;
}

.faq-item__question {
  font-size: var(--font-lg);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  line-height: 1.4;
  flex: 1;
}

.faq-item__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.faq-item--open .faq-item__icon {
  transform: rotate(45deg);
}

.faq-item__body {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  padding-left: calc(var(--spacing-lg) + 24px + var(--spacing-md));
}

.faq-item__body p {
  margin: 0;
  font-size: var(--font-base);
  color: var(--text-secondary);
  line-height: 1.7;
}

.faq-item__body :deep(a) {
  color: var(--primary-main);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.faq-item__body :deep(a:hover) {
  color: var(--primary-hover);
}

.faq-item__body :deep(strong) {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}

/* FAQ animation */
.faq-expand-enter-active,
.faq-expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.faq-expand-enter-to,
.faq-expand-leave-from {
  opacity: 1;
  max-height: 300px;
}

@media (max-width: 1024px) {
  .faq-item__header {
    padding: 16px;
  }

  .faq-item__question {
    font-size: var(--font-base);
  }

  .faq-item__body {
    padding: 0 16px 16px;
    padding-left: calc(16px + 24px + var(--spacing-md));
  }
}
</style>
