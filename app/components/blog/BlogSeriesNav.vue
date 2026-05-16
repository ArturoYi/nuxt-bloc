<script setup lang="ts">
import type { BlogSeriesNav } from '~/types/blog'

const props = defineProps<{
  nav: BlogSeriesNav | null
}>()

const hasNav = computed(() =>
  Boolean(props.nav?.stages?.some(stage => stage.articles.length > 0)),
)

const activeNav = computed(() => (hasNav.value ? props.nav : null))

const { isSidebarOpen, close, setHasSeriesNav } = useLayoutDrawer()
const isSidebarDrawer = useMediaQuery('(max-width: 767.98px)')

watch(
  hasNav,
  (visible) => {
    setHasSeriesNav(visible)
    if (!visible && isSidebarOpen.value) close()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  setHasSeriesNav(false)
})

function onNavigate() {
  if (isSidebarDrawer.value) {
    close()
  }
}

console.log(props.nav);
</script>

<template>
  <template v-if="activeNav">
    <!-- 桌面端侧边栏 -->
    <div
      v-show="!isSidebarDrawer"
      class="blog-series-nav blog-series-nav--sidebar"
    >
      <p class="blog-series-nav__title">{{ activeNav.series }}</p>
      
      <div v-for="stage in activeNav.stages" :key="stage.name" class="blog-series-nav__stage">
        <p v-if="stage.name !== '未分阶段'" class="blog-series-nav__stage-name">{{ stage.name }}</p>
        <ol class="blog-series-nav__list">
          <li
            v-for="article in stage.articles"
            :key="article.path"
            class="blog-series-nav__item"
          >
            <NuxtLink
              :to="article.path"
              class="blog-series-nav__link"
              :class="{ 'is-active': activeNav.currentPath === article.path }"
              @click="onNavigate"
            >
              <span class="blog-series-nav__text">{{ article.title }}</span>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </div>

    <!-- 移动端抽屉 -->
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
            <div v-for="stage in activeNav.stages" :key="stage.name" class="blog-series-nav__stage">
              <p v-if="stage.name !== '未分阶段'" class="blog-series-nav__stage-name">{{ stage.name }}</p>
              <ol class="blog-series-nav__list">
                <li
                  v-for="article in stage.articles"
                  :key="article.path"
                  class="blog-series-nav__item"
                >
                  <NuxtLink
                    :to="article.path"
                    class="blog-series-nav__link"
                    :class="{ 'is-active': activeNav.currentPath === article.path }"
                    @click="onNavigate"
                  >
                    <span class="blog-series-nav__text">{{ article.title }}</span>
                  </NuxtLink>
                </li>
              </ol>
            </div>
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
