import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

/**
 * 锁定页面滚动且避免滚动条消失引起的布局跳动（固定 body 而非仅 overflow:hidden）。
 */
export function useBodyScrollLock(locked: MaybeRefOrGetter<boolean>) {
  const scrollY = ref(0)

  function lock() {
    scrollY.value = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY.value}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
  }

  function unlock() {
    const y = scrollY.value
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    
    const htmlStyle = document.documentElement.style
    const originalScrollBehavior = htmlStyle.scrollBehavior
    
    htmlStyle.scrollBehavior = 'auto'
    window.scrollTo({ top: y, left: 0, behavior: 'instant' })
    
    setTimeout(() => {
      htmlStyle.scrollBehavior = originalScrollBehavior
    }, 0)
  }

  watch(
    () => toValue(locked),
    (isLocked) => {
      if (!import.meta.client) return
      if (isLocked) lock()
      else unlock()
    },
    { flush: 'post' },
  )

  onBeforeUnmount(() => {
    if (!import.meta.client) return
    if (toValue(locked)) unlock()
  })
}
