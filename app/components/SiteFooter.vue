<script setup lang="ts">
import type { SiteFooterLink } from '~/constants/site'

// 页脚同样通过 props 暴露文案和链接，方便按站点类型做定制。
defineProps<{
  title: string
  description: string
  links: SiteFooterLink[]
}>()
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div>
        <p class="footer-title">
          {{ title }}
        </p>
        <p>{{ description }}</p>
      </div>

      <div class="footer-links">
        <template v-for="link in links" :key="link.label">
          <NuxtLink v-if="link.to" :to="link.to">
            {{ link.label }}
          </NuxtLink>
          <a v-else-if="link.href" :href="link.href">
            {{ link.label }}
          </a>
        </template>
      </div>
    </div>
  </footer>
</template>
