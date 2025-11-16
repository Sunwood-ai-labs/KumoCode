# アーキテクチャ

## システム概要

KumoCodeは、Next.js 14の App Routerを使用した、モダンなMarkdownドキュメントプラットフォームです。Docusaurusのアーキテクチャ原則を参考にしながら、Next.jsの強力な機能を活用して構築されています。

## 技術スタック

### フロントエンド

- **Next.js 14.2.0**: Reactフレームワーク（App Router使用）
- **React 18.3.0**: UIライブラリ
- **TypeScript 5.4.0**: 型安全性
- **next-themes**: テーマ管理
- **react-markdown**: Markdownレンダリング
- **KaTeX**: 数式レンダリング
- **Highlight.js**: シンタックスハイライト

### ビルドツール

- **Next.js**: 静的サイト生成（SSG）とサーバーサイドレンダリング（SSR）
- **TypeScript Compiler**: 型チェックとトランスパイル
- **ESLint**: コード品質管理

## ディレクトリ構造

```
KumoCode/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   └── articles/            # 記事ページ
│       └── [slug]/
│           └── page.tsx     # 動的記事ページ
├── components/              # Reactコンポーネント
│   ├── Header.tsx          # ヘッダーコンポーネント
│   └── TableOfContents.tsx # 目次コンポーネント
├── lib/                     # ユーティリティライブラリ
│   ├── markdown.ts         # Markdown処理
│   └── themes.ts           # テーマ処理
├── articles/                # Markdownソースファイル
│   └── *.md                # 記事ファイル
├── themes/                  # テーマJSONファイル
│   ├── ocean.json
│   ├── default.json
│   ├── sunset.json
│   └── cyberpunk.json
├── public/                  # 静的ファイル
│   └── images/             # 画像ファイル
├── legacy/                  # レガシーコード（v1.x）
│   ├── server.js           # 旧Express.jsサーバー
│   ├── build-static.js     # 旧ビルドスクリプト
│   ├── js/                 # 旧JavaScriptファイル
│   └── css/                # 旧CSSファイル
├── docs/                    # ドキュメント
│   ├── INSTALLATION.md
│   ├── USAGE.md
│   ├── THEMES.md
│   └── ARCHITECTURE.md
├── .env.example             # 環境変数のテンプレート
├── next.config.js           # Next.js設定
├── tsconfig.json            # TypeScript設定
└── package.json             # プロジェクト設定
```

## アーキテクチャパターン

### 静的サイト生成（SSG）

KumoCodeは、ビルド時に全ての記事を静的HTMLとして事前レンダリングします。

```typescript
// app/articles/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs.map((slug) => ({
    slug: slug.slug,
  }))
}
```

**メリット:**
- 高速なページロード
- SEO最適化
- CDNキャッシュに最適
- サーバーコスト削減

### ファイルベースルーティング

Next.jsの App Routerを使用して、直感的なルーティングを実現しています。

```
app/
├── page.tsx              → /
└── articles/
    └── [slug]/
        └── page.tsx      → /articles/:slug
```

### コンポーネント指向

再利用可能なReactコンポーネントで構成されています。

```typescript
// components/Header.tsx
'use client'

export default function Header() {
  const { theme, setTheme } = useTheme()
  // ...
}
```

## データフロー

### 記事データの流れ

```
Markdownファイル → gray-matter → メタデータ抽出 → react-markdown → HTML
     ↓
  articles/
  example.md
```

1. **ファイル読み込み**: `lib/markdown.ts`でMarkdownファイルを読み込み
2. **メタデータ解析**: `gray-matter`でフロントマターを解析
3. **コンテンツレンダリング**: `react-markdown`でHTMLに変換
4. **拡張処理**: KaTeX、Highlight.jsで数式とコードをレンダリング

### テーマデータの流れ

```
JSONファイル → テーマプロバイダー → CSSカスタムプロパティ → スタイル適用
     ↓
  themes/
  ocean.json
```

1. **テーマ読み込み**: `lib/themes.ts`でJSONファイルを読み込み
2. **テーマ適用**: `next-themes`でライト/ダークモードを管理
3. **スタイル注入**: CSSカスタムプロパティとして注入

## レンダリング戦略

### 記事一覧ページ（/）

- **戦略**: 静的生成（SSG）
- **タイミング**: ビルド時
- **データソース**: `articles/`ディレクトリ

```typescript
// app/page.tsx
export default function Home() {
  const articles = getAllArticles() // ビルド時に実行
  return <ArticleList articles={articles} />
}
```

### 記事詳細ページ（/articles/[slug]）

- **戦略**: 静的生成（SSG）
- **タイミング**: ビルド時
- **データソース**: 個別のMarkdownファイル

```typescript
// app/articles/[slug]/page.tsx
export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug) // ビルド時に実行
  return <Article article={article} />
}
```

## パフォーマンス最適化

### ビルド時最適化

1. **事前レンダリング**: 全ページを静的HTMLとして生成
2. **コード分割**: 自動的なJavaScriptバンドル分割
3. **画像最適化**: Next.js Image Optimizationによる自動最適化

### ランタイム最適化

1. **クライアントサイドキャッシュ**: ブラウザキャッシュの活用
2. **遅延ロード**: 必要なコンポーネントのみロード
3. **プリフェッチ**: Next.jsの自動プリフェッチ機能

## セキュリティ

### 入力検証

```typescript
// lib/markdown.ts
export function getArticleBySlug(slug: string): Article {
  // パストラバーサル攻撃を防ぐ
  const fullPath = path.join(articlesDirectory, `${slug}.md`)
  // ...
}
```

### 環境変数管理

- `.env`ファイルで機密情報を管理
- `.gitignore`で`.env`をバージョン管理から除外
- `.env.example`でテンプレートを提供

### XSS対策

- `react-markdown`によるサニタイゼーション
- HTMLタグのエスケープ処理

## デプロイメント

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build

- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./out
```

### Vercel

```bash
# Vercelに自動デプロイ
vercel --prod
```

## アーキテクチャの変遷

### Version 1.x（レガシー）

- **フレームワーク**: Express.js
- **レンダリング**: サーバーサイドレンダリング
- **ビルド**: カスタムビルドスクリプト（build-static.js）
- **制限**:
  - スケーラビリティの問題
  - ホットリロードなし
  - 型安全性なし

### Version 2.x（現在）

- **フレームワーク**: Next.js 14（App Router）
- **レンダリング**: 静的サイト生成（SSG）
- **ビルド**: Next.jsビルドシステム
- **改善点**:
  - 高速なビルドと実行
  - 開発体験の向上（ホットリロード、TypeScript）
  - スケーラビリティ
  - SEO最適化

## ベストプラクティス

### コンポーネント設計

1. **単一責任の原則**: 各コンポーネントは1つの責務のみ
2. **props型定義**: TypeScriptで厳密な型定義
3. **クライアントコンポーネントの最小化**: `'use client'`は必要な場所のみ

### 状態管理

1. **ローカル状態**: `useState`で管理
2. **グローバル状態**: Context APIまたはnext-themes
3. **サーバー状態**: Next.jsのData Fetchingパターン

### パフォーマンス

1. **イメージ最適化**: Next.js Imageコンポーネント使用
2. **コード分割**: dynamic importの活用
3. **メモ化**: useMemo、useCallbackの適切な使用

## 拡張性

### プラグインシステム（計画中）

```typescript
// plugins/custom-plugin.ts
export default function customPlugin() {
  return {
    name: 'custom-plugin',
    setup(build) {
      // プラグインロジック
    },
  }
}
```

### カスタムコンポーネント

```typescript
// components/custom/YouTube.tsx
export function YouTube({ videoId }: { videoId: string }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      // ...
    />
  )
}
```

## トラブルシューティング

### ビルドエラー

1. `npm run build`でエラーが発生する場合、TypeScriptの型エラーを確認
2. `tsconfig.json`の設定を確認
3. `node_modules`を削除して再インストール

### パフォーマンス問題

1. Chrome DevToolsのLighthouseでパフォーマンス診断
2. Next.js Bundle Analyzerでバンドルサイズを確認
3. 不要な依存関係を削除

## 次のステップ

- [インストール](INSTALLATION.md) - セットアップ手順
- [使用方法](USAGE.md) - 記事作成とカスタマイズ
- [テーマ](THEMES.md) - カスタムテーマの作成
