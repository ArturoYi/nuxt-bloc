<script setup lang="ts">
type ThemeMode = 'dark' | 'light'

const THEME_STORAGE_KEY = 'nuxt-bloc-theme'
const theme = useState<ThemeMode>('theme-mode', () => 'dark')

const isDark = computed(() => theme.value === 'dark')
const themeToggleLabel = computed(() =>
  isDark.value ? '切换到亮色模式' : '切换到暗色模式',
)

const toggleTheme = () => {
  theme.value = isDark.value ? 'light' : 'dark'
}

useHead(() => ({
  htmlAttrs: {
    'data-theme': theme.value,
  },
  meta: [
    {
      name: 'theme-color',
      content: isDark.value ? '#0b1020' : '#f6f7fb',
    },
  ],
}))

if (import.meta.client) {
  onMounted(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    if (savedTheme === 'dark' || savedTheme === 'light') {
      theme.value = savedTheme
    }
  })

  watch(theme, (value) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, value)
  })
}
</script>

<template>
  <div class="site-shell">
    <NuxtRouteAnnouncer />
    <header class="site-header">
      <div class="container site-header__inner">
        <div class="site-branding">
          <NuxtLink to="/" class="site-brand">Nuxt Bloc</NuxtLink>
          <p class="site-tagline">Content-first static journal</p>
        </div>
        <div class="site-actions">
          <nav class="site-nav" aria-label="主导航">
            <NuxtLink to="/">首页</NuxtLink>
            <NuxtLink to="/blog">博客</NuxtLink>
            <NuxtLink to="/gallery">照片墙</NuxtLink>
            <NuxtLink to="/editor">编辑器</NuxtLink>
          </nav>
          <button
            type="button"
            class="theme-toggle"
            :aria-label="themeToggleLabel"
            @click="toggleTheme"
          >
            <span class="theme-toggle__icon" aria-hidden="true">
              {{ isDark ? '☀' : '☾' }}
            </span>
            <span class="theme-toggle__label">
              {{ isDark ? '亮色' : '暗色' }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <main class="site-main">
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div>
          <p class="footer-title">Nuxt Bloc</p>
          <p>基于 Nuxt 4、Nuxt Content 与 generate 的静态内容站点示例。</p>
        </div>
        <div class="footer-links">
          <NuxtLink to="/blog">博客</NuxtLink>
          <NuxtLink to="/gallery">照片墙</NuxtLink>
          <NuxtLink to="/editor">编辑器</NuxtLink>
          <a href="/rss.xml">RSS</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </div>
    </footer>
  </div>
</template>
