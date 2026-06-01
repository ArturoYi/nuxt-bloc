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
  <div v-for="stage in nav.stages" :key="stage.name" class="blog-series-nav__stage">
    <p v-if="stage.name !== DEFAULT_STAGE_NAME" class="blog-series-nav__stage-name">
      {{ stage.name }}
    </p>
    <ol class="blog-series-nav__list">
      <li
        v-for="article in stage.articles"
        :key="article.path"
        class="blog-series-nav__item"
      >
        <NuxtLink
          :to="article.path"
          class="blog-series-nav__link"
          :class="{ 'is-active': nav.currentPath === article.path }"
          @click="emit('navigate')"
        >
          <span class="blog-series-nav__text">{{ article.title }}</span>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.blog-series-nav__stage {
  margin-top: 1rem;
}

.blog-series-nav__stage:first-of-type {
  margin-top: 0;
}

.blog-series-nav__stage-name {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--muted-strong);
}

.blog-series-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.blog-series-nav__item {
  margin: 0;
  padding: 0;
}

.blog-series-nav__link {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0.35rem 0.5rem;
  border-radius: 0.375rem;
  color: var(--muted-strong);
  font-size: 0.875rem;
  line-height: 1.35;
  text-decoration: none;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.blog-series-nav__link:hover {
  color: var(--text);
  background-color: var(--surface-hover);
}

.blog-series-nav__link.is-active {
  color: var(--brand);
  background-color: color-mix(in srgb, var(--brand) 10%, transparent);
  font-weight: 600;
}

.blog-series-nav__link:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.blog-series-nav__text {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
