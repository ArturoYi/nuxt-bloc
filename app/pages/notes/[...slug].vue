<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(`page:${route.path}`, () => {
  return queryCollection("content").path(route.path).first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "笔记不存在",
  });
}

const articleOutline = useBlogArticleOutline(page);
const { seriesNav } = useNotesArticleSeries(page);

useSiteSeo({
  title: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
  path: route.path,
  type: "article",
});
</script>

<template>
  <Layout>
    <template #sidebar>
      <BlogSeriesNav :nav="seriesNav" />
    </template>
    <template #main>
      <article v-if="page" class="markdown-body">
        <ContentRenderer :value="page" prose />
      </article>
    </template>
    <template #aside>
      <BlogArticleOutline :outline="articleOutline" />
    </template>
  </Layout>
</template>
