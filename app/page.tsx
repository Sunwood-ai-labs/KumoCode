import Link from 'next/link'
import { getAllArticles } from '@/lib/markdown'
import Header from '@/components/Header'

export default function Home() {
  const articles = getAllArticles()

  return (
    <div className="container">
      <Header />
      
      <main className="main-wrapper">
        <div className="home-view">
          <div className="home-header">
            <h2 className="home-title">📚 記事一覧</h2>
          </div>
          
          <div className="article-grid">
            {articles.length === 0 ? (
              <div className="loading">記事が見つかりませんでした</div>
            ) : (
              articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="article-card"
                >
                  <div className="article-card-title">{article.title}</div>
                  <div className="article-card-date">
                    {new Date(article.date).toLocaleDateString('ja-JP')}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
