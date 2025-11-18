import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'articles')

export interface Author {
  name: string
  github?: string
  twitter?: string
  avatar?: string
}

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  author?: Author
  colabUrl?: string
  demoUrl?: string
  repoUrl?: string
  gradient?: string
  emoji?: string
}

export interface Article extends ArticleMeta {
  content: string
}

// テーマカラーに合わせたグラデーションパレット（パステルカラー）
const gradientPalettes = [
  'linear-gradient(135deg, rgba(179, 186, 255, 0.2) 0%, rgba(192, 192, 224, 0.2) 100%)',
  'linear-gradient(135deg, rgba(255, 200, 221, 0.2) 0%, rgba(255, 175, 189, 0.2) 100%)',
  'linear-gradient(135deg, rgba(162, 210, 255, 0.2) 0%, rgba(178, 255, 255, 0.2) 100%)',
  'linear-gradient(135deg, rgba(178, 255, 213, 0.2) 0%, rgba(178, 255, 234, 0.2) 100%)',
  'linear-gradient(135deg, rgba(255, 198, 201, 0.2) 0%, rgba(255, 236, 179, 0.2) 100%)',
  'linear-gradient(135deg, rgba(178, 235, 242, 0.2) 0%, rgba(178, 190, 235, 0.2) 100%)',
  'linear-gradient(135deg, rgba(224, 242, 254, 0.2) 0%, rgba(254, 235, 244, 0.2) 100%)',
  'linear-gradient(135deg, rgba(255, 218, 221, 0.2) 0%, rgba(254, 235, 253, 0.2) 100%)',
  'linear-gradient(135deg, rgba(255, 245, 225, 0.2) 0%, rgba(254, 228, 208, 0.2) 100%)',
  'linear-gradient(135deg, rgba(255, 200, 209, 0.2) 0%, rgba(221, 250, 255, 0.2) 100%)',
  'linear-gradient(135deg, rgba(240, 223, 254, 0.2) 0%, rgba(198, 235, 254, 0.2) 100%)',
  'linear-gradient(135deg, rgba(255, 210, 250, 0.2) 0%, rgba(255, 190, 200, 0.2) 100%)',
  'linear-gradient(135deg, rgba(253, 251, 251, 0.2) 0%, rgba(235, 237, 238, 0.2) 100%)',
  'linear-gradient(135deg, rgba(207, 224, 255, 0.2) 0%, rgba(224, 247, 253, 0.2) 100%)',
  'linear-gradient(135deg, rgba(236, 208, 230, 0.2) 0%, rgba(254, 249, 239, 0.2) 100%)',
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
 * 著者情報を処理する
 */
function processAuthor(authorData: any): Author | undefined {
  if (!authorData) return undefined

  const author: Author = {
    name: authorData.name || 'Unknown Author',
    github: authorData.github,
    twitter: authorData.twitter,
    avatar: authorData.avatar,
  }

  // アバターが指定されていない場合、GitHubまたはTwitterから自動生成
  if (!author.avatar) {
    if (author.github) {
      author.avatar = `https://github.com/${author.github}.png`
    } else if (author.twitter) {
      author.avatar = `https://unavatar.io/twitter/${author.twitter}`
    }
  }

  return author
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
        author: processAuthor(data.author),
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
    author: processAuthor(data.author),
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
