import type { BlogTocLink } from '~/types/blog'

export function flattenBlogOutlineLinks(links: BlogTocLink[]): BlogTocLink[] {
  return links.flatMap(link => [
    link,
    ...(link.children?.length ? flattenBlogOutlineLinks(link.children) : []),
  ])
}

export function getOutlineMinDepth(links: BlogTocLink[]) {
  const flat = flattenBlogOutlineLinks(links)
  if (!flat.length) return 2
  return Math.min(...flat.map(link => link.depth))
}

export function getOutlineIndentLevel(depth: number, minDepth: number) {
  return Math.max(0, depth - minDepth)
}
