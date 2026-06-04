<script setup lang="ts">
import type { Component, VNode } from 'vue'

const slots = useSlots()

function resolveComponentName(type: unknown): string | undefined {
  if (!type || typeof type !== 'object') {
    return undefined
  }

  const component = type as Component & {
    __asyncResolved?: Component
  }

  const resolved = component.__asyncResolved ?? component
  return resolved.name || resolved.__name
}

/** Markdown 中「仅一张图」的段落只有一个 Prose 组件子节点（含 AsyncComponentWrapper）。 */
function isImageOnlyChild(node: VNode): boolean {
  if (!node || typeof node !== 'object') {
    return false
  }

  if (node.type === 'img') {
    return true
  }

  if (typeof node.type === 'string') {
    return false
  }

  const name = resolveComponentName(node.type)
  if (name === 'ProseImg' || name === 'AsyncComponentWrapper') {
    return true
  }

  // 兜底：单个子节点为 Vue 组件（非原生标签）时视为图片段落
  return typeof node.type === 'object'
}

function isMeaningfulNode(node: VNode): boolean {
  if (typeof node.children === 'string') {
    return node.children.trim().length > 0
  }

  if (Array.isArray(node.children)) {
    return node.children.some((child) => {
      if (typeof child === 'string') {
        return child.trim().length > 0
      }

      return true
    })
  }

  return true
}

const isImageOnly = computed(() => {
  const nodes = (slots.default?.() ?? []).filter(isMeaningfulNode)
  return nodes.length === 1 && isImageOnlyChild(nodes[0]!)
})

provide('inImageParagraph', readonly(isImageOnly))
</script>

<template>
  <div v-if="isImageOnly" class="prose-img-paragraph">
    <slot />
  </div>
  <p v-else>
    <slot />
  </p>
</template>

<style scoped>
.prose-img-paragraph {
  display: block;
  margin: 1.5rem 0;
  text-align: center;
}
</style>
