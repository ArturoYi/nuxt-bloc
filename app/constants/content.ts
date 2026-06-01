/**
 * 内容分区（博客 / 笔记）的 URL 前缀与页面文案。
 * 新增分区时在此扩展，并在 useArticleSeries / useContentArticlePage 中接入。
 */
export type ContentSection = 'blog' | 'notes'

export const CONTENT_SECTION_PATH: Record<ContentSection, string> = {
  blog: '/blog',
  notes: '/notes',
}

export const CONTENT_SECTION_NOT_FOUND: Record<ContentSection, string> = {
  blog: '文章不存在',
  notes: '笔记不存在',
}
