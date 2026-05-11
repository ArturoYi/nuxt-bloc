import { visit } from 'unist-util-visit'

const VALID_TYPES = new Set(['tip', 'info', 'warning', 'danger'])

export default function remarkCalloutLocal() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      const type = VALID_TYPES.has(node.name) ? node.name : 'info'

      node.data = node.data || {}
      node.attributes = node.attributes || {}
      node.data.hName = 'div'
      node.data.hProperties = {
        class: ['callout', `callout--${type}`].join(' '),
      }
    })
  }
}
