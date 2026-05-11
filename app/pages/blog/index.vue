<script setup lang="ts">
import { BLOG_PAGE_SIZE, contentCover, paginate, uniqueCategories } from '~~/utils/content'

const { data: posts } = await useAsyncData('blog-posts', () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/blog/%')
    .order('date', 'DESC')
    .all()
})

const categories = computed(() => uniqueCategories(posts.value ?? []))

const pageData = computed(() => paginate(posts.value ?? [], 1, BLOG_PAGE_SIZE))
const featuredPost = computed(() => pageData.value.items[0] ?? null)
const archivePosts = computed(() => pageData.value.items.slice(1))

function makePageLink(page: number) {
  return page <= 1 ? '/blog' : `/blog/page/${page}`
}

useSiteSeo({
  title: '博客列表',
  description: '查看 Nuxt Bloc 当前所有示例文章。',
  path: '/blog',
  image: contentCover(featuredPost.value),
  imageAlt: featuredPost.value?.title || '博客列表封面图',
})
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <section class="page-header page-header--wide">
      <p class="eyebrow">Blog</p>
      <h1>博客文章</h1>
      <p>
        更偏正式博客模板的列表页：顶部说明、分类筛选、精选文章和归档列表都在这里统一呈现。
      </p>

      <div class="filter-row">
        <NuxtLink
          class="filter-chip filter-chip--active"
          to="/blog"
        >
          全部
        </NuxtLink>
        <NuxtLink
          v-for="category in categories"
          :key="category"
          class="filter-chip"
          :to="`/blog/category/${encodeURIComponent(category)}`"
        >
          {{ category }}
        </NuxtLink>
      </div>
    </section>

    <section v-if="featuredPost" class="highlight-article">
      <div v-if="contentCover(featuredPost)" class="highlight-article__cover">
        <MediaAsset
          :src="contentCover(featuredPost)!"
          :alt="featuredPost.title"
          :preview-label="`预览 ${featuredPost.title} 封面图`"
          :lazy="false"
        />
      </div>
      <div class="highlight-article__meta">
        <span>{{ featuredPost.date || '未填写日期' }}</span>
        <NuxtLink
          v-if="featuredPost.category"
          :to="`/blog/category/${encodeURIComponent(featuredPost.category)}`"
        >
          {{ featuredPost.category }}
        </NuxtLink>
        <span v-else>未分类</span>
      </div>
      <h2>
        <NuxtLink :to="featuredPost.path">{{ featuredPost.title }}</NuxtLink>
      </h2>
      <p>{{ featuredPost.description }}</p>
      <div class="tag-row">
        <span v-for="tag in featuredPost.tags || []" :key="tag" class="tag-chip">
          {{ tag }}
        </span>
      </div>
    </section>

    <section class="archive-list">
      <article
        v-for="post in archivePosts"
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
