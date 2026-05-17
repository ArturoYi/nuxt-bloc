import { queryCollection } from '#imports'
import { BLOG_PAGE_SIZE, GALLERY_PAGE_SIZE, isBlogPath, isGalleryPath } from '~~/utils/content'

export default eventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  const entries = await queryCollection(event, 'content')
    .where('published', '=', true)
    .all()

  const staticRoutes = [
    '/',
    '/blog',
    '/gallery',
    '/editor',
    '/rss.xml',
    '/sitemap.xml',
  ]

  const categoryRoutes = [
    ...new Set(
      entries
        .filter(entry => entry.category && entry.path?.startsWith('/gallery/'))
        .map(entry => `/gallery/category/${encodeURIComponent(entry.category!)}`),
    ),
  ]

  const blogCount = entries.filter(entry => isBlogPath(entry.path)).length
  const galleryCount = entries.filter(entry => isGalleryPath(entry.path)).length
  const blogPages = Math.ceil(blogCount / BLOG_PAGE_SIZE)
  const galleryPages = Math.ceil(galleryCount / GALLERY_PAGE_SIZE)

  const pageRoutes = [
    ...Array.from({ length: Math.max(blogPages - 1, 0) }, (_, index) => `/blog/page/${index + 2}`),
    ...Array.from({ length: Math.max(galleryPages - 1, 0) }, (_, index) => `/gallery/page/${index + 2}`),
  ]

  const contentRoutes = entries
    .map(entry => entry.path)
    .filter(Boolean)

  const urls = [...new Set([...staticRoutes, ...categoryRoutes, ...pageRoutes, ...contentRoutes])]
    .map(path => `<url><loc>${siteUrl}${path}</loc></url>`)
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
