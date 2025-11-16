# サンプル記事とデモ

このディレクトリには、KumoCodeの機能を実際に体験できるサンプル記事が含まれています。

## 📚 サンプル記事一覧

### [getting-started.md](getting-started.md)
KumoCodeの基本的な使い方を説明するチュートリアル記事です。

**学べること:**
- フロントマターの設定
- 基本的なMarkdown記法
- 見出しとリストの使い方

### [advanced-features.md](advanced-features.md)
KumoCodeの高度な機能を紹介する記事です。

**学べること:**
- 数式の記述方法（KaTeX）
- シンタックスハイライト
- テーブルと引用
- リンクと画像の埋め込み

## 🚀 サンプル記事の使い方

### 1. サンプル記事を確認する

このディレクトリ内の`.md`ファイルを直接開いて、Markdown記法を確認できます。

### 2. articlesフォルダにコピーする

サンプル記事を実際に表示させるには、`articles/`フォルダにコピーします：

```bash
# すべてのサンプル記事をコピー
cp examples/*.md articles/

# 特定のサンプル記事のみコピー
cp examples/getting-started.md articles/
```

### 3. 開発サーバーで確認する

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスして、サンプル記事を確認できます。

## 📝 自分の記事を作成する

サンプル記事をテンプレートとして使用して、独自の記事を作成できます：

```bash
# サンプル記事をテンプレートとしてコピー
cp examples/getting-started.md articles/my-first-article.md

# お好みのエディタで編集
code articles/my-first-article.md
```

## 🎨 カスタマイズ例

### フロントマターのカスタマイズ

```yaml
---
title: 私の最初の記事
date: 2025-11-16
tags: [Tutorial, Beginner, Custom]
---
```

### スタイルのカスタマイズ

サンプル記事で使用されている要素をカスタマイズする方法は、[テーマガイド](../docs/THEMES.md)を参照してください。

## 🔗 関連リンク

- [メインREADME](../README.md) - プロジェクト概要
- [使用方法](../docs/USAGE.md) - 詳細な使い方
- [インストールガイド](../docs/INSTALLATION.md) - セットアップ手順

## 💡 ヒント

1. **サンプル記事は編集しない**: `examples/`内のファイルは参考用です。編集する場合は`articles/`にコピーしてください。
2. **実験用に使う**: 新しいMarkdown記法や機能を試す際は、サンプル記事をコピーして実験してください。
3. **テンプレートとして活用**: 記事の構造が決まっている場合は、サンプル記事をテンプレートとして再利用できます。
