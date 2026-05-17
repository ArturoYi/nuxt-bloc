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
  <div class="site-shell">
    <ArtDotsBackground />

    <div class="site-shell__foreground">
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
                {{ isDark ? "☀" : "☾" }}
              </span>
            </button>
          </nav>
        </div>
      </Transition>
      <main
        class="site-main"
        :class="{ 'site-main--editor': route.meta.editorFullscreen }"
      >
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
.site-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-shell__foreground {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-main {
  flex: 1;
}

@media (max-width: 767.98px) {
  .site-nav--mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    width: 100%;
    min-height: 100dvh;
  }

  .site-mobile-menu-overlay {
    position: fixed;
    inset: 0;
    z-index: 39;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    overscroll-behavior: contain;
    touch-action: none;
    background: color-mix(in srgb, var(--overlay-strong) 56%, transparent);
    -webkit-backdrop-filter: blur(32px) saturate(150%);
    backdrop-filter: blur(32px) saturate(150%);
  }

  .site-nav--mobile .site-nav__link,
  .theme-toggle--mobile {
    width: auto;
    min-height: auto;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: center;
    font-size: clamp(1.5rem, 4vw, 2rem);
    line-height: 1.15;
    color: var(--text);
    font-weight: 700;
  }

  .theme-toggle--mobile {
    margin-top: 0.4rem;
  }

  .theme-toggle--mobile .theme-toggle__icon {
    font-size: clamp(1.5rem, 4vw, 2rem);
  }

  [data-theme="light"] .site-mobile-menu-overlay {
    background: rgba(255, 255, 255, 0.82);
    -webkit-backdrop-filter: blur(40px) saturate(160%);
    backdrop-filter: blur(40px) saturate(160%);
  }

  [data-theme="light"] .site-nav--mobile .site-nav__link,
  [data-theme="light"] .theme-toggle--mobile {
    color: #111827;
  }

  .site-mobile-overlay-enter-active,
  .site-mobile-overlay-leave-active {
    transition: opacity 0.24s ease;
  }

  .site-mobile-overlay-enter-active .site-nav--mobile,
  .site-mobile-overlay-leave-active .site-nav--mobile {
    transition:
      opacity 0.24s ease,
      transform 0.24s ease;
  }

  .site-mobile-overlay-enter-from,
  .site-mobile-overlay-leave-to {
    opacity: 0;
  }

  .site-mobile-overlay-enter-from .site-nav--mobile,
  .site-mobile-overlay-leave-to .site-nav--mobile {
    opacity: 0;
    transform: translateY(-0.75rem);
  }
}

@media (min-width: 768px) {
  .site-mobile-menu-overlay {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-mobile-overlay-enter-active,
  .site-mobile-overlay-leave-active,
  .site-mobile-overlay-enter-active .site-nav--mobile,
  .site-mobile-overlay-leave-active .site-nav--mobile {
    transition: none;
  }
}
</style>
