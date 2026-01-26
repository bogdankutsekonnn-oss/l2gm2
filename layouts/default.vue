<template>
  <div class="app-layout">
    <AppHeader />
    <TopBanner />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style>
:root {
  --bg-main: #06080A;
  --bg-surface: #0F1113;
  --primary-main: #DF2027;
  --primary-hover: #C11B21;
  --primary-contrast: #F5F5F7;
  --secondary-main: rgba(255, 255, 255, 0.05);
  --secondary-hover: rgba(255, 255, 255, 0.1);
  --secondary-contrast: #F5F5F7;
  --text-primary: #F5F5F7;
  --text-secondary: rgba(245, 245, 247, 0.6);
  --text-disabled: rgba(245, 245, 247, 0.3);
  --status-success: #28A745;
  --status-warning: #FFC107;
  --status-error: #DC3545;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-xs: 12px;
  --font-sm: 14px;
  --font-base: 16px;
  --font-lg: 18px;
  --font-xl: 20px;
  --font-h2: 32px;
  --font-h1: 48px;
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-base: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  --radius-button: 26px;
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
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}
</style>
