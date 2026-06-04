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

const inImageParagraph = inject(
  'inImageParagraph',
  computed(() => false),
)
const lightbox = useMarkdownLightbox()
const imageIndex = ref<number | null>(null)

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

watch(
  refinedSrc,
  (src) => {
    if (src) {
      preloadLightboxImage(src)
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (!lightbox || !refinedSrc.value) {
    return
  }

  imageIndex.value = lightbox.register({
    src: refinedSrc.value,
    title: props.alt || undefined,
  })
})

function openPreview() {
  if (lightbox && imageIndex.value !== null) {
    lightbox.open(imageIndex.value)
  }
}
</script>

<template>
  <component
    :is="wrapperTag"
    class="prose-img"
    :class="{ 'prose-img--block': inImageParagraph }"
  >
    <button
      type="button"
      class="prose-img__trigger"
      :aria-label="alt ? `预览图片：${alt}` : '预览图片'"
      @click="openPreview"
    >
      <span class="prose-img__frame">
        <img
          :src="refinedSrc"
          :alt="alt"
          :width="width"
          :height="height"
          loading="lazy"
          decoding="async"
          class="prose-img__image"
        />
      </span>
    </button>
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  height: var(--prose-img-height, 360px);
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-raised);
  cursor: zoom-in;
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.prose-img--block .prose-img__trigger {
  width: auto;
  max-width: min(100%, var(--prose-img-max-width, 640px));
}

.prose-img__trigger:hover {
  border-color: var(--brand-border);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.prose-img__trigger:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
}

.prose-img__frame {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: min(100%, var(--prose-img-max-width, 640px));
  padding: 0.5rem;
  box-sizing: border-box;
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
}

.prose-img__caption {
  width: min(100%, var(--prose-img-max-width, 640px));
  margin-top: 0.65rem;
  color: var(--muted);
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
}
</style>
