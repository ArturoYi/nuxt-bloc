<script setup lang="ts">
import type { BlogSeriesNav } from '~/types/blog'
import { DEFAULT_STAGE_NAME } from '~~/utils/blog-series'

defineProps<{
  nav: BlogSeriesNav
}>()

const emit = defineEmits<{
  navigate: []
}>()
</script>

<template>
  <div
    v-for="stage in nav.stages"
    :key="stage.name"
    class="clay-rail__stage"
  >
    <p v-if="stage.name !== DEFAULT_STAGE_NAME" class="clay-rail__stage-label">
      {{ stage.name }}
    </p>
    <ol class="clay-rail-list">
      <li
        v-for="article in stage.articles"
        :key="article.path"
        class="clay-rail-list__item"
      >
        <NuxtLink
          :to="article.path"
          class="clay-rail-item"
          :class="{ 'is-active': nav.currentPath === article.path }"
          @click="emit('navigate')"
        >
          <span class="clay-rail-item__text">{{ article.title }}</span>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>
