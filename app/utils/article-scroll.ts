/** 文章三栏页（≥768px）正文区滚动根；其余页面为 window。 */
export function getArticleScrollRoot(): HTMLElement | null {
  if (!import.meta.client) return null
  const main = document.querySelector<HTMLElement>('.layout-main')
  if (!main) return null
  const { overflowY } = getComputedStyle(main)
  if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
    return main
  }
  return null
}

export function getPageScrollTop(): number {
  const root = getArticleScrollRoot()
  if (root) return root.scrollTop
  return (
    window.scrollY
    || document.documentElement.scrollTop
    || document.body.scrollTop
    || 0
  )
}

export function scrollPageToTop(behavior: ScrollBehavior = 'smooth') {
  const root = getArticleScrollRoot()
  if (root) {
    root.scrollTo({ top: 0, behavior })
    return
  }
  window.scrollTo({ top: 0, behavior })
}
