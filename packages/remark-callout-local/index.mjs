import { visit } from 'unist-util-visit'
import remarkContainerCompat from 'remark-container-compat'

const CONTAINER_TYPES = new Set([
  'tip',
  'info',
  'warning',
  'danger',
  'details',
])

const ALERT_TYPES = new Set([
  'tip',
  'note',
  'info',
  'important',
  'warning',
  'caution',
  'danger',
])

const DEFAULT_TITLES = {
  tip: 'TIP',
  info: 'INFO',
  warning: 'WARNING',
  danger: 'DANGER',
  details: 'Details',
  note: 'NOTE',
  important: 'IMPORTANT',
  caution: 'CAUTION',
}

const ALERT_MARKER_RE =
  /^\[!(TIP|NOTE|INFO|IMPORTANT|WARNING|CAUTION|DANGER)\]([^\n\r]*)/i

function titleFromDirective(node) {
  const attrTitle = node.attributes?.title
  if (typeof attrTitle === 'string' && attrTitle.trim()) {
    return attrTitle.trim()
  }
  if (typeof node.label === 'string' && node.label.trim()) {
    return node.label.trim()
  }
  return ''
}

function prependTitle(node, title, { summary = false, defaultTitle = false } = {}) {
  node.children.unshift({
    type: 'paragraph',
    data: {
      hName: summary ? 'summary' : 'p',
      hProperties: summary
        ? {}
        : {
            className: [
              'custom-block-title',
              ...(defaultTitle ? ['custom-block-title-default'] : []),
            ],
          },
    },
    children: [{ type: 'text', value: title }],
  })
}

function applyCustomBlock(node, type, title, { summary = false } = {}) {
  const resolvedTitle =
    title || DEFAULT_TITLES[type] || type.toUpperCase()
  const defaultTitle = !title

  prependTitle(node, resolvedTitle, { summary, defaultTitle })

  node.data = node.data || {}
  node.data.hName = summary ? 'details' : 'div'
  node.data.hProperties = {
    className: [type, 'custom-block'],
  }
}

function firstParagraphText(node) {
  const paragraph = node.children?.find((child) => child.type === 'paragraph')
  if (!paragraph?.children?.length) {
    return ''
  }
  return paragraph.children
    .filter((child) => child.type === 'text')
    .map((child) => child.value)
    .join('')
}

function stripAlertMarker(paragraph, match) {
  const textChild = paragraph.children.find((child) => child.type === 'text')
  if (!textChild) {
    return
  }

  const rest = textChild.value.slice(match[0].length).trimStart()
  if (!rest) {
    paragraph.children = paragraph.children.filter((child) => child !== textChild)
    return
  }

  textChild.value = rest
}

export default function remarkCalloutLocal() {
  const compatVitePressContainers = remarkContainerCompat()

  return (tree) => {
    compatVitePressContainers(tree)

    visit(tree, 'containerDirective', (node) => {
      if (node.name === 'code-group') {
        return
      }

      const type = String(node.name || 'info').toLowerCase()
      if (!CONTAINER_TYPES.has(type)) {
        return
      }

      const customTitle = titleFromDirective(node)
      applyCustomBlock(node, type, customTitle, {
        summary: type === 'details',
      })
    })

    visit(tree, 'blockquote', (node) => {
      const text = firstParagraphText(node)
      const match = text.match(ALERT_MARKER_RE)
      if (!match) {
        return
      }

      const type = match[1].toLowerCase()
      if (!ALERT_TYPES.has(type)) {
        return
      }

      const inlineTitle = match[2]?.trim() || ''
      const paragraph = node.children.find((child) => child.type === 'paragraph')
      if (paragraph) {
        stripAlertMarker(paragraph, match)
        if (!paragraph.children.length) {
          node.children = node.children.filter((child) => child !== paragraph)
        }
      }

      applyCustomBlock(node, type, inlineTitle)
    })
  }
}
