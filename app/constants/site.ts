export type SiteNavigationItem = {
  to: string
  label: string
}

export type SiteFooterLink = {
  label: string
  to?: string
  href?: string
}

export const SITE_BRAND_NAME = 'Arlen'
export const SITE_DESCRIPTION = ''
export const SITE_FOOTER_DESCRIPTION = SITE_DESCRIPTION
export const SITE_HOME_INTRO = '我是一名前端开发者，喜欢研究技术，喜欢记录，喜欢探索未知。 \n 这里是我的一些思考和总结。'

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
