<script setup lang="ts">
// 分页组件只负责页码计算和链接输出，具体跳转规则交给上层传入。
const props = defineProps<{
  currentPage: number
  totalPages: number
  makeLink: (page: number) => string
}>()

const pages = computed(() => {
  return Array.from({ length: props.totalPages }, (_, index) => index + 1)
})
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="pagination-nav"
    aria-label="分页导航"
  >
    <NuxtLink
      class="pagination-nav__item"
      :class="{ 'pagination-nav__item--disabled': currentPage <= 1 }"
      :to="currentPage > 1 ? makeLink(currentPage - 1) : makeLink(1)"
    >
      上一页
    </NuxtLink>

    <div class="pagination-nav__pages">
      <NuxtLink
        v-for="page in pages"
        :key="page"
        class="pagination-nav__item"
        :class="{ 'pagination-nav__item--active': page === currentPage }"
        :to="makeLink(page)"
      >
        {{ page }}
      </NuxtLink>
    </div>

    <NuxtLink
      class="pagination-nav__item"
      :class="{ 'pagination-nav__item--disabled': currentPage >= totalPages }"
      :to="currentPage < totalPages ? makeLink(currentPage + 1) : makeLink(totalPages)"
    >
      下一页
    </NuxtLink>
  </nav>
</template>
