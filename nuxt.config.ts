// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  pages: true,

  modules: ['@nuxt/content', '@nuxtjs/mdc'],

  css: ['~/assets/css/main.css', 'katex/dist/katex.min.css'],

  app: {
    head: {
      title: 'Nuxt Bloc',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#6d5efc' },
        {
          name: 'description',
          content: '基于 Nuxt 4 与 Nuxt Content 的纯静态博客起步项目。',
        },
        { property: 'og:site_name', content: 'Nuxt Bloc' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
        { rel: 'mask-icon', href: '/mask-icon.svg', color: '#6d5efc' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      siteTitle: 'Nuxt Bloc',
      siteDescription: '基于 Nuxt 4 与 Nuxt Content 的纯静态博客起步项目。',
      defaultOgImage: '/og-default.svg',
      twitterHandle: process.env.NUXT_PUBLIC_TWITTER_HANDLE || '',
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
