<script setup lang="ts">
definePageMeta({
  showFooter: true,
});

import { buildNotesSeriesSummaries } from "~~/utils/notes-series";

const { categories, selectedCategory, filteredPosts } = await useContentArchivePage({
  asyncDataKey: "notes-posts",
  pathLike: "/notes/%",
});

const notesSeriesList = computed(() =>
  buildNotesSeriesSummaries(filteredPosts.value),
);

useArchiveItemListJsonLd("notes-list-jsonld", () =>
  notesSeriesList.value.map((item) => ({
    name: item.series,
    path: item.href,
  })),
);

useSiteSeo({
  title: "笔记列表",
  description: "查看所有笔记；可在本页按分类筛选。",
  path: "/notes",
});
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <ArchiveCategoryNav
      :categories="categories"
      :selected-category="selectedCategory"
      archive-path="/notes"
      aria-label="笔记分类"
    />

    <p
      v-if="selectedCategory && !notesSeriesList.length"
      class="archive-empty"
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
