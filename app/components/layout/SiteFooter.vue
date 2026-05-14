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

<style>
.site-footer {
  padding: 2rem 0 3rem;
  color: var(--muted);
}

.site-footer__inner {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border);
}

.footer-title {
  margin: 0 0 0.4rem;
  color: var(--text);
  font-weight: 700;
}

.footer-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .site-footer__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
