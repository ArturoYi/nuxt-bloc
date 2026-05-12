<script setup lang="ts">
import { uniqueCategories } from '~~/utils/content'

const { data: notes } = await useAsyncData('notes-archive', () => {
  return queryCollection('content')
    .where('published', '=', true)
    .where('path', 'LIKE', '/blog/%')
    .order('date', 'DESC')
    .all()
})

const categories = computed<string[]>(() =>
  uniqueCategories(notes.value ?? []).filter(
    (category): category is string => Boolean(category),
  ),
)

useSiteSeo({
  title: '笔记归档',
  description: '按时间整理 Nuxt Bloc 的文章与学习笔记，方便快速回看。',
  path: '/notes',
})
</script>

<template>
  <div class="container page-stack page-stack--xl">
    <section class="page-header page-header--wide">
      <p class="eyebrow">Notes</p>
      <h1>笔记归档</h1>
      <p>
        这里保留更偏归档视角的阅读方式，适合快速浏览历史内容、按分类回看主题，或者继续从旧笔记展开新文章。
      </p>

      <div class="filter-row">
        <NuxtLink class="filter-chip filter-chip--active" to="/notes">
          全部笔记
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

    <section class="archive-list">
      <article
        v-for="note in notes ?? []"
        :key="note.path"
        class="archive-card"
      >
        <div class="archive-card__meta">
          <span>{{ note.date || '未填写日期' }}</span>
          <NuxtLink
            v-if="note.category"
            :to="`/blog/category/${encodeURIComponent(note.category)}`"
          >
            {{ note.category }}
          </NuxtLink>
          <span v-else>未分类</span>
        </div>

        <div class="archive-card__body">
          <h3>
            <NuxtLink :to="note.path">{{ note.title }}</NuxtLink>
          </h3>
          <p>{{ note.description }}</p>
          <div class="tag-row">
            <span v-for="tag in note.tags || []" :key="tag" class="tag-chip">
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
