import type { VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

export interface CodeGroupTab {
  index: number
  title: string
  language?: string
  filename?: string
  code?: string
  vnode: VNode
}

const FRAGMENT = Symbol.for('v-fgt')

function isFragment(type: unknown): boolean {
  return type === Fragment || type === FRAGMENT || String(type) === 'Symbol(v-fgt)'
}

function isWhitespaceText(vnode: VNode): boolean {
  return vnode.type === Text && typeof vnode.children === 'string' && !vnode.children.trim()
}

/** Flatten default slot vnodes from MDCRenderer (fragments, whitespace, wrappers). */
export function flattenSlotVNodes(vnodes: VNode[] | undefined): VNode[] {
  const result: VNode[] = []

  for (const vnode of vnodes ?? []) {
    if (!vnode || vnode.type === Comment || isWhitespaceText(vnode)) {
      continue
    }

    if (isFragment(vnode.type)) {
      const children = Array.isArray(vnode.children) ? vnode.children : []
      result.push(...flattenSlotVNodes(children as VNode[]))
      continue
    }

    if (typeof vnode.type === 'symbol' || vnode.type === 'template') {
      const children = Array.isArray(vnode.children) ? vnode.children : []
      result.push(...flattenSlotVNodes(children as VNode[]))
      continue
    }

  // Unwrap single-child wrappers (e.g. <p> from markdown) down to code blocks.
    if (
      typeof vnode.type === 'string'
      && vnode.type !== 'pre'
      && vnode.children
      && Array.isArray(vnode.children)
    ) {
      const inner = flattenSlotVNodes(vnode.children as VNode[])
      if (inner.length) {
        result.push(...inner)
        continue
      }
    }

    result.push(vnode)
  }

  return result
}

function readBlockProps(vnode: VNode) {
  const props = (vnode.props ?? {}) as Record<string, unknown>
  return {
    filename: typeof props.filename === 'string' ? props.filename : undefined,
    label: typeof props.label === 'string' ? props.label : undefined,
    language: typeof props.language === 'string' ? props.language : undefined,
    code: typeof props.code === 'string' ? props.code : undefined,
  }
}

export function resolveCodeBlockTab(vnode: VNode, index: number): CodeGroupTab {
  const { filename, label, language, code } = readBlockProps(vnode)
  const langLabel = language?.split(':')[0]?.split('{')[0]?.trim()
  const title = filename || label || (langLabel ? langLabel.toUpperCase() : `Tab ${index + 1}`)

  return {
    index,
    title,
    filename,
    language: langLabel,
    code,
    vnode,
  }
}

export function resolveCodeGroupTabs(vnodes: VNode[] | undefined): CodeGroupTab[] {
  return flattenSlotVNodes(vnodes).map(resolveCodeBlockTab)
}
