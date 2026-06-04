<template>
  <div
    class="image-slider"
    tabindex="0"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
  >
    <div class="image-slider__stage">
      <button
        type="button"
        class="image-slider__nav image-slider__nav--prev"
        aria-label="Предыдущее изображение"
        @click="prev"
      >
        &lsaquo;
      </button>

      <div class="image-slider__frame">
        <img
          :src="current.src"
          :alt="current.caption || ''"
          class="image-slider__img"
          loading="lazy"
        />
        <div v-if="current.caption" class="image-slider__caption">
          {{ current.caption }}
        </div>
      </div>

      <button
        type="button"
        class="image-slider__nav image-slider__nav--next"
        aria-label="Следующее изображение"
        @click="next"
      >
        &rsaquo;
      </button>
    </div>

    <div v-if="images.length > 1" class="image-slider__dots" role="tablist">
      <button
        v-for="(_, i) in images"
        :key="i"
        type="button"
        role="tab"
        :aria-selected="i === active"
        :aria-label="`Изображение ${i + 1} из ${images.length}`"
        :class="['image-slider__dot', { 'image-slider__dot--active': i === active }]"
        @click="active = i"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  images: { type: Array, default: () => [] },
})

const active = ref(0)
const current = computed(() => props.images[active.value] || {})

const prev = () => {
  if (!props.images.length) return
  active.value = (active.value - 1 + props.images.length) % props.images.length
}
const next = () => {
  if (!props.images.length) return
  active.value = (active.value + 1) % props.images.length
}
</script>

<style scoped>
.image-slider {
  margin: 2rem 0;
  outline: none;
}

.image-slider__stage {
  position: relative;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  line-height: 0;
}

.image-slider__frame {
  position: relative;
  display: block;
}

.image-slider__img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.image-slider__caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.9rem 1.2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0));
  color: #fff;
  font-size: 0.95rem;
  text-align: center;
  letter-spacing: 0.02em;
}

.image-slider__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 0;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background 0.15s ease;
}

.image-slider__nav:hover,
.image-slider__nav:focus-visible {
  background: rgba(254, 54, 0, 0.85);
  outline: none;
}

.image-slider__nav--prev {
  left: 12px;
}

.image-slider__nav--next {
  right: 12px;
}

.image-slider__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.image-slider__dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #555;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}

.image-slider__dot:hover {
  background: #888;
}

.image-slider__dot--active {
  background: #fe3600;
  transform: scale(1.2);
}

@media (max-width: 640px) {
  .image-slider__nav {
    width: 36px;
    height: 36px;
    font-size: 1.5rem;
  }
  .image-slider__nav--prev { left: 6px; }
  .image-slider__nav--next { right: 6px; }
}
</style>
