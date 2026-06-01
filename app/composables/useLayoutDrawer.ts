export type LayoutDrawerPanel = 'sidebar' | 'outline'

/** 当前打开的移动端抽屉面板（sidebar = 系列导航，outline = 文章大纲） */
const activePanel = ref<LayoutDrawerPanel | null>(null)

export function useLayoutDrawer() {
  /** 当前页面是否存在可展示的系列导航（供 header 侧栏按钮显隐） */
  const hasSeriesNav = useState('article-series-nav-active', () => false)

  const isOpen = computed(() => activePanel.value !== null)
  const isSidebarOpen = computed(() => activePanel.value === 'sidebar')
  const isOutlineOpen = computed(() => activePanel.value === 'outline')

  const toggleSidebar = () => {
    activePanel.value = activePanel.value === 'sidebar' ? null : 'sidebar'
  }

  const toggleOutline = () => {
    activePanel.value = activePanel.value === 'outline' ? null : 'outline'
  }

  const close = () => {
    activePanel.value = null
  }

  const setHasSeriesNav = (value: boolean) => {
    hasSeriesNav.value = value
  }

  return {
    activePanel,
    isOpen,
    isSidebarOpen,
    isOutlineOpen,
    hasSeriesNav: readonly(hasSeriesNav),
    toggleSidebar,
    toggleOutline,
    close,
    setHasSeriesNav,
  }
}
