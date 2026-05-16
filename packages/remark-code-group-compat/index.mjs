/**
 * VitePress uses `::: code-group` (space after colons) while remark-directive
 * expects `:::code-group`. This plugin merges the loose pattern into a container.
 */
const OPEN = /^:::\s*code-group\s*$/i
const CLOSE = /^:::\s*$/

function paragraphText(node) {
  if (node?.type !== 'paragraph' || !node.children?.length) {
    return ''
  }
  return node.children
    .filter((child) => child.type === 'text')
    .map((child) => child.value)
    .join('')
    .trim()
}

function isOpen(node) {
  return OPEN.test(paragraphText(node))
}

function isClose(node) {
  return CLOSE.test(paragraphText(node))
}

export default function remarkCodeGroupCompat() {
  return (tree) => {
    const children = tree.children
    if (!children?.length) {
      return
    }

    const next = []

    for (let i = 0; i < children.length; i++) {
      const node = children[i]

      if (!isOpen(node)) {
        next.push(node)
        continue
      }

      const blocks = []
      let j = i + 1

      while (j < children.length) {
        const sibling = children[j]
        if (isClose(sibling)) {
          break
        }
        if (sibling.type === 'code') {
          blocks.push(sibling)
          j++
          continue
        }
        break
      }

      if (!blocks.length || j >= children.length || !isClose(children[j])) {
        next.push(node)
        continue
      }

      next.push({
        type: 'containerDirective',
        name: 'code-group',
        attributes: {},
        children: blocks,
        data: {
          hName: 'code-group',
          hProperties: {},
        },
      })

      i = j
    }

    tree.children = next
  }
}
