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
    class="app-nav-progress"
    :class="{ 'app-nav-progress--visible': progressActive }"
    aria-hidden="true"
  >
    <div
      class="app-nav-progress__bar"
      :style="{ transform: `scaleX(${progressValue})` }"
    />
  </div>

  <Transition name="app-back-top">
    <button
      v-show="showBackTop"
      type="button"
      class="app-back-top"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <svg class="app-back-top__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 5.5 4.5 13l1.4 1.4L11 9.8V20h2V9.8l5.1 5.6L19.5 13 12 5.5Z"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.app-nav-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 2px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.app-nav-progress--visible {
  opacity: 1;
}

.app-nav-progress__bar {
  height: 100%;
  width: 100%;
  transform-origin: left center;
  background: linear-gradient(
    90deg,
    var(--brand-strong),
    var(--brand)
  );
  box-shadow: 0 0 12px rgba(var(--brand-rgb), 0.45);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.app-back-top {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  z-index: 45;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid var(--surface-raised-border);
  border-radius: 999px;
  color: var(--text);
  background: var(--surface-raised);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.app-back-top:hover {
  border-color: var(--brand-border);
  color: var(--brand-strong);
}

.app-back-top:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
}

.app-back-top__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.app-back-top-enter-active,
.app-back-top-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.app-back-top-enter-from,
.app-back-top-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .app-nav-progress__bar {
    transition: none;
  }

  .app-back-top-enter-active,
  .app-back-top-leave-active {
    transition: none;
  }
}
</style>
