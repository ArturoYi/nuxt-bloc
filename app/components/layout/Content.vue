<script setup lang="ts">
const route = useRoute();
const {
  isOpen,
  isSidebarOpen,
  isOutlineOpen,
  hasSeriesNav,
  toggleSidebar,
  toggleOutline,
  close,
} = useLayoutDrawer();

watch(
  () => route.fullPath,
  () => {
    close();
  },
);
const isOutlineDrawerViewport = useMediaQuery("(max-width: 991.98px)");
const isSidebarDrawerViewport = useMediaQuery("(max-width: 767.98px)");

const shouldLockScroll = computed(
  () =>
    (isOutlineOpen.value && isOutlineDrawerViewport.value) ||
    (isSidebarOpen.value && isSidebarDrawerViewport.value),
);
useBodyScrollLock(shouldLockScroll);
onKeyStroke(
  "Escape",
  () => {
    if (isOpen.value) close();
  },
  { dedupe: true },
);
</script>
<template>
  <div class="layout-content-box">
    <div class="layout-toolbar">
      <button
        v-if="hasSeriesNav"
        type="button"
        class="layout-toolbar-btn layout-toolbar-btn--sidebar"
        aria-controls="layout-site-sidebar"
        :aria-expanded="isSidebarOpen"
        :aria-label="isSidebarOpen ? '关闭站点导航' : '打开站点导航'"
        @click="toggleSidebar"
      >
        <svg
          class="layout-toolbar-btn__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>

      <button
        type="button"
        class="layout-toolbar-btn layout-toolbar-btn--outline"
        aria-controls="layout-site-outline"
        :aria-expanded="isOutlineOpen"
        :aria-label="isOutlineOpen ? '关闭页面大纲' : '打开页面大纲'"
        @click="toggleOutline"
      >
        <svg
          class="layout-toolbar-btn__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
          <line x1="9" y1="6" x2="9" y2="18" />
        </svg>
      </button>
    </div>
    <slot />
  </div>
</template>
