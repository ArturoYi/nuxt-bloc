<script setup lang="ts">
const props = defineProps<{
  categories: readonly string[]
  selectedCategory: string | null
  archivePath: '/blog' | '/notes'
  ariaLabel: string
}>()

const {
  categoryScrollRef,
  showNavScrollNudges,
  navCanScrollLeft,
  navCanScrollRight,
  readCategoryScrollState,
  nudgeCategoryScroll,
} = useArchiveCategoryNavScroll(() => props.categories)
</script>

<template>
  <nav class="archive-category-nav" :aria-label="ariaLabel">
    <div class="archive-category-nav__viewport">
      <button
        v-show="showNavScrollNudges"
        type="button"
        class="clay-btn clay-btn--icon hidden min-w-8 sm:flex"
        :disabled="!navCanScrollLeft"
        aria-label="向左滑动查看更多分类"
        @click="nudgeCategoryScroll(-1)"
      >
        <span class="text-xl leading-none" aria-hidden="true">‹</span>
      </button>
      <div
        ref="categoryScrollRef"
        class="archive-category-nav__scroll"
        @scroll.passive="readCategoryScrollState"
      >
        <div class="clay-inset flex w-max min-w-full flex-nowrap items-center justify-center gap-3 rounded-clay-xl px-3 py-2 sm:gap-5 sm:px-4">
          <NuxtLink
            class="clay-nav-pill text-lg sm:text-2xl"
            :class="{ 'clay-nav-pill--active': selectedCategory === null }"
            :to="archivePath"
          >
            全部
          </NuxtLink>
          <NuxtLink
            v-for="category in categories"
            :key="category"
            class="clay-nav-pill text-lg sm:text-2xl"
            :class="{ 'clay-nav-pill--active': selectedCategory === category }"
            :to="{ path: archivePath, query: { category } }"
          >
            {{ category }}
          </NuxtLink>
        </div>
      </div>
      <button
        v-show="showNavScrollNudges"
        type="button"
        class="clay-btn clay-btn--icon hidden min-w-8 sm:flex"
        :disabled="!navCanScrollRight"
        aria-label="向右滑动查看更多分类"
        @click="nudgeCategoryScroll(1)"
      >
        <span class="text-xl leading-none" aria-hidden="true">›</span>
      </button>
    </div>
  </nav>
</template>
