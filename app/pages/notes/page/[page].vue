<script setup lang="ts">
/**
 * 笔记列表已改为单页展示，旧分页 URL 统一 301 到 /notes。
 */
await navigateTo('/notes', { redirectCode: 301, replace: true })
</script>

<template>
  <div />
</template>
