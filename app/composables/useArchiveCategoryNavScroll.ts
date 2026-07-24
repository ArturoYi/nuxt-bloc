import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

/** 归档页分类 pill 横向滚动与左右 nudge 按钮状态。 */
export function useArchiveCategoryNavScroll(categories: MaybeRefOrGetter<readonly string[]>) {
  const categoryScrollRef = ref<HTMLDivElement | null>(null)
  const isMobileNav = ref(false)
  const navScrollOverflow = ref({ overflow: false, left: false, right: false })

  function readCategoryScrollState() {
    const el = categoryScrollRef.value
    if (!el || typeof window === 'undefined') return
    isMobileNav.value = window.matchMedia('(max-width: 639px)').matches
    const maxScroll = el.scrollWidth - el.clientWidth
    const overflow = maxScroll > 6
    const sl = el.scrollLeft
    navScrollOverflow.value = {
      overflow,
      left: overflow && sl > 6,
      right: overflow && sl < maxScroll - 6,
    }
  }

  function nudgeCategoryScroll(direction: -1 | 1) {
    const el = categoryScrollRef.value
    if (!el) return
    const delta = Math.round(Math.min(el.clientWidth * 0.65, 240))
    el.scrollBy({ left: direction * delta, behavior: 'smooth' })
  }

  let categoryScrollResizeObserver: ResizeObserver | null = null

  onMounted(async () => {
    await nextTick()
    readCategoryScrollState()
    const el = categoryScrollRef.value
    if (el && typeof ResizeObserver !== 'undefined') {
      categoryScrollResizeObserver = new ResizeObserver(readCategoryScrollState)
      categoryScrollResizeObserver.observe(el)
    }
    window.addEventListener('resize', readCategoryScrollState)
  })

  onBeforeUnmount(() => {
    categoryScrollResizeObserver?.disconnect()
    categoryScrollResizeObserver = null
    window.removeEventListener('resize', readCategoryScrollState)
  })

  watch(
    () => toValue(categories),
    async () => {
      await nextTick()
      readCategoryScrollState()
    },
  )

  const showNavScrollNudges = computed(
    () => isMobileNav.value && navScrollOverflow.value.overflow,
  )
  const navCanScrollLeft = computed(() => navScrollOverflow.value.left)
  const navCanScrollRight = computed(() => navScrollOverflow.value.right)

  return {
    categoryScrollRef,
    showNavScrollNudges,
    navCanScrollLeft,
    navCanScrollRight,
    readCategoryScrollState,
    nudgeCategoryScroll,
  }
}
