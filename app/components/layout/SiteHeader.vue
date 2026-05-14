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
    <div class="site-header__inner">
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

<style>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: color-mix(in srgb, var(--header-bg) 82%, transparent);
  -webkit-backdrop-filter: blur(8px) saturate(175%) brightness(1.02);
  backdrop-filter: blur(12px) saturate(175%) brightness(1.02);
  border-bottom: 1px solid var(--header-border);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 8%, transparent);
}

@media (prefers-reduced-transparency: reduce) {
  .site-header {
    background: var(--header-bg);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
  }
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 5rem;
  gap: 1rem;
  width: 100%;
  padding: 0 2rem;
}

.site-brand {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  color: var(--text);
  text-decoration: none;
  transition: color 0.22s ease;
}

.site-brand:hover {
  color: var(--brand-strong);
}

.site-brand:focus-visible {
  outline: 2px solid var(--brand-strong);
  outline-offset: 3px;
  border-radius: 0.2em;
}

.site-brand__name {
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.site-header__desktop-actions,
.site-nav {
  display: flex;
  align-items: center;
}

.site-header__desktop-actions {
  gap: 0.85rem;
  margin-left: auto;
}

.site-nav {
  gap: 0.55rem;
}

.site-nav__link,
.theme-toggle,
.menu-toggle {
  transition:
    color 0.22s ease,
    transform 0.22s ease,
    opacity 0.22s ease;
}

.site-nav__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.62rem 1rem;
  border-radius: 999px;
  color: var(--muted-strong);
  font-weight: 600;
}

.site-nav__link:hover,
.site-nav__link.router-link-active {
  color: var(--brand-strong);
}

.theme-toggle,
.menu-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 2.75rem;
  color: var(--muted-strong);
  cursor: pointer;
  border: 0;
  background: transparent;
}

.theme-toggle {
  width: 2.75rem;
  padding: 0;
}

.theme-toggle:hover,
.menu-toggle:hover {
  color: var(--brand-strong);
  transform: translateY(-1px);
}

.theme-toggle__icon {
  font-size: 1.2rem;
  line-height: 1;
}

.menu-toggle {
  display: none;
  width: 2.75rem;
  padding: 0;
  flex-shrink: 0;
}

.menu-toggle__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.site-nav__link:focus-visible,
.theme-toggle:focus-visible,
.menu-toggle:focus-visible {
  outline: none;
  color: var(--brand-strong);
}

@media (max-width: 767.98px) {
  .site-header__inner {
    min-height: 4.5rem;
  }

  .site-header__desktop-actions {
    display: none;
  }

  .menu-toggle {
    display: inline-flex;
  }
}

@media (min-width: 768px) {
  .menu-toggle {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-brand,
  .site-nav__link,
  .theme-toggle,
  .menu-toggle {
    transition: none;
  }
}
</style>
