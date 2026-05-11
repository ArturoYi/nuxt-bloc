<script setup lang="ts">
const route = useRoute()
const category = decodeURIComponent(String(route.params.category))

const { data: photos } = await useAsyncData(`gallery-category:${route.path}`, () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/gallery/%')
    .where('category', '=', category)
    .order('date', 'DESC')
    .all()
})

if (!(photos.value?.length)) {
  throw createError({
    statusCode: 404,
    statusMessage: '分类不存在',
  })
}

useSiteSeo({
  title: `${category} 照片分类`,
  description: `${category} 分类下的照片列表。`,
  path: route.path,
  image: photos.value?.[0]?.image,
  imageAlt: `${category} 分类分享图`,
})
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <section class="page-header page-header--wide">
      <p class="eyebrow">Gallery Category</p>
      <h1>{{ category }}</h1>
      <p>这个分类下共有 {{ photos?.length || 0 }} 张作品。</p>
    </section>

    <section class="gallery-wall">
      <article
        v-for="photo in photos ?? []"
        :key="photo.path"
        class="gallery-wall__item"
      >
        <figure class="photo-card" :class="`photo-card--${photo.aspect || 'landscape'}`">
          <MediaAsset
            :src="photo.image"
            :alt="photo.title"
            :preview-label="`预览 ${photo.title}`"
          />
          <figcaption class="photo-card__caption">
            <div>
              <p class="photo-card__eyebrow">{{ photo.category || '作品' }} · {{ photo.date || '未填写日期' }}</p>
              <h3>
                <NuxtLink :to="photo.path">{{ photo.title }}</NuxtLink>
              </h3>
              <p>{{ photo.description }}</p>
            </div>
          </figcaption>
        </figure>
      </article>
    </section>
  </div>
</template>
