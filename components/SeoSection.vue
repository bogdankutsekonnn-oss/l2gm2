<template>
  <div class="seo-section">
    <h2>{{ title }}</h2>
    <div class="seo-text">
      <template v-for="(block, index) in alwaysVisibleBlocks" :key="`v-${index}`">
        <p>
          <template v-for="(seg, segIndex) in block.segments" :key="segIndex">
            <NuxtLink v-if="seg.type === 'link'" :to="seg.href" class="seo-inline-link">{{ seg.text }}</NuxtLink>
            <template v-else>{{ seg.text }}</template>
          </template>
        </p>
      </template>

      <div
        v-if="collapsibleBlocks.length"
        class="seo-collapsible"
        :class="{ 'is-expanded': expanded }"
      >
        <div class="seo-collapsible-inner">
          <template v-for="(block, index) in collapsibleBlocks" :key="`c-${index}`">
            <h3 v-if="block.type === 'h3'" class="seo-subheading">{{ block.text }}</h3>
            <p v-else>
              <template v-for="(seg, segIndex) in block.segments" :key="segIndex">
                <NuxtLink v-if="seg.type === 'link'" :to="seg.href" class="seo-inline-link">{{ seg.text }}</NuxtLink>
                <template v-else>{{ seg.text }}</template>
              </template>
            </p>
          </template>
        </div>
        <div v-if="!expanded" class="seo-fade" aria-hidden="true"></div>
      </div>

      <button
        v-if="collapsibleBlocks.length"
        type="button"
        class="seo-toggle"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Свернуть' : 'Читать далее' }}
        <span class="seo-toggle-icon" :class="{ 'is-rotated': expanded }" aria-hidden="true">▾</span>
      </button>
    </div>

    <div v-if="links?.length" class="seo-links">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="seo-links__item">
        {{ link.text }}
      </NuxtLink>
    </div>
    <div v-if="comboLinks?.length" class="seo-links-section">
      <h3 v-if="comboLinksTitle" class="seo-links-title">{{ comboLinksTitle }}</h3>
      <div class="seo-links">
        <NuxtLink v-for="link in comboLinks" :key="link.to" :to="link.to" class="seo-links__item">
          {{ link.text }}
        </NuxtLink>
      </div>
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
  links: {
    type: Array,
    default: () => [],
  },
  comboLinks: {
    type: Array,
    default: () => [],
  },
  comboLinksTitle: {
    type: String,
    default: '',
  },
})

const expanded = ref(false)

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

function parseInline(text) {
  const segments = []
  let lastIndex = 0
  let match
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'link', text: match[1], href: match[2] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', text: text.slice(lastIndex) })
  }
  return segments.length ? segments : [{ type: 'text', text }]
}

const blocks = computed(() =>
  props.text
    .split('\n\n')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) =>
      chunk.startsWith('## ')
        ? { type: 'h3', text: chunk.slice(3).trim() }
        : { type: 'p', segments: parseInline(chunk) }
    )
)

const firstH3Index = computed(() => blocks.value.findIndex((b) => b.type === 'h3'))

const alwaysVisibleBlocks = computed(() =>
  firstH3Index.value === -1 ? blocks.value : blocks.value.slice(0, firstH3Index.value)
)

const collapsibleBlocks = computed(() =>
  firstH3Index.value === -1 ? [] : blocks.value.slice(firstH3Index.value)
)
</script>

<style scoped>
.seo-subheading {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
}

.seo-text > p + .seo-subheading {
  margin-top: var(--spacing-md);
}

.seo-inline-link {
  color: var(--primary-main);
  text-decoration: none;
  transition: color 0.2s;
}

.seo-inline-link:hover {
  color: var(--primary-hover, var(--primary-main));
  text-decoration: underline;
}

.seo-collapsible {
  position: relative;
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.seo-collapsible.is-expanded {
  max-height: 6000px;
}

.seo-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: linear-gradient(to bottom, rgba(6, 8, 10, 0), var(--bg-main, #06080a));
  pointer-events: none;
}

.seo-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--spacing-md);
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: background 0.2s;
}

.seo-toggle:hover {
  background: rgba(255, 255, 255, 0.12);
}

.seo-toggle-icon {
  display: inline-block;
  transition: transform 0.2s;
  font-size: 12px;
}

.seo-toggle-icon.is-rotated {
  transform: rotate(180deg);
}

.seo-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: var(--spacing-md);
}

.seo-links__item {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.seo-links__item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.seo-links-section {
  margin-top: var(--spacing-lg);
}

.seo-links-title {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}
</style>
