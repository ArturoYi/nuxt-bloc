<script setup lang="ts">
definePageMeta({
  showFooter: true,
});

import { uniqueCategories } from "~~/utils/content";
import { buildNotesSeriesSummaries } from "~~/utils/notes-series";

function timestampFromContentDate(date?: string | null) {
  if (!date) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(date);
  return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY;
}

const route = useRoute();

const { data: posts } = await useAsyncData("notes-posts", () => {
  return queryCollection("content")
    .where("published", "=", true)
    .where("path", "LIKE", "/notes/%")
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

const sortedNotesPosts = computed(() => {
  const list = posts.value ?? [];
  return [...list].sort(
    (a, b) =>
      timestampFromContentDate(b.date) - timestampFromContentDate(a.date),
  );
});

const filteredNotesPosts = computed(() => {
  const list = sortedNotesPosts.value;
  const cat = selectedCategory.value;
  if (!cat) return list;
  return list.filter((p) => p.category === cat);
});

const notesSeriesList = computed(() =>
  buildNotesSeriesSummaries(filteredNotesPosts.value),
);

const runtimeConfig = useRuntimeConfig();

function absoluteContentUrl(path: string) {
  const siteUrl = runtimeConfig.public.siteUrl.replace(/\/$/, "");
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

const notesListJsonLd = computed(() => {
  const list = notesSeriesList.value;
  if (!list.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: list.length,
    itemListElement: list.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.series,
      url: absoluteContentUrl(item.href),
    })),
  };
});

const notesListJsonLdString = computed(() =>
  notesListJsonLd.value ? JSON.stringify(notesListJsonLd.value) : "",
);

useSiteSeo({
  title: "笔记列表",
  description: "查看所有笔记；可在本页按分类筛选。",
  path: "/notes",
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
      v-if="notesListJsonLdString"
      :is="'script'"
      type="application/ld+json"
      >{{ notesListJsonLdString }}</component
    >
    <nav class="notes-archive-nav" aria-label="笔记分类">
      <div class="notes-archive-nav__viewport">
        <button
          v-show="showNavScrollNudges"
          type="button"
          class="notes-archive-nav__nudge"
          :disabled="!navCanScrollLeft"
          aria-label="向左滑动查看更多分类"
          @click="nudgeCategoryScroll(-1)"
        >
          <span class="notes-archive-nav__nudge-icon" aria-hidden="true">‹</span>
        </button>
        <div
          ref="categoryScrollRef"
          class="notes-archive-nav__scroll"
          @scroll.passive="readCategoryScrollState"
        >
          <div class="notes-archive-nav__track">
            <NuxtLink
              class="notes-archive-nav__link"
              :class="{ 'notes-archive-nav__link--active': selectedCategory === null }"
              to="/notes"
            >
              全部
            </NuxtLink>
            <NuxtLink
              v-for="category in categories"
              :key="category"
              class="notes-archive-nav__link"
              :class="{
                'notes-archive-nav__link--active': selectedCategory === category,
              }"
              :to="{ path: '/notes', query: { category } }"
            >
              {{ category }}
            </NuxtLink>
          </div>
        </div>
        <button
          v-show="showNavScrollNudges"
          type="button"
          class="notes-archive-nav__nudge"
          :disabled="!navCanScrollRight"
          aria-label="向右滑动查看更多分类"
          @click="nudgeCategoryScroll(1)"
        >
          <span class="notes-archive-nav__nudge-icon" aria-hidden="true">›</span>
        </button>
      </div>
    </nav>

    <p
      v-if="selectedCategory && !notesSeriesList.length"
      class="notes-archive-empty"
    >
      「{{ selectedCategory }}」分类下暂无笔记系列。
    </p>

    <section
      v-if="notesSeriesList.length"
      class="notes-archive"
      aria-label="笔记系列列表"
    >
      <div class="notes-archive__grid">
        <NotesSeriesCard
          v-for="item in notesSeriesList"
          :key="item.series"
          :item="item"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.notes-archive-nav {
  margin-top: -0.25rem;
  margin-bottom: 1.75rem;
  background: transparent;
}

.notes-archive-nav__viewport {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  background: transparent;
}

.notes-archive-nav__scroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.notes-archive-nav__scroll::-webkit-scrollbar {
  display: none;
}

.notes-archive-nav__track {
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

.notes-archive-nav__link {
  flex: 0 0 auto;
  font-size: 2rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
  color: var(--text);
  opacity: 0.7;
  transition: opacity 0.15s ease, color 0.15s ease;
}

.notes-archive-nav__link:hover {
  opacity: 0.85;
}

.notes-archive-nav__link--active {
  color: var(--brand);
  opacity: 1;
}

.notes-archive-nav__link--active:hover {
  opacity: 1;
  color: var(--brand-strong);
}

.notes-archive-nav__nudge {
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
  .notes-archive-nav__nudge {
    display: flex;
    width: 2rem;
    min-height: 2.75rem;
  }
}

.notes-archive-nav__nudge:disabled {
  opacity: 0.32;
  cursor: default;
}

.notes-archive-nav__nudge:disabled .notes-archive-nav__nudge-icon {
  opacity: 0.65;
}

.notes-archive-empty {
  margin: 0 0 1.5rem;
  color: var(--muted);
}

.notes-archive {
  padding: 1.25rem;
}

.notes-archive__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16.5rem), 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  .notes-archive__grid {
    gap: 1.15rem;
  }
}
</style>
