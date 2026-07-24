import type { Config } from 'tailwindcss'

/** Claymorphism 设计令牌与 Tailwind 扩展；颜色与阴影以 CSS 变量为准，便于亮/暗主题切换。 */
export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        clay: {
          bg: 'var(--bg)',
          surface: 'var(--clay-surface)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          'muted-strong': 'var(--muted-strong)',
          brand: 'var(--brand)',
          'brand-strong': 'var(--brand-strong)',
          border: 'var(--border)',
        },
      },
      borderRadius: {
        clay: 'var(--clay-radius)',
        'clay-lg': 'var(--clay-radius-lg)',
        'clay-xl': 'var(--clay-radius-xl)',
        'clay-pill': '9999px',
      },
      boxShadow: {
        clay: 'var(--clay-raise)',
        'clay-hover': 'var(--clay-raise-hover)',
        'clay-pressed': 'var(--clay-pressed)',
        'clay-inset': 'var(--clay-inset)',
      },
      transitionTimingFunction: {
        clay: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'clay-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        banner: 'var(--banner-w)',
      },
      spacing: {
        'layout-pad': 'var(--layout-padding)',
        'safe-bottom': 'max(1.25rem, env(safe-area-inset-bottom))',
        'safe-right': 'max(1rem, env(safe-area-inset-right))',
      },
      minHeight: {
        touch: '2.75rem',
      },
    },
  },
  plugins: [],
} satisfies Config
