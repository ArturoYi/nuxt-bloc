<script setup lang="ts">
import { CONTENT_SECTION_NOT_FOUND } from '~/constants/content'

const route = useRoute()

const { data: page } = await useAsyncData(`page:${route.path}`, () =>
  queryCollection('content').path(route.path).first(),
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: CONTENT_SECTION_NOT_FOUND.blog,
  })
}

const { articleOutline, seriesNav } = useContentArticlePage('blog', page)
</script>

<template>
  <Layout>
    <template #sidebar>
      <BlogSeriesNav :nav="seriesNav" />
    </template>
    <template #main>
      <article v-if="page" class="markdown-body">
        <ContentProse :value="page" />
      </article>
    </template>
    <template #aside>
      <BlogArticleOutline :outline="articleOutline" />
    </template>
  </Layout>
</template>
