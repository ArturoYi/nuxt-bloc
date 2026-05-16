<script setup lang="ts">
definePageMeta({
  showFooter: true,
});

import { uniqueCategories } from "~~/utils/content";

function timestampFromContentDate(date?: string | null) {
  if (!date) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(date);
  return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY;
}

function yearFromContentDate(date?: string | null) {
  if (!date) return null;
  const t = Date.parse(date);
  if (!Number.isFinite(t)) return null;
  const y = new Date(t).getFullYear();
  return Number.isFinite(y) ? y : null;
}

const route = useRoute();

const { data: posts } = await useAsyncData("blog-posts", () => {
  return queryCollection("content")
    .where("published", "=", true)
    .where("path", "LIKE", "/blog/%")
    .order("date", "DESC")
    .all();
});

const categories = computed(() =>
  uniqueCategories(posts.value ?? []).filter((c): c is string => Boolean(c)),
);

const selectedCategory = computed(() => {
  const raw = route.query.category;
  if (typeof raw !== "string" || !raw.trim()) return null;
  const decoded = decodeURIComponent(raw);
  return categories.value.includes(decoded) ? decoded : null;
});

const sortedBlogPosts = computed(() => {
  const list = posts.value ?? [];
  return [...list].sort(
    (a, b) =>
      timestampFromContentDate(b.date) - timestampFromContentDate(a.date),
  );
});

const filteredBlogPosts = computed(() => {
  const list = sortedBlogPosts.value;
  const cat = selectedCategory.value;
  if (!cat) return list;
  return list.filter((p) => p.category === cat);
});

const postsByYear = computed(() => {
  type Post = (typeof sortedBlogPosts.value)[number];
  const groups: { label: string; posts: Post[]; yearWatermark: boolean }[] = [];
  for (const post of filteredBlogPosts.value) {
    const y = yearFromContentDate(post.date);
    const label = y === null ? "日期未定" : String(y);
    const yearWatermark = /^\d{4}$/.test(label);
    const last = groups[groups.length - 1];
    if (!last || last.label !== label)
      groups.push({ label, posts: [post], yearWatermark });
    else last.posts.push(post);
  }
  return groups;
});

const runtimeConfig = useRuntimeConfig();

function absoluteContentUrl(path: string) {
  const siteUrl = runtimeConfig.public.siteUrl.replace(/\/$/, "");
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

const blogListJsonLd = computed(() => {
  const list = filteredBlogPosts.value;
  if (!list.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: list.length,
    itemListElement: list.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: post.title,
      url: absoluteContentUrl(post.path),
    })),
  };
});

const blogListJsonLdString = computed(() =>
  blogListJsonLd.value ? JSON.stringify(blogListJsonLd.value) : "",
);

useSiteSeo({
  title: "博客列表",
  description: "查看 Nuxt Bloc 当前所有示例文章；可在本页按分类筛选，无需进入单独归档页。",
  path: "/blog",
});

const categoryScrollRef = ref<HTMLDivElement | null>(null);
const isMobileNav = ref(false);
const navScrollOverflow = ref({ overflow: false, left: false, right: false });

function readCategoryScrollState() {
  const el = categoryScrollRef.value;
  if (!el || typeof window === "undefined") return;
  isMobileNav.value = window.matchMedia("(max-width: 639px)").matches;
  const maxScroll = el.scrollWidth - el.clientWidth;
  const overflow = maxScroll > 6;
  const sl = el.scrollLeft;
  navScrollOverflow.value = {
    overflow,
    left: overflow && sl > 6,
    right: overflow && sl < maxScroll - 6,
  };
}

function nudgeCategoryScroll(direction: -1 | 1) {
  const el = categoryScrollRef.value;
  if (!el) return;
  const delta = Math.round(Math.min(el.clientWidth * 0.65, 240));
  el.scrollBy({ left: direction * delta, behavior: "smooth" });
}

let categoryScrollResizeObserver: ResizeObserver | null = null;

onMounted(async () => {
  await nextTick();
  readCategoryScrollState();
  const el = categoryScrollRef.value;
  if (el && typeof ResizeObserver !== "undefined") {
    categoryScrollResizeObserver = new ResizeObserver(readCategoryScrollState);
    categoryScrollResizeObserver.observe(el as unknown as Element);
  }
  window.addEventListener("resize", readCategoryScrollState);
});

onBeforeUnmount(() => {
  categoryScrollResizeObserver?.disconnect();
  categoryScrollResizeObserver = null;
  window.removeEventListener("resize", readCategoryScrollState);
});

watch(categories, async () => {
  await nextTick();
  readCategoryScrollState();
});

const showNavScrollNudges = computed(
  () => isMobileNav.value && navScrollOverflow.value.overflow,
);
const navCanScrollLeft = computed(() => navScrollOverflow.value.left);
const navCanScrollRight = computed(() => navScrollOverflow.value.right);
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <component
      v-if="blogListJsonLdString"
      :is="'script'"
      type="application/ld+json"
      >{{ blogListJsonLdString }}</component
    >
    <nav class="blog-archive-nav" aria-label="博客分类">
      <div class="blog-archive-nav__viewport">
        <button
          v-show="showNavScrollNudges"
          type="button"
          class="blog-archive-nav__nudge"
          :disabled="!navCanScrollLeft"
          aria-label="向左滑动查看更多分类"
          @click="nudgeCategoryScroll(-1)"
        >
          <span class="blog-archive-nav__nudge-icon" aria-hidden="true">‹</span>
        </button>
        <div
          ref="categoryScrollRef"
          class="blog-archive-nav__scroll"
          @scroll.passive="readCategoryScrollState"
        >
          <div class="blog-archive-nav__track">
            <NuxtLink
              class="blog-archive-nav__link"
              :class="{ 'blog-archive-nav__link--active': selectedCategory === null }"
              to="/blog"
            >
              全部
            </NuxtLink>
            <NuxtLink
              v-for="category in categories"
              :key="category"
              class="blog-archive-nav__link"
              :class="{
                'blog-archive-nav__link--active': selectedCategory === category,
              }"
              :to="{ path: '/blog', query: { category } }"
            >
              {{ category }}
            </NuxtLink>
          </div>
        </div>
        <button
          v-show="showNavScrollNudges"
          type="button"
          class="blog-archive-nav__nudge"
          :disabled="!navCanScrollRight"
          aria-label="向右滑动查看更多分类"
          @click="nudgeCategoryScroll(1)"
        >
          <span class="blog-archive-nav__nudge-icon" aria-hidden="true">›</span>
        </button>
      </div>
    </nav>

    <p
      v-if="selectedCategory && !postsByYear.length"
      class="blog-archive-empty"
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
.blog-archive-nav {
  margin-top: -0.25rem;
  margin-bottom: 1.75rem;
  background: transparent;
}

.blog-archive-nav__viewport {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  background: transparent;
}

.blog-archive-nav__scroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.blog-archive-nav__scroll::-webkit-scrollbar {
  display: none;
}

.blog-archive-nav__track {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  justify-content: center;
  gap: clamp(1rem, 3vw, 1.75rem);
  width: max-content;
  min-width: 100%;
  margin-inline: auto;
  padding-block: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.blog-archive-nav__link {
  flex: 0 0 auto;
  font-size: 2rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
  color: var(--text);
  opacity: 0.7;
  transition: opacity 0.15s ease, color 0.15s ease;
}

.blog-archive-nav__link:hover {
  opacity: 0.85;
}

.blog-archive-nav__link--active {
  color: var(--brand);
  opacity: 1;
}

.blog-archive-nav__link--active:hover {
  opacity: 1;
  color: var(--brand-strong);
}

.blog-archive-nav__nudge {
  display: none;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--brand);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

@media (max-width: 639px) {
  .blog-archive-nav__nudge {
    display: flex;
    width: 2rem;
    min-height: 2.75rem;
  }
}

.blog-archive-nav__nudge:disabled {
  opacity: 0.32;
  cursor: default;
}

.blog-archive-nav__nudge:disabled .blog-archive-nav__nudge-icon {
  opacity: 0.65;
}

.blog-archive-empty {
  margin: 0 0 1.5rem;
  color: var(--muted);
}

.blog-timeline {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
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
