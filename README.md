# KumoCode

Modern Markdown Documentation Platform inspired by Docusaurus architecture.

![KumoCode](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-success.svg)

## 概要

KumoCodeは、Docusaurusのアーキテクチャを参考にした、マークダウンベースのドキュメントプラットフォームです。GitHub Pagesでの静的ホスティングに最適化されており、美しいYAMLテーマシステムを搭載しています。

## 特徴

### コア機能
- 📝 **Markdown記事**: フロントマター対応のMarkdownファイル
- 🎨 **YAMLテーマシステム**: 複数のテーマとライト/ダークモード
- 🚀 **GitHub Pages対応**: 静的サイトとして完璧に動作
- 📱 **レスポンシブデザイン**: 全デバイス対応
- ⚡ **高速**: 静的ファイル生成で最適化

### リッチコンテンツ
- 💻 **シンタックスハイライト**: Highlight.jsで13言語以上
- 📐 **数式サポート**: KaTeXによるLaTeX数式
- 📊 **図表**: Mermaid図表サポート
- 🎬 **メディア埋め込み**: YouTube、Twitter、ニコニコ動画対応
- 🔗 **自動目次**: 見出しから自動生成

### Docusaurus風アーキテクチャ
- 🔧 **config.js**: docusaurus.config.js相当の設定ファイル
- 📦 **ビルドプロセス**: 静的JSON生成
- 🌐 **ベースURL対応**: サブパスでのデプロイ対応
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

## Quick Start

### 前提条件
- Node.js 16.0.0 以上

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
├── articles/          # Markdown記事
│   ├── example.md
│   └── ...
├── themes/            # YAMLテーマ定義
│   ├── ocean.yaml
│   ├── default.yaml
│   └── ...
├── css/              # スタイルシート
├── js/               # JavaScriptファイル
│   ├── app.js       # メインアプリケーション
│   └── theme.js     # テーママネージャー
├── data/            # 生成されたJSONファイル（ビルド出力）
│   ├── articles.json
│   └── themes/
├── config.js        # サイト設定（docusaurus.config.js相当）
├── build-static.js  # 静的ファイル生成スクリプト
├── 404.html         # SPAルーティング用404ページ
├── .nojekyll        # GitHub Pages設定
└── index.html       # エントリーポイント
```

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
# 静的ファイルをビルド
npm run build

# 全ディレクトリをホスティングプロバイダーにデプロイ
# 必要なファイル: index.html, 404.html, css/, js/, articles/,
#                 data/, themes/, config.js, .nojekyll
```

## テーマの作成

`themes/` に新しいYAMLファイルを作成:

```yaml
name: "My Theme"
version: "1.0.0"
description: "テーマ説明"

fonts:
  primary: "'Inter', sans-serif"
  code: "'Fira Code', monospace"

light:
  colors:
    primary: "#3b82f6"
    background: "#ffffff"
    text_primary: "#1e293b"
    # ... その他の色

dark:
  colors:
    primary: "#60a5fa"
    background: "#0f172a"
    text_primary: "#f1f5f9"
    # ... その他の色

styles:
  border_radius: "8px"
  card_shadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
```

## アーキテクチャ

KumoCodeはDocusaurusのアーキテクチャ原則に従っています:

- **静的サイト生成** - 最適なパフォーマンスのためJSONデータを事前ビルド
- **クライアントサイドルーティング** - URLベースナビゲーションのSPA
- **テーマシステム** - プラガブルなYAMLベーステーマ
- **ビルドプロセス** - 自動化された静的ファイル生成
- **GitHub Pages最適化** - ベースURL処理、404リダイレクト、.nojekyll

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
