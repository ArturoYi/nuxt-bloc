export default eventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /editor',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `# RSS Feed: ${siteUrl}/rss.xml`,
  ].join('\n')

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return body
})
