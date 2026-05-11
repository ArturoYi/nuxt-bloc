type SiteSeoOptions = {
  title?: string
  description?: string
  path?: string
  image?: string | null
  imageAlt?: string
  type?: 'website' | 'article'
  robots?: string
}

function withSiteTitle(pageTitle: string | undefined, siteTitle: string) {
  if (!pageTitle || pageTitle === siteTitle)
    return siteTitle
  return `${pageTitle} - ${siteTitle}`
}

function absoluteUrl(siteUrl: string, path?: string | null) {
  if (!path)
    return siteUrl
  if (/^https?:\/\//.test(path))
    return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function useSiteSeo(options: SiteSeoOptions) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const siteTitle = config.public.siteTitle
  const siteDescription = config.public.siteDescription
  const siteImage = config.public.defaultOgImage || '/og-default.svg'
  const twitterHandle = config.public.twitterHandle

  const title = withSiteTitle(options.title, siteTitle)
  const description = options.description || siteDescription
  const url = absoluteUrl(siteUrl, options.path || useRoute().path)
  const image = absoluteUrl(siteUrl, options.image || siteImage)
  const imageAlt = options.imageAlt || options.title || siteTitle

  useSeoMeta({
    title,
    description,
    robots: options.robots,
    ogSiteName: siteTitle,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogType: options.type || 'website',
    ogImage: image,
    ogImageAlt: imageAlt,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: imageAlt,
    twitterSite: twitterHandle || undefined,
    twitterCreator: twitterHandle || undefined,
  })

  useHead({
    link: [
      { rel: 'canonical', href: url },
    ],
  })
}
