<script setup lang="ts">
import {
  getArticleScrollRoot,
  getPageScrollTop,
  scrollPageToTop,
} from '~/utils/article-scroll'

const SCROLL_SHOW_AT = 360
const route = useRoute()
const { active: progressActive, value: progressValue } = useNavProgress()

const showBackTop = ref(false)
const prefersReducedMotion = ref(false)

let articleScrollRoot: HTMLElement | null = null

const syncBackTop = () => {
  showBackTop.value = getPageScrollTop() > SCROLL_SHOW_AT
}

const scrollToTop = () => {
  scrollPageToTop(prefersReducedMotion.value ? 'instant' : 'smooth')
}

function bindScrollListeners() {
  articleScrollRoot?.removeEventListener('scroll', syncBackTop)
  window.removeEventListener('scroll', syncBackTop)
  articleScrollRoot = getArticleScrollRoot()
  syncBackTop()
  window.addEventListener('scroll', syncBackTop, { passive: true })
  articleScrollRoot?.addEventListener('scroll', syncBackTop, { passive: true })
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  bindScrollListeners()
})

watch(() => route.path, () => nextTick(bindScrollListeners))

onBeforeUnmount(() => {
  articleScrollRoot?.removeEventListener('scroll', syncBackTop)
  window.removeEventListener('scroll', syncBackTop)
})
</script>

<template>
  <div
    class="pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5 opacity-0 transition-opacity duration-200"
    :class="{ 'opacity-100': progressActive }"
    aria-hidden="true"
  >
    <div
      class="h-full w-full origin-left rounded-full bg-gradient-to-r from-clay-brand-strong to-clay-brand shadow-[0_0_12px_rgba(var(--brand-rgb),0.45)] transition-transform duration-300 ease-clay-soft"
      :style="{ transform: `scaleX(${progressValue})` }"
    />
  </div>

  <Transition name="app-back-top">
    <button
      v-show="showBackTop"
      type="button"
      class="clay-btn clay-btn--icon fixed bottom-safe-bottom right-safe-right z-[45] text-clay-text"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 5.5 4.5 13l1.4 1.4L11 9.8V20h2V9.8l5.1 5.6L19.5 13 12 5.5Z"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.app-back-top-enter-active,
.app-back-top-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.app-back-top-enter-from,
.app-back-top-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .app-back-top-enter-active,
  .app-back-top-leave-active {
    transition: none;
  }
}
</style>
