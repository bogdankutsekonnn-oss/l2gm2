<template>
  <div v-if="items.length" class="faq-block">
    <h2 class="faq-block__title">Часто задаваемые вопросы</h2>
    <div class="faq-block__list">
      <details
        v-for="(item, index) in items"
        :key="index"
        class="faq-block__item"
      >
        <summary class="faq-block__question">
          {{ item.question }}
          <svg class="faq-block__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </summary>
        <div class="faq-block__answer">
          {{ item.answer }}
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<style scoped>
.faq-block {
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xl);
  margin-top: var(--spacing-md);
}

.faq-block__title {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.faq-block__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.faq-block__item {
  background: var(--bg-main);
  border-radius: var(--radius-base);
  overflow: hidden;
}

.faq-block__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: 16px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  list-style: none;
  user-select: none;
  transition: color 0.2s;
}

.faq-block__question::-webkit-details-marker {
  display: none;
}

.faq-block__question:hover {
  color: var(--primary-main);
}

.faq-block__arrow {
  flex-shrink: 0;
  color: var(--text-disabled);
  transition: transform 0.2s;
}

details[open] .faq-block__arrow {
  transform: rotate(180deg);
}

.faq-block__answer {
  padding: 0 16px 16px;
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .faq-block {
    padding: 16px;
  }

  .faq-block__question {
    font-size: 14px;
    padding: 12px;
  }

  .faq-block__answer {
    padding: 0 12px 12px;
    font-size: 14px;
  }
}
</style>
