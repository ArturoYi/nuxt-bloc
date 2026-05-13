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
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink to="/" class="site-brand">
        <span class="site-brand__name">Arlen</span>
      </NuxtLink>

      <div class="site-header__desktop-actions">
        <nav class="site-nav site-nav--desktop" aria-label="主导航">
          <NuxtLink
            v-for="item in props.navigationItems"
            :key="item.to"
            :to="item.to"
            class="site-nav__link"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <button
          type="button"
          class="theme-toggle theme-toggle--desktop"
          :aria-label="props.themeToggleLabel"
          @click="emit('toggleTheme', $event)"
        >
          <span class="theme-toggle__icon" aria-hidden="true">
            {{ props.isDark ? '☀' : '☾' }}
          </span>
        </button>
      </div>

      <button
        type="button"
        class="menu-toggle"
        aria-controls="site-header-mobile-menu"
        :aria-expanded="props.isMobileMenuOpen"
        :aria-label="props.isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
        @click="emit('toggleMobileMenu')"
      >
        <svg
          v-if="!props.isMobileMenuOpen"
          class="menu-toggle__icon"
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
          class="menu-toggle__icon"
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
