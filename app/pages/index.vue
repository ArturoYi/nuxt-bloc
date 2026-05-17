<script setup lang="ts">
definePageMeta({
  showFooter: true,
});

import { SITE_BRAND_NAME, SITE_HOME_INTRO } from "~/constants/site";

useSiteSeo({
  title: SITE_BRAND_NAME,
  description: SITE_HOME_INTRO,
  path: "/",
});
</script>

<template>
  <div class="page-stack container">
    <section class="intro-hero">
      <p class="eyebrow">欢迎回来</p>
      <h1>{{ SITE_BRAND_NAME }}</h1>
      <p class="intro-hero__lead">
        {{ SITE_HOME_INTRO }}
      </p>
    </section>
  </div>
</template>

<style scoped>
.page-stack {
  margin: 0 auto;
  padding: 5rem 4rem;
  width: min(var(--banner-w), calc(100% - 1rem));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.intro-hero__lead {
  white-space: pre-line;
}
</style>
