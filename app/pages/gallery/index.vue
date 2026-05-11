<script setup lang="ts">
import { GALLERY_PAGE_SIZE, paginate, uniqueCategories } from '~~/utils/content'

const { data: photos } = await useAsyncData('gallery-photos', () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/gallery/%')
    .order('date', 'DESC')
    .all()
})

const categories = computed(() => uniqueCategories(photos.value ?? []))
const pageData = computed(() => paginate(photos.value ?? [], 1, GALLERY_PAGE_SIZE))
const heroPhotos = computed(() => pageData.value.items.slice(0, 2))
const wallPhotos = computed(() => pageData.value.items)

function makePageLink(page: number) {
  return page <= 1 ? '/gallery' : `/gallery/page/${page}`
}

useSiteSeo({
  title: '照片墙',
  description: '基于本地内容与静态资源构建的摄影作品墙页面。',
  path: '/gallery',
  image: heroPhotos.value[0]?.image,
  imageAlt: heroPhotos.value[0]?.title || '照片墙分享图',
})
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <section class="page-header page-header--wide">
      <p class="eyebrow">Gallery</p>
      <h1>照片墙</h1>
      <p>
        这里的每张作品都来自本地内容条目与静态图片资源，支持筛选、独立详情页和静态预渲染。
      </p>

      <div class="filter-row">
        <NuxtLink
          class="filter-chip filter-chip--active"
          to="/gallery"
        >
          全部
        </NuxtLink>
        <NuxtLink
          v-for="category in categories"
          :key="category"
          class="filter-chip"
          :to="`/gallery/category/${encodeURIComponent(category)}`"
        >
          {{ category }}
        </NuxtLink>
      </div>
    </section>

    <section class="gallery-hero-grid">
      <article
        v-for="photo in heroPhotos"
        :key="photo.path"
        class="gallery-hero-card"
      >
        <MediaAsset
          class="gallery-hero-card__media"
          :src="photo.image"
          :alt="photo.title"
          :preview-label="`预览 ${photo.title}`"
          :lazy="false"
        />
        <div class="gallery-hero-card__overlay">
          <p class="post-meta">{{ photo.date || '未填写日期' }}</p>
          <h2>
            <NuxtLink :to="photo.path">{{ photo.title }}</NuxtLink>
          </h2>
          <p>{{ photo.description }}</p>
        </div>
      </article>
    </section>

    <section class="gallery-wall">
      <article
        v-for="photo in wallPhotos"
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
