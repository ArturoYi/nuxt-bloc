<script setup lang="ts">
const md = ref(`---
title: 编辑器示例
description: 这是一个实时预览示例
---

# Markdown 编辑器

这里的预览使用 MDC 运行时渲染，便于快速验证语法。

:::tip
先让博客链路稳定，再继续增强编辑器能力。
:::

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
  <div class="container page-stack">
    <section class="page-header">
      <p class="eyebrow">Editor</p>
      <h1>Markdown 编辑器</h1>
      <p>先在左侧输入内容，再在右侧预览；完成后可直接导出为 `.md` 文件。</p>
    </section>

    <section class="editor-grid">
      <div class="editor-pane">
        <div class="editor-pane__title">编辑区</div>
        <textarea
          v-model="md"
          class="editor-textarea"
          spellcheck="false"
          placeholder="请输入 Markdown 内容"
        />
      </div>

      <div class="editor-pane">
        <div class="editor-pane__title">预览区</div>
        <div class="editor-preview prose">
          <MDC :value="md" :parser-options="{ highlight: false }" tag="article" />
        </div>
      </div>
    </section>

    <div class="action-row">
      <button type="button" class="button button--primary" @click="exportMd">
        导出 Markdown
      </button>
    </div>
  </div>
</template>
