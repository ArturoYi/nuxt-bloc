<script setup lang="ts">
import type { BlogTocLink } from '~/types/blog'
import { getOutlineIndentLevel } from '~~/utils/blog-outline'

const props = defineProps<{
  links: BlogTocLink[]
  activeId: string | null
  minDepth: number
}>()

const emit = defineEmits<{
  navigate: [id: string]
}>()
</script>

<template>
  <ol class="blog-outline-nav">
    <li
      v-for="link in props.links"
      :key="link.id"
      class="blog-outline-nav__item"
      :style="{ '--outline-level': getOutlineIndentLevel(link.depth, props.minDepth) }"
    >
      <button
        type="button"
        class="blog-outline-nav__btn"
        :class="{ 'is-active': props.activeId === link.id }"
        :aria-current="props.activeId === link.id ? 'location' : undefined"
        @click="emit('navigate', link.id)"
      >
        <span class="blog-outline-nav__text">{{ link.text }}</span>
      </button>
    </li>
  </ol>
</template>

<style scoped>
.blog-outline-nav {
  list-style: none;
  margin: 0;
  padding: 0;
}

.blog-outline-nav__item {
  margin: 0;
  padding-left: calc(var(--outline-level, 0) * 0.75rem);
}

.blog-outline-nav__btn {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0.35rem 0;
  border: 0;
  background: transparent;
  color: var(--muted-strong);
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: color 0.15s ease;
}

.blog-outline-nav__btn:hover {
  color: var(--text);
}

.blog-outline-nav__btn.is-active {
  color: var(--brand);
  font-weight: 600;
}

.blog-outline-nav__btn:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
  border-radius: 0.2rem;
}

.blog-outline-nav__text {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
