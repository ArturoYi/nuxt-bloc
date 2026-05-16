export interface BlogTocLink {
  id: string
  depth: number
  text: string
  children?: BlogTocLink[]
}

export interface BlogArticleOutline {
  title?: string | null
  depth: number
  searchDepth: number
  links: BlogTocLink[]
}

export interface BlogSeriesArticle {
  path: string
  title: string
  series?: string | null
  stage?: string | null
  stem: string
  date?: string | null
}

export interface BlogSeriesStageGroup {
  name: string
  articles: BlogSeriesArticle[]
}

export interface BlogSeriesNav {
  series: string
  currentPath: string
  stages: BlogSeriesStageGroup[]
}
