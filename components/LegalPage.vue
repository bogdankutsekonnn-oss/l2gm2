<template>
  <div class="about-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>{{ title }}</h1>
      </div>
      <div class="page-layout">
        <div class="servers-column">
          <div class="about-content legal-content">
            <slot />
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
// Общая обёртка юридических страниц: разметка, SEO-мета и оформление текста.
// Сами тексты лежат в pages/<страница>/index.vue секциями .about-section.
const props = defineProps({
  title: { type: String, required: true },
  path: { type: String, required: true },
  description: { type: String, required: true },
  noindex: { type: Boolean, default: false },
})

const { getCanonicalUrl, generateBreadcrumbJsonLd } = useSeo()
const canonicalUrl = getCanonicalUrl(props.path)

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: props.title, url: props.path },
])

useHead({
  title: `${props.title} | L2GM`,
  meta: [
    { name: 'description', content: props.description },
    { name: 'robots', content: props.noindex ? 'noindex, follow' : 'index, follow' },
    { property: 'og:title', content: `${props.title} | L2GM` },
    { property: 'og:description', content: props.description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${props.title} | L2GM` },
    { name: 'twitter:description', content: props.description },
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

.legal-content :deep(.about-section) {
  background: #1B1D1F;
  border-radius: 8px;
  padding: var(--spacing-xl);
  min-width: 0;
}

.legal-content :deep(.about-section h2) {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md);
}

.legal-content :deep(.about-section p),
.legal-content :deep(.about-section li) {
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.7;
}

.legal-content :deep(.about-section p) {
  margin: 0;
}

.legal-content :deep(.about-section p + p),
.legal-content :deep(.about-section ul + p),
.legal-content :deep(.about-section ol + p),
.legal-content :deep(.about-section p + ul),
.legal-content :deep(.about-section p + ol),
.legal-content :deep(.about-section .legal-table-wrap + p),
.legal-content :deep(.about-section p + .legal-table-wrap) {
  margin-top: var(--spacing-md);
}

.legal-content :deep(.about-section ul),
.legal-content :deep(.about-section ol) {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.legal-content :deep(.about-section ul) {
  list-style: disc;
}

.legal-content :deep(.about-section ol) {
  list-style: decimal;
}

.legal-content :deep(.about-section li + li) {
  margin-top: 6px;
}

.legal-content :deep(.about-section li ul) {
  margin-top: 6px;
}

.legal-content :deep(.about-section a) {
  color: var(--primary-main);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.legal-content :deep(.about-section a:hover) {
  color: var(--primary-hover);
}

.legal-content :deep(.about-section strong) {
  color: var(--text-primary);
}

.legal-content :deep(.legal-date) {
  color: var(--text-disabled);
  font-size: var(--font-sm);
}

/* Таблицы на узком экране прокручиваются внутри своего блока */
.legal-content :deep(.legal-table-wrap) {
  overflow-x: auto;
}

.legal-content :deep(table) {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  font-size: var(--font-sm);
  line-height: 1.5;
}

.legal-content :deep(th),
.legal-content :deep(td) {
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  text-align: left;
  vertical-align: top;
}

.legal-content :deep(th) {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  background: rgba(255, 255, 255, 0.04);
}
</style>
