<script setup lang="ts">
import { GALLERY_PAGE_SIZE, paginate } from '~~/utils/content'

const route = useRoute()
const rawPage = Number(route.params.page)

const { data: photos } = await useAsyncData(`gallery-page:${route.path}`, () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/gallery/%')
    .order('date', 'DESC')
    .all()
})

const pageData = computed(() => paginate(photos.value ?? [], rawPage, GALLERY_PAGE_SIZE))

if (Number.isNaN(rawPage) || rawPage < 1) {
  throw createError({
    statusCode: 404,
    statusMessage: '分页不存在',
  })
}

if (rawPage !== pageData.value.currentPage) {
  throw createError({
    statusCode: 404,
    statusMessage: '分页不存在',
  })
}

function makePageLink(page: number) {
  return page <= 1 ? '/gallery' : `/gallery/page/${page}`
}

useSiteSeo({
  title: `照片墙第 ${rawPage} 页`,
  description: '照片墙分页归档页。',
  path: route.path,
  image: pageData.value.items[0]?.image,
  imageAlt: `照片墙第 ${rawPage} 页分享图`,
})
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <section class="page-header page-header--wide">
      <p class="eyebrow">Gallery Archive</p>
      <h1>照片归档</h1>
      <p>当前是第 {{ rawPage }} 页，用更轻量的卡片浏览摄影内容。</p>
    </section>

    <section class="gallery-wall">
      <article
        v-for="photo in pageData.items"
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

    <PaginationNav
      :current-page="pageData.currentPage"
      :total-pages="pageData.totalPages"
      :make-link="makePageLink"
    />
  </div>
</template>
