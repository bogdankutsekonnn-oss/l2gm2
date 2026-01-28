<template>
  <div class="seo-section">
    <h2>{{ title }}</h2>
    <div class="seo-text">
      <p v-for="(paragraph, index) in paragraphs" :key="index">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})

const paragraphs = computed(() =>
  props.text.split('\n\n').filter((p) => p.trim())
)
</script>
