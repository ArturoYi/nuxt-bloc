<script setup lang="ts">
/**
 * 博客列表已改为单页虚拟列表，旧分页 URL 统一 301 到 /blog。
 */
await navigateTo('/blog', { redirectCode: 301, replace: true })
</script>

<template>
  <div />
</template>
