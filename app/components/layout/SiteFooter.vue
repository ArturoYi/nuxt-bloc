<script setup lang="ts">
import type { SiteFooterLink } from '~/constants/site'

defineProps<{
  title: string
  description: string
  links: SiteFooterLink[]
}>()
</script>

<template>
  <footer class="clay-footer">
    <div class="clay-footer__inner">
      <div>
        <p class="m-0 mb-2 font-bold text-clay-text">
          {{ title }}
        </p>
        <p class="m-0 text-sm leading-relaxed">
          {{ description }}
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <template v-for="link in links" :key="link.label">
          <NuxtLink
            v-if="link.to"
            :to="link.to"
            class="clay-nav-pill px-3 py-1.5 text-sm"
          >
            {{ link.label }}
          </NuxtLink>
          <a
            v-else-if="link.href"
            :href="link.href"
            class="clay-nav-pill px-3 py-1.5 text-sm"
          >
            {{ link.label }}
          </a>
        </template>
      </div>
    </div>
  </footer>
</template>
