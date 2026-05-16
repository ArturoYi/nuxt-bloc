<script setup lang="ts">
const { hasSeriesNav } = useLayoutDrawer();
</script>

<template>
  <nav
    v-if="hasSeriesNav"
    id="layout-site-sidebar"
    v-scrollbar-reveal
    class="layout-sidebar"
    aria-label="系列文章导航"
  >
    <slot />
  </nav>
</template>
