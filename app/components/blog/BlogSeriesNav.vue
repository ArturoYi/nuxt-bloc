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
    <div v-show="!isSidebarDrawer" class="clay-rail clay-rail--series">
      <header class="clay-rail__head">
        <span class="clay-rail__eyebrow">系列</span>
        <h2 class="clay-rail__title">
          {{ activeNav.series }}
        </h2>
      </header>
      <div v-scrollbar-reveal class="clay-rail__track clay-inset">
        <BlogSeriesStageList :nav="activeNav" @navigate="onNavigate" />
      </div>
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
          class="blog-series-drawer clay-drawer clay-drawer--series"
          role="dialog"
          aria-modal="true"
          aria-label="系列文章导航"
        >
          <header class="clay-drawer__head">
            <div class="clay-rail__head clay-rail__head--compact">
              <span class="clay-rail__eyebrow">系列</span>
              <p class="clay-rail__title">
                {{ activeNav.series }}
              </p>
            </div>
            <button
              type="button"
              class="clay-btn clay-btn--icon shrink-0"
              aria-label="关闭"
              @click="close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div v-scrollbar-reveal class="clay-drawer__scroll">
            <div class="clay-rail__track clay-inset">
              <BlogSeriesStageList :nav="activeNav" @navigate="onNavigate" />
            </div>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </template>
</template>
