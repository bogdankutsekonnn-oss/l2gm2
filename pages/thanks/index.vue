<template>
  <div class="thanks-page">
    <div class="thanks-content">
      <div class="thanks-icon">✓</div>
      <h1>Спасибо!</h1>
      <p class="thanks-message">
        Ваш сервер успешно добавлен и отправлен на модерацию.
      </p>
      <p class="thanks-info">
        После проверки модератором ваш сервер появится на сайте. Обычно это занимает не более 24 часов.
      </p>
      <div class="thanks-actions">
        <NuxtLink to="/" class="btn-primary">
          Вернуться на главную
        </NuxtLink>
        <NuxtLink to="/add-server" class="btn-secondary">
          Добавить ещё сервер
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Спасибо - L2GM',
  meta: [
    {
      name: 'description',
      content: 'Ваш сервер успешно добавлен на сайт L2GM.'
    }
  ]
})
</script>

<style scoped>
.thanks-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) 0;
}

.thanks-content {
  text-align: center;
  max-width: 600px;
  padding: var(--spacing-xxl);
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
}

.thanks-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--status-success);
  color: var(--text-primary);
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-xl);
  font-weight: var(--font-bold);
}

.thanks-content h1 {
  font-size: var(--font-h1);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.thanks-message {
  font-size: var(--font-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.thanks-info {
  font-size: var(--font-base);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.thanks-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

</style>
