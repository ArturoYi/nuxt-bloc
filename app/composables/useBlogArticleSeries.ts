import type { BlogSeriesNav } from '~/types/blog'
import { buildBlogSeriesNav, toBlogSeriesArticle } from '~~/utils/blog-series'

type BlogPage = {
  path: string
  title: string
  series?: string | null
  stage?: string | null
  stem: string
  date?: string | null
  published?: boolean | null
}

export async function useBlogArticleSeries(page: Ref<BlogPage | null | undefined>) {
  const route = useRoute()

  const seriesName = computed(() => page.value?.series?.trim() || null)

  const { data: seriesPosts } = await useAsyncData(
    () => `blog-series:${seriesName.value ?? 'none'}`,
    async () => {
      const name = seriesName.value
      if (!name) return []

      const posts = await queryCollection('content')
        .where('published', '=', true)
        .where('series', '=', name)
        .where('path', 'LIKE', '/blog/%')
        .all()

      return posts.filter(post => post.series?.trim() && post.stage?.trim())
    },
    { watch: [seriesName] },
  )

  const seriesNav = computed<BlogSeriesNav | null>(() => {
    const name = seriesName.value
    const current = page.value
    const posts = seriesPosts.value
    if (!name || !current || !posts?.length) return null

    return buildBlogSeriesNav(
      posts.map(post => toBlogSeriesArticle(post)),
      { series: name, currentPath: route.path },
    )
  })

  return {
    seriesName,
    seriesPosts,
    seriesNav,
  }
}
