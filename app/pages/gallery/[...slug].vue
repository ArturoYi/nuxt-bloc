<script setup lang="ts">
const route = useRoute()

const { data: photo } = await useAsyncData(`gallery:${route.path}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!photo.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '照片不存在',
  })
}

useSiteSeo({
  title: photo.value.seo?.title || photo.value.title,
  description: photo.value.seo?.description || photo.value.description,
  path: route.path,
  image: photo.value.image,
  imageAlt: photo.value.title,
  type: 'article',
})
</script>

<template>
  <div class="container page-stack">
    <div class="breadcrumb-row">
      <NuxtLink to="/">首页</NuxtLink>
      <span>/</span>
      <NuxtLink to="/gallery">照片墙</NuxtLink>
      <span>/</span>
      <span>{{ photo?.title }}</span>
    </div>

    <article v-if="photo" class="photo-detail">
      <div class="photo-detail__image">
        <MediaAsset
          :src="photo.image"
          :alt="photo.title"
          :preview-label="`预览 ${photo.title}`"
          :lazy="false"
          fit="contain"
        />
      </div>

      <div class="photo-detail__content">
        <header class="photo-detail__header">
          <p class="eyebrow">{{ photo.category || '摄影作品' }}</p>
          <h1>{{ photo.title }}</h1>
          <p class="article-description">{{ photo.description }}</p>

          <div class="tag-row">
            <span class="tag-chip tag-chip--muted">
              {{ photo.date || '未填写日期' }}
            </span>
            <span
              v-if="photo.location"
              class="tag-chip tag-chip--muted"
            >
              {{ photo.location }}
            </span>
            <span v-for="tag in photo.tags || []" :key="tag" class="tag-chip">
              {{ tag }}
            </span>
          </div>
        </header>

        <div class="content-card content-card--soft markdown-body">
          <ContentRenderer :value="photo" prose />
        </div>
      </div>
    </article>
  </div>
</template>
