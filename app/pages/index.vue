<script setup lang="ts">
import { contentCover } from '~~/utils/content'

const { data: home } = await useAsyncData('home-page', () => {
  return queryCollection('content').path('/').first()
})

const { data: recentPosts } = await useAsyncData('recent-posts', () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/blog/%')
    .order('date', 'DESC')
    .limit(4)
    .all()
})

const { data: featuredPhotos } = await useAsyncData('featured-photos', () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/gallery/%')
    .where('featured', '=', true)
    .order('date', 'DESC')
    .limit(3)
    .all()
})

const { data: totalPosts } = await useAsyncData('total-posts', () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/blog/%')
    .count()
})

const { data: totalPhotos } = await useAsyncData('total-photos', () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/gallery/%')
    .count()
})

useSiteSeo({
  title: home.value?.seo?.title || home.value?.title || 'Nuxt Bloc',
  description:
    home.value?.seo?.description ||
    home.value?.description ||
    'Nuxt 4 静态博客起步项目',
  path: '/',
  image: contentCover(recentPosts.value?.[0]) || featuredPhotos.value?.[0]?.image,
  imageAlt: 'Nuxt Bloc 首页分享图',
})
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <section class="home-hero">
      <div class="home-hero__main">
        <p class="eyebrow">Nuxt 4 static content journal</p>
        <h1>更像正式博客的内容站模板</h1>
        <p class="hero-copy">
          现在这个项目已经不只是“能跑通”的示例，而是一个统一了博客、照片墙、Markdown
          编辑器和静态生成链路的轻量内容站基础模板。
        </p>

        <div class="action-row">
          <NuxtLink to="/blog" class="button button--primary">阅读博客</NuxtLink>
          <NuxtLink to="/gallery" class="button">进入照片墙</NuxtLink>
          <NuxtLink to="/editor" class="button">打开编辑器</NuxtLink>
        </div>

        <div class="hero-metrics">
          <div class="metric-card">
            <span class="metric-card__label">文章</span>
            <strong>{{ totalPosts ?? 0 }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">照片</span>
            <strong>{{ totalPhotos ?? 0 }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">输出</span>
            <strong>Static</strong>
          </div>
        </div>
      </div>

      <div class="home-hero__aside">
        <div class="spotlight-card">
          <p class="eyebrow">Project Focus</p>
          <h2>内容优先，视觉统一，生成稳定</h2>
          <ul class="spotlight-list">
            <li>Nuxt Content 驱动 Markdown 与页面</li>
            <li>首页、博客、照片墙共用统一视觉系统</li>
            <li>`nuxt generate` 可直接输出静态部署产物</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="feature-grid">
      <article class="feature-card">
        <h2>内容系统</h2>
        <p>基于 `@nuxt/content` 统一查询、渲染、预渲染策略。</p>
      </article>
      <article class="feature-card">
        <h2>Markdown 扩展</h2>
        <p>已接入 GFM、数学公式、自定义 callout，正文与编辑器风格统一。</p>
      </article>
      <article class="feature-card">
        <h2>照片墙</h2>
        <p>使用真实页面路由、本地资源和内容元数据，不是占位区块。</p>
      </article>
      <article class="feature-card">
        <h2>静态部署</h2>
        <p>已验证 `generate` 可产出多级详情页与图片墙页面。</p>
      </article>
    </section>

    <section class="section-shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Recent Writing</p>
          <h2>最近文章</h2>
        </div>
        <NuxtLink to="/blog">全部文章</NuxtLink>
      </div>

      <div class="teaser-grid">
        <article v-for="post in recentPosts ?? []" :key="post.path" class="teaser-card">
          <MediaAsset
            v-if="contentCover(post)"
            class="teaser-card__cover"
            :src="contentCover(post)!"
            :alt="post.title"
            :preview-label="`预览 ${post.title} 封面图`"
          />
          <p class="post-meta">{{ post.date || '未填写日期' }} · {{ post.category || '未分类' }}</p>
          <h3>
            <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
          </h3>
          <p>{{ post.description }}</p>
          <div class="tag-row">
            <span v-for="tag in post.tags || []" :key="tag" class="tag-chip">
              {{ tag }}
            </span>
          </div>
        </article>
      </div>
    </section>

    <section class="section-shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Gallery Preview</p>
          <h2>照片墙预览</h2>
        </div>
        <NuxtLink to="/gallery">查看全部</NuxtLink>
      </div>

      <div class="gallery-preview-grid">
        <article
          v-for="photo in featuredPhotos ?? []"
          :key="photo.path"
          class="gallery-preview-card"
        >
          <MediaAsset
            class="gallery-preview-card__cover"
            :src="photo.image"
            :alt="photo.title"
            :preview-label="`预览 ${photo.title}`"
          />
          <div class="gallery-preview-card__body">
            <p class="post-meta">{{ photo.location || '未知地点' }}</p>
            <h3>
              <NuxtLink :to="photo.path">{{ photo.title }}</NuxtLink>
            </h3>
            <p>{{ photo.description }}</p>
          </div>
        </article>
      </div>
    </section>

    <section v-if="home" class="section-shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">About This Project</p>
          <h2>项目说明</h2>
        </div>
      </div>

      <div class="content-card content-card--soft">
        <ContentRenderer :value="home" prose />
      </div>
    </section>
  </div>
</template>
