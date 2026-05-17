<script setup lang="ts">
import '~/assets/css/editor.css'

definePageMeta({
  editorFullscreen: true,
})

const md = ref(`---
title: 编辑器示例
description: 这是一个实时预览示例
---

# Markdown 编辑器

这里的预览使用 MDC 运行时渲染，便于快速验证语法。

::: tip
先让博客链路稳定，再继续增强编辑器能力。
:::

::: danger STOP
危险区域，请勿继续
:::

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

## 支持的内容

- GFM 列表
- 数学公式
- 自定义提示块

\`\`\`ts
console.log('Nuxt Bloc editor')
\`\`\`

$$
a^2 + b^2 = c^2
$$
`)

const downloadName = computed(() => `post-${Date.now()}.md`)

const lineCount = computed(() => {
  if (!md.value) return 0
  return md.value.split('\n').length
})

const charCount = computed(() => md.value.length)

const isEmpty = computed(() => !md.value.trim())

function exportMd() {
  const blob = new Blob([md.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = downloadName.value
  link.click()
  URL.revokeObjectURL(url)
}

useSiteSeo({
  title: 'Markdown 编辑器',
  description: '使用与站点同生态的 Markdown 预览编辑器。',
  path: '/editor',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="editor-page">
    <section class="editor-workspace" aria-label="Markdown 编辑工作台">
      <header class="editor-workspace__toolbar">
        <div class="editor-toolbar__intro">
          <p class="editor-toolbar__eyebrow">Editor</p>
          <h1 class="editor-toolbar__title">Markdown 编辑器</h1>
          <p class="editor-toolbar__hint">
            左侧编辑 · 右侧预览 · 导出 <code>.md</code>
          </p>
        </div>

        <div class="editor-workspace__actions">
          <div class="editor-workspace__meta">
            <span class="editor-stat">
              <span class="editor-stat__value">{{ lineCount }}</span>
              行
            </span>
            <span class="editor-stat">
              <span class="editor-stat__value">{{ charCount }}</span>
              字符
            </span>
          </div>

          <button
            type="button"
            class="editor-export-btn"
            :disabled="isEmpty"
            @click="exportMd"
          >
            <svg
              class="editor-export-btn__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            导出
          </button>
        </div>
      </header>

      <div class="editor-workspace__panes">
        <div class="editor-pane editor-pane--source">
          <header class="editor-pane__head">
            <span
              class="editor-pane__dot editor-pane__dot--source"
              aria-hidden="true"
            />
            <h2 class="editor-pane__title">编辑区</h2>
            <span class="editor-pane__badge">Source</span>
          </header>
          <textarea
            v-model="md"
            v-scrollbar-reveal
            class="editor-pane__input"
            spellcheck="false"
            aria-label="Markdown 源码"
            placeholder="请输入 Markdown 内容…"
          />
        </div>

        <div class="editor-pane editor-pane--preview">
          <header class="editor-pane__head">
            <span
              class="editor-pane__dot editor-pane__dot--preview"
              aria-hidden="true"
            />
            <h2 class="editor-pane__title">预览区</h2>
            <span class="editor-pane__badge">Preview</span>
          </header>
          <div
            v-scrollbar-reveal
            class="editor-pane__body markdown-body prose"
          >
            <p v-if="isEmpty" class="editor-pane__empty">
              预览将在此处显示
            </p>
            <MDC
              v-else
              :value="md"
              :parser-options="{ highlight: false }"
              tag="article"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
