/** 文章目录（TOC）单条链接 */
export interface BlogTocLink {
  id: string
  depth: number
  text: string
  children?: BlogTocLink[]
}

/** 文章页右侧大纲数据 */
export interface BlogArticleOutline {
  title?: string | null
  depth: number
  searchDepth: number
  links: BlogTocLink[]
}

/** 系列导航中的单篇文章 */
export interface BlogSeriesArticle {
  path: string
  title: string
  series?: string | null
  stage?: string | null
  stem: string
  date?: string | null
}

/** 系列导航中的 stage 分组 */
export interface BlogSeriesStageGroup {
  name: string
  articles: BlogSeriesArticle[]
}

/** 系列文章侧边栏 / 抽屉导航的完整数据 */
export interface BlogSeriesNav {
  series: string
  currentPath: string
  stages: BlogSeriesStageGroup[]
}

/** 参与系列导航查询的文章 frontmatter 字段 */
export type ArticleSeriesPage = BlogSeriesArticle & {
  published?: boolean | null
}
