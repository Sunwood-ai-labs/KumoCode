<h1 align="center">KumoCode</h1>

<p align="center">
  <img src="images/kumocode.jpeg" alt="KumoCode" width="600"/>
</p>

<p align="center">
  Modern Markdown Documentation Platform inspired by Docusaurus architecture
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-14.2.0-black.svg" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.3.0-61dafb.svg" alt="React" />
</p>

## 概要

KumoCodeは、Docusaurusのアーキテクチャを参考にした、マークダウンベースのドキュメントプラットフォームです。GitHub Pagesでの静的ホスティングに最適化されており、美しいJSONテーマシステムを搭載しています。

## 🔄 アーキテクチャの変遷

KumoCodeは当初、Express.jsベースのサーバーサイドアプリケーションとして開発されましたが、バージョン2.0.0でNext.js 14に完全移行しました。

- **v1.x**: Express.js + 静的HTML（`legacy/`フォルダに保存）
- **v2.x以降**: Next.js 14 + React（現在のアーキテクチャ）

レガシーコードは参考のため`legacy/`フォルダに保存されていますが、本番環境では使用されていません。

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

### Docusaurus風アーキテクチャ
- 🔧 **config.js**: docusaurus.config.js相当の設定ファイル
- 📦 **ビルドプロセス**: Markdown→HTML事前レンダリング
- 🌐 **ベースURL対応**: サブパスでのデプロイ対応
- 🎯 **シンプル設計**: 重複なし、JSONソースファイル
- 404 **ハンドリング**: SPAルーティング対応

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

### フロントエンド
- HTML5
- CSS3 (カスタムデザイン)
- JavaScript (ES6+)
- [Marked.js](https://marked.js.org/) - Markdownパーサー
- [Highlight.js](https://highlightjs.org/) - シンタックスハイライト
- [KaTeX](https://katex.org/) - 数式レンダリング

### バックエンド
- Node.js
- Express.js
- CORS
- dotenv - 環境変数管理

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
npm start

# 4. ブラウザでアクセス
# http://localhost:3000
```

### プロダクションビルド

```bash
# 静的ファイルをビルド
npm run build

# ビルドをプレビュー
npm run serve
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

サイトは `config.js` で設定します（Docusaurusの `docusaurus.config.js` に相当）:

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
├── articles/          # Markdown記事（ソースファイル）
│   ├── example.md
│   └── ...
├── themes/            # JSONテーマ定義（ソースファイル）
│   ├── ocean.json
│   ├── default.json
│   ├── cyberpunk.json
│   └── sunset.json
├── css/              # スタイルシート
├── js/               # JavaScriptファイル
│   ├── app.js       # メインアプリケーション
│   └── theme.js     # テーママネージャー
├── data/             # ビルド成果物（.gitignore対象）
│   ├── articles.json      # 記事リストメタデータ
│   ├── articles/          # 事前レンダリングHTML
│   │   └── *.json
│   └── themes.json        # テーマリストメタデータ
├── config.js         # サイト設定（docusaurus.config.js相当）
├── build-static.js   # 静的ファイル生成スクリプト
├── 404.html          # SPAルーティング用404ページ
├── .nojekyll         # GitHub Pages設定
└── index.html        # エントリーポイント
```

### アーキテクチャの特徴

**ソースファイル（Gitにコミット）:**
- `articles/*.md` - Markdown記事（人間が編集）
- `themes/*.json` - JSONテーマ（人間が編集）

**ビルド成果物（.gitignoreで除外）:**
- `data/articles.json` - 記事リストメタデータ
- `data/articles/*.json` - 事前レンダリングHTML
- `data/themes.json` - テーマリストメタデータ

**ビルドプロセス:**
- 記事のみ変換: `Markdown → HTML` (build-static.js)
- テーマ: `themes/*.json`から直接読み込み（変換なし）
- シンプル、重複なし、Docusaurus原則に従う

## Deployment

### GitHub Pages

GitHub Actionsで自動デプロイされます:

1. `main` ブランチにプッシュ
2. GitHub Actionsが `build-static.js` を実行
3. GitHub Pagesにデプロイ

`.github/workflows/static-site.yml` で設定:

```yaml
env:
  DEFAULT_THEME: ocean  # デフォルトテーマを設定
```

### 手動デプロイ

```bash
# 1. 依存関係をインストール
npm install

# 2. 静的ファイルをビルド
npm run build

# 3. 全ディレクトリをホスティングプロバイダーにデプロイ
# 必要なファイル:
#   - index.html, 404.html, .nojekyll
#   - css/, js/, images/
#   - articles/ (Markdownソース)
#   - themes/ (JSONソース)
#   - data/ (ビルド成果物)
#   - config.js
```

**注意:** `data/` ディレクトリはビルド成果物なので、デプロイ前に必ず `npm run build` を実行してください。

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

## アーキテクチャ

KumoCodeはDocusaurusのアーキテクチャ原則に従っています:

- **静的サイト生成** - Markdown→HTMLの事前レンダリングで最適化
- **クライアントサイドルーティング** - URLベースナビゲーションのSPA
- **テーマシステム** - JSONベースのシンプルなテーマシステム
- **ビルドプロセス** - 記事のみ変換、テーマは直接読み込み
- **シンプル設計** - 重複なし、ソースファイルとビルド成果物の明確な分離
- **GitHub Pages最適化** - ベースURL処理、404リダイレクト、.nojekyll

### ビルド時の最適化

```
ソース → ビルド → 実行時
--------------------------------------------------
articles/*.md → MD→HTML変換 → 事前レンダリングHTML使用
themes/*.json → メタデータ生成のみ → JSON直接読み込み
```

**パフォーマンス:**
- ランタイムでのMarkdownパース不要
- JSON.parse()のみ（高速）
- 初回ロード時間の短縮

## トラブルシューティング

### 記事が表示されない
1. `articles/` ディレクトリに `.md` ファイルがあることを確認
2. ブラウザのコンソールでエラーを確認
3. サーバーのログを確認

### スタイルが適用されない
1. ブラウザのキャッシュをクリア
2. `css/style.css` が正しく読み込まれているか確認

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 作者

KumoCode Development Team

## Credits

- Inspired by [Docusaurus](https://docusaurus.io/) architecture
- [Marked.js](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
- [KaTeX](https://katex.org/)
- [Mermaid](https://mermaid.js.org/)
