import { Suspense } from 'react'
import { getAllArticles } from '@/lib/markdown'
import Header from '@/components/Header'
import HomeContent from '@/components/HomeContent'

export default function Home() {
  const articles = getAllArticles()

  return (
    <div className="container">
      <Header />
      <main className="main-wrapper">
        <Suspense fallback={<div className="loading">読み込み中...</div>}>
          <HomeContent articles={articles} />
        </Suspense>
      </main>
    </div>
  )
}
