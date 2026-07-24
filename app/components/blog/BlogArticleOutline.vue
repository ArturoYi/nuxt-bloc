<script setup lang="ts">
import type { BlogArticleOutline } from '~/types/blog'
import {
  flattenBlogOutlineLinks,
  getOutlineMinDepth,
} from '~~/utils/blog-outline'

const props = defineProps<{
  outline: BlogArticleOutline | null
}>()

const { isOutlineOpen, close } = useLayoutDrawer()
const isOutlineDrawer = useMediaQuery('(max-width: 991.98px)')

const flatLinks = computed(() =>
  props.outline ? flattenBlogOutlineLinks(props.outline.links) : [],
)

const minDepth = computed(() =>
  props.outline ? getOutlineMinDepth(props.outline.links) : 2,
)

const { activeId, scrollTo } = useBlogOutlineSpy(flatLinks)

function onNavigate(id: string) {
  if (isOutlineDrawer.value) {
    close()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollTo(id)
      })
    })
  } else {
    scrollTo(id)
  }
}
</script>

<template>
  <template v-if="outline && flatLinks.length">
    <nav
      v-show="!isOutlineDrawer"
      id="layout-site-outline"
      class="clay-rail clay-rail--outline"
      aria-label="页面导航"
    >
      <header class="clay-rail__head">
        <span class="clay-rail__eyebrow">大纲</span>
        <h2 class="clay-rail__title">文章大纲</h2>
      </header>
      <div v-scrollbar-reveal class="clay-rail__track clay-inset">
        <BlogOutlineNav
          :links="flatLinks"
          :active-id="activeId"
          :min-depth="minDepth"
          @navigate="onNavigate"
        />
      </div>
    </nav>

    <Teleport to="body">
      <Transition name="layout-drawer">
        <button
          v-if="isOutlineDrawer && isOutlineOpen"
          type="button"
          class="layout-drawer-scrim"
          aria-label="关闭页面大纲"
          @click="close"
        />
      </Transition>

      <Transition name="layout-drawer-panel">
        <aside
          v-if="isOutlineDrawer && isOutlineOpen"
          id="layout-site-outline"
          class="blog-outline-drawer clay-drawer clay-drawer--outline"
          role="dialog"
          aria-modal="true"
          aria-label="页面导航"
        >
          <header class="clay-drawer__head">
            <div class="clay-rail__head clay-rail__head--compact">
              <span class="clay-rail__eyebrow">大纲</span>
              <p class="clay-rail__title">文章大纲</p>
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
              <BlogOutlineNav
                :links="flatLinks"
                :active-id="activeId"
                :min-depth="minDepth"
                @navigate="onNavigate"
              />
            </div>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </template>
</template>
