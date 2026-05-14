export type SiteNavigationItem = {
  to: string
  label: string
}

export type SiteFooterLink = {
  label: string
  to?: string
  href?: string
}

export const SITE_BRAND_NAME = 'Nuxt Demo'
export const SITE_DESCRIPTION = '基于 Nuxt 4、Nuxt Content 与 generate 的静态内容站点示例。'
export const SITE_FOOTER_DESCRIPTION = SITE_DESCRIPTION
export const SITE_HOME_INTRO = '你好，这里是Nuxt Demo'

export const siteNavigationItems: SiteNavigationItem[] = [
  { to: '/blog', label: '博客' },
  { to: '/gallery', label: '照片' },
  { to: '/editor', label: '编辑器' },
]

export const siteFooterLinks: SiteFooterLink[] = [
  { to: '/blog', label: '博客' },
  { to: '/gallery', label: '照片墙' },
  { to: '/editor', label: '编辑器' },
  { href: '/rss.xml', label: 'RSS' },
  { href: '/sitemap.xml', label: 'Sitemap' },
]
