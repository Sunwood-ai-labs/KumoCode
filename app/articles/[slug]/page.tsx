import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import remarkUrlCards from '@/lib/remark-url-cards'
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/markdown'
import Header from '@/components/Header'
import TableOfContents from '@/components/TableOfContents'
import ArticleTags from '@/components/ArticleTags'
import FrontmatterLinks from '@/components/FrontmatterLinks'
import { YoutubeEmbed, TwitterEmbed, NicovideoEmbed } from '@/components/EmbedComponents'
import Link from 'next/link'

// KaTeX CSS
import 'katex/dist/katex.min.css'
// Highlight.js CSS
import 'highlight.js/styles/github-dark.css'

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  let article
  try {
    article = getArticleBySlug(params.slug)
  } catch (error) {
    notFound()
  }

  return (
    <div className="container">
      <Header />
      
      <main className="main-wrapper">
        <div className="article-view">
          <Link href="/" className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            記事一覧に戻る
          </Link>

          <article className="article-container">
            <header className="article-header">
              <h1 className="article-title">{article.title}</h1>
              <div className="article-meta">
                <span>📅 {new Date(article.date).toLocaleDateString('ja-JP')}</span>
                <ArticleTags tags={article.tags} />
              </div>
            </header>

            {/* Article with TOC Sidebar */}
            <div className="article-with-toc">
              {/* Table of Contents Sidebar (Left) */}
              <TableOfContents content={article.content} />

              <div className="article-content-wrapper">
                {/* Frontmatter Links */}
                <FrontmatterLinks
                  colabUrl={article.colabUrl}
                  demoUrl={article.demoUrl}
                  repoUrl={article.repoUrl}
                />

                <div className="article-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkUrlCards, remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeHighlight, rehypeKatex]}
                    components={{
                      'youtube-embed': ({ url }: any) => <YoutubeEmbed url={url} />,
                      'twitter-embed': ({ url }: any) => <TwitterEmbed url={url} />,
                      'nicovideo-embed': ({ url }: any) => <NicovideoEmbed url={url} />,
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
