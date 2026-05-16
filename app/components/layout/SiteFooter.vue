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
    <div class="site-footer__inner container">
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
  padding: 1.25rem 0 1.25rem;
  color: var(--muted);
  margin-top: 0 auto;
  border-top: 1px solid var(--border);
}

.site-footer__inner {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding-top: 1.25rem;
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
