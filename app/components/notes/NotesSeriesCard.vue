<script setup lang="ts">
import { DEFAULT_CONTENT_COVER } from '~~/utils/content'
import type { NotesSeriesSummary } from '~~/utils/notes-series'

const props = defineProps<{
  item: NotesSeriesSummary
}>()

const coverSrc = computed(() => props.item.cover || DEFAULT_CONTENT_COVER)
</script>

<template>
  <article class="clay-raised group overflow-hidden rounded-clay-xl p-0">
    <NuxtLink class="flex h-full flex-col text-inherit" :to="item.href">
      <div class="relative aspect-video overflow-hidden border-b border-clay-border bg-clay-muted/10">
        <img
          class="block h-full w-full object-cover transition-transform duration-300 ease-clay-soft motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.03]"
          :src="coverSrc"
          :alt="`${item.series} 封面`"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        >
      </div>
      <div class="flex flex-1 flex-col gap-1.5 px-4 py-4 sm:px-5 sm:py-5">
        <h3 class="m-0 text-base font-semibold leading-snug text-clay-text transition-colors group-hover:text-clay-brand-strong sm:text-lg">
          {{ item.series }}
        </h3>
        <p class="m-0 text-sm text-clay-muted">
          {{ item.articleCount }} 篇
        </p>
      </div>
    </NuxtLink>
  </article>
</template>
