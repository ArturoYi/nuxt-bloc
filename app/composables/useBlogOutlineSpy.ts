import type { BlogTocLink } from '~/types/blog'
import { flattenBlogOutlineLinks } from '~~/utils/blog-outline'

const SPY_TOP_OFFSET = 96

export function useBlogOutlineSpy(links: MaybeRefOrGetter<BlogTocLink[]>) {
  const activeId = ref<string | null>(null)

  let stopScroll: (() => void) | undefined

  function resolveActiveId(flat: BlogTocLink[]) {
    if (!flat.length) return null

    let current = flat[0]!.id
    for (const link of flat) {
      const el = document.getElementById(link.id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= SPY_TOP_OFFSET) current = link.id
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

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    stopScroll = () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }

  watch(() => toValue(links), () => nextTick(bindScrollSpy))

  onMounted(() => nextTick(bindScrollSpy))
  onBeforeUnmount(() => stopScroll?.())

  function scrollTo(id: string) {
    if (!import.meta.client) return
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeId.value = id
  }

  return { activeId, scrollTo }
}
