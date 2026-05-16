export type ThemeMode = 'dark' | 'light'
type ThemeTransitionOrigin = {
  x: number
  y: number
}

type ViewTransitionController = {
  finished: Promise<void>
}

type ThemeTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransitionController
}

// 统一管理站点主题状态，避免布局组件直接关心持久化逻辑。
const THEME_STORAGE_KEY = 'nuxt-bloc-theme'

export function useSiteTheme() {
  const theme = useState<ThemeMode>('theme-mode', () => 'dark')

  const isDark = computed(() => theme.value === 'dark')
  const themeToggleLabel = computed(() =>
    isDark.value ? '切换到亮色模式' : '切换到暗色模式',
  )

  const getTransitionOrigin = (event?: MouseEvent): ThemeTransitionOrigin => {
    if (event?.currentTarget instanceof HTMLElement) {
      const rect = event.currentTarget.getBoundingClientRect()

      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
    }

    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
  }

  const toggleTheme = async (event?: MouseEvent) => {
    const nextTheme = isDark.value ? 'light' : 'dark'

    if (!import.meta.client) {
      theme.value = nextTheme
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const transitionDocument = document as ThemeTransitionDocument
    const startViewTransition = transitionDocument.startViewTransition

    if (!startViewTransition || prefersReducedMotion) {
      theme.value = nextTheme
      return
    }

    const origin = getTransitionOrigin(event)
    const radius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    )
    const root = document.documentElement

    root.style.setProperty('--theme-transition-x', `${origin.x}px`)
    root.style.setProperty('--theme-transition-y', `${origin.y}px`)
    root.style.setProperty('--theme-transition-radius', `${radius}px`)

    const transition = startViewTransition.call(transitionDocument, () => {
      theme.value = nextTheme
    })

    await transition.finished
  }

  // 根据当前主题同步页面根节点属性，供主题变量与浏览器 UI 使用。
  useHead(() => ({
    htmlAttrs: {
      'data-theme': theme.value,
      class: isDark.value ? 'dark' : '',
    },
    meta: [
      {
        name: 'theme-color',
        content: isDark.value ? '#0b1020' : '#f6f7fb',
      },
    ],
    link: [
      {
        rel: 'stylesheet',
        href: isDark.value
          ? '/css/github-markdown-dark.min.css'
          : '/css/github-markdown-light.min.css',
      },
    ],
  }))

  if (import.meta.client) {
    onMounted(() => {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

      if (savedTheme === 'dark' || savedTheme === 'light')
        theme.value = savedTheme
    })

    watch(theme, (value) => {
      window.localStorage.setItem(THEME_STORAGE_KEY, value)
    })
  }

  return {
    isDark,
    themeToggleLabel,
    toggleTheme,
  }
}
