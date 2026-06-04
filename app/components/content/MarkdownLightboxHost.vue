<script setup lang="ts">
import {
  downloadLightboxImage,
  provideMarkdownLightbox,
} from '~/composables/useMarkdownLightbox'

const { images, visible, index, close } = provideMarkdownLightbox()

const currentImageSrc = computed(() => {
  const current = images.value[index.value]
  if (!current) {
    return ''
  }

  return typeof current === 'string' ? current : current.src
})

const currentImageTitle = computed(() => {
  const current = images.value[index.value]
  if (!current || typeof current === 'string') {
    return undefined
  }

  return current.title
})

function handleDownload() {
  if (!currentImageSrc.value) {
    return
  }

  downloadLightboxImage(currentImageSrc.value, currentImageTitle.value)
}
</script>

<template>
  <div class="markdown-lightbox-host">
    <slot />

    <VueEasyLightbox
      :visible="visible"
      :imgs="images"
      :index="index"
      :move-disabled="false"
      :mask-closable="true"
      teleport="body"
      @hide="close"
    >
      <template #close-btn="{ close: closeLightbox }">
        <button
          type="button"
          class="markdown-lightbox-close"
          aria-label="关闭预览"
          @click="closeLightbox"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z" />
          </svg>
        </button>
      </template>

      <template #toolbar="{ toolbarMethods }">
        <div class="markdown-lightbox-toolbar">
          <button
            type="button"
            class="markdown-lightbox-toolbar__btn"
            aria-label="放大"
            @click="toolbarMethods.zoomIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14Z" />
            </svg>
          </button>
          <button
            type="button"
            class="markdown-lightbox-toolbar__btn"
            aria-label="缩小"
            @click="toolbarMethods.zoomOut"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5ZM9.5 13A3.5 3.5 0 1 1 13 9.5 3.504 3.504 0 0 1 9.5 13Z" />
            </svg>
          </button>
          <button
            type="button"
            class="markdown-lightbox-toolbar__btn"
            aria-label="逆时针旋转"
            @click="toolbarMethods.rotateLeft"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.11 8.53 5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47ZM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47Zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32ZM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-3.31-2.1-6.16-5.08-7.24Z" />
            </svg>
          </button>
          <button
            type="button"
            class="markdown-lightbox-toolbar__btn"
            aria-label="顺时针旋转"
            @click="toolbarMethods.rotateRight"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.55 5.55 11 1v3.07C7.06 3.56 4 6.92 4 11c0 2.31 1.17 4.35 2.95 5.57L8.36 15.1C7.17 14.33 6.4 12.74 6.4 11c0-2.65 2.05-4.8 4.6-4.96V7.4L15.55 5.55ZM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.41 1.42c.52.75.87 1.59 1.01 2.47h2.02ZM13 17.9v2.02c3.95-.49 7-3.85 7-7.93 0-1.64-.53-3.16-1.43-4.4l-1.45 1.45c.54.75.88 1.62 1.03 2.46H13Z" />
            </svg>
          </button>
          <button
            type="button"
            class="markdown-lightbox-toolbar__btn"
            aria-label="重置视图"
            @click="toolbarMethods.resize"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12h-2v3h-3v2h5v-5ZM7 9h3V7H5v5h2V9Zm14-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H5V5h14v14Z" />
            </svg>
          </button>
          <button
            type="button"
            class="markdown-lightbox-toolbar__btn markdown-lightbox-toolbar__btn--accent"
            aria-label="下载图片"
            @click="handleDownload"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7ZM5 18v2h14v-2H5Z" />
            </svg>
          </button>
        </div>
      </template>
    </VueEasyLightbox>
  </div>
</template>

<style scoped>
.markdown-lightbox-host {
  display: contents;
}
</style>
