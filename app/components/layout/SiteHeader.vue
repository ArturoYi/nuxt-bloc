<script setup lang="ts">
import type { SiteNavigationItem } from '~/constants/site'

const props = defineProps<{
  navigationItems: SiteNavigationItem[]
  isDark: boolean
  themeToggleLabel: string
  isMobileMenuOpen: boolean
}>()

const emit = defineEmits<{
  toggleTheme: [event: MouseEvent]
  toggleMobileMenu: []
}>()
</script>

<template>
  <header class="clay-header sticky top-0 z-40 w-full">
    <div class="container flex min-h-[4.5rem] items-center justify-between gap-4 px-4 sm:min-h-20 sm:px-8">
      <NuxtLink
        to="/"
        class="inline-flex min-w-0 items-center text-clay-text transition-colors duration-200 hover:text-clay-brand-strong focus-visible:rounded-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-clay-brand"
      >
        <span class="text-lg font-extrabold tracking-wide sm:text-xl">Arlen</span>
      </NuxtLink>

      <div class="ml-auto hidden items-center gap-3 md:flex">
        <nav class="flex items-center gap-2" aria-label="主导航">
          <NuxtLink
            v-for="item in props.navigationItems"
            :key="item.to"
            :to="item.to"
            class="clay-nav-pill"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <button
          type="button"
          class="clay-btn clay-btn--icon"
          :aria-label="props.themeToggleLabel"
          @click="emit('toggleTheme', $event)"
        >
          <span class="text-xl leading-none" aria-hidden="true">
            {{ props.isDark ? '☀' : '☾' }}
          </span>
        </button>
      </div>

      <button
        type="button"
        class="clay-btn clay-btn--icon md:hidden"
        aria-controls="site-header-mobile-menu"
        :aria-expanded="props.isMobileMenuOpen"
        :aria-label="props.isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
        @click="emit('toggleMobileMenu')"
      >
        <svg
          v-if="!props.isMobileMenuOpen"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
        <svg
          v-else
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </svg>
      </button>
    </div>
  </header>
</template>
