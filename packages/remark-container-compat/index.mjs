import { unified } from 'unified'
import remarkParse from 'remark-parse'

/**
 * VitePress uses `::: info` (space after colons) and optional titles
 * `::: danger STOP` while remark-directive expects `:::info` without spaces.
 */
const TYPES = 'info|tip|warning|danger|details'
const OPEN_LINE = new RegExp(`^:::\\s*(${TYPES})(?:\\s+(.+))?$`, 'i')
const CLOSE = /^:::\s*$/
const FENCED = new RegExp(
  `^:::\\s*(${TYPES})(?:\\s+([^\\n]+))?\\n([\\s\\S]*?)\\n:::\\s*$`,
  'i',
)

function paragraphText(node) {
  if (node?.type !== 'paragraph' || !node.children?.length) {
    return ''
  }
  return node.children
    .filter((child) => child.type === 'text')
    .map((child) => child.value)
    .join('')
}

function parseOpenLine(text) {
  const line = text.trim()
  const match = line.match(OPEN_LINE)
  if (!match) {
    return null
  }
  return {
    type: match[1].toLowerCase(),
    title: match[2]?.trim() || '',
  }
}

function parseFencedParagraph(node) {
  const text = paragraphText(node)
  const match = text.match(FENCED)
  if (!match) {
    return null
  }

  const content = match[3].trim()
  const children = content
    ? unified().use(remarkParse).parse(content).children
    : []

  return {
    type: match[1].toLowerCase(),
    title: match[2]?.trim() || '',
    children,
  }
}

function isClose(node) {
  return CLOSE.test(paragraphText(node).trim())
}

export default function remarkContainerCompat() {
  return (tree) => {
    const children = tree.children
    if (!children?.length) {
      return
    }

    const next = []

    for (let i = 0; i < children.length; i++) {
      const node = children[i]

      const fenced = node.type === 'paragraph' ? parseFencedParagraph(node) : null
      if (fenced) {
        next.push({
          type: 'containerDirective',
          name: fenced.type,
          attributes: fenced.title ? { title: fenced.title } : {},
          children: fenced.children,
        })
        continue
      }

      const open = node.type === 'paragraph' ? parseOpenLine(paragraphText(node)) : null
      if (!open) {
        next.push(node)
        continue
      }

      const blocks = []
      let j = i + 1

      while (j < children.length) {
        const sibling = children[j]
        if (sibling.type === 'paragraph' && isClose(sibling)) {
          break
        }
        blocks.push(sibling)
        j++
      }

      if (j >= children.length || !isClose(children[j])) {
        next.push(node)
        continue
      }

      next.push({
        type: 'containerDirective',
        name: open.type,
        attributes: open.title ? { title: open.title } : {},
        children: blocks,
      })

      i = j
    }

    tree.children = next
  }
}
