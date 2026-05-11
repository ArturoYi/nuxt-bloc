import { contentKind, xmlEscape } from '~~/utils/content'

export default eventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const siteTitle = config.public.siteTitle
  const siteDescription = config.public.siteDescription

  const entries = await queryCollection(event, 'content')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all()

  const items = entries
    .filter(entry => entry.path && (entry.path.startsWith('/blog/') || entry.path.startsWith('/gallery/')))
    .map((entry) => {
      const link = `${siteUrl}${entry.path}`
      const title = xmlEscape(entry.title || 'Untitled')
      const description = xmlEscape(entry.description || '')
      const kind = contentKind(entry.path)
      const pubDate = entry.date ? new Date(entry.date).toUTCString() : new Date().toUTCString()

      return [
        '<item>',
        `<title>${title}</title>`,
        `<link>${link}</link>`,
        `<guid>${link}</guid>`,
        `<description>${description}</description>`,
        `<category>${kind}</category>`,
        `<pubDate>${pubDate}</pubDate>`,
        '</item>',
      ].join('')
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${xmlEscape(siteDescription)}</description>
    ${items}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
