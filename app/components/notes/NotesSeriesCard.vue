<script setup lang="ts">
import { DEFAULT_CONTENT_COVER } from '~~/utils/content'
import type { NotesSeriesSummary } from '~~/utils/notes-series'

const props = defineProps<{
  item: NotesSeriesSummary
}>()

const coverSrc = computed(() => props.item.cover || DEFAULT_CONTENT_COVER)
</script>

<template>
  <article class="notes-series-card">
    <NuxtLink class="notes-series-card__link" :to="item.href">
      <div class="notes-series-card__media">
        <img
          class="notes-series-card__cover"
          :src="coverSrc"
          :alt="`${item.series} 封面`"
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="notes-series-card__body">
        <h3 class="notes-series-card__title">{{ item.series }}</h3>
        <p class="notes-series-card__meta">{{ item.articleCount }} 篇</p>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.notes-series-card {
  height: 100%;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--surface-raised) 48%, transparent);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.notes-series-card:hover {
  border-color: var(--brand-border);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.notes-series-card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
}

.notes-series-card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: color-mix(in srgb, var(--muted) 12%, transparent);
  border-bottom: 1px solid var(--border);
}

.notes-series-card__cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.notes-series-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  padding: 1rem 1.1rem 1.05rem;
}

.notes-series-card__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text);
  transition: color 0.15s ease;
}

.notes-series-card:hover .notes-series-card__title {
  color: var(--brand-strong);
}

.notes-series-card__meta {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .notes-series-card,
  .notes-series-card__title {
    transition: none;
  }

  .notes-series-card:hover {
    transform: none;
  }
}
</style>
