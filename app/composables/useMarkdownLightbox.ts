import type { InjectionKey, Ref } from 'vue'

export interface MarkdownLightboxImage {
  src: string
  title?: string
}

export interface MarkdownLightboxContext {
  images: Ref<MarkdownLightboxImage[]>
  visible: Ref<boolean>
  index: Ref<number>
  register: (image: MarkdownLightboxImage) => number
  open: (index: number) => void
  close: () => void
}

export const MARKDOWN_LIGHTBOX_KEY: InjectionKey<MarkdownLightboxContext> =
  Symbol('markdownLightbox')

const preloadedSources = new Set<string>()

export function preloadLightboxImage(src: string) {
  if (!import.meta.client || !src || preloadedSources.has(src)) {
    return
  }

  preloadedSources.add(src)

  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

export function provideMarkdownLightbox(): MarkdownLightboxContext {
  const images = ref<MarkdownLightboxImage[]>([])
  const visible = ref(false)
  const index = ref(0)

  const route = useRoute()
  watch(
    () => route.path,
    () => {
      images.value = []
      visible.value = false
      index.value = 0
    },
  )

  function register(image: MarkdownLightboxImage): number {
    const existingIndex = images.value.findIndex(
      (item) => item.src === image.src && item.title === image.title,
    )
    if (existingIndex >= 0) {
      preloadLightboxImage(image.src)
      return existingIndex
    }

    images.value.push(image)
    preloadLightboxImage(image.src)
    return images.value.length - 1
  }

  function open(imageIndex: number) {
    index.value = imageIndex
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  const context: MarkdownLightboxContext = {
    images,
    visible,
    index,
    register,
    open,
    close,
  }

  provide(MARKDOWN_LIGHTBOX_KEY, context)
  return context
}

export function useMarkdownLightbox(): MarkdownLightboxContext | null {
  return inject(MARKDOWN_LIGHTBOX_KEY, null)
}

export function downloadLightboxImage(src: string, title?: string) {
  const filename =
    title?.replace(/[^\w\u4e00-\u9fff.-]+/g, '_').slice(0, 80) ||
    src.split('/').pop()?.split('?')[0] ||
    'image'

  const link = document.createElement('a')
  link.href = src
  link.download = filename
  link.rel = 'noopener'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
