import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'articles')

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  colabUrl?: string
  demoUrl?: string
  repoUrl?: string
}

export interface Article extends ArticleMeta {
  content: string
}

/**
 * すべての記事のメタデータを取得
 */
export function getAllArticles(): ArticleMeta[] {
  const fileNames = fs.readdirSync(articlesDirectory)
  const articles = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        tags: data.tags || [],
        colabUrl: data.colabUrl,
        demoUrl: data.demoUrl,
        repoUrl: data.repoUrl,
      }
    })

  // 日付でソート（新しい順）
  return articles.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

/**
 * 特定の記事の詳細を取得
 */
export function getArticleBySlug(slug: string): Article {
  const fullPath = path.join(articlesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    tags: data.tags || [],
    colabUrl: data.colabUrl,
    demoUrl: data.demoUrl,
    repoUrl: data.repoUrl,
    content,
  }
}

/**
 * すべての記事のslugを取得（静的パス生成用）
 */
export function getAllArticleSlugs() {
  const fileNames = fs.readdirSync(articlesDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }))
}
