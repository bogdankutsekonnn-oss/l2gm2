<template>
  <div v-if="items?.length" class="faq-section">
    <h2 class="faq-title">{{ title }}</h2>
    <div class="faq-list">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="['faq-item', { 'faq-item--open': openFaq === index }]"
      >
        <button class="faq-item__header" @click="toggleFaq(index)">
          <span class="faq-item__number">{{ index + 1 }}.</span>
          <span class="faq-item__question">{{ item.question }}</span>
          <span class="faq-item__icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V20"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 12H20"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
        <Transition name="faq-expand">
          <div v-if="openFaq === index" class="faq-item__body">
            <p>{{ item.answer }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Частые вопросы',
  },
  items: {
    type: Array,
    default: () => [],
  },
})

const openFaq = ref(null)

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<style scoped>
.faq-section {
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xl);
  margin-top: var(--spacing-md);
}

.faq-title {
  color: var(--text-primary);
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-lg);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.faq-item {
  background: #06080a;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.faq-item__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.2s;
}

.faq-item:not(.faq-item--open) .faq-item__header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.faq-item__number {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--primary-main);
  flex-shrink: 0;
  min-width: 24px;
}

.faq-item__question {
  font-size: var(--font-lg);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  line-height: 1.4;
  flex: 1;
}

.faq-item__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.faq-item--open .faq-item__icon {
  transform: rotate(45deg);
}

.faq-item__body {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  padding-left: calc(var(--spacing-lg) + 24px + var(--spacing-md));
}

.faq-item__body p {
  margin: 0;
  font-size: var(--font-base);
  color: var(--text-secondary);
  line-height: 1.7;
}

/* FAQ animation */
.faq-expand-enter-active,
.faq-expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.faq-expand-enter-to,
.faq-expand-leave-from {
  opacity: 1;
  max-height: 300px;
}

@media (max-width: 1024px) {
  .faq-section {
    padding: 16px;
  }

  .faq-item__header {
    padding: 16px;
  }

  .faq-item__question {
    font-size: var(--font-base);
  }

  .faq-item__body {
    padding: 0 16px 16px;
    padding-left: calc(16px + 24px + var(--spacing-md));
  }
}
</style>
