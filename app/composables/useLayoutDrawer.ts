export type LayoutDrawerPanel = "sidebar" | "outline";

const activePanel = ref<LayoutDrawerPanel | null>(null);
const hasSeriesNav = ref(false);

export function useLayoutDrawer() {
  const isOpen = computed(() => activePanel.value !== null);

  const isSidebarOpen = computed(() => activePanel.value === "sidebar");
  const isOutlineOpen = computed(() => activePanel.value === "outline");

  const toggleSidebar = () => {
    activePanel.value = activePanel.value === "sidebar" ? null : "sidebar";
  };

  const toggleOutline = () => {
    activePanel.value = activePanel.value === "outline" ? null : "outline";
  };

  const close = () => {
    activePanel.value = null;
  };

  const setHasSeriesNav = (value: boolean) => {
    hasSeriesNav.value = value;
  };

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
  };
}
