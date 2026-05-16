<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

interface Props {
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
  class?: string
  lineNumbers?: boolean | string
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  language: '',
  filename: '',
  highlights: () => [],
  meta: '',
  class: '',
  lineNumbers: false
})

const inCodeGroup = inject('inCodeGroup', false)

const { copy, copied } = useClipboard({ source: props.code })

function parseActualLanguage(language: string | undefined): string {
  const lang = language || ''
  const beforeColon = lang.split(':')[0] ?? lang
  return beforeColon.split('{')[0] ?? beforeColon
}

const actualLanguage = computed(() => parseActualLanguage(props.language))
const languageLabel = computed(() => parseActualLanguage(props.language).toUpperCase())

const hasLineNumbers = computed(() => {
  const lang = props.language || ''
  return props.lineNumbers || lang.includes(':line-numbers') || props.meta?.includes(':line-numbers')
})
</script>

<template>
  <div
    class="prose-pre-wrapper"
    :class="[filename ? 'has-filename' : '', inCodeGroup ? 'in-code-group' : '']"
  >
    <!-- Header with filename or language -->
    <div v-if="!inCodeGroup && (filename || language)" class="prose-pre-header">
      <div class="header-left">
        <span v-if="filename" class="filename">{{ filename }}</span>
      </div>
      <div class="header-right">
        <span v-if="actualLanguage && !filename" class="language-badge">{{ languageLabel }}</span>
        <button class="copy-btn" :class="{ copied }" @click="copy()" aria-label="Copy code">
          <div class="icon-wrapper">
             <Transition name="fade" mode="out-in">
                <svg v-if="!copied" key="copy" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <svg v-else key="check" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="icon check"><polyline points="20 6 9 17 4 12"></polyline></svg>
             </Transition>
          </div>
        </button>
      </div>
    </div>

    <!-- Floating actions for blocks without header -->
    <div v-else-if="!inCodeGroup" class="floating-actions">
       <span class="language-badge-floating">{{ languageLabel }}</span>
       <button class="copy-btn floating" :class="{ copied }" @click="copy()" aria-label="Copy code">
          <div class="icon-wrapper">
             <Transition name="fade" mode="out-in">
                <svg v-if="!copied" key="copy" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <svg v-else key="check" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="icon check"><polyline points="20 6 9 17 4 12"></polyline></svg>
             </Transition>
          </div>
        </button>
    </div>

    <pre :class="[props.class, hasLineNumbers ? 'line-numbers' : '']" v-bind="$attrs"><slot /></pre>
  </div>
</template>

<style scoped>
.prose-pre-wrapper {
  position: relative;
  margin: 1.5rem 0;
  background-color: var(--code-bg);
  border-radius: 12px;
  border: 1px solid var(--code-border);
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.prose-pre-wrapper:hover {
  border-color: var(--brand-border);
}

.prose-pre-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 40px;
  background-color: var(--code-header-bg);
  border-bottom: 1px solid var(--code-border);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filename {
  font-size: 0.8rem;
  color: var(--code-lang-text);
  font-family: var(--font-mono, monospace);
  font-weight: 500;
}

.language-badge, .language-badge-floating {
  font-size: 0.7rem;
  color: var(--code-lang-text);
  font-weight: 700;
  letter-spacing: 0.5px;
  opacity: 0.6;
}

.language-badge-floating {
  position: absolute;
  top: 12px;
  right: 48px;
  z-index: 2;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.prose-pre-wrapper:hover .language-badge-floating {
  opacity: 0;
}

.floating-actions {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}

.copy-btn {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid transparent;
  background-color: var(--code-copy-btn-bg);
  color: var(--code-lang-text);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.8;
}

.copy-btn.floating {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
  opacity: 0;
}

.prose-pre-wrapper:hover .copy-btn.floating {
  opacity: 1;
}

.copy-btn:hover {
  opacity: 1;
  background-color: var(--code-copy-btn-hover-bg);
  border-color: var(--brand-border);
  color: var(--brand);
  transform: translateY(-1px);
}

.copy-btn.copied {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
  background-color: rgba(16, 185, 129, 0.1);
  opacity: 1;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 14px;
  height: 14px;
}

.icon.check {
  width: 16px;
  height: 16px;
}

pre {
  margin: 0 !important;
  padding: 1.25rem 0 !important;
  background-color: transparent !important;
  font-size: 0.875rem !important;
  line-height: 1.7 !important;
  overflow-x: auto;
  letter-spacing: 0.2px;
}

pre :deep(.line) {
  display: block;
  padding: 0 1.25rem;
  margin: 0;
  line-height: 1.7;
  position: relative;
  min-height: 1.7em; /* Use em to match line-height exactly, ensuring continuous background */
}

pre :deep(.line.highlight),
pre :deep(.line.highlighted) {
  background-color: var(--code-line-highlight-bg);
  padding-left: calc(1.25rem - 3px);
}

pre :deep(.line.diff.remove) {
  background-color: var(--code-diff-remove-bg, rgba(239, 68, 68, 0.12));
  box-shadow: inset 3px 0 0 var(--code-diff-remove-border, #f43f5e);
  padding-left: calc(1.25rem - 3px);
}

pre :deep(.line.diff.add) {
  background-color: var(--code-diff-add-bg, rgba(16, 185, 129, 0.12));
  box-shadow: inset 3px 0 0 var(--code-diff-add-border, #10b981);
  padding-left: calc(1.25rem - 3px);
}

pre :deep(.line.diff.remove::before) {
  content: '-';
  position: absolute;
  left: 0.5rem;
  color: #f43f5e;
  opacity: 0.7;
}

pre :deep(.line.diff.add::before) {
  content: '+';
  position: absolute;
  left: 0.5rem;
  color: #10b981;
  opacity: 0.7;
}

/* ================== Error & Warning ================== */

pre :deep(.line.error) {
  background-color: rgba(239, 68, 68, 0.1);
  box-shadow: inset 3px 0 0 #ef4444;
}

pre :deep(.line.warning) {
  background-color: rgba(245, 158, 11, 0.1);
  box-shadow: inset 3px 0 0 #f59e0b;
}

/* ================== Line Numbers ================== */

pre.line-numbers {
  counter-reset: line;
}

pre.line-numbers :deep(.line) {
  padding-left: 3.5rem;
}

pre.line-numbers :deep(.line::before) {
  counter-increment: line;
  content: counter(line);
  position: absolute;
  left: 0;
  width: 2.75rem;
  padding-right: 0.75rem;
  text-align: right;
  color: var(--code-lang-text);
  opacity: 0.35;
  user-select: none;
  font-size: 0.8rem;
  border-right: 1px solid var(--code-border);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

pre.line-numbers :deep(.line.diff.remove::before),
pre.line-numbers :deep(.line.diff.add::before) {
  content: counter(line); /* Don't show +/- when line numbers are on, or maybe show both? VitePress shows line numbers. */
}

/* ================== Focus & Dim Effect ================== */

/* When some lines are focused, dim and blur the others */
pre.has-focused :deep(.line:not(.focused)) {
  filter: blur(4px);
  opacity: 0.3;
  transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* On hover, reveal non-focused lines for readability */
pre.has-focused:hover :deep(.line:not(.focused)) {
  filter: blur(0);
  opacity: 1;
}

/* Focused lines are fully visible */
pre.has-focused :deep(.line.focused) {
  opacity: 1;
  filter: blur(0);
  background-color: var(--code-line-focus-bg, rgba(255, 255, 255, 0.05));
}

/* Highlighted lines from transformerNotationHighlight */
pre :deep(.line.highlighted) {
  background-color: var(--code-line-highlight-bg);
}

/* ================== Token Polish (Contrast Boost) ================== */

/* 强制全透明度，确保清晰 */
pre :deep(.line span) {
  opacity: 1 !important;
}

/* 针对深色模式：显著提升暗灰色 Identifier (如 console, window) 的亮度 */
:root:not([data-theme="light"]) pre :deep(span[style*="color:#e1e4e8"]),
:root:not([data-theme="light"]) pre :deep(span[style*="color:#E1E4E8"]),
:root:not([data-theme="light"]) pre :deep(span[style*="color:#d1d5da"]),
:root:not([data-theme="light"]) pre :deep(span[style*="color:#D1D5DA"]),
:root:not([data-theme="light"]) pre :deep(span[style*="color:#959da5"]) {
  color: #f1f5f9 !important; /* 提升到近乎纯白 */
}

:root:not([data-theme="light"]) pre :deep(span[style*="color:#6a737d"]),
:root:not([data-theme="light"]) pre :deep(span[style*="color:#6A737D"]) {
  color: #94a3b8 !important; /* 将昏暗的灰色标点/标识符提升为清晰的蓝灰色 */
}

/* 针对浅色模式：加深标识符颜色 */
[data-theme="light"] pre :deep(span[style*="color:#24292e"]),
[data-theme="light"] pre :deep(span[style*="color:#24292E"]),
[data-theme="light"] pre :deep(span[style*="color:#6a737d"]) {
  color: #1e293b !important;
}

/* 增加代码块的整体平滑度 */
pre code {
  -webkit-font-smoothing: subpixel-antialiased;
  display: block;
  min-width: fit-content;
}

/* Scrollbar */
pre::-webkit-scrollbar {
  height: 8px;
}

pre::-webkit-scrollbar-track {
  background: transparent;
}

pre::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
