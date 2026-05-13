<script setup lang="ts">
import {
  SITE_BRAND_NAME,
  SITE_FOOTER_DESCRIPTION,
  SITE_TAGLINE,
  siteFooterLinks,
  siteNavigationItems,
} from '~/constants/site'

const route = useRoute()
const { isDark, themeToggleLabel, toggleTheme } = useSiteTheme()

const isMobileMenuOpen = ref(false)
let cleanupMediaQueryListener: (() => void) | null = null

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape')
    closeMobileMenu()
}

watch(() => route.fullPath, closeMobileMenu)

onMounted(() => {
  const mediaQuery = window.matchMedia('(min-width: 768px)')
  const handleMediaChange = (event: MediaQueryList | MediaQueryListEvent) => {
    if (event.matches)
      closeMobileMenu()
  }

  handleMediaChange(mediaQuery)

  const listener = (event: MediaQueryListEvent) => handleMediaChange(event)

  mediaQuery.addEventListener('change', listener)
  cleanupMediaQueryListener = () => mediaQuery.removeEventListener('change', listener)

  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  cleanupMediaQueryListener?.()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="site-shell">
    <ArtDotsBackground />

    <div class="site-shell__foreground">
      <SiteHeader
        :brand-name="SITE_BRAND_NAME"
        :tagline="SITE_TAGLINE"
        :navigation-items="siteNavigationItems"
        :is-dark="isDark"
        :theme-toggle-label="themeToggleLabel"
        :is-mobile-menu-open="isMobileMenuOpen"
        @toggle-theme="toggleTheme"
        @toggle-mobile-menu="toggleMobileMenu"
      />

      <Transition name="site-mobile-overlay">
        <div
          v-if="isMobileMenuOpen"
          id="site-header-mobile-menu"
          class="site-mobile-menu-overlay"
          @click.self="closeMobileMenu"
        >
          <nav class="site-nav site-nav--mobile" aria-label="移动端主导航">
            <NuxtLink
              v-for="item in siteNavigationItems"
              :key="item.to"
              :to="item.to"
              class="site-nav__link"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </NuxtLink>

            <button
              type="button"
              class="theme-toggle theme-toggle--mobile"
              :aria-label="themeToggleLabel"
              @click="toggleTheme($event)"
            >
              <span class="theme-toggle__icon" aria-hidden="true">
                {{ isDark ? '☀' : '☾' }}
              </span>
            </button>
          </nav>
        </div>
      </Transition>

      <SiteMain>
        <slot />
      </SiteMain>

      <SiteFooter
        :title="SITE_BRAND_NAME"
        :description="SITE_FOOTER_DESCRIPTION"
        :links="siteFooterLinks"
      />
    </div>
  </div>
</template>
