import { contentCover } from './content'
import { sortBlogSeriesArticles, toBlogSeriesArticle } from './blog-series'

export interface NotesSeriesPost {
  path: string
  title: string
  stem: string
  series?: string | null
  stage?: string | null
  date?: string | null
  cover?: string | null
  image?: string | null
}

export interface NotesSeriesSummary {
  series: string
  articleCount: number
  href: string
  cover: string | null
  /** 用于列表排序：系列内最新文章时间戳 */
  sortTimestamp: number
}

function timestampFromContentDate(date?: string | null) {
  if (!date) return Number.NEGATIVE_INFINITY
  const t = Date.parse(date)
  return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY
}

/** 将笔记按 series 聚合，首篇链接与封面遵循系列内 stem / 日期排序 */
export function buildNotesSeriesSummaries(posts: NotesSeriesPost[]): NotesSeriesSummary[] {
  const bySeries = new Map<string, NotesSeriesPost[]>()

  for (const post of posts) {
    const name = post.series?.trim()
    if (!name) continue
    const bucket = bySeries.get(name)
    if (bucket) bucket.push(post)
    else bySeries.set(name, [post])
  }

  const summaries: NotesSeriesSummary[] = []

  for (const [series, articles] of bySeries) {
    const sorted = sortBlogSeriesArticles(articles.map(toBlogSeriesArticle))
    const pathOrder = sorted.map(item => item.path)
    const orderedPosts = pathOrder
      .map(path => articles.find(post => post.path === path))
      .filter((post): post is NotesSeriesPost => Boolean(post))

    const href = sorted[0]?.path ?? articles[0]!.path
    const coverPost = orderedPosts.find(post => contentCover(post)) ?? orderedPosts[0]
    const cover = coverPost ? contentCover(coverPost) : null
    const sortTimestamp = Math.max(
      ...articles.map(post => timestampFromContentDate(post.date)),
    )

    summaries.push({
      series,
      articleCount: articles.length,
      href,
      cover,
      sortTimestamp,
    })
  }

  return summaries.sort((a, b) => b.sortTimestamp - a.sortTimestamp)
}
