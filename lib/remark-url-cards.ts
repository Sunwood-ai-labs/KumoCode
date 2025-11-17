import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Paragraph, Text } from 'mdast'

const remarkUrlCards: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      // Check if paragraph contains only a URL
      if (node.children.length === 1 && node.children[0].type === 'text') {
        const textNode = node.children[0] as Text
        const url = textNode.value.trim()

        // Check if it's a standalone URL
        const urlPatterns = [
          { regex: /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)$/, type: 'youtube' },
          { regex: /^https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+$/, type: 'twitter' },
          { regex: /^https?:\/\/(?:www\.)?nicovideo\.jp\/watch\/(sm\d+|so\d+)$/, type: 'nicovideo' },
        ]

        for (const { regex, type } of urlPatterns) {
          if (regex.test(url)) {
            // Replace the paragraph node with a custom node
            const customNode: any = {
              type: 'html',
              value: `<url-card data-url="${url}" data-type="${type}"></url-card>`,
            }

            if (parent && typeof index === 'number') {
              parent.children[index] = customNode
            }
            break
          }
        }
      }
    })
  }
}

export default remarkUrlCards
