<h1 align="center">KumoCode</h1>

<p align="center">
  <img src="images/kumocode.jpeg" alt="KumoCode" width="600"/>
</p>

<p align="center">
  Modern Markdown Documentation Platform built with Next.js
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-14.2.0-black.svg" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.3.0-61dafb.svg" alt="React" />
</p>

## 概要

KumoCodeは、Next.js 14とReactで構築された、モダンなマークダウンベースのドキュメントプラットフォームです。GitHub Pagesでの静的ホスティングに最適化されており、美しいJSONテーマシステムを搭載しています。

## 特徴

### コア機能
- 📝 **Markdown記事**: フロントマター対応のMarkdownファイル
- 🎨 **JSONテーマシステム**: 複数のテーマとライト/ダークモード
- 🚀 **GitHub Pages対応**: 静的サイトとして完璧に動作
- 📱 **レスポンシブデザイン**: 全デバイス対応
- ⚡ **高速**: ビルド時レンダリングで最適化

### リッチコンテンツ
- 💻 **シンタックスハイライト**: Highlight.jsで13言語以上
- 📐 **数式サポート**: KaTeXによるLaTeX数式
- 📊 **図表**: Mermaid図表サポート
- 🎬 **メディア埋め込み**: YouTube、Twitter、ニコニコ動画対応
- 🔗 **自動目次**: 見出しから自動生成

### アーキテクチャ
- 🔧 **設定ファイル**: config.jsによる柔軟な設定管理
- 📦 **静的サイト生成**: Next.jsによる最適化されたビルド
- 🌐 **GitHub Pages対応**: サブパスでのデプロイ対応
- 🎯 **シンプル設計**: クリーンなファイル構成
- ⚡ **高速ルーティング**: Next.jsのApp Routerを活用

## デモ

### ホーム画面
- 記事一覧をカードグリッドで表示
- 記事タイトルと更新日を表示
- ホバー時のアニメーション効果

### 記事詳細画面
- タイトル、メタ情報（日付、タグ）
- 目次（記事内の見出しから自動生成）
- マークダウンコンテンツ
- シンタックスハイライト付きコードブロック
- 数式レンダリング

## 技術スタック

### フレームワーク
- [Next.js 14](https://nextjs.org/) - Reactフレームワーク
- [React 18](https://react.dev/) - UIライブラリ
- TypeScript - 型安全な開発

### Markdown & コンテンツ処理
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdownレンダリング
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatterパース
- [remark-gfm](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdown
- [remark-math](https://github.com/remarkjs/remark-math) - 数式サポート

### UI & スタイリング
- [rehype-highlight](https://github.com/rehypejs/rehype-highlight) - シンタックスハイライト
- [rehype-katex](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex) - 数式レンダリング
- [Mermaid](https://mermaid.js.org/) - 図表生成
- [next-themes](https://github.com/pacocoursey/next-themes) - テーマ管理

## 📖 ドキュメント

詳細なドキュメントは以下をご覧ください：

- **[インストールガイド](docs/INSTALLATION.md)** - セットアップ手順と環境構築
- **[使用方法](docs/USAGE.md)** - 記事作成とカスタマイズ方法
- **[テーマガイド](docs/THEMES.md)** - カスタムテーマの作成方法
- **[アーキテクチャ](docs/ARCHITECTURE.md)** - システム設計の詳細
- **[サンプル記事](examples/README.md)** - 実例とチュートリアル

## Quick Start

### 前提条件
- Node.js 18.0.0 以上

### ローカル開発

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd KumoCode

# 2. 依存関係をインストール
npm install

# 3. 開発サーバーを起動
npm run dev

# 4. ブラウザでアクセス
# http://localhost:3000
```

### プロダクションビルド

```bash
# 静的ファイルをビルド
npm run build

# ローカルでプロダクションサーバーを起動
npm start
```

## 使い方

### 記事の作成

1. `articles/` ディレクトリに `.md` ファイルを作成
2. 以下の形式でマークダウンを記述

```markdown
---
title: 記事のタイトル
date: 2025-11-15
tags: [Tag1, Tag2, Tag3]
---

# 見出し1

記事の本文をここに書きます。

## 見出し2

コードブロックの例：

\`\`\`javascript
function hello() {
  console.log("Hello, KumoCode!");
}
\`\`\`

数式の例：

inline数式: $E = mc^2$

ブロック数式:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

3. サーバーを再起動するか、ブラウザの更新ボタンをクリック

### サポートされている機能

#### Frontmatter
記事のメタデータをYAML形式で記述できます：

- `title`: 記事のタイトル
- `date`: 公開日
- `tags`: タグ（配列形式）

#### Markdownシンタックス
- 見出し (h1-h6)
- 強調 (**太字**, *斜体*)
- リスト (順序付き/順序なし)
- リンク
- 画像
- コードブロック (シンタックスハイライト付き)
- インラインコード
- 引用
- テーブル
- 水平線

#### 数式
- インライン数式: `$...$`
- ブロック数式: `$$...$$`

## Configuration

サイトは `config.js` で設定します:

```javascript
window.kumoConfig = {
  // デプロイ用ベースURL（自動検出または手動設定）
  baseUrl: '/',

  // デフォルトテーマ
  defaultTheme: 'ocean',

  // サイトメタデータ
  title: 'KumoCode',
  tagline: 'Modern Markdown Documentation Platform',

  // GitHub情報
  organizationName: 'Sunwood-ai-labs',
  projectName: 'KumoCode',
};
```

## プロジェクト構成

```
KumoCode/
├── app/                    # Next.js App Router
│   ├── articles/[slug]/   # 動的記事ページ
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── articles/              # Markdown記事（ソースファイル）
│   ├── example.md
│   └── ...
├── components/            # Reactコンポーネント
│   ├── ArticleCard.tsx
│   ├── ArticleContent.tsx
│   └── ...
├── lib/                   # ユーティリティ関数
│   ├── articles.ts        # 記事処理ロジック
│   └── themes.ts          # テーマ管理ロジック
├── themes/                # JSONテーマ定義
│   ├── ocean.json
│   ├── default.json
│   ├── cyberpunk.json
│   └── sunset.json
├── public/                # 静的ファイル
│   └── images/
├── docs/                  # ドキュメント
├── examples/              # サンプル記事
├── config.js              # サイト設定
├── next.config.js         # Next.js設定
├── tsconfig.json          # TypeScript設定
└── package.json           # 依存関係
```

### アーキテクチャの特徴

**Next.js App Router:**
- 動的ルーティングで記事ページを生成
- 静的サイト生成（SSG）による高速化
- TypeScriptによる型安全な開発

**コンテンツ管理:**
- Markdown記事をファイルシステムから読み込み
- Frontmatterによるメタデータ管理
- JSONテーマによる柔軟なスタイリング

## Deployment

### GitHub Pages

GitHub Actionsで自動デプロイされます:

1. `main` ブランチにプッシュ
2. GitHub Actionsが Next.js のビルドを実行
3. 静的ファイルを GitHub Pages にデプロイ

### 手動デプロイ

```bash
# 1. 依存関係をインストール
npm install

# 2. Next.jsで静的ファイルをビルド
npm run build

# 3. ビルド成果物（outディレクトリ）をホスティングプロバイダーにデプロイ
```

**注意:** Next.jsは自動的に最適化された静的ファイルを生成します。

## テーマの作成

`themes/` に新しいJSONファイルを作成:

```json
{
  "name": "My Theme",
  "version": "1.0.0",
  "description": "テーマ説明",
  "fonts": {
    "primary": "'Inter', sans-serif",
    "code": "'Fira Code', monospace"
  },
  "highlight_themes": {
    "light": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css",
    "dark": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/nord.min.css"
  },
  "light": {
    "colors": {
      "primary": "#3b82f6",
      "accent": "#60a5fa",
      "background": "#ffffff",
      "surface": "#f8fafc",
      "text_primary": "#1e293b",
      "text_secondary": "#64748b",
      "text_muted": "#94a3b8",
      "border": "#e2e8f0",
      "code_bg": "#f8fafc",
      "link": "#3b82f6",
      "link_hover": "#2563eb",
      "header_text": "#ffffff"
    },
    "gradients": {
      "header": "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      "card_hover": "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)"
    },
    "backgrounds": {
      "header_image": "",
      "body_image": "",
      "card_image": ""
    }
  },
  "dark": {
    "colors": {
      "primary": "#60a5fa",
      "accent": "#93c5fd",
      "background": "#0f172a",
      "surface": "#1e293b",
      "text_primary": "#f1f5f9",
      "text_secondary": "#cbd5e1",
      "text_muted": "#94a3b8",
      "border": "#334155",
      "code_bg": "#1e293b",
      "link": "#60a5fa",
      "link_hover": "#93c5fd",
      "header_text": "#f1f5f9"
    },
    "gradients": {
      "header": "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
      "card_hover": "linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)"
    },
    "backgrounds": {
      "header_image": "",
      "body_image": "",
      "card_image": ""
    }
  },
  "styles": {
    "border_radius": "8px",
    "card_shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
    "header_height": "80px",
    "backdrop_blur": "10px"
  }
}
```

既存のテーマ（`ocean.json`, `default.json`, `cyberpunk.json`, `sunset.json`）を参考にしてください。

## アーキテクチャ詳細

KumoCodeは以下の原則に基づいて設計されています:

- **静的サイト生成** - Next.jsのSSGによる最適化されたパフォーマンス
- **App Router** - Next.js 14の最新ルーティングシステム
- **テーマシステム** - JSONベースの柔軟なテーマ管理
- **型安全性** - TypeScriptによる堅牢な開発
- **GitHub Pages最適化** - 静的ホスティングに最適化された構成

### ビルドプロセス

```
ソース → ビルド → デプロイ
--------------------------------------------------
articles/*.md → Next.jsビルド → 静的HTML生成
themes/*.json → ビルド時読み込み → クライアント側で動的適用
components/*.tsx → React → 最適化されたJavaScript
```

**パフォーマンス:**
- ビルド時の静的生成による高速化
- 自動コード分割とバンドル最適化
- 画像の自動最適化

## トラブルシューティング

### 記事が表示されない
1. `articles/` ディレクトリに `.md` ファイルがあることを確認
2. ブラウザのコンソールでエラーを確認
3. `npm run dev` で開発サーバーのログを確認
4. ビルド後は `npm run build` を再実行

### スタイルが適用されない
1. ブラウザのキャッシュをクリア
2. Next.jsの `.next` フォルダを削除して再ビルド
3. テーマファイルが正しく配置されているか確認

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 作者

KumoCode Development Team

## Credits

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [KaTeX](https://katex.org/)
- [Mermaid](https://mermaid.js.org/)
