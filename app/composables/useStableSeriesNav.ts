import type { BlogSeriesNav } from '~/types/blog'
import { hasBlogSeriesNavContent } from '~~/utils/blog-series'

/**
 * 路由切换期间 props.nav 可能短暂为空，用 lastNav 缓存上一次有效数据，
 * 避免侧栏闪烁；当全局 hasSeriesNav 关闭时一并清空。
 */
export function useStableSeriesNav(
  nav: Ref<BlogSeriesNav | null>,
  hasSeriesNav: Ref<boolean>,
) {
  const route = useRoute()
  const lastNav = shallowRef<BlogSeriesNav | null>(null)

  watch(
    nav,
    (value) => {
      if (hasBlogSeriesNavContent(value)) {
        lastNav.value = value
      }
    },
    { immediate: true },
  )

  watch(hasSeriesNav, (active) => {
    if (!active) {
      lastNav.value = null
    }
  })

  return computed(() => {
    const current = nav.value ?? (hasSeriesNav.value ? lastNav.value : null)
    if (!hasBlogSeriesNavContent(current)) return null
    return { ...current!, currentPath: route.path }
  })
}
