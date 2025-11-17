import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Paragraph, Text, Link } from 'mdast'

const remarkUrlCards: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      // URL patterns to match
      const urlPatterns = [
        { regex: /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)$/, type: 'youtube-embed' },
        { regex: /^https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+$/, type: 'twitter-embed' },
        { regex: /^https?:\/\/(?:www\.)?nicovideo\.jp\/watch\/(sm\d+|so\d+)$/, type: 'nicovideo-embed' },
      ]

      let url: string | null = null

      // Check if paragraph contains only a text node (before remarkGfm processes it)
      if (node.children.length === 1 && node.children[0].type === 'text') {
        const textNode = node.children[0] as Text
        url = textNode.value.trim()
      }

      // Check if paragraph contains only a link node (after remarkGfm auto-links it)
      else if (node.children.length === 1 && node.children[0].type === 'link') {
        const linkNode = node.children[0] as Link
        url = linkNode.url
      }

      // If we found a URL, check if it matches our patterns
      if (url) {
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
