<template>
  <div class="error-page">
    <div class="error-container">
      <span class="error-code">{{ error?.statusCode || 404 }}</span>
      <h1 class="error-title">Страница не найдена</h1>
      <p class="error-text">Возможно, страница была удалена или вы перешли по неверной ссылке</p>
      <NuxtLink to="/" class="error-btn">На главную</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
})

useHead({
  title: 'Страница не найдена | L2GM',
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #06080a;
  font-family: 'Onest', sans-serif;
  padding: 24px;
}

.error-container {
  text-align: center;
  max-width: 480px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  color: rgb(254, 54, 0);
  display: block;
  margin-bottom: 16px;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: #f5f5f7;
  margin-bottom: 12px;
}

.error-text {
  font-size: 14px;
  color: rgba(245, 245, 247, 0.6);
  line-height: 1.6;
  margin-bottom: 32px;
}

.error-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  background: rgb(254, 54, 0);
  color: #f5f5f7;
  font-size: 14px;
  font-weight: 600;
  border-radius: 36px;
  text-decoration: none;
  transition: background 0.2s;
}

.error-btn:hover {
  background: rgb(179, 30, 0);
}
</style>
