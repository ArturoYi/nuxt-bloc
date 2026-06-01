import type { ContentSection } from '~/constants/content'

type ContentPage = {
  title?: string | null
  description?: string | null
  seo?: { title?: string | null, description?: string | null } | null
  series?: string | null
  stage?: string | null
  body?: { toc?: unknown } | null
}

/**
 * 博客 / 笔记详情页通用 setup（同步）：
 * 大纲、系列导航、SEO。
 *
 * 调用方须先在 setup 中 await useAsyncData 并完成 404 校验，再传入 page ref。
 */
export function useContentArticlePage(
  section: ContentSection,
  page: Ref<ContentPage>,
) {
  const route = useRoute()
  const articleOutline = useBlogArticleOutline(page)
  const { seriesNav } = useArticleSeries(page, section)

  useSiteSeo({
    title: page.value.seo?.title || page.value.title,
    description: page.value.seo?.description || page.value.description,
    path: route.path,
    type: 'article',
  })

  return { page, articleOutline, seriesNav }
}
