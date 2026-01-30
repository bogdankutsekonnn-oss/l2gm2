<template>
  <div class="advertisement-page">
    <Breadcrumbs />
    <div class="page-header">
      <h1>Реклама сервера lineage 2</h1>
      <h2>Тарифы размещения в л2 топе серверов</h2>
      <p class="disclaimer">
        После оказания в надлежащем качестве платной услуги, деньги, потраченные на ее приобретение, возврату не подлежат. В случае, если услуга не была оказана в полной мере или была оказана в ненадлежащем качестве.
      </p>
    </div>

    <div class="tariffs-grid">
      <!-- Premium -->
      <div class="tariff-card">
        <h3>Премиум статус</h3>
        <div class="card-preview">
          <div class="server-card-preview">
            <span class="status-badge status-premium">PREM</span>
            <span class="server-name-preview">Название сервера</span>
          </div>
        </div>
        <ul class="tariff-features">
          <li>Вашему серверу добавляется значок</li>
          <li>Серверу присваивается VIP статус</li>
          <li>Сервер висит выше, чем все остальные VIP сервера</li>
        </ul>
        <div class="tariff-price">1 день - $10</div>
        <a href="https://t.me/l2gm" target="_blank" class="btn-contact">
          Связаться
        </a>
      </div>

      <!-- VIP Status -->
      <div class="tariff-card">
        <h3>VIP статус</h3>
        <div class="card-preview">
          <div class="server-card-preview">
            <span class="status-badge status-vip">VIP</span>
            <span class="server-name-preview">Название сервера</span>
          </div>
        </div>
        <ul class="tariff-features">
          <li>Вашему серверу добавляется значок</li>
          <li>Серверу присваивается VIP статус</li>
          <li>Сервер висит выше, чем все остальные VIP сервера</li>
        </ul>
        <div class="tariff-price">1 день - $10</div>
        <a href="https://t.me/l2gm" target="_blank" class="btn-contact">
          Связаться
        </a>
      </div>

      <!-- Regular VIP -->
      <div class="tariff-card">
        <h3>Обычное размещение</h3>
        <div class="card-preview">
          <div class="server-card-preview">
            <span class="status-badge status-vip-gray">VIP</span>
            <span class="server-name-preview">Название сервера</span>
          </div>
        </div>
        <ul class="tariff-features">
          <li>Вашему серверу добавляется значок</li>
          <li>Серверу присваивается VIP статус</li>
          <li>Сервер висит выше, чем все остальные VIP сервера</li>
        </ul>
        <div class="tariff-price">1 день - $10</div>
        <a href="https://t.me/l2gm" target="_blank" class="btn-contact">
          Связаться
        </a>
      </div>

      <!-- Additional Accents -->
      <div class="tariff-card">
        <h3>Дополнительные акценты</h3>
        <div class="badges-preview">
          <span class="badge-preview" title="Рекомендуем">⭐</span>
          <span class="badge-preview" title="Горячий старт">🔥</span>
          <span class="badge-preview" title="Бонус старт">🎁</span>
        </div>
        <p class="tariff-description">
          Для бесплатного добавления сервера в наш l2top серверов lineage 2 разместите нашу кнопку на главной странице вашего сайта. Выберите нужный баннер и скопируйте HTML-код ниже:
        </p>
        <div class="tariff-price">1 день - $10</div>
        <a href="https://t.me/l2gm" target="_blank" class="btn-contact">
          Связаться
        </a>
      </div>

      <!-- Top Banner -->
      <div class="tariff-card">
        <h3>Обои сайта</h3>
        <div class="banner-preview-large">
          <span>Баннер 1920x600px</span>
        </div>
        <ul class="tariff-features">
          <li>Размер 1920х600</li>
          <li>Сервер висит выше чем все остальные VIP сервера</li>
        </ul>
      </div>

      <!-- Filter Banner -->
      <div class="tariff-card">
        <h3>Баннер в фильтре</h3>
        <div class="banner-preview-small">
          <span>Баннер 282x470px</span>
        </div>
        <ul class="tariff-features">
          <li>Размер 282x470</li>
          <li>Сервер висит выше чем все остальные VIP сервера</li>
        </ul>
      </div>

      <!-- Free Placement Banner -->
      <div class="tariff-card">
        <h3>Баннер для бесплатного размещения</h3>
        <p class="tariff-description">
          Для бесплатного добавления сервера в наш l2top серверов lineage 2 разместите нашу кнопку на главной странице вашего сайта. Выберите нужный баннер и скопируйте HTML-код ниже:
        </p>
        <div class="banner-selector">
          <label class="radio-option">
            <input type="radio" name="banner-type" value="light" v-model="selectedBanner" />
            <span>Светлый баннер</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="banner-type" value="dark" v-model="selectedBanner" />
            <span>Тёмный баннер</span>
          </label>
        </div>
        <div class="code-input-group">
          <input
            :value="bannerCode"
            readonly
            class="code-input"
          />
          <button @click="copyCode" class="btn-copy">
            Копировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedBanner = ref('light')

const bannerCode = computed(() => {
  const baseUrl = 'https://l2gm.com'
  if (selectedBanner.value === 'light') {
    return `<a href="${baseUrl}"><img src="${baseUrl}/banners/light.png" alt="L2GM" width="88" height="32"></a>`
  } else {
    return `<a href="${baseUrl}"><img src="${baseUrl}/banners/dark.png" alt="L2GM" width="88" height="32"></a>`
  }
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(bannerCode.value)
    alert('Код скопирован!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const { getCanonicalUrl } = useSeo()
const canonicalUrl = getCanonicalUrl('/advertisement')

useHead({
  title: 'Реклама сервера Lineage 2 | Размещение в топе L2GM',
  meta: [
    {
      name: 'description',
      content: 'Разместите сервер Lineage 2 в топе L2GM. Тарифы: Premium, VIP статусы, баннеры. Бесплатное размещение при установке кнопки.'
    },
    { name: 'keywords', content: 'реклама сервера lineage 2, размещение л2, топ серверов, vip статус, premium' },
    // Open Graph
    { property: 'og:title', content: 'Реклама сервера Lineage 2 | L2GM' },
    { property: 'og:description', content: 'Разместите сервер Lineage 2 в топе L2GM. Premium, VIP статусы и рекламные баннеры.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    // Twitter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Реклама сервера Lineage 2 | L2GM' },
    { name: 'twitter:description', content: 'Тарифы размещения серверов в топе L2GM.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<style scoped>
.advertisement-page {
  padding: var(--spacing-lg) 0;
  max-width: 1200px;
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
  margin-bottom: var(--spacing-lg);
}

.disclaimer {
  color: var(--text-disabled);
  font-size: var(--font-sm);
  max-width: 800px;
  margin: 0 auto;
}

.tariffs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.tariff-card {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.tariff-card h3 {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.card-preview {
  background: var(--bg-main);
  border-radius: var(--radius-base);
  padding: var(--spacing-md);
}

.server-card-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
}

.status-premium {
  background: var(--primary-main);
  color: var(--primary-contrast);
}

.status-vip {
  background: var(--status-warning);
  color: var(--text-primary);
}

.status-vip-gray {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-secondary);
}

.server-name-preview {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}

.badges-preview {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  padding: var(--spacing-lg);
}

.badge-preview {
  font-size: 24px;
  cursor: help;
}

.tariff-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.tariff-features li {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  padding-left: var(--spacing-lg);
  position: relative;
}

.tariff-features li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-main);
}

.tariff-description {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.6;
}

.tariff-price {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--primary-main);
}

.btn-contact {
  background: var(--primary-main);
  color: var(--primary-contrast);
  padding: 15px 24px;
  border-radius: 26px;
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  text-align: center;
  transition: background 0.2s;
}

.btn-contact:hover {
  background: var(--primary-hover);
}

.banner-preview-large {
  aspect-ratio: 1920 / 600;
  background: var(--bg-main);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-disabled);
  font-size: var(--font-sm);
}

.banner-preview-small {
  aspect-ratio: 282 / 470;
  background: var(--bg-main);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-disabled);
  font-size: var(--font-sm);
}

.banner-selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  color: var(--text-primary);
}

.radio-option input[type="radio"] {
  cursor: pointer;
}

.code-input-group {
  display: flex;
  gap: var(--spacing-sm);
}

.code-input {
  flex: 1;
  background: var(--bg-main);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-base);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-family: monospace;
}

.btn-copy {
  background: var(--secondary-main);
  color: var(--secondary-contrast);
  padding: 12px 24px;
  border-radius: var(--radius-base);
  border: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: background 0.2s;
}

.btn-copy:hover {
  background: var(--secondary-hover);
}
</style>
