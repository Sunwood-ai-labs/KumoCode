'use client'

import { useRouter } from 'next/navigation'

interface TagFilterSidebarProps {
  allTags: string[]
  tagCounts: Record<string, number>
  selectedTag: string | null
  articleCount: number
}

export default function TagFilterSidebar({ allTags, tagCounts, selectedTag, articleCount }: TagFilterSidebarProps) {
  const router = useRouter()

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      // 同じタグをクリックしたらフィルターを解除
      router.push('/')
    } else {
      router.push(`/?tag=${encodeURIComponent(tag)}`)
    }
  }

  const handleClearFilter = () => {
    router.push('/')
  }

  if (allTags.length === 0) {
    return null
  }

  return (
    <aside className="tag-filter-sidebar">
      <div className="tag-filter-sidebar-header">
        <h3 className="tag-filter-sidebar-title">🏷️ タグで絞り込み</h3>
        {selectedTag && (
          <button
            onClick={handleClearFilter}
            className="clear-filter-btn-sidebar"
            title="フィルターをクリア"
          >
            ✕
          </button>
        )}
      </div>

      {selectedTag && (
        <div className="selected-tag-info-sidebar">
          <strong>{selectedTag}</strong>
          <span className="article-count">{articleCount}件</span>
        </div>
      )}

      <div className="tag-filter-list-sidebar">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`tag-filter-item-sidebar ${selectedTag === tag ? 'active' : ''}`}
          >
            <span className="tag-name">{tag}</span>
            <span className="tag-count">{tagCounts[tag]}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
