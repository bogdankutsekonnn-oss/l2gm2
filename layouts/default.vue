<template>
  <div class="app-layout">
    <AppHeader />
    <div class="banner-wrapper">
      <TopBanner />
    </div>
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
    <CookieBanner />
  </div>
</template>

<style>
/* ── Global utilities (inlined via inlineStyles: true) ── */

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.btn-primary {
  background: var(--primary-main);
  color: var(--primary-contrast);
  padding: 12px 24px;
  border-radius: var(--radius-button);
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  transition: background 0.2s;
  display: inline-block;
  border: none;
  cursor: pointer;
  text-align: center;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: var(--secondary-main);
  color: var(--secondary-contrast);
  padding: 12px 24px;
  border-radius: var(--radius-button);
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  transition: background 0.2s;
  display: inline-block;
  border: none;
  cursor: pointer;
  text-align: center;
}

.btn-secondary:hover {
  background: var(--secondary-hover);
}

.input,
.select {
  background: var(--bg-main);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-base);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: var(--font-base);
  font-family: inherit;
  width: 100%;
  transition: border-color 0.2s;
}

.select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 32px;
  background-image: url('/images/arrow-down.svg');
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  cursor: pointer;
}

.select-wrap {
  display: flex;
  gap: var(--spacing-sm);
}

.input:focus,
.select:focus {
  outline: none;
  border-color: var(--primary-main);
}

.page-wrapper {
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
}

.page-header {
  margin: 4px;
}

.page-header h1 {
  background: #1b1d1f;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--radius-sm);
  padding: 16px;
  font-size: var(--font-h1);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.page-header h2 {
  font-size: var(--font-h2);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.servers-count {
  display: inline-block;
  margin: 4px 0 0 16px;
  font-size: var(--font-sm);
  color: var(--text-disabled);
  font-weight: var(--font-medium);
}

.page-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.servers-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.categories-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--spacing-lg);
  align-items: start;
}

.category-col {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.server-category {
  margin-bottom: 0;
}

.category-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: var(--font-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.category-date {
  font-size: var(--font-sm);
  font-weight: var(--font-regular);
  color: var(--text-disabled);
}

.servers-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-xs);
}

.servers-grid > * {
  min-width: 0;
}

.filters-column {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.seo-section {
  padding: var(--spacing-xl);
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
}

.seo-section h2 {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.seo-text {
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.8;
}

.seo-text p {
  margin-bottom: var(--spacing-md);
}

@media (max-width: 1024px) {
  .seo-section {
    padding: 16px;
  }

  .seo-text p {
    font-size: 14px;
  }

  .page-header h1 {
    font-size: 24px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: -0.04em;
  }

  .page-layout {
    grid-template-columns: 1fr;
  }

  .filters-column {
    display: none;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .servers-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Design tokens & resets ── */

:root {
  --bg-main: #06080a;
  --bg-surface: #0f1113;
  --primary-main: rgb(254, 54, 0);
  --primary-hover: rgb(179, 30, 0);
  --primary-contrast: #f5f5f7;
  --secondary-main: rgba(255, 255, 255, 0.05);
  --secondary-hover: rgba(255, 255, 255, 0.1);
  --secondary-contrast: #f5f5f7;
  --text-primary: #f5f5f7;
  --text-secondary: rgba(245, 245, 247, 0.6);
  --text-disabled: rgba(245, 245, 247, 0.3);
  --status-success: #28a745;
  --status-warning: #ffc107;
  --status-error: #dc3545;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-xs: 10px;
  --font-sm: 12px;
  --font-base: 14px;
  --font-lg: 16px;
  --font-xl: 18px;
  --font-h2: 24px;
  --font-h1: 32px;
  --radius-none: 0px;
  --radius-sm: 8px;
  --radius-base: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  --radius-button: 36px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Onest', sans-serif;
  background: var(--bg-main);
  color: var(--text-primary);
  line-height: 1.6;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.banner-wrapper {
  position: fixed;
  top: 70px; /* После шапки */
  left: 0;
  width: 100%;
  z-index: 0;
  pointer-events: none;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  margin-top: 250px;
  position: relative;
  z-index: 2;
  pointer-events: none;
}

.main-content > * {
  pointer-events: auto;
}

@media (max-width: 1024px) {
  .banner-wrapper {
    top: 57px;
  }

  .main-content {
    padding: 0;
  }
}
</style>
