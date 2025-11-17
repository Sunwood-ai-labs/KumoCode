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
          { regex: /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)$/, type: 'youtube-embed' },
          { regex: /^https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+$/, type: 'twitter-embed' },
          { regex: /^https?:\/\/(?:www\.)?nicovideo\.jp\/watch\/(sm\d+|so\d+)$/, type: 'nicovideo-embed' },
        ]

        for (const { regex, type } of urlPatterns) {
          if (regex.test(url)) {
            // Replace the paragraph node with a custom node type
            const customNode: any = {
              type: type,
              data: {
                hName: type,
                hProperties: {
                  url: url
                }
              },
              url: url
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
