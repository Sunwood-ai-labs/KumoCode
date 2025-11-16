# KumoCode

マークダウン技術記事プレビューアプリケーション

![KumoCode](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 概要

KumoCodeは、マークダウンで書かれた技術記事をブラウザ上で美しくプレビューできるWebアプリケーションです。モダンなデザインで快適な記事閲覧体験を提供します。

## 特徴

- 📝 **Markdownプレビュー**: リアルタイムでマークダウンをHTMLに変換して表示
- 🎨 **モダンなデザイン**: グラスモーフィズムとグラデーションを使った美しいUI
- 🌓 **ダークモード対応**: ライト/ダークモードの切り替えが可能
- 💻 **シンタックスハイライト**: 13の主要言語をサポート（Python, JavaScript, TypeScript等）
- 📐 **数式表示**: KaTeXを使用した数式レンダリング
- 🔗 **目次の自動生成**: 記事内の見出しから目次を自動生成
- 📱 **レスポンシブデザイン**: スマートフォンやタブレットにも対応
- 🎯 **カードグリッドレイアウト**: 記事一覧を美しいカードで表示
- ⚡ **軽量で高速**: シンプルな構成で素早く起動
- 🔧 **カスタマイズ可能**: .envファイルで簡単に設定変更

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

## インストール

### 前提条件
- Node.js 16.0.0 以上

### セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd KumoCode
```

2. 依存関係をインストール
```bash
npm install
```

3. サーバーを起動
```bash
npm start
```

4. ブラウザでアクセス
```
http://localhost:3000
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

## プロジェクト構成

```
KumoCode/
├── articles/              # マークダウン記事
│   ├── getting-started-with-react.md
│   ├── typescript-best-practices.md
│   └── docker-basics.md
├── css/
│   └── style.css         # スタイルシート
├── js/
│   └── app.js            # フロントエンドロジック
├── index.html            # メインHTML
├── server.js             # Expressサーバー
├── package.json          # 依存関係
└── README.md             # このファイル
```

## API エンドポイント

### GET `/api/articles`
記事の一覧を取得

**レスポンス:**
```json
[
  {
    "filename": "example.md",
    "title": "記事タイトル",
    "modifiedDate": "2025-11-15T12:00:00.000Z"
  }
]
```

### GET `/api/articles/:filename`
特定の記事の内容を取得

**レスポンス:**
```json
{
  "filename": "example.md",
  "title": "記事タイトル",
  "content": "# マークダウン本文...",
  "modifiedDate": "2025-11-15T12:00:00.000Z"
}
```

## カスタマイズ

### カラーテーマの変更
`css/style.css` の `:root` セクションでカスタムプロパティを変更できます：

```css
:root {
  --primary-color: #3ea8ff;
  --bg-color: #f8f9fa;
  --text-primary: #1a1a1a;
  /* ... */
}
```

### 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成し、設定をカスタマイズできます：

```bash
cp .env.example .env
```

`.env` ファイルの設定例：

```env
# サーバーポート番号
PORT=8080

# 記事ディレクトリのパス（オプション）
ARTICLES_DIR=/path/to/your/articles
```

または、コマンドラインで直接指定：

```bash
PORT=8080 npm start
```

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

## 謝辞

- [Marked.js](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
- [KaTeX](https://katex.org/)
