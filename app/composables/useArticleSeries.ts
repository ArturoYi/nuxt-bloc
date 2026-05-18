import type { BlogSeriesNav } from '~/types/blog'
import { buildBlogSeriesNav, toBlogSeriesArticle } from '~~/utils/blog-series'

export type ArticleSeriesPage = {
  path: string
  title: string
  series?: string | null
  stage?: string | null
  stem: string
  date?: string | null
  published?: boolean | null
}

export type ArticleSeriesSection = 'blog' | 'notes'

const SECTION_PATH_PREFIX: Record<ArticleSeriesSection, string> = {
  blog: '/blog',
  notes: '/notes',
}

function isSeriesArticle(
  post: { path?: string | null, series?: string | null, stage?: string | null },
  pathPrefix: string,
) {
  const path = post.path ?? ''
  return path.startsWith(`${pathPrefix}/`)
    && Boolean(post.series?.trim())
    && Boolean(post.stage?.trim())
}

function hasSeriesNavContent(nav: BlogSeriesNav | null | undefined) {
  return Boolean(nav?.stages?.some(stage => stage.articles.length > 0))
}

export function useArticleSeries(
  page: Ref<ArticleSeriesPage | null | undefined>,
  section: ArticleSeriesSection,
) {
  const route = useRoute()
  const pathPrefix = SECTION_PATH_PREFIX[section]
  const { setHasSeriesNav } = useLayoutDrawer()

  const seriesName = computed(() => page.value?.series?.trim() || null)

  // 切换文章时 page 会短暂为空；保留上一次系列名，避免 useAsyncData key 抖动清空侧栏
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

  const seriesNav = computed<BlogSeriesNav | null>(() => {
    const base = seriesNavBase.value
    if (!base) return null
    return { ...base, currentPath: route.path }
  })

  watch(
    seriesNav,
    (nav) => {
      if (hasSeriesNavContent(nav)) {
        setHasSeriesNav(true)
        return
      }
      if (!seriesKey.value) {
        setHasSeriesNav(false)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    setHasSeriesNav(false)
  })

  return {
    seriesName,
    seriesNav,
  }
}

export function useBlogArticleSeries(page: Ref<ArticleSeriesPage | null | undefined>) {
  return useArticleSeries(page, 'blog')
}

export function useNotesArticleSeries(page: Ref<ArticleSeriesPage | null | undefined>) {
  return useArticleSeries(page, 'notes')
}
