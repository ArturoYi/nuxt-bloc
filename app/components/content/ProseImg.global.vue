<script setup lang="ts">
import { withLeadingSlash, withTrailingSlash, joinURL } from 'ufo'
import {
  preloadLightboxImage,
  useMarkdownLightbox,
} from '~/composables/useMarkdownLightbox'

interface Props {
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
})

type LoadStatus = 'loading' | 'loaded' | 'error'

const inImageParagraph = inject(
  'inImageParagraph',
  computed(() => false),
)
const lightbox = useMarkdownLightbox()
const imageIndex = ref<number | null>(null)
const loadStatus = ref<LoadStatus>('loading')
const imgRetryKey = ref(0)
const imgRef = ref<HTMLImageElement | null>(null)

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (base !== '/' && !props.src.startsWith(base)) {
      return joinURL(base, props.src)
    }
  }

  return props.src
})

const wrapperTag = computed(() => (toValue(inImageParagraph) ? 'figure' : 'span'))

const aspectRatio = computed(() => {
  const width = Number(props.width)
  const height = Number(props.height)

  if (width > 0 && height > 0) {
    return `${width} / ${height}`
  }

  return undefined
})

const triggerStyle = computed(() => {
  const style: Record<string, string> = {}

  if (aspectRatio.value) {
    style.aspectRatio = aspectRatio.value
  }

  return style
})

const isPreviewReady = computed(() => loadStatus.value === 'loaded')

watch(
  refinedSrc,
  (src) => {
    if (src) {
      preloadLightboxImage(src)
    }
  },
  { immediate: true },
)

watch(
  [refinedSrc, imgRetryKey],
  ([src]) => {
    if (!src) {
      loadStatus.value = 'error'
      return
    }

    loadStatus.value = 'loading'
    nextTick(syncImageLoadState)
  },
  { immediate: true },
)

function syncImageLoadState() {
  const img = imgRef.value
  if (!img || !refinedSrc.value) {
    return
  }

  if (img.complete) {
    loadStatus.value = img.naturalWidth > 0 ? 'loaded' : 'error'
  }
}

function onImageLoad() {
  loadStatus.value = 'loaded'
}

function onImageError() {
  loadStatus.value = 'error'
}

function retryLoad() {
  if (!refinedSrc.value) {
    return
  }

  loadStatus.value = 'loading'
  imgRetryKey.value += 1
}

onMounted(() => {
  if (!lightbox || !refinedSrc.value) {
    return
  }

  imageIndex.value = lightbox.register({
    src: refinedSrc.value,
    title: props.alt || undefined,
  })

  syncImageLoadState()
})

function openPreview() {
  if (!isPreviewReady.value || !lightbox || imageIndex.value === null) {
    return
  }

  lightbox.open(imageIndex.value)
}
</script>

<template>
  <component
    :is="wrapperTag"
    class="prose-img"
    :class="{ 'prose-img--block': inImageParagraph }"
  >
    <component
      :is="isPreviewReady ? 'button' : 'div'"
      :type="isPreviewReady ? 'button' : undefined"
      class="prose-img__trigger"
      :class="{
        'prose-img__trigger--block': inImageParagraph,
        'prose-img__trigger--loading': loadStatus === 'loading',
        'prose-img__trigger--loaded': loadStatus === 'loaded',
        'prose-img__trigger--error': loadStatus === 'error',
      }"
      :style="triggerStyle"
      :aria-label="isPreviewReady ? (alt ? `预览图片：${alt}` : '预览图片') : undefined"
      :aria-busy="loadStatus === 'loading' || undefined"
      @click="isPreviewReady ? openPreview() : undefined"
    >
      <span class="prose-img__frame">
        <span
          v-if="loadStatus === 'loading'"
          class="prose-img__state prose-img__state--loading"
          aria-hidden="true"
        >
          <span class="prose-img__shimmer" />
          <span class="prose-img__spinner" />
        </span>

        <span
          v-else-if="loadStatus === 'error'"
          class="prose-img__state prose-img__state--error"
          role="status"
        >
          <svg
            class="prose-img__error-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.25" fill="currentColor" stroke="none" />
            <path d="M3 16l5-5 4 4 3-3 6 6" stroke-linecap="round" stroke-linejoin="round" />
            <path d="m15 8 4-2M19 8l-4 2" stroke-linecap="round" opacity="0.55" />
          </svg>
          <span class="prose-img__error-title">图片加载失败</span>
          <span v-if="alt" class="prose-img__error-detail">{{ alt }}</span>
          <button
            type="button"
            class="prose-img__retry"
            @click.stop="retryLoad"
          >
            重试
          </button>
        </span>

        <img
          v-if="refinedSrc"
          :key="imgRetryKey"
          ref="imgRef"
          :src="refinedSrc"
          :alt="alt"
          :width="width"
          :height="height"
          loading="lazy"
          decoding="async"
          class="prose-img__image"
          :class="{ 'prose-img__image--visible': loadStatus === 'loaded' }"
          @load="onImageLoad"
          @error="onImageError"
        >
      </span>
    </component>
    <figcaption v-if="inImageParagraph && alt" class="prose-img__caption">
      {{ alt }}
    </figcaption>
  </component>
</template>

<style scoped>
.prose-img {
  display: inline-block;
  max-width: 100%;
  vertical-align: middle;
}

.prose-img--block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-inline: auto;
}

.prose-img__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: min(100%, var(--prose-img-inline-width, 280px));
  min-width: min(100%, var(--prose-img-inline-width, 280px));
  max-width: 100%;
  height: var(--prose-img-height, 360px);
  margin: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  text-align: inherit;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-raised);
  cursor: zoom-in;
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}

.prose-img__trigger--block {
  width: min(100%, var(--prose-img-max-width, 640px));
  min-width: min(100%, var(--prose-img-max-width, 640px));
}

.prose-img__trigger--loading,
.prose-img__trigger--error {
  cursor: default;
}

.prose-img__trigger--error {
  border-color: color-mix(in srgb, #f87171 35%, var(--border));
}

.prose-img__trigger--loaded:hover {
  border-color: var(--brand-border);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.prose-img__trigger:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
}

.prose-img__frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.prose-img__state {
  position: absolute;
  inset: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
  z-index: 1;
}

.prose-img__state--loading {
  background: color-mix(in srgb, var(--muted) 10%, transparent);
}

.prose-img__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    color-mix(in srgb, var(--muted) 6%, transparent) 0%,
    color-mix(in srgb, var(--muted) 16%, transparent) 42%,
    color-mix(in srgb, var(--muted) 6%, transparent) 84%
  );
  background-size: 220% 100%;
  animation: prose-img-shimmer 1.35s ease-in-out infinite;
}

.prose-img__spinner {
  position: relative;
  z-index: 1;
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid color-mix(in srgb, var(--muted) 28%, transparent);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: prose-img-spin 0.75s linear infinite;
}

.prose-img__state--error {
  padding: 1rem;
  text-align: center;
  background: color-mix(in srgb, #f87171 8%, var(--surface-raised));
}

.prose-img__error-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: color-mix(in srgb, #f87171 72%, var(--muted));
}

.prose-img__error-title {
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
}

.prose-img__error-detail {
  max-width: 100%;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.prose-img__retry {
  margin-top: 0.15rem;
  padding: 0.35rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-raised);
  color: var(--text);
  font-size: 0.8rem;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background-color 0.15s ease;
}

.prose-img__retry:hover {
  border-color: var(--brand-border);
  color: var(--brand);
}

.prose-img__retry:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.prose-img__image {
  display: block;
  height: 100%;
  width: auto;
  max-width: 100%;
  margin: 0;
  object-fit: contain;
  object-position: center;
  background: transparent;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.28s ease;
}

.prose-img__image--visible {
  opacity: 1;
}

.prose-img__caption {
  width: min(100%, var(--prose-img-max-width, 640px));
  margin-top: 0.65rem;
  color: var(--muted);
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
}

@keyframes prose-img-shimmer {
  0% {
    background-position: 120% 0;
  }

  100% {
    background-position: -120% 0;
  }
}

@keyframes prose-img-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .prose-img__shimmer,
  .prose-img__spinner {
    animation: none;
  }

  .prose-img__image {
    transition: none;
  }
}
</style>
