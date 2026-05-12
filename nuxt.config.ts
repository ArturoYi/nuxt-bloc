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

  modules: ['@nuxt/content', '@nuxtjs/mdc'],

  // 通过单一入口聚合主题、基础、布局和内容样式，方便后续继续拆分。
  css: ['~/assets/css/main.css', 'katex/dist/katex.min.css'],

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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
        { rel: 'mask-icon', href: '/mask-icon.svg', color: '#646cff' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
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
          'remark-directive': {},
          'remark-math': {},
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
          langs: ['js', 'ts', 'vue', 'bash', 'json', 'md'],
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
      'remark-directive': {},
      'remark-math': {},
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
