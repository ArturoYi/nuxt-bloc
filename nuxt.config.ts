import { SITE_BRAND_NAME, SITE_DESCRIPTION } from './app/constants/site'


// Nuxt 配置入口，集中定义全局模块、样式和静态生成行为。
const env = (
  globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>
    }
  }
).process?.env ?? {}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  pages: true,

  modules: ['@vueuse/nuxt', '@nuxt/content', '@nuxtjs/mdc'],

  // 全局注册主题、基础排版与布局骨架（layout.css）；业务与头部/页脚样式仍在各 Vue 的 <style> 中。
  css: [
    '~/assets/css/theme.css',
    '~/assets/css/base.css',
    '~/assets/css/layout.css',
    '~/assets/css/custom-blocks.css',
    'katex/dist/katex.min.css',
  ],

  app: {
    head: {
      title: SITE_BRAND_NAME,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0b1020' },
        {
          name: 'description',
          content: SITE_DESCRIPTION,
        },
        { property: 'og:site_name', content: SITE_BRAND_NAME },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://chenyiren.top',
      siteTitle: SITE_BRAND_NAME,
      siteDescription: SITE_DESCRIPTION,
      defaultOgImage: '/og-default.svg',
      twitterHandle: env.NUXT_PUBLIC_TWITTER_HANDLE || '',
    },
  },

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog', '/gallery', '/editor', '/rss.xml', '/sitemap.xml', '/robots.txt'],
    },
  },

  routeRules: {
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/gallery': { prerender: true },
    '/gallery/**': { prerender: true },
    '/editor': { prerender: true },
    '/rss.xml': { prerender: true },
    '/sitemap.xml': { prerender: true },
    '/robots.txt': { prerender: true },
  },

  content: {
    experimental: {
      sqliteConnector: 'native',
    },
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        remarkPlugins: {
          'remark-gfm': {},
          'remark-flexible-markers': {},
          'remark-directive': {},
          'remark-math': {},
          'remark-code-group-compat': {},
          'remark-callout-local': {},
        },
        rehypePlugins: {
          'rehype-slug': {},
          'rehype-external-links': {},
          'rehype-katex': {},
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
    renderer: {
      anchorLinks: {
        h2: true,
        h3: true,
        h4: true,
      },
    },
  },

  mdc: {
    remarkPlugins: {
      'remark-gfm': {},
      'remark-flexible-markers': {},
      'remark-directive': {},
      'remark-math': {},
      'remark-code-group-compat': {},
      'remark-callout-local': {},
    },
    rehypePlugins: {
      'rehype-slug': {},
      'rehype-external-links': {},
      'rehype-katex': {},
    },
    headings: {
      anchorLinks: {
        h2: true,
        h3: true,
        h4: true,
      },
    },
    components: {
      prose: true,
    },
  },
})
