import type { BlogSeriesArticle, BlogSeriesNav } from '~/types/blog'

/** 未指定 stage 时的默认分组名（不在 UI 中显示分组标题） */
export const DEFAULT_STAGE_NAME = '未分阶段'

/** 判断系列导航是否包含可展示的文章 */
export function hasBlogSeriesNavContent(nav: BlogSeriesNav | null | undefined) {
  return Boolean(nav?.stages?.some(stage => stage.articles.length > 0))
}

/** 用路径分隔符作为排序键，保证目录层级顺序稳定 */
function stemSortKey(stem: string) {
  return stem.replaceAll('/', '\0')
}

function timestampFromContentDate(date?: string | null) {
  if (!date) return Number.POSITIVE_INFINITY
  const t = Date.parse(date)
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY
}

/** 按 stem 路径、再按发布日期排序系列文章 */
export function sortBlogSeriesArticles(articles: BlogSeriesArticle[]) {
  return [...articles].sort((a, b) => {
    const byStem = stemSortKey(a.stem).localeCompare(stemSortKey(b.stem), 'en')
    if (byStem !== 0) return byStem
    return timestampFromContentDate(a.date) - timestampFromContentDate(b.date)
  })
}

/** 将扁平文章列表按 stage 分组，构建系列导航数据结构 */
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

/** 将 content collection 条目转为系列导航文章项 */
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
