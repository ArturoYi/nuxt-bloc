<script setup lang="ts">
import { contentCover } from '~~/utils/content'

const route = useRoute()
const category = decodeURIComponent(String(route.params.category))

const { data: posts } = await useAsyncData(`blog-category:${route.path}`, () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/blog/%')
    .where('category', '=', category)
    .order('date', 'DESC')
    .all()
})

if (!(posts.value?.length)) {
  throw createError({
    statusCode: 404,
    statusMessage: '分类不存在',
  })
}

useSiteSeo({
  title: `${category} 分类`,
  description: `${category} 分类下的博客文章列表。`,
  path: route.path,
  image: contentCover(posts.value?.[0]),
  imageAlt: `${category} 分类封面图`,
})
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <section class="page-header page-header--wide">
      <p class="eyebrow">Blog Category</p>
      <h1>{{ category }}</h1>
      <p>这个分类下共有 {{ posts?.length || 0 }} 篇文章。</p>
    </section>

    <section class="archive-list">
      <article
        v-for="post in posts ?? []"
        :key="post.path"
        class="archive-card"
      >
        <div v-if="contentCover(post)" class="archive-card__cover">
          <MediaAsset
            :src="contentCover(post)!"
            :alt="post.title"
            :preview-label="`预览 ${post.title} 封面图`"
          />
        </div>
        <div class="archive-card__meta">
          <span>{{ post.date || '未填写日期' }}</span>
          <span>{{ post.category || '未分类' }}</span>
        </div>
        <div class="archive-card__body">
          <h3>
            <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
          </h3>
          <p>{{ post.description }}</p>
          <div class="tag-row">
            <span v-for="tag in post.tags || []" :key="tag" class="tag-chip">
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
