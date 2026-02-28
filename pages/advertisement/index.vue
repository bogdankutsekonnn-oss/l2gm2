<template>
  <div class="advertisement-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Реклама и платное размещение</h1>
      </div>

      <div class="page-layout">
        <div class="servers-column ad-blocks">

          <!-- Брендирование сайта -->
          <div class="ad-block">
            <h2 class="ad-block__title">Брендирование сайта (фон/обложка)</h2>
            <span class="ad-block__badge ad-block__badge--available">ДОСТУПНО</span>

            <div class="ad-block__specs">
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Размер баннера (px)</span>
                <span class="ad-block__spec-value">1920×1080 px</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Возможные расширения</span>
                <span class="ad-block__spec-value">PNG,JPG</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Максимальный вес</span>
                <span class="ad-block__spec-value">500 kb</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Стоимость размещения (30 дней)</span>
                <span class="ad-block__spec-value">$100</span>
              </div>
            </div>

            <div class="ad-block__actions">
              <a href="https://t.me/l2gm" target="_blank" rel="noopener" class="btn-primary">
                Разместить баннер
              </a>
              <a href="https://www.figma.com/design/C0uIARQHjOlMubE0cNsoMv/template_banner_l2gm?node-id=1-28&t=UfngLCteYrS7wOkh-1" target="_blank" rel="noopener" class="btn-secondary">
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 24C6.208 24 8 22.208 8 20V16H4C1.792 16 0 17.792 0 20C0 22.208 1.792 24 4 24Z" fill="#0ACF83"/>
                  <path d="M0 12C0 9.792 1.792 8 4 8H8V16H4C1.792 16 0 14.208 0 12Z" fill="#A259FF"/>
                  <path d="M0 4C0 1.792 1.792 0 4 0H8V8H4C1.792 8 0 6.208 0 4Z" fill="#F24E1E"/>
                  <path d="M8 0H12C14.208 0 16 1.792 16 4C16 6.208 14.208 8 12 8H8V0Z" fill="#FF7262"/>
                  <path d="M16 12C16 14.208 14.208 16 12 16C9.792 16 8 14.208 8 12C8 9.792 9.792 8 12 8C14.208 8 16 9.792 16 12Z" fill="#1ABCFE"/>
                </svg>
                Шаблон баннера
              </a>
            </div>

            <div class="ad-block__warnings">
              <p>АНИМАЦИЯ В БРЕНДИРОВАНИИ НЕ ДОПУСКАЕТСЯ.</p>
              <p>СТАРАЙТЕСЬ ИЗБЕГАТЬ СЛИШКОМ РЕЗКИХ, ВЫРВИГЛАЗНЫХ И КОНТРАСТНЫХ СОЧЕТАНИЙ.</p>
              <p>МЫ МОЖЕМ ОТКАЗАТЬ В РАЗМЕЩЕНИИ ПОЗИЦИИ ПРИ НЕКАЧЕСТВЕННЫХ ИЛИ НЕПОДХОДЯЩИХ ПРОМО-МАТЕРИАЛАХ.</p>
            </div>
          </div>

          <!-- Баннерная реклама -->
          <div class="ad-block">
            <h2 class="ad-block__title">Баннерная реклама</h2>
            <span class="ad-block__badge ad-block__badge--available">ДОСТУПНО</span>

            <div class="ad-block__specs">
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Размер баннера (px)</span>
                <span class="ad-block__spec-value">240x400</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Возможные расширения</span>
                <span class="ad-block__spec-value">GIF, PNG, JPG</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Максимальный вес</span>
                <span class="ad-block__spec-value">200 кб</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Баннеров в ротации</span>
                <span class="ad-block__spec-value">До 5</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Тип ротации</span>
                <span class="ad-block__spec-value">Случайный показ</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Стоимость размещения (30 дней)</span>
                <span class="ad-block__spec-value">$14</span>
              </div>
            </div>

            <div class="ad-block__actions">
              <a href="https://t.me/l2gm" target="_blank" rel="noopener" class="btn-primary">
                Разместить баннер
              </a>
            </div>

            <div class="ad-block__warnings">
              <p>НЕ ПРИНИМАЕМ БАННЕРЫ С ЧРЕЗМЕРНО КИСЛОТНЫМИ ЦВЕТАМИ И «МИГАЮЩЕЙ» АНИМАЦИЕЙ.</p>
              <p>ЗАПРЕЩЕНЫ: НЕЦЕНЗУРНАЯ ЛЕКСИКА (ВКЛЮЧАЯ ЗАВУАЛИРОВАННУЮ), ЭРОТИКА/ПОРНОГРАФИЯ, ПРИЗЫВЫ К НАСИЛИЮ.</p>
              <p>НЕЛЬЗЯ ВВОДИТЬ ПОЛЬЗОВАТЕЛЕЙ В ЗАБЛУЖДЕНИЕ И ИСПОЛЬЗОВАТЬ «ЧЁРНЫЕ» МАРКЕТИНГОВЫЕ ПРИЁМЫ.</p>
            </div>
          </div>

          <!-- Стандартное VIP размещение -->
          <div class="ad-block">
            <h2 class="ad-block__title">Стандартное VIP размещение</h2>

            <div class="ad-block__card-preview">
              <ServerCard :server="topPreviewServer" />
            </div>

            <div class="ad-block__specs">
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Стоимость (30 дней)</span>
                <span class="ad-block__spec-value">$9</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Эконом размещение* с нашей кнопкой (30 дней)</span>
                <span class="ad-block__spec-value">$5</span>
              </div>
            </div>

            <ul class="ad-block__features">
              <li><strong>VIP размещение:</strong> сервер получает метку VIP, поднимается выше обычных серверов в списке и выделяется более заметным оформлением.</li>
              <li><strong>Эконом размещение*:</strong> при выборе "эконом" нужно установить нашу кнопку на главной странице сайта сервера. Удалять кнопку и/или менять её код до окончания срока размещения запрещено.</li>
            </ul>

            <div class="ad-block__actions">
              <a href="https://t.me/l2gm" target="_blank" rel="noopener" class="btn-primary">
                Разместить сервер
              </a>
            </div>
          </div>

          <!-- VIP размещение -->
          <div class="ad-block">
            <h2 class="ad-block__title">VIP размещение</h2>

            <div class="ad-block__card-preview">
              <ServerCard :server="vipPreviewServer" />
            </div>

            <div class="ad-block__specs">
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Стоимость в левой колонке (30 дней)</span>
                <span class="ad-block__spec-value">$20</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Стоимость в правой колонке (30 дней)</span>
                <span class="ad-block__spec-value">$20</span>
              </div>
            </div>

            <p class="ad-block__description">VIP серверы получают оригинальный дизайн и отображаются в отдельном блоке в верхней части страниц подбора. Также они дополнительно показываются в остальных блоках, занимая позиции выше стандартных VIP.</p>

            <div class="ad-block__actions">
              <a href="https://t.me/l2gm" target="_blank" rel="noopener" class="btn-primary">
                Разместить сервер
              </a>
            </div>
          </div>

          <!-- Премиум размещение -->
          <div class="ad-block">
            <h2 class="ad-block__title">Премиум размещение</h2>

            <div class="ad-block__card-preview">
              <ServerCard :server="premiumPreviewServer" />
            </div>

            <div class="ad-block__specs">
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Стоимость в левой колонке (30 дней)</span>
                <span class="ad-block__spec-value">$40</span>
              </div>
              <div class="ad-block__spec">
                <span class="ad-block__spec-label">Стоимость в правой колонке (30 дней)</span>
                <span class="ad-block__spec-value">$40</span>
              </div>
            </div>

            <p class="ad-block__description">Премиум — максимальная заметность: самый яркий дизайн и размещение в самом верху страниц подбора серверов. Плюс дублирование в других блоках — выше обычных и VIP позиций.</p>

            <div class="ad-block__actions">
              <a href="https://t.me/l2gm" target="_blank" rel="noopener" class="btn-primary">
                Разместить сервер
              </a>
            </div>
          </div>

        </div>

        <div class="filters-column">
          <FiltersPanel />
        </div>
      </div>

      <SeoSection
        title="Реклама серверов Lineage 2 на L2GM"
        :text="seoText"
      />
    </div>
  </div>
</template>

<script setup>
const topPreviewServer = {
  name: 'SERVER NAME',
  rate: 'x100K',
  chronicle: 'Interlude+',
  startDate: '2025-08-22',
  cardType: 'top',
  icons: [],
  url: '#',
}

const vipPreviewServer = {
  name: 'SERVER NAME',
  rate: 'x100K',
  chronicle: 'Interlude+',
  startDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  cardType: 'vip',
  icons: [],
  url: '#',
}

const premiumPreviewServer = {
  name: 'SERVER NAME',
  rate: 'x100K',
  chronicle: 'Interlude+',
  startDate: new Date().toISOString().split('T')[0],
  cardType: 'premium',
  icons: [],
  url: '#',
}

const seoText = `Продвижение сервера Lineage 2 начинается с правильного размещения. L2GM предлагает несколько форматов рекламы: от баннеров и брендирования до выделенных позиций в каталоге серверов. Каждый формат решает свою задачу — привлечь внимание на старте, выделиться среди конкурентов или закрепиться в топе выдачи.

Баннерная реклама и брендирование фона работают на узнаваемость проекта. Администратор загружает готовый креатив, и он показывается всем посетителям сайта. Ротация баннеров распределяет показы равномерно, а шаблоны в Figma упрощают подготовку материалов под нужные размеры.

VIP и Премиум статусы меняют позицию сервера в общем рейтинге. Карточка с повышенным статусом отображается выше остальных, получает уникальное визуальное оформление и дублируется в нескольких разделах каталога. Это особенно эффективно в период открытия, когда конкуренция за внимание игроков максимальна.

Все тарифы рассчитаны на 30-дневный цикл размещения. Для серверов с ограниченным бюджетом доступен эконом-вариант: установите кнопку L2GM на сайт проекта и получите VIP-статус по сниженной цене. Подробности и оформление — через Telegram.`

const { getCanonicalUrl } = useSeo()
const canonicalUrl = getCanonicalUrl('/advertisement')

useHead({
  title: 'Реклама сервера Lineage 2 | Размещение в топе L2GM',
  meta: [
    {
      name: 'description',
      content: 'Разместите сервер Lineage 2 в топе L2GM. Тарифы: Premium, VIP статусы, баннеры. Бесплатное размещение при установке кнопки.'
    },
    { name: 'keywords', content: 'реклама сервера lineage 2, размещение л2, топ серверов, vip статус, premium, баннер lineage 2, продвижение сервера л2, анонс сервера lineage' },
    { property: 'og:title', content: 'Реклама сервера Lineage 2 | L2GM' },
    { property: 'og:description', content: 'Разместите сервер Lineage 2 в топе L2GM. Premium, VIP статусы и рекламные баннеры.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Реклама сервера Lineage 2 | L2GM' },
    { name: 'twitter:description', content: 'Тарифы размещения серверов в топе L2GM.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<style scoped>
.ad-blocks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Ad block */
.ad-block {
  background: #1B1D1F;
  border-radius: 8px;
  padding: var(--spacing-xl);
}

.ad-block__title {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.ad-block__badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ad-block__badge--available {
  background: #4BD28514;
  color: #4BD285;
}

/* Card preview */
.ad-block__card-preview {
  margin-top: var(--spacing-md);
  max-width: 50%;
  pointer-events: none;
}

@media (max-width: 640px) {
  .ad-block__card-preview {
    max-width: 100%;
  }
}

/* Features list */
.ad-block__features {
  list-style: none;
  padding: 0;
  margin: var(--spacing-md) 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ad-block__features li {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.6;
  padding-left: var(--spacing-md);
  position: relative;
}

.ad-block__features li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--text-secondary);
}

.ad-block__features li strong {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}

/* Specs table */
.ad-block__specs {
  margin-top: var(--spacing-md);
  display: flex;
  flex-direction: column;
}

.ad-block__spec {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.ad-block__spec-label {
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.ad-block__spec-value {
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
}

/* Description */
.ad-block__description {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.6;
  margin: var(--spacing-md) 0 0;
}

/* Actions */
.ad-block__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

@media (max-width: 640px) {
  .ad-block__actions {
    flex-direction: column;
    align-items: stretch;
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: var(--primary-main);
  color: var(--primary-contrast);
  border-radius: var(--radius-button);
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-sm);
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border-radius: var(--radius-button);
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-sm);
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* Warnings */
.ad-block__warnings {
  margin-top: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ad-block__warnings p {
  color: #AE6E00;
  font-size: var(--font-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  line-height: 1.5;
  margin: 0;
}
</style>
