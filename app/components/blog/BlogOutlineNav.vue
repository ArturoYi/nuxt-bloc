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

function indentLevel(link: BlogTocLink) {
  return getOutlineIndentLevel(link.depth, props.minDepth)
}

/** 仅对顶层大纲项从 1 递增编号（子级用圆点） */
const topLevelOrdinal = computed(() => {
  let step = 0
  const map = new Map<string, number>()
  for (const link of props.links) {
    if (indentLevel(link) === 0) {
      step += 1
      map.set(link.id, step)
    }
  }
  return map
})
</script>

<template>
  <ol class="clay-rail-list clay-rail-list--outline">
    <li
      v-for="link in props.links"
      :key="link.id"
      class="clay-rail-list__item clay-rail-list__item--indent"
      :style="{ '--outline-level': indentLevel(link) }"
    >
      <button
        type="button"
        class="clay-rail-item clay-rail-item--outline"
        :class="{ 'is-active': props.activeId === link.id }"
        :aria-current="props.activeId === link.id ? 'location' : undefined"
        @click="emit('navigate', link.id)"
      >
        <span
          class="clay-rail-item__badge"
          :class="{ 'clay-rail-item__badge--dot': indentLevel(link) > 0 }"
          aria-hidden="true"
        >
          <template v-if="indentLevel(link) === 0">
            {{ topLevelOrdinal.get(link.id) }}
          </template>
        </span>
        <span class="clay-rail-item__text clay-rail-item__text--wrap">{{ link.text }}</span>
      </button>
    </li>
  </ol>
</template>
