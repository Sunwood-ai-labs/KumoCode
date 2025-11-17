---
title: フロントマターリンク機能のデモ
date: 2025-11-17
tags: [Demo, Tutorial, Features]
colabUrl: https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/quickstart/beginner.ipynb
demoUrl: https://huggingface.co/spaces/stabilityai/stable-diffusion
repoUrl: https://github.com/Sunwood-ai-labs/KumoCode
---

# フロントマターリンク機能のデモ

このページは、KumoCodeの新機能である**フロントマターリンク**のデモンストレーションです。記事のフロントマターにGoogle Colab、デモアプリ、GitHubリポジトリのリンクを設定すると、目次の下に美しいカードとして表示されます。

## 機能概要

この記事のフロントマターには、以下の3つのリンクが設定されています：

1. **Google Colab** - Jupyter Notebookを実行できるリンク
2. **デモアプリ** - 実際に動作するアプリケーションのリンク
3. **リポジトリ** - ソースコードが公開されているGitHubリポジトリのリンク

## 使い方

記事のフロントマターに以下のように記述するだけです：

```yaml
---
title: 記事のタイトル
date: 2025-11-17
tags: [Tag1, Tag2]
colabUrl: https://colab.research.google.com/...
demoUrl: https://huggingface.co/spaces/...
repoUrl: https://github.com/username/repo
---
```

### 設定可能なフィールド

| フィールド | 説明 | 例 |
|----------|------|-----|
| `colabUrl` | Google Colabのノートブックリンク | TensorFlow、PyTorchのチュートリアル |
| `demoUrl` | デモアプリケーションのリンク | Hugging Face Spaces、Streamlitアプリ |
| `repoUrl` | GitHubリポジトリのリンク | プロジェクトのソースコード |

## 特徴

### 🎨 美しいデザイン

各リンクは、専用のアイコンと色でデザインされています：

- **Google Colab**: オレンジ色のグラデーション
- **デモアプリ**: ブルー色のグラデーション
- **リポジトリ**: グリーン色のグラデーション

### ⚡ インタラクティブ

カードにホバーすると、以下のアニメーションが発生します：

1. カード全体が少し浮き上がる
2. アイコンが拡大される
3. 矢印が右に移動する
4. 上部のボーダーがスライドインする

### 📱 レスポンシブ対応

モバイルデバイスでも美しく表示されます。画面幅に応じて自動的にレイアウトが調整されます。

## 実装例

### 機械学習プロジェクト

```yaml
---
title: 画像分類モデルの実装
date: 2025-11-17
tags: [Machine Learning, Deep Learning, PyTorch]
colabUrl: https://colab.research.google.com/github/pytorch/tutorials/blob/gh-pages/_downloads/cifar10_tutorial.ipynb
demoUrl: https://huggingface.co/spaces/pytorch/ResNet
repoUrl: https://github.com/pytorch/vision
---
```

### Webアプリケーション

```yaml
---
title: Next.jsで作るブログシステム
date: 2025-11-17
tags: [Next.js, React, Web Development]
demoUrl: https://nextjs-blog-demo.vercel.app
repoUrl: https://github.com/vercel/next.js/tree/canary/examples/blog
---
```

### データ分析プロジェクト

```yaml
---
title: Pandasによるデータ分析
date: 2025-11-17
tags: [Python, Data Analysis, Pandas]
colabUrl: https://colab.research.google.com/notebooks/mlcc/intro_to_pandas.ipynb
repoUrl: https://github.com/pandas-dev/pandas
---
```

## ベストプラクティス

### リンクの選択

- **Colab**: 実行可能なコードを提供する場合に使用
- **Demo**: ユーザーが実際に試せるアプリケーションがある場合に使用
- **Repo**: ソースコードを公開している場合に使用

### すべてのリンクは必須ではありません

必要なリンクのみを設定してください。設定されていないリンクは表示されません。

例えば、デモアプリのみの場合：

```yaml
---
title: シンプルなデモ
date: 2025-11-17
tags: [Demo]
demoUrl: https://example.com/demo
---
```

## コードの詳細

### フロントマターの処理

KumoCodeは、`gray-matter`を使用してフロントマターを解析します。以下のフィールドが自動的に抽出されます：

```typescript
export interface Article {
  slug: string
  title: string
  date: string
  tags: string[]
  colabUrl?: string
  demoUrl?: string
  repoUrl?: string
  content: string
}
```

### レンダリング

`FrontmatterLinks`コンポーネントがこれらのリンクを受け取り、カードとして表示します。

## まとめ

フロントマターリンク機能を使うことで、記事に関連するリソースを読者に簡単に提供できます。以下の利点があります：

- ✅ コードを試せる（Google Colab）
- ✅ デモを体験できる（デモアプリ）
- ✅ ソースコードを確認できる（リポジトリ）

この機能を活用して、より充実した技術記事を作成しましょう！

## 関連記事

- [KumoCode v0.1.0 リリースノート](20251117-kumocode-0-1-0-release.md)
- [KumoCodeを始めよう](../examples/getting-started.md)
- [高度な機能](../examples/advanced-features.md)
