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
  gradient?: string
  emoji?: string
}

export interface Article extends ArticleMeta {
  content: string
}

// テーマカラーに合わせたグラデーションパレット
const gradientPalettes = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
]

// 記事カードに使用する絵文字リスト
const cardEmojis = [
  '📝', '🚀', '💡', '🎨', '🔧', '📚', '🌟', '💻',
  '🎯', '🔥', '✨', '🎪', '🎭', '🎬', '🎤', '🎧',
  '🎼', '🎹', '🎸', '🎺', '🎻', '🎲', '🎰', '🎳',
  '🏆', '🏅', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐',
  '🌈', '🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🍀',
  '🌙', '⭐', '☀️', '⚡', '🔮', '💎', '🎁', '🎀'
]

/**
 * 文字列からハッシュ値を生成（シード値として使用）
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * ファイル名からランダムなグラデーションを生成
 */
function generateGradient(slug: string): string {
  const hash = hashString(slug)
  const index = hash % gradientPalettes.length
  return gradientPalettes[index]
}

/**
 * ファイル名からランダムな絵文字を生成
 */
function generateEmoji(slug: string): string {
  const hash = hashString(slug)
  const index = hash % cardEmojis.length
  return cardEmojis[index]
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
        gradient: data.gradient || generateGradient(slug),
        emoji: data.emoji || generateEmoji(slug),
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
    gradient: data.gradient || generateGradient(slug),
    emoji: data.emoji || generateEmoji(slug),
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
