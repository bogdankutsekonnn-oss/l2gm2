<template>
  <div class="seo-section">
    <h2>{{ title }}</h2>
    <div class="seo-text">
      <template v-for="(block, index) in blocks" :key="index">
        <h3 v-if="block.type === 'h3'" class="seo-subheading">{{ block.text }}</h3>
        <p v-else>
          <template v-for="(seg, segIndex) in block.segments" :key="segIndex">
            <NuxtLink v-if="seg.type === 'link'" :to="seg.href" class="seo-inline-link">{{ seg.text }}</NuxtLink>
            <template v-else>{{ seg.text }}</template>
          </template>
        </p>
      </template>
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
</script>

<style scoped>
.seo-subheading {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
}

.seo-text > p + .seo-subheading,
.seo-text > .seo-subheading + p {
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
