<template>
  <div class="add-server-page">
    <div class="page-header">
      <h1>Добавить сервер Lineage 2</h1>
      <h2>Разместите информацию о вашем сервере на нашем сайте</h2>
    </div>

    <form class="add-server-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="server-url">Сайт сервера</label>
        <input
          id="server-url"
          v-model="form.serverUrl"
          type="url"
          placeholder="Например: https://myserver.com/"
          required
        />
      </div>

      <div class="form-group">
        <label for="server-name">Название сервера</label>
        <input
          id="server-name"
          v-model="form.serverName"
          type="text"
          placeholder="MyServer"
          required
        />
      </div>

      <div class="form-group">
        <label for="server-rate">Рейты</label>
        <input
          id="server-rate"
          v-model="form.serverRate"
          type="text"
          placeholder="x1"
          required
        />
        <span class="form-hint">Укажите цифрами рейты, или GVE, RVR</span>
      </div>

      <div class="form-group">
        <label for="server-chronicle">Хроники</label>
        <select
          id="server-chronicle"
          v-model="form.serverChronicle"
          required
        >
          <option value="">Выберите хронику</option>
          <option
            v-for="chronicle in chronicles"
            :key="chronicle.id"
            :value="chronicle.name"
          >
            {{ chronicle.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="server-date">Дата старта</label>
        <input
          id="server-date"
          v-model="form.serverDate"
          type="date"
          placeholder="Укажите дату старта"
          required
        />
      </div>

      <div class="form-group">
        <label for="server-email">Email</label>
        <input
          id="server-email"
          v-model="form.serverEmail"
          type="email"
          placeholder="example@mail.com"
          required
        />
      </div>

      <div class="form-group">
        <label>reCaptcha</label>
        <div class="recaptcha-placeholder">
          <span>reCaptcha будет здесь</span>
        </div>
      </div>

      <button type="submit" class="btn-primary">
        Добавить сервер
      </button>
    </form>
  </div>
</template>

<script setup>
const { getChronicles } = useFilters()

const chronicles = getChronicles()

const form = reactive({
  serverUrl: '',
  serverName: '',
  serverRate: '',
  serverChronicle: '',
  serverDate: '',
  serverEmail: ''
})

const handleSubmit = () => {
  // TODO: Implement form submission
  navigateTo('/thanks')
}

useHead({
  title: 'Добавить сервер Lineage 2 - L2GM',
  meta: [
    {
      name: 'description',
      content: 'Добавьте свой сервер Lineage 2 на наш сайт. Размещение серверов всех хроник и рейтов.'
    }
  ]
})
</script>

<style scoped>
.add-server-page {
  padding: var(--spacing-lg) 0;
  max-width: 800px;
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
}

.add-server-form {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.form-group input,
.form-group select {
  background: var(--bg-main);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-base);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: var(--font-base);
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-main);
}

.form-hint {
  font-size: var(--font-sm);
  color: var(--text-disabled);
}

.recaptcha-placeholder {
  background: var(--bg-main);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-base);
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--text-disabled);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--primary-main);
  color: var(--primary-contrast);
  padding: 15px 24px;
  border-radius: 26px;
  border: none;
  font-weight: var(--font-semibold);
  font-size: var(--font-base);
  cursor: pointer;
  transition: background 0.2s;
  margin-top: var(--spacing-md);
}

.btn-primary:hover {
  background: var(--primary-hover);
}
</style>
