import type { BlogSeriesArticle, BlogSeriesNav } from '~/types/blog'

const DEFAULT_STAGE_NAME = '未分阶段'

function stemSortKey(stem: string) {
  return stem.replaceAll('/', '\0')
}

function timestampFromContentDate(date?: string | null) {
  if (!date) return Number.POSITIVE_INFINITY
  const t = Date.parse(date)
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY
}

export function sortBlogSeriesArticles(articles: BlogSeriesArticle[]) {
  return [...articles].sort((a, b) => {
    const byStem = stemSortKey(a.stem).localeCompare(stemSortKey(b.stem), 'en')
    if (byStem !== 0) return byStem
    return timestampFromContentDate(a.date) - timestampFromContentDate(b.date)
  })
}

export function buildBlogSeriesNav(
  articles: BlogSeriesArticle[],
  options: { series: string, currentPath: string },
): BlogSeriesNav {
  const sorted = sortBlogSeriesArticles(articles)
  const stageOrder: string[] = []
  const stageMap = new Map<string, BlogSeriesArticle[]>()

  for (const article of sorted) {
    const stage = article.stage?.trim() || DEFAULT_STAGE_NAME
    if (!stageMap.has(stage)) {
      stageMap.set(stage, [])
      stageOrder.push(stage)
    }
    stageMap.get(stage)!.push(article)
  }

  return {
    series: options.series,
    currentPath: options.currentPath,
    stages: stageOrder.map(name => ({
      name,
      articles: stageMap.get(name) ?? [],
    })),
  }
}

export function toBlogSeriesArticle(item: {
  path: string
  title: string
  series?: string | null
  stage?: string | null
  stem: string
  date?: string | null
}): BlogSeriesArticle {
  return {
    path: item.path,
    title: item.title,
    series: item.series,
    stage: item.stage,
    stem: item.stem,
    date: item.date,
  }
}
