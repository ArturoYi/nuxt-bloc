import { yearFromContentDate } from './content-dates'

export type ArchiveYearGroup<T> = {
  label: string
  posts: T[]
  yearWatermark: boolean
}

/** 按发布年份分组归档列表（保持输入顺序，同一年合并为一组）。 */
export function groupPostsByContentYear<T extends { date?: string | null }>(
  posts: readonly T[],
): ArchiveYearGroup<T>[] {
  const groups: ArchiveYearGroup<T>[] = []
  for (const post of posts) {
    const y = yearFromContentDate(post.date)
    const label = y === null ? '日期未定' : String(y)
    const yearWatermark = /^\d{4}$/.test(label)
    const last = groups[groups.length - 1]
    if (!last || last.label !== label) {
      groups.push({ label, posts: [post], yearWatermark })
    } else {
      last.posts.push(post)
    }
  }
  return groups
}

export function absoluteSitePath(siteUrl: string, path: string) {
  const base = siteUrl.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildItemListJsonLd(
  siteUrl: string,
  items: readonly { name: string; path: string }[],
) {
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteSitePath(siteUrl, item.path),
    })),
  }
}
