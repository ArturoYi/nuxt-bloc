import type { BlogTocLink } from '~/types/blog'
import { flattenBlogOutlineLinks } from '~~/utils/blog-outline'
import { getArticleScrollRoot } from '~/utils/article-scroll'

const SPY_TOP_OFFSET = 96
const MAIN_SCROLL_INSET = 20

export function useBlogOutlineSpy(links: MaybeRefOrGetter<BlogTocLink[]>) {
  const activeId = ref<string | null>(null)

  let stopScroll: (() => void) | undefined

  function resolveActiveId(flat: BlogTocLink[]) {
    if (!flat.length) return null

    const scrollRoot = getArticleScrollRoot()
    const baseline = scrollRoot
      ? scrollRoot.getBoundingClientRect().top + SPY_TOP_OFFSET
      : SPY_TOP_OFFSET

    let current = flat[0]!.id
    for (const link of flat) {
      const el = document.getElementById(link.id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= baseline) current = link.id
    }
    return current
  }

  function bindScrollSpy() {
    if (!import.meta.client) return
    stopScroll?.()
    const flat = flattenBlogOutlineLinks(toValue(links))
    if (!flat.length) {
      activeId.value = null
      return
    }

    const update = useThrottleFn(() => {
      activeId.value = resolveActiveId(flat)
    }, 80)

    const scrollRoot = getArticleScrollRoot()
    update()
    if (scrollRoot) {
      scrollRoot.addEventListener('scroll', update, { passive: true })
    } else {
      window.addEventListener('scroll', update, { passive: true })
    }
    window.addEventListener('resize', update, { passive: true })
    stopScroll = () => {
      if (scrollRoot) {
        scrollRoot.removeEventListener('scroll', update)
      } else {
        window.removeEventListener('scroll', update)
      }
      window.removeEventListener('resize', update)
    }
  }

  const route = useRoute()

  watch(() => toValue(links), () => nextTick(bindScrollSpy))
  watch(() => route.path, () => nextTick(bindScrollSpy))

  onMounted(() => nextTick(bindScrollSpy))
  onBeforeUnmount(() => stopScroll?.())

  function scrollTo(id: string) {
    if (!import.meta.client) return
    const el = document.getElementById(id)
    if (!el) return

    const scrollRoot = getArticleScrollRoot()
    if (scrollRoot) {
      const rootRect = scrollRoot.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const top =
        scrollRoot.scrollTop + (elRect.top - rootRect.top) - MAIN_SCROLL_INSET
      scrollRoot.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      })
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    activeId.value = id
  }

  return { activeId, scrollTo }
}
