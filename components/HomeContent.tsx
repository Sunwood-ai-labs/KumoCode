'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArticleMeta } from '@/lib/markdown'

interface HomeContentProps {
  articles: ArticleMeta[]
}

export default function HomeContent({ articles }: HomeContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedTag = searchParams.get('tag')

  // 全てのタグを収集
  const allTags = Array.from(
    new Set(articles.flatMap((article) => article.tags))
  ).sort()

  // タグでフィルタリング
  const filteredArticles = selectedTag
    ? articles.filter((article) => article.tags.includes(selectedTag))
    : articles

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      // 同じタグをクリックしたらフィルターを解除
      router.push('/')
    } else {
      router.push(`/?tag=${encodeURIComponent(tag)}`)
    }
  }

  return (
    <div className="home-view">
      <div className="home-header">
        <h2 className="home-title">📚 記事一覧</h2>
        {selectedTag && (
          <div className="selected-tag-info">
            🏷️ タグ: <strong>{selectedTag}</strong>
            <button
              onClick={() => router.push('/')}
              className="clear-filter-btn"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="tag-filter-bar">
          <div className="tag-filter-label">タグで絞り込み:</div>
          <div className="tag-filter-list">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`tag-filter-item ${selectedTag === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="article-grid">
        {filteredArticles.length === 0 ? (
          <div className="loading">
            {selectedTag
              ? `タグ「${selectedTag}」の記事が見つかりませんでした`
              : '記事が見つかりませんでした'
            }
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="article-card"
            >
              <div className="article-card-title">{article.title}</div>
              <div className="article-card-date">
                {new Date(article.date).toLocaleDateString('ja-JP')}
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="article-card-tags">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="article-card-tag"
                      onClick={(e) => {
                        e.preventDefault()
                        handleTagClick(tag)
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
