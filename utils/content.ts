export const BLOG_PAGE_SIZE = 2
export const NOTES_PAGE_SIZE = 2
export const GALLERY_PAGE_SIZE = 4

export function isBlogPath(path?: string) {
  return Boolean(path?.startsWith('/blog/'))
}

export function isNotesPath(path?: string) {
  return Boolean(path?.startsWith('/notes/'))
}

export function isGalleryPath(path?: string) {
  return Boolean(path?.startsWith('/gallery/'))
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize

  return {
    currentPage,
    totalPages,
    items: items.slice(start, end),
  }
}

export function uniqueCategories<T extends { category?: string | null }>(items: T[]) {
  return [...new Set(items.map(item => item.category).filter(Boolean))]
}

export function contentKind(path?: string) {
  if (isBlogPath(path))
    return 'blog'
  if (isNotesPath(path))
    return 'notes'
  if (isGalleryPath(path))
    return 'gallery'
  return 'page'
}

export function contentCover(item: { cover?: string | null, image?: string | null }) {
  return item.cover || item.image || null
}

export function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;')
}
