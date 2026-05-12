<script setup lang="ts">
// 将可预览图片的交互集中在组件内部，页面层只需要传入资源信息。
const props = withDefaults(defineProps<{
  src: string
  alt: string
  lazy?: boolean
  preview?: boolean
  aspectRatio?: string
  fit?: 'cover' | 'contain'
  previewLabel?: string
}>(), {
  lazy: true,
  preview: true,
  fit: 'cover',
  previewLabel: '预览图片',
})

const isLoaded = ref(false)
const isOpen = ref(false)

function openPreview() {
  if (!props.preview)
    return
  isOpen.value = true
}

function closePreview() {
  isOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    closePreview()
}

// 监听弹层开关，同步处理滚动锁定与 ESC 关闭行为。
watch(isOpen, (open) => {
  if (!import.meta.client)
    return

  if (open) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
  }
  else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client)
    return

  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <figure
    class="media-asset"
    :class="{ 'media-asset--loaded': isLoaded, 'media-asset--previewable': preview }"
    :style="aspectRatio ? { aspectRatio } : undefined"
  >
    <div class="media-asset__skeleton" aria-hidden="true" />

    <img
      class="media-asset__img"
      :class="`media-asset__img--${fit}`"
      :src="src"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      decoding="async"
      @load="isLoaded = true"
      @error="isLoaded = true"
      @click="openPreview"
    >

    <button
      v-if="preview"
      type="button"
      class="media-asset__action"
      :aria-label="previewLabel"
      @click.stop.prevent="openPreview"
    >
      预览
    </button>

    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="isOpen"
          class="media-lightbox"
          role="dialog"
          aria-modal="true"
          :aria-label="alt"
          @click.self="closePreview"
        >
          <button
            type="button"
            class="media-lightbox__close"
            aria-label="关闭预览"
            @click="closePreview"
          >
            关闭
          </button>
          <img
            class="media-lightbox__img"
            :src="src"
            :alt="alt"
          >
        </div>
      </Teleport>
    </ClientOnly>
  </figure>
</template>
