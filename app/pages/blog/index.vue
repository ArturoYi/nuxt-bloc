<script setup lang="ts">
definePageMeta({
  showFooter: true,
});

import { groupPostsByContentYear } from "~~/utils/content-archive";

const { categories, selectedCategory, filteredPosts } = await useContentArchivePage({
  asyncDataKey: "blog-posts",
  pathLike: "/blog/%",
});

const postsByYear = computed(() => groupPostsByContentYear(filteredPosts.value));

useArchiveItemListJsonLd("blog-list-jsonld", () =>
  filteredPosts.value.map((post) => ({
    name: post.title,
    path: post.path,
  })),
);

useSiteSeo({
  title: "博客列表",
  description: "查看 Nuxt Bloc 当前所有示例文章；可在本页按分类筛选，无需进入单独归档页。",
  path: "/blog",
});
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <ArchiveCategoryNav
      :categories="categories"
      :selected-category="selectedCategory"
      archive-path="/blog"
      aria-label="博客分类"
    />

    <p
      v-if="selectedCategory && !postsByYear.length"
      class="archive-empty"
    >
      「{{ selectedCategory }}」分类下暂无文章。
    </p>

    <section
      v-if="postsByYear.length"
      class="blog-timeline"
      aria-label="按年份归档的文章"
    >
      <div
        v-for="group in postsByYear"
        :key="group.label"
        class="blog-timeline__group"
        :class="{ 'blog-timeline__group--watermark': group.yearWatermark }"
      >
        <h2
          class="blog-timeline__year"
          :class="{ 'blog-timeline__year--watermark': group.yearWatermark }"
        >
          {{ group.label }}
        </h2>
        <div class="archive-list blog-timeline__list">
          <BlogArchivePostCard
            v-for="post in group.posts"
            :key="post.path"
            :post="post"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-timeline {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  padding: 0 1.25rem;
}

/* 时间段分组：无衬底，年份绝对叠在底层作装饰。 */
.blog-timeline__group {
  position: relative;
  padding: 0.35rem 0 1.25rem;
  overflow: visible;
}

/* 有年份水印时保证纵向空间，避免文章少时大号年份被裁切或显得挤。 */
.blog-timeline__group--watermark {
  min-height: clamp(10rem, 36vw, 15rem);
  padding-top: 0.5rem;
}

/* 年份装饰层：不参与布局，叠在底层、文章列表之下 */
.blog-timeline__year {
  position: absolute;
  z-index: 0;
  margin: 0;
  pointer-events: none;
  user-select: none;
  left: 0.35rem;
  top: 0.2rem;
  font-size: clamp(1.35rem, 4vw, 1.85rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--muted-strong);
  opacity: 0.4;
  -webkit-text-stroke: 0 transparent;
}

.blog-timeline__year--watermark {
  left: -0.35rem;
  top: -0.85rem;
  font-size: clamp(4.25rem, 22vw, 10.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 2px rgba(var(--art-dots-rgb), 0.78);
  opacity: 0.28;
  paint-order: stroke fill;
}

[data-theme="light"] .blog-timeline__year--watermark {
  -webkit-text-stroke: 2px rgba(var(--art-dots-rgb), 0.62);
  opacity: 0.32;
}

.blog-timeline__list {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding-top: 5rem;
  gap: clamp(1.35rem, 2.8vw, 2.25rem);
}
</style>
