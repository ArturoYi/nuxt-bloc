<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed, provide, ref, useSlots } from 'vue'
import { resolveCodeGroupTabs } from '../../../utils/code-group'

provide('inCodeGroup', true)

const slots = useSlots()
const activeIndex = ref(0)

const tabs = computed(() => resolveCodeGroupTabs(slots.default?.()))

const activeTab = computed(() => tabs.value[activeIndex.value])

const activeCode = computed(() => activeTab.value?.code ?? '')

const { copy, copied } = useClipboard({ source: activeCode })

function selectTab(index: number) {
  if (index < 0 || index >= tabs.value.length) {
    return
  }
  activeIndex.value = index
}

function onTabKeydown(event: KeyboardEvent, index: number) {
  const last = tabs.value.length - 1
  if (!last) {
    return
  }

  let next = index
  if (event.key === 'ArrowRight') {
    next = index >= last ? 0 : index + 1
  } else if (event.key === 'ArrowLeft') {
    next = index <= 0 ? last : index - 1
  } else if (event.key === 'Home') {
    next = 0
  } else if (event.key === 'End') {
    next = last
  } else {
    return
  }

  event.preventDefault()
  selectTab(next)
  const tablist = (event.currentTarget as HTMLElement)?.closest('[role="tablist"]')
  const nextTab = tablist?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]
  nextTab?.focus()
}
</script>

<template>
  <div
    v-if="tabs.length"
    class="code-group"
    role="region"
    :aria-label="activeTab ? `代码组：${activeTab.title}` : '代码组'"
  >
    <div class="code-group-tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :id="`code-group-tab-${tab.index}`"
        :key="tab.title + '-' + tab.index"
        type="button"
        class="tab-item"
        role="tab"
        :aria-selected="activeIndex === tab.index"
        :aria-controls="`code-group-panel-${tab.index}`"
        :tabindex="activeIndex === tab.index ? 0 : -1"
        :class="{ active: activeIndex === tab.index }"
        @click="selectTab(tab.index)"
        @keydown="onTabKeydown($event, tab.index)"
      >
        <span class="tab-title">{{ tab.title }}</span>
      </button>

      <div class="code-group-tabs__actions">
        <button
          type="button"
          class="copy-btn"
          :class="{ copied }"
          :disabled="!activeCode"
          aria-label="复制当前标签页代码"
          @click="copy()"
        >
          <Transition name="fade" mode="out-in">
            <svg
              v-if="!copied"
              key="copy"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <svg
              v-else
              key="check"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon check"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </Transition>
        </button>
      </div>
    </div>

    <div class="code-group-panels">
      <div
        v-for="tab in tabs"
        :id="`code-group-panel-${tab.index}`"
        :key="tab.index"
        class="tab-panel"
        role="tabpanel"
        :aria-labelledby="`code-group-tab-${tab.index}`"
        :hidden="activeIndex !== tab.index"
      >
        <component :is="tab.vnode" />
      </div>
    </div>
  </div>

  <!-- Fallback: render children if tab extraction failed (e.g. during dev HMR) -->
  <div v-else class="code-group code-group--fallback">
    <slot />
  </div>
</template>

<style scoped>
.code-group {
  margin: 1.5rem 0;
  background-color: var(--code-bg);
  border-radius: 12px;
  border: 1px solid var(--code-border);
  overflow: hidden;
  box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.1);
}

.code-group-tabs {
  display: flex;
  align-items: center;
  padding: 0 4px 0 8px;
  background-color: var(--code-header-bg);
  border-bottom: 1px solid var(--code-border);
  overflow-x: auto;
  gap: 2px;
}

.code-group-tabs::-webkit-scrollbar {
  display: none;
}

.code-group-tabs__actions {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 6px 8px 6px 4px;
  flex-shrink: 0;
}

.tab-item {
  position: relative;
  padding: 12px 16px;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: var(--font-mono, monospace);
  color: var(--code-lang-text);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease, opacity 0.2s ease;
  opacity: 0.6;
}

.tab-item:hover {
  opacity: 1;
  color: var(--brand);
}

.tab-item.active {
  opacity: 1;
  color: var(--brand);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--brand);
  border-radius: 2px 2px 0 0;
}

.copy-btn {
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
  opacity: 0.85;
}

.copy-btn:hover:not(:disabled) {
  opacity: 1;
  background-color: var(--code-copy-btn-hover-bg);
  border-color: var(--brand-border);
  color: var(--brand);
}

.copy-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.copy-btn.copied {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
  background-color: rgba(16, 185, 129, 0.1);
}

.copy-btn .icon {
  width: 14px;
  height: 14px;
}

.copy-btn .icon.check {
  width: 16px;
  height: 16px;
}

.code-group-panels {
  position: relative;
}

.tab-panel :deep(.prose-pre-wrapper) {
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.tab-panel :deep(.prose-pre-wrapper:hover) {
  border-color: transparent !important;
}

.tab-panel :deep(.prose-pre-header),
.tab-panel :deep(.floating-actions) {
  display: none !important;
}

.tab-panel[hidden] {
  display: none;
}

.tab-panel:not([hidden]) {
  animation: code-group-fade-in 0.25s ease-out;
}

@keyframes code-group-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.code-group--fallback {
  padding: 0;
}
</style>
