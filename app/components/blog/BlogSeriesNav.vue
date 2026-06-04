<script setup lang="ts">
import type { BlogSeriesNav } from '~/types/blog'

const props = defineProps<{
  /** 系列导航数据；路由切换期间可能短暂为 null */
  nav: BlogSeriesNav | null
}>()

const { isSidebarOpen, close, hasSeriesNav } = useLayoutDrawer()
const isSidebarDrawer = useMediaQuery('(max-width: 767.98px)')

const activeNav = useStableSeriesNav(toRef(props, 'nav'), hasSeriesNav)
const hasNav = computed(() => Boolean(activeNav.value))

// 导航消失时自动关闭移动端抽屉
watch(hasNav, (visible) => {
  if (!visible && isSidebarOpen.value) {
    close()
  }
})

function onNavigate() {
  if (isSidebarDrawer.value) {
    close()
  }
}
</script>

<template>
  <template v-if="activeNav">
    <div
      v-show="!isSidebarDrawer"
      class="blog-series-nav blog-series-nav--sidebar"
    >
      <p class="blog-series-nav__title">{{ activeNav.series }}</p>
      <BlogSeriesStageList :nav="activeNav" @navigate="onNavigate" />
    </div>

    <Teleport to="body">
      <Transition name="layout-drawer">
        <button
          v-if="isSidebarDrawer && isSidebarOpen"
          type="button"
          class="layout-drawer-scrim"
          aria-label="关闭系列文章导航"
          @click="close"
        />
      </Transition>

      <Transition name="layout-drawer-left-panel">
        <aside
          v-if="isSidebarDrawer && isSidebarOpen"
          class="blog-series-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="系列文章导航"
        >
          <header class="blog-series-drawer__header">
            <p class="blog-series-drawer__title">{{ activeNav.series }}</p>
            <button
              type="button"
              class="blog-series-drawer__close"
              aria-label="关闭"
              @click="close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div v-scrollbar-reveal class="blog-series-drawer__body">
            <BlogSeriesStageList :nav="activeNav" @navigate="onNavigate" />
          </div>
        </aside>
      </Transition>
    </Teleport>
  </template>
</template>

<style scoped>
.blog-series-nav--sidebar {
  padding: 1.25rem 1rem;
}

.blog-series-nav__title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}
</style>
