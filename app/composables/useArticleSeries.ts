import type { ArticleSeriesPage } from '~/types/blog'
import type { ContentSection } from '~/constants/content'
import { CONTENT_SECTION_PATH } from '~/constants/content'
import {
  buildBlogSeriesNav,
  hasBlogSeriesNavContent,
  toBlogSeriesArticle,
} from '~~/utils/blog-series'

/** 文章是否属于指定分区且具备 series / stage 元数据 */
function isSeriesArticle(
  post: { path?: string | null, series?: string | null, stage?: string | null },
  pathPrefix: string,
) {
  const path = post.path ?? ''
  return path.startsWith(`${pathPrefix}/`)
    && Boolean(post.series?.trim())
    && Boolean(post.stage?.trim())
}

/**
 * 根据当前文章的 series 字段，异步加载同系列文章并构建侧边栏导航。
 * 路由切换时通过 seriesKey 缓存避免侧栏闪烁，并通过挂载世代防止误清全局状态。
 */
export function useArticleSeries(
  page: Ref<ArticleSeriesPage | null | undefined>,
  section: ContentSection,
) {
  const route = useRoute()
  const pathPrefix = CONTENT_SECTION_PATH[section]
  const { setHasSeriesNav } = useLayoutDrawer()

  const seriesName = computed(() => page.value?.series?.trim() || null)

  // 切换文章时 page 会短暂为空；保留上一次系列名，避免 useAsyncData key 抖动
  const seriesKey = ref<string | null>(seriesName.value)

  watch(
    () => page.value,
    (current) => {
      const name = current?.series?.trim() || null
      if (name) {
        seriesKey.value = name
        return
      }
      if (current) {
        seriesKey.value = null
      }
    },
    { immediate: true },
  )

  const { data: seriesNavBase } = useAsyncData(
    () => `${section}-series-nav:${seriesKey.value ?? 'none'}`,
    async () => {
      const name = seriesKey.value
      if (!name) return null

      const posts = await queryCollection('content')
        .where('published', '=', true)
        .where('series', '=', name)
        .all()

      const articles = posts
        .filter(post => isSeriesArticle(post, pathPrefix))
        .map(post => toBlogSeriesArticle(post))

      if (!articles.length) return null

      return buildBlogSeriesNav(articles, {
        series: name,
        currentPath: route.path,
      })
    },
    { watch: [seriesKey] },
  )

  const seriesNav = computed(() => {
    const base = seriesNavBase.value
    if (!base) return null
    return { ...base, currentPath: route.path }
  })

  watch(
    [seriesNav, seriesKey],
    ([nav, key]) => {
      // nav 短暂为空但 seriesKey 仍有效时，保留侧栏入口
      if (key || hasBlogSeriesNavContent(nav)) {
        setHasSeriesNav(true)
        return
      }
      setHasSeriesNav(false)
    },
    { immediate: true },
  )

  // 新页面实例已挂载时，避免旧实例卸载误清全局侧栏状态
  const mountGeneration = useState('article-series-mount-gen', () => 0)
  const instanceGeneration = ++mountGeneration.value

  onBeforeUnmount(() => {
    if (mountGeneration.value === instanceGeneration) {
      setHasSeriesNav(false)
    }
  })

  return { seriesName, seriesNav }
}
