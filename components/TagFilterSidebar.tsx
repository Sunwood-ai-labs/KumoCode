'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface TagFilterSidebarProps {
  allTags: string[]
  tagCounts: Record<string, number>
  selectedTag: string | null
  articleCount: number
  hasColab: boolean
  hasRepo: boolean
  hasDemo: boolean
}

export default function TagFilterSidebar({
  allTags,
  tagCounts,
  selectedTag,
  articleCount,
  hasColab,
  hasRepo,
  hasDemo
}: TagFilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URLパラメータを構築するヘルパー関数
  const buildUrl = (params: Record<string, string | boolean | null>) => {
    const urlParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value === true) {
        urlParams.set(key, 'true')
      } else if (value && value !== false && value !== null) {
        urlParams.set(key, String(value))
      }
    })

    const queryString = urlParams.toString()
    return queryString ? `/?${queryString}` : '/'
  }

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag
    router.push(buildUrl({
      tag: newTag,
      hasColab: hasColab || null,
      hasRepo: hasRepo || null,
      hasDemo: hasDemo || null,
    }))
  }

  const handleFilterToggle = (filterType: 'hasColab' | 'hasRepo' | 'hasDemo') => {
    const currentValue = filterType === 'hasColab' ? hasColab
                       : filterType === 'hasRepo' ? hasRepo
                       : hasDemo

    router.push(buildUrl({
      tag: selectedTag,
      hasColab: filterType === 'hasColab' ? (!currentValue || null) : (hasColab || null),
      hasRepo: filterType === 'hasRepo' ? (!currentValue || null) : (hasRepo || null),
      hasDemo: filterType === 'hasDemo' ? (!currentValue || null) : (hasDemo || null),
    }))
  }

  const handleClearFilter = () => {
    router.push('/')
  }

  const hasAnyFilter = selectedTag || hasColab || hasRepo || hasDemo

  if (allTags.length === 0) {
    return null
  }

  return (
    <aside className="tag-filter-sidebar">
      <div className="tag-filter-sidebar-header">
        <h3 className="tag-filter-sidebar-title">🔍 フィルター</h3>
        {hasAnyFilter && (
          <button
            onClick={handleClearFilter}
            className="clear-filter-btn-sidebar"
            title="全てのフィルターをクリア"
          >
            ✕
          </button>
        )}
      </div>

      {hasAnyFilter && (
        <div className="selected-tag-info-sidebar">
          <span className="article-count">{articleCount}件の記事</span>
        </div>
      )}

      {/* 追加フィルター（Google Colab, リポジトリ, デモ） */}
      <div className="additional-filters">
        <h4 className="filter-section-title">リンク種別</h4>
        <div className="filter-checkboxes">
          <label className={`filter-checkbox ${hasColab ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={hasColab}
              onChange={() => handleFilterToggle('hasColab')}
            />
            <span className="checkbox-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="checkbox-label">Google Colab</span>
          </label>

          <label className={`filter-checkbox ${hasRepo ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={hasRepo}
              onChange={() => handleFilterToggle('hasRepo')}
            />
            <span className="checkbox-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="checkbox-label">リポジトリ</span>
          </label>

          <label className={`filter-checkbox ${hasDemo ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={hasDemo}
              onChange={() => handleFilterToggle('hasDemo')}
            />
            <span className="checkbox-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="checkbox-label">デモアプリ</span>
          </label>
        </div>
      </div>

      {/* タグフィルター */}
      <div className="tag-filter-section">
        <h4 className="filter-section-title">🏷️ タグ</h4>
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
      </div>
    </aside>
  )
}
