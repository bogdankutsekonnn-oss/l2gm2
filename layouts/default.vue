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
  </div>
</template>

<style>
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
</style>
