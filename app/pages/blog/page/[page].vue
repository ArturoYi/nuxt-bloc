<script setup lang="ts">
import { BLOG_PAGE_SIZE, contentCover, paginate } from '~~/utils/content'

const route = useRoute()
const rawPage = Number(route.params.page)

const { data: posts } = await useAsyncData(`blog-page:${route.path}`, () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/blog/%')
    .order('date', 'DESC')
    .all()
})

const pageData = computed(() => paginate(posts.value ?? [], rawPage, BLOG_PAGE_SIZE))

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
  return page <= 1 ? '/blog' : `/blog/page/${page}`
}

useSiteSeo({
  title: `博客第 ${rawPage} 页`,
  description: '博客分页归档页。',
  path: route.path,
  image: contentCover(pageData.value.items[0]),
  imageAlt: `博客第 ${rawPage} 页封面图`,
})
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <section class="page-header page-header--wide">
      <p class="eyebrow">Blog Archive</p>
      <h1>博客归档</h1>
      <p>当前是第 {{ rawPage }} 页，展示更完整的文章归档列表。</p>
    </section>

    <section class="archive-list">
      <article
        v-for="post in pageData.items"
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
          <NuxtLink
            v-if="post.category"
            :to="`/blog/category/${encodeURIComponent(post.category)}`"
          >
            {{ post.category }}
          </NuxtLink>
          <span v-else>未分类</span>
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

    <PaginationNav
      :current-page="pageData.currentPage"
      :total-pages="pageData.totalPages"
      :make-link="makePageLink"
    />
  </div>
</template>
