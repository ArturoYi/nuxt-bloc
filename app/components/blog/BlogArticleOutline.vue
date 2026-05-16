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
      class="blog-outline blog-outline--aside"
      aria-label="页面导航"
    >
      <p class="blog-outline__title">页面导航</p>
      <BlogOutlineNav
        :links="flatLinks"
        :active-id="activeId"
        :min-depth="minDepth"
        @navigate="onNavigate"
      />
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
          class="blog-outline-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="页面导航"
        >
          <header class="blog-outline-drawer__header">
            <p class="blog-outline-drawer__title">页面导航</p>
            <button
              type="button"
              class="blog-outline-drawer__close"
              aria-label="关闭"
              @click="close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div v-scrollbar-reveal class="blog-outline-drawer__body">
            <BlogOutlineNav
              :links="flatLinks"
              :active-id="activeId"
              :min-depth="minDepth"
              @navigate="onNavigate"
            />
          </div>
        </aside>
      </Transition>
    </Teleport>
  </template>
</template>

<style scoped>
.blog-outline--aside {
  padding: 1.25rem 1rem;
}

.blog-outline__title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}
</style>
