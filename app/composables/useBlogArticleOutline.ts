import type { BlogArticleOutline } from '~/types/blog'

type PageWithToc = {
  body?: {
    toc?: {
      title?: string | null
      depth?: number
      searchDepth?: number
      links?: BlogArticleOutline['links']
    } | null
  } | null
}

/** 从 content 页面的 body.toc 提取右侧大纲数据 */
export function useBlogArticleOutline(page: Ref<PageWithToc | null | undefined>) {
  return computed<BlogArticleOutline | null>(() => {
    const toc = page.value?.body?.toc
    const links = toc?.links
    if (!links?.length) return null

    return {
      title: toc?.title ?? null,
      depth: toc?.depth ?? 3,
      searchDepth: toc?.searchDepth ?? 3,
      links,
    }
  })
}
