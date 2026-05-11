<script setup lang="ts">
import { contentCover } from '~~/utils/content'

const route = useRoute()

const { data: page } = await useAsyncData(`page:${route.path}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '文章不存在',
  })
}

useSiteSeo({
  title: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
  path: route.path,
  image: contentCover(page.value),
  imageAlt: page.value.title,
  type: 'article',
})
</script>

<template>
  <div class="container page-stack">
    <div class="breadcrumb-row">
      <NuxtLink to="/">首页</NuxtLink>
      <span>/</span>
      <NuxtLink to="/blog">博客</NuxtLink>
      <span>/</span>
      <span>{{ page?.title }}</span>
    </div>

    <article v-if="page" class="content-card">
      <div v-if="contentCover(page)" class="article-cover">
        <MediaAsset
          :src="contentCover(page)!"
          :alt="page.title"
          :preview-label="`预览 ${page.title} 封面图`"
          :lazy="false"
        />
      </div>

      <header class="article-header">
        <p class="eyebrow">{{ page.category || '文章' }}</p>
        <h1>{{ page.title }}</h1>
        <p class="article-description">{{ page.description }}</p>
        <div class="article-meta">
          <span>{{ page.date || '未填写日期' }}</span>
          <div class="tag-row">
            <span v-for="tag in page.tags || []" :key="tag" class="tag-chip">
              {{ tag }}
            </span>
          </div>
        </div>
      </header>

      <ContentRenderer :value="page" prose />
    </article>
  </div>
</template>
