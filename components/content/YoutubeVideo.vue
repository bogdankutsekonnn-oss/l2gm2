<template>
  <div class="youtube-video">
    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      :title="title"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  title: { type: String, default: 'YouTube video player' },
})
</script>

<style scoped>
.youtube-video {
  margin: 2rem 0;
  line-height: 0;
}

.youtube-video iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
