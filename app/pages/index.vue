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
  <div class="page-stack page-stack--center container">
    <section class="intro-hero">
      <p class="eyebrow">欢迎回来</p>
      <h1 class="m-0 text-3xl font-extrabold tracking-tight text-clay-text sm:text-4xl">
        {{ SITE_BRAND_NAME }}
      </h1>
      <p class="intro-hero__lead">
        {{ SITE_HOME_INTRO }}
      </p>
    </section>
  </div>
</template>
