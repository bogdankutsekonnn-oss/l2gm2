<template>
  <div class="placement-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Реклама и платное размещение</h1>
      </div>

      <div class="page-layout">
        <div class="servers-column placement-blocks">
          <section class="test-boost" aria-labelledby="test-boost-title">
            <div class="test-boost__intro">
              <span class="section-eyebrow">Специальное предложение</span>
              <div class="test-boost__heading">
                <h2 id="test-boost-title">Test Boost</h2>
                <p><strong>$7</strong><span>— 7 дней</span></p>
              </div>
              <a
                href="https://t.me/L2gmcom"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary telegram-button test-boost__action"
              >
                Попробовать Test Boost
              </a>
              <p class="test-boost__disclaimer">Test Boost можно приобрести только один раз для одного сервера.</p>
            </div>

            <ul class="test-boost__features">
              <li>A-Grade статус</li>
              <li>Бейдж «Рекомендуем»</li>
              <li>Правый баннер 240 × 400 px</li>
              <li>Мини-отчёт по кликам</li>
              <li>Ротация баннера каждые 5 секунд</li>
            </ul>
          </section>

          <section class="placement-section comparison-section" aria-labelledby="comparison-title">
            <div class="section-heading">
              <span class="section-eyebrow">Форматы размещения</span>
              <h2 id="comparison-title">Сравнение тарифов</h2>
            </div>

            <div class="comparison-table" role="table" aria-label="Сравнение форматов размещения">
              <div class="comparison-table__head" role="row">
                <div role="columnheader">Пример отображения</div>
                <div role="columnheader">Позиция</div>
                <div role="columnheader">Стоимость</div>
              </div>

              <article
                v-for="item in comparisonItems"
                :key="item.id"
                class="comparison-row"
                role="row"
              >
                <div class="comparison-row__preview" role="cell">
                  <span class="comparison-row__mobile-label">Пример отображения</span>
                  <div class="server-card-preview" @click.prevent>
                    <ServerCard :server="item.server" />
                  </div>
                </div>

                <div class="comparison-row__position" role="cell">
                  <span class="comparison-row__mobile-label">Позиция</span>
                  <strong>{{ item.position }}</strong>
                  <small v-if="item.note">{{ item.note }}</small>
                </div>

                <div class="comparison-row__price" role="cell">
                  <span class="comparison-row__mobile-label">Стоимость</span>
                  <strong :class="{ 'comparison-row__free': item.isFree }">{{ item.price }}</strong>
                  <NuxtLink v-if="item.isFree" to="/add-server/">Добавить сервер</NuxtLink>
                </div>
              </article>
            </div>

            <div class="comparison-configurator">
              <div class="section-heading comparison-configurator__heading">
                <span class="section-eyebrow">Настройте размещение</span>
                <h3 id="plans-title">Тариф и срок</h3>
                <p>Выберите подходящий формат и длительность размещения.</p>
              </div>

              <div class="plan-selector" role="radiogroup" aria-labelledby="plans-title">
                <fieldset
                  v-for="plan in placementPlans"
                  :key="plan.id"
                  :class="['plan-card', { 'plan-card--active': selectedPlanId === plan.id }]"
                >
                  <legend class="sr-only">{{ plan.name }}</legend>
                  <div class="plan-card__info">
                    <strong>{{ plan.name }}</strong>
                    <small>от {{ formatPrice(plan.weeklyPrice) }} / 7 дней</small>
                  </div>

                  <div class="duration-grid">
                    <label
                      v-for="duration in placementDurations"
                      :key="duration.days"
                      :class="[
                        'duration-option',
                        { 'duration-option--active': isSelectedOption(plan.id, duration.days) },
                      ]"
                    >
                      <input
                        v-model="selectedOption"
                        type="radio"
                        name="placement-option"
                        :value="getOptionValue(plan.id, duration.days)"
                      >
                      <span class="duration-option__content">
                        <span>{{ duration.days }} дней</span>
                        <strong>{{ formatPrice(calculatePlacementPrice(plan.weeklyPrice, duration.days, duration.discount)) }}</strong>
                      </span>
                      <small v-if="duration.discount" class="discount-badge">−{{ duration.discount }}%</small>
                    </label>
                  </div>
                </fieldset>
              </div>

              <div class="order-summary" aria-live="polite" aria-labelledby="summary-title">
                <div>
                  <span class="section-eyebrow">Ваш выбор</span>
                  <h3 id="summary-title">{{ selectedPlan.name }} · {{ selectedDuration.days }} дней</h3>
                </div>
                <dl class="order-summary__details">
                  <div>
                    <dt>Тариф</dt>
                    <dd>{{ selectedPlan.name }}</dd>
                  </div>
                  <div>
                    <dt>Срок</dt>
                    <dd>{{ selectedDuration.days }} дней</dd>
                  </div>
                  <div class="order-summary__total">
                    <dt>Итого</dt>
                    <dd>{{ formatPrice(selectedPrice) }}</dd>
                  </div>
                </dl>
                <a
                  href="https://t.me/L2gmcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary telegram-button"
                >
                  Связаться
                </a>
              </div>
            </div>
          </section>

          <section class="placement-section banner-section" aria-labelledby="banner-title">
            <div class="section-heading">
              <span class="section-eyebrow">Брендирование сайта</span>
              <h2 id="banner-title">Баннерная реклама</h2>
              <p>Схема показывает расположение рекламных форматов на страницах L2GM.</p>
            </div>

            <div class="banner-layout">
              <article class="banner-slot banner-slot--header">
                <div class="banner-slot__content">
                  <div class="banner-slot__heading">
                    <h3>Header-баннер</h3>
                    <span class="availability-chip">Свободно</span>
                  </div>
                  <dl>
                    <div><dt>Размер</dt><dd>1920 × 600 px</dd></div>
                    <div><dt>Стоимость</dt><dd>$15 / неделя</dd></div>
                  </dl>
                </div>
                <a
                  href="https://t.me/L2gmcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary telegram-button"
                >
                  Связаться
                </a>
              </article>

              <div class="server-skeleton" aria-label="Схема списка серверов">
                <span class="server-skeleton__title">Список серверов</span>
                <div class="server-skeleton__columns" aria-hidden="true">
                  <div v-for="column in 2" :key="column" class="server-skeleton__column">
                    <span v-for="row in 5" :key="row"></span>
                  </div>
                </div>
              </div>

              <article class="banner-slot banner-slot--right">
                <div class="banner-slot__content">
                  <div class="banner-slot__heading">
                    <h3>Правый баннер</h3>
                    <span class="availability-chip">Свободно</span>
                  </div>
                  <dl>
                    <div><dt>Размер</dt><dd>240 × 400 px</dd></div>
                    <div><dt>Стоимость</dt><dd>$7 / неделя</dd></div>
                  </dl>
                </div>
                <a
                  href="https://t.me/L2gmcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary telegram-button"
                >
                  Связаться
                </a>
              </article>
            </div>
          </section>

          <section class="blog-review" aria-labelledby="blog-review-title">
            <div class="blog-review__content">
              <span class="section-eyebrow">Дополнительно</span>
              <h2 id="blog-review-title">Обзор сервера в блоге</h2>
              <div class="blog-review__price">
                <strong>$8</strong>
                <span>— стоимость</span>
              </div>
              <p>Разместим нативный обзор вашего проекта в блоге L2GM: расскажем о сервере, его особенностях, старте, бонусах и добавим CTA-ссылку на ваш сайт.</p>
            </div>
            <a
              href="https://t.me/L2gmcom"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary telegram-button blog-review__action"
            >
              Хочу обзор
            </a>
          </section>
        </div>

        <div class="filters-column">
          <FiltersPanel />
        </div>
      </div>

      <SeoSection
        title="Реклама серверов Lineage 2 на L2GM"
        :text="seoText"
        :links="placementLinks"
      />
    </div>
  </div>
</template>

<script setup>
const placementPlans = [
  {
    id: 's-grade',
    name: 'S-Grade',
    weeklyPrice: 7,
  },
  {
    id: 'a-grade',
    name: 'A-Grade',
    weeklyPrice: 5,
  },
  {
    id: 'b-grade',
    name: 'B-Grade',
    weeklyPrice: 3,
  },
]

const placementDurations = [
  { days: 7, discount: 0 },
  { days: 14, discount: 15 },
  { days: 21, discount: 20 },
  { days: 28, discount: 30 },
]

const calculatePlacementPrice = (weeklyPrice, days, discount) => {
  const weeks = days / 7
  const baseTotal = weeklyPrice * weeks
  const finalTotal = baseTotal * (1 - discount / 100)

  return Math.round(finalTotal * 100) / 100
}

const comparisonItems = [
  {
    id: 's-grade',
    name: 'S-Grade',
    position: 'Первые места в списке',
    note: '1–2 места в каждой колонке',
    price: '7 дней — $7',
    server: {
      id: 'placement-s-grade-preview',
      name: 'S-Grade сервер',
      rate: 100,
      chronicle: 'High Five',
      startDate: '',
      cardType: 'premium',
      icons: [],
      url: '',
    },
  },
  {
    id: 'a-grade',
    name: 'A-Grade',
    position: 'Сразу после S-Grade серверов',
    note: 'Возможна фиксация на 2–5 позициях',
    price: '7 дней — $5',
    server: {
      id: 'placement-a-grade-preview',
      name: 'A-Grade сервер',
      rate: 50,
      chronicle: 'Interlude',
      startDate: '',
      cardType: 'vip',
      icons: [],
      url: '',
    },
  },
  {
    id: 'b-grade',
    name: 'B-Grade',
    position: 'В общем списке',
    note: '',
    price: '7 дней — $3',
    server: {
      id: 'placement-b-grade-preview',
      name: 'B-Grade сервер',
      rate: 10,
      chronicle: 'Essence',
      startDate: '',
      cardType: 'top',
      icons: [],
      url: '',
    },
  },
  {
    id: 'free',
    name: 'Бесплатное размещение',
    position: 'В общем списке',
    note: '',
    price: 'Бесплатно',
    isFree: true,
    server: {
      id: 'placement-free-preview',
      name: 'Free сервер',
      rate: 1,
      chronicle: 'Epilogue',
      startDate: '',
      cardType: 'basic',
      icons: [],
      url: '',
    },
  },
]

const selectedOption = ref('s-grade:7')

const getOptionValue = (planId, days) => `${planId}:${days}`

const selectedPlanId = computed(() => selectedOption.value.split(':')[0])
const selectedDays = computed(() => Number(selectedOption.value.split(':')[1]))
const selectedPlan = computed(() => (
  placementPlans.find(plan => plan.id === selectedPlanId.value) || placementPlans[0]
))
const selectedDuration = computed(() => (
  placementDurations.find(duration => duration.days === selectedDays.value) || placementDurations[0]
))
const selectedPrice = computed(() => calculatePlacementPrice(
  selectedPlan.value.weeklyPrice,
  selectedDuration.value.days,
  selectedDuration.value.discount,
))

const isSelectedOption = (planId, days) => selectedOption.value === getOptionValue(planId, days)
const formatPrice = price => `$${Number(price.toFixed(2))}`

const seoText = `Размещение сервера на L2GM — это способ продвижения проекта Lineage 2 через каталог серверов с ежедневной аудиторией игроков. L2GM предлагает несколько форматов рекламы: платные статусы S-Grade, A-Grade и B-Grade, баннерную рекламу и нативные обзоры в блоге. Каждый формат решает свою задачу — привлечь внимание на старте, выделиться среди конкурентов или закрепиться в топе выдачи.

Как работают статусы S-Grade, A-Grade и B-Grade? Это платные статусы, которые меняют позицию сервера в каталоге и оформление карточки. S-Grade ($7 за 7 дней) закрепляет сервер на первых местах списка с максимально заметным дизайном. A-Grade ($5 за 7 дней) размещает проект сразу после S-Grade серверов, возможна фиксация на 2–5 позициях. B-Grade ($3 за 7 дней) выделяет карточку в общем списке. При заказе на 14, 21 или 28 дней действуют скидки до 30%.

Что такое баннерная реклама на L2GM? Доступны два формата: header-баннер размером 1920x600 пикселей в шапке сайта ($15 в неделю) и правый баннер 240x400 пикселей в боковой колонке ($7 в неделю). Поддерживаются форматы GIF, PNG и JPG.

Для знакомства с площадкой есть Test Boost — недельный пакет за $7, в который входят A-Grade статус, бейдж «Рекомендуем», правый баннер и мини-отчёт по кликам. Test Boost можно приобрести только один раз для одного сервера. Также доступен нативный обзор сервера в блоге L2GM за $8.

Базовое размещение в каталоге бесплатно — достаточно установить кнопку L2GM на сайт проекта. Оформление платного размещения — через Telegram.`

const placementLinks = [
  { to: '/add-server/', text: 'Добавить сервер' },
  { to: '/', text: 'Новые сервера Л2' },
  { to: '/pvp/', text: 'PvP сервера' },
  { to: '/chronicle/interlude/', text: 'Сервера Interlude' },
  { to: '/chronicle/high-five/', text: 'Сервера High Five' },
  { to: '/chronicle/essence/', text: 'Сервера Essence' },
]

const { getCanonicalUrl, getOgImageMeta, generateBreadcrumbJsonLd } = useSeo()
const canonicalUrl = getCanonicalUrl('/placement/')

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: 'Размещение', url: '/placement/' },
])
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Размещение серверов Lineage 2 на L2GM',
  description: 'Рекламное размещение серверов Lineage 2: статусы S-Grade, A-Grade, B-Grade и баннерная реклама.',
  url: canonicalUrl,
  provider: {
    '@type': 'Organization',
    name: 'L2GM',
    url: 'https://l2gm.com',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'S-Grade размещение (7 дней)',
      price: '7',
      priceCurrency: 'USD',
    },
    {
      '@type': 'Offer',
      name: 'A-Grade размещение (7 дней)',
      price: '5',
      priceCurrency: 'USD',
    },
    {
      '@type': 'Offer',
      name: 'B-Grade размещение (7 дней)',
      price: '3',
      priceCurrency: 'USD',
    },
    {
      '@type': 'Offer',
      name: 'Бесплатное размещение',
      price: '0',
      priceCurrency: 'USD',
    },
  ],
}

useHead({
  title: 'Реклама сервера Lineage 2 | Размещение в топе L2GM',
  meta: [
    {
      name: 'description',
      content: 'Разместите сервер Lineage 2 в топе L2GM. Тарифы S-Grade, A-Grade и B-Grade от $3 за 7 дней, баннеры, обзоры в блоге. Бесплатное размещение при установке кнопки.'
    },
    { name: 'keywords', content: 'реклама сервера lineage 2, размещение сервера, топ серверов, s-grade статус, баннер lineage 2, продвижение сервера, анонс сервера lineage' },
    { property: 'og:title', content: 'Реклама сервера Lineage 2 | L2GM' },
    { property: 'og:description', content: 'Разместите сервер Lineage 2 в топе L2GM. Статусы S-Grade, A-Grade, B-Grade и рекламные баннеры.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    ...getOgImageMeta(),
    { name: 'twitter:title', content: 'Реклама сервера Lineage 2 | L2GM' },
    { name: 'twitter:description', content: 'Тарифы размещения серверов в топе L2GM.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(serviceJsonLd) },
  ],
})
</script>


<style scoped>
.placement-page {
  padding: var(--spacing-lg) 0;
  overflow-x: clip;
}

.placement-blocks {
  gap: var(--spacing-lg);
}

.placement-section,
.test-boost,
.order-summary,
.blog-review {
  min-width: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  background: #1b1d1f;
}

.placement-section {
  padding: var(--spacing-lg);
}

.section-heading {
  margin-bottom: var(--spacing-lg);
}

.section-heading h2,
.section-heading h3,
.order-summary h2,
.order-summary h3,
.blog-review h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-h2);
  line-height: 1.25;
}

.section-heading p,
.blog-review p {
  max-width: 680px;
  margin: var(--spacing-xs) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.6;
}

.section-eyebrow {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: #ff8a5c;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.telegram-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-height: 44px;
  padding: 10px 20px;
  border: 0;
  font-size: var(--font-base);
  white-space: nowrap;
}

.test-boost::after {
  display: none;
}

.telegram-button img {
  flex: 0 0 auto;
}

.telegram-button:focus-visible,
.comparison-row__price a:focus-visible,
.duration-option:focus-within {
  outline: 2px solid var(--text-primary);
  outline-offset: 3px;
}

.telegram-button:active {
  transform: translateY(1px);
}

.test-boost {
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(420px, 1.2fr);
  align-items: stretch;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  border-color: rgba(255, 112, 56, 0.36);
  background: linear-gradient(110deg, #24201f 0%, #1b1d1f 60%);
}

.test-boost__intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.test-boost__heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-xs);
}

.test-boost__heading h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.15;
}

.test-boost__heading p {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0;
  color: var(--text-secondary);
  white-space: nowrap;
}

.test-boost__heading strong {
  color: var(--text-primary);
  font-size: var(--font-xl);
}

.test-boost__disclaimer {
  margin: var(--spacing-lg) 0 0;
  color: var(--text-disabled);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.02em;
  line-height: 1.45;
  text-transform: uppercase;
}

.test-boost__action {
  margin-top: var(--spacing-lg);
}

.test-boost__features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  align-content: center;
  gap: var(--spacing-md);
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.test-boost__features li {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 56px;
  padding: 8px 16px 8px 42px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.07);
  color: var(--text-primary);
  font-size: var(--font-sm);
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.test-boost__features li::before {
  position: absolute;
  left: 16px;
  color: var(--status-success);
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  content: '✓';
}

.comparison-table {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--radius-sm);
  background: #121416;
}

.comparison-table__head,
.comparison-row {
  display: grid;
  grid-template-columns: minmax(340px, 1.55fr) minmax(170px, 0.85fr) minmax(120px, 0.5fr);
}

.comparison-table__head {
  color: var(--text-disabled);
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.comparison-table__head > div,
.comparison-row > div {
  min-width: 0;
  padding: var(--spacing-md);
}

.comparison-table__head > div + div,
.comparison-row > div + div {
  border-left: 1px solid rgba(255, 255, 255, 0.07);
}

.comparison-row {
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.server-card-preview {
  min-width: 0;
}

.server-card-preview :deep(.server-card) {
  cursor: default;
}

.server-card-preview :deep(.server-card__date:empty::before) {
  color: var(--text-disabled);
  font-size: 10px;
  content: 'Не указано';
  text-transform: none;
}

.comparison-row__position,
.comparison-row__price {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.comparison-row__position strong,
.comparison-row__price strong {
  color: var(--text-primary);
  font-size: var(--font-sm);
}

.comparison-row__position small {
  color: var(--text-disabled);
  font-size: var(--font-xs);
}

.comparison-row__price .comparison-row__free {
  color: var(--status-success);
}

.comparison-row__price a {
  color: var(--primary-main);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-decoration: none;
}

.comparison-row__price a:hover {
  color: var(--text-primary);
}

.comparison-row__mobile-label {
  display: none;
}

.comparison-configurator {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.comparison-configurator__heading h3 {
  font-size: var(--font-h2);
}

.plan-selector {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-md);
}

.plan-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(145px, 0.45fr) minmax(0, 1.55fr);
  align-items: center;
  gap: var(--spacing-lg);
  min-width: 0;
  margin: 0;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  background: #121416;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
}

.plan-card--active {
  border-color: var(--primary-main);
  background: #1f1c1c;
}

.plan-card--active::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--primary-main);
  content: '';
}

.plan-card__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
  color: var(--text-primary);
}

.plan-card__info strong {
  font-size: var(--font-lg);
}

.plan-card__info small {
  color: var(--text-disabled);
  font-size: var(--font-xs);
  font-weight: var(--font-regular);
  white-space: nowrap;
}

.duration-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
  min-width: 0;
}

.duration-option {
  position: relative;
  min-width: 0;
  min-height: 60px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.025);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}

.duration-option:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.05);
}

.duration-option:active {
  transform: translateY(1px);
}

.duration-option--active {
  border-color: var(--primary-main);
  background: rgba(200, 40, 0, 0.13);
}

.duration-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.duration-option__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
  color: var(--text-secondary);
  font-size: var(--font-xs);
  text-align: center;
}

.duration-option__content strong {
  color: var(--text-primary);
  font-size: var(--font-sm);
}

.discount-badge {
  position: absolute;
  top: 5px;
  right: 7px;
  padding: 2px 5px;
  border-radius: var(--radius-full);
  background: rgba(40, 167, 69, 0.18);
  color: #59cb72;
  font-size: 9px;
  font-weight: var(--font-bold);
}

.order-summary {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(300px, 1.4fr) auto;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  border-color: rgba(200, 40, 0, 0.45);
  background: #201b1b;
}

.order-summary__details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
}

.order-summary__details > div {
  min-width: 0;
  padding: 0 var(--spacing-md);
  border-left: 1px solid rgba(255, 255, 255, 0.09);
}

.order-summary__details dt {
  color: var(--text-disabled);
  font-size: var(--font-xs);
}

.order-summary__details dd {
  margin: 2px 0 0;
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  overflow-wrap: anywhere;
}

.order-summary__details .order-summary__total dd {
  color: #ff8a5c;
  font-size: var(--font-xl);
}

.banner-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 230px;
  gap: var(--spacing-md);
}

.banner-slot,
.server-skeleton {
  min-width: 0;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  border-radius: var(--radius-sm);
  background: #15181a;
}

.banner-slot {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.banner-slot--header {
  grid-column: 1 / -1;
  min-height: 190px;
  flex-direction: row;
  align-items: flex-end;
}

.banner-slot--right {
  min-height: 300px;
}

.banner-slot__content {
  min-width: 0;
}

.banner-slot__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
}

.banner-slot h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-lg);
}

.availability-chip {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  background: rgba(40, 167, 69, 0.18);
  color: #59cb72;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
}

.banner-slot dl {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin: var(--spacing-md) 0 0;
}

.banner-slot dl > div {
  min-width: 0;
}

.banner-slot dt {
  color: var(--text-disabled);
  font-size: var(--font-xs);
}

.banner-slot dd {
  margin: 1px 0 0;
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
}

.server-skeleton {
  min-height: 300px;
  padding: var(--spacing-lg);
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.07);
  background: #0c0e10;
}

.server-skeleton__title {
  display: block;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
}

.server-skeleton__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);
}

.server-skeleton__column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 0;
}

.server-skeleton__column span {
  display: block;
  height: 22px;
  border-radius: var(--radius-sm);
  background: #202427;
}

.blog-review {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
}

.blog-review__content {
  min-width: 0;
}

.blog-review__price {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.blog-review__price > span {
  color: var(--text-secondary);
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
}

.blog-review__price > strong {
  color: var(--text-primary);
  font-size: var(--font-xl);
}

.blog-review__action {
  justify-self: end;
}

.blog-review__content > p {
  margin-top: var(--spacing-lg);
}

@media (max-width: 1180px) and (min-width: 1025px) {
  .test-boost {
    grid-template-columns: minmax(230px, 0.75fr) minmax(360px, 1.25fr);
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }

  .plan-selector {
    grid-template-columns: 1fr;
  }

  .order-summary {
    grid-template-columns: 1fr auto;
  }

  .order-summary__details {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}

@media (max-width: 900px) {
  .test-boost {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
  }

  .plan-selector {
    grid-template-columns: 1fr;
  }

  .order-summary {
    grid-template-columns: 1fr auto;
  }

  .order-summary__details {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}

@media (max-width: 800px) {
  .comparison-table {
    border: 0;
    background: transparent;
  }

  .comparison-table__head {
    display: none;
  }

  .comparison-row {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: var(--radius-sm);
    background: #121416;
  }

  .comparison-row + .comparison-row {
    margin-top: var(--spacing-md);
  }

  .comparison-row > div + div {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    border-left: 0;
  }

  .comparison-row__mobile-label {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: var(--text-disabled);
    font-size: var(--font-xs);
    font-weight: var(--font-bold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .banner-layout {
    grid-template-columns: 1fr;
  }

  .banner-slot--header {
    grid-column: auto;
    min-height: 220px;
  }

  .banner-slot--right {
    min-height: 280px;
  }
}

@media (max-width: 640px) {
  .placement-page {
    padding: 0;
  }

  .placement-section,
  .test-boost,
  .order-summary,
  .blog-review {
    padding: var(--spacing-md);
  }

  .section-heading h2,
  .order-summary h2,
  .blog-review h2 {
    font-size: 20px;
  }

  .test-boost {
    grid-template-columns: 1fr;
  }

  .test-boost__features {
    grid-template-columns: 1fr;
  }

  .test-boost__action {
    width: 100%;
  }

  .plan-card {
    grid-template-columns: 1fr;
  }

  .duration-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .order-summary {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .order-summary__details {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .order-summary__details > div {
    padding: 0 var(--spacing-sm);
  }

  .order-summary__details > div:first-child {
    padding-left: 0;
    border-left: 0;
  }

  .order-summary > .telegram-button {
    width: 100%;
  }

  .banner-slot--header {
    flex-direction: column;
    align-items: stretch;
  }

  .banner-slot .telegram-button {
    width: 100%;
  }

  .server-skeleton__columns {
    grid-template-columns: 1fr;
  }

  .server-skeleton__column:nth-child(2) {
    display: none;
  }

  .blog-review {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .blog-review__action {
    justify-self: stretch;
    width: 100%;
  }
}

@media (max-width: 390px) {
  .placement-section,
  .test-boost,
  .order-summary,
  .blog-review {
    padding: 14px;
  }

  .test-boost__heading {
    flex-wrap: wrap;
    gap: var(--spacing-xs) var(--spacing-md);
  }

  .duration-grid {
    grid-template-columns: 1fr;
  }

  .duration-option {
    min-height: 58px;
  }

  .order-summary__details {
    gap: var(--spacing-sm);
  }

  .order-summary__details > div {
    padding: 0;
    border-left: 0;
  }

  .order-summary__details dd,
  .order-summary__details .order-summary__total dd {
    font-size: var(--font-sm);
  }
}
</style>
