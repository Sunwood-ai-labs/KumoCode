'use client'

import Link from 'next/link'

interface ArticleTagsProps {
  tags: string[]
}

export default function ArticleTags({ tags }: ArticleTagsProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="article-tags">
      🏷️
      {tags.map((tag, index) => (
        <span key={tag}>
          {index > 0 && ', '}
          <Link
            href={`/?tag=${encodeURIComponent(tag)}`}
            className="article-tag-link"
          >
            {tag}
          </Link>
        </span>
      ))}
    </div>
  )
}
