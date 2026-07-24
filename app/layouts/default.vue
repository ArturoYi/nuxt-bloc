<script setup lang="ts">
import {
  SITE_BRAND_NAME,
  SITE_FOOTER_DESCRIPTION,
  siteFooterLinks,
  siteNavigationItems,
} from "~/constants/site";

const route = useRoute();
const showFooter = computed(() => route.meta.showFooter === true);
const { isDark, themeToggleLabel, toggleTheme } = useSiteTheme();
const isMobileMenuOpen = ref(false);
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
watch(() => route.fullPath, closeMobileMenu);

const { md } = useBreakpoints();

watch(md, (matches) => {
  if (matches) closeMobileMenu();
});

onKeyStroke("Escape", closeMobileMenu);
</script>

<template>
  <div class="site-shell site-shell--clay flex min-h-dvh flex-col">
    <div class="site-shell__foreground relative flex min-h-dvh flex-1 flex-col">
      <LayoutSiteHeader
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
          class="clay-mobile-overlay md:!hidden"
          @click.self="closeMobileMenu"
        >
          <nav class="clay-mobile-nav" aria-label="移动端主导航">
            <NuxtLink
              v-for="item in siteNavigationItems"
              :key="item.to"
              :to="item.to"
              class="clay-mobile-nav__link"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </NuxtLink>

            <button
              type="button"
              class="clay-mobile-nav__link clay-btn--brand"
              :aria-label="themeToggleLabel"
              @click="toggleTheme($event)"
            >
              <span aria-hidden="true">{{ isDark ? "☀" : "☾" }}</span>
            </button>
          </nav>
        </div>
      </Transition>
      <main class="site-main flex-1">
        <slot />
      </main>

      <LayoutSiteFooter
        v-if="showFooter"
        :title="SITE_BRAND_NAME"
        :description="SITE_FOOTER_DESCRIPTION"
        :links="siteFooterLinks"
      />
    </div>
  </div>
</template>

<style>
.site-mobile-overlay-enter-active,
.site-mobile-overlay-leave-active {
  transition: opacity 0.24s ease;
}

.site-mobile-overlay-enter-active .clay-mobile-nav,
.site-mobile-overlay-leave-active .clay-mobile-nav {
  transition:
    opacity 0.24s ease,
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.site-mobile-overlay-enter-from,
.site-mobile-overlay-leave-to {
  opacity: 0;
}

.site-mobile-overlay-enter-from .clay-mobile-nav,
.site-mobile-overlay-leave-to .clay-mobile-nav {
  opacity: 0;
  transform: translateY(-0.75rem) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .site-mobile-overlay-enter-active,
  .site-mobile-overlay-leave-active,
  .site-mobile-overlay-enter-active .clay-mobile-nav,
  .site-mobile-overlay-leave-active .clay-mobile-nav {
    transition: none;
  }
}
</style>
