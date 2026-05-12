<script setup lang="ts">
import { SITE_BRAND_NAME, SITE_HOME_INTRO } from '~/constants/site'

useSiteSeo({
  title: SITE_BRAND_NAME,
  description: SITE_HOME_INTRO,
  path: '/',
})
</script>

<template>
  <div class="container page-stack">
    <section class="intro-hero">
      <p class="eyebrow">About</p>
      <h1>{{ SITE_BRAND_NAME }}</h1>
      <p class="intro-hero__lead">
        {{ SITE_HOME_INTRO }}
      </p>
    </section>
  </div>
</template>
