<template>
  <div class="site-shell">
    <NuxtRouteAnnouncer />
    <header class="site-header">
      <div class="container site-header__inner">
        <div class="site-branding">
          <NuxtLink to="/" class="site-brand">Nuxt Bloc</NuxtLink>
          <p class="site-tagline">Content-first static journal</p>
        </div>
        <nav class="site-nav" aria-label="主导航">
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/blog">博客</NuxtLink>
          <NuxtLink to="/gallery">照片墙</NuxtLink>
          <NuxtLink to="/editor">编辑器</NuxtLink>
        </nav>
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
