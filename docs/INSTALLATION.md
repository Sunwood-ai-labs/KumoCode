# インストールガイド

## 前提条件

- **Node.js**: 18.0.0 以上
- **npm**: 9.0.0 以上（Node.jsに付属）
- **Git**: バージョン管理用

## ローカル開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/Sunwood-ai-labs/KumoCode.git
cd KumoCode
```

### 2. 依存関係のインストール

```bash
npm install
```

これにより、以下の主要なパッケージがインストールされます：
- Next.js 14.2.0
- React 18.3.0
- react-markdown
- gray-matter
- KaTeX
- その他の依存パッケージ

### 3. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成します：

```bash
cp .env.example .env
```

`.env`ファイルを編集して、必要な設定を行います：

```env
# デフォルトテーマ（ocean, default, sunset, cyberpunk から選択）
NEXT_PUBLIC_DEFAULT_THEME=ocean

# 開発サーバーのポート（オプション、デフォルトは3000）
PORT=3000
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスして、KumoCodeが正常に動作していることを確認します。

## プロダクション環境のビルド

### 1. ビルドの実行

```bash
npm run build
```

このコマンドは以下を実行します：
- TypeScriptのコンパイル
- 最適化されたプロダクションビルドの作成
- 静的ファイルの生成

### 2. ビルドの確認

```bash
npm start
```

ブラウザで http://localhost:3000 にアクセスして、プロダクションビルドが正常に動作していることを確認します。

## トラブルシューティング

### Node.jsのバージョンが古い

```bash
# Node.jsのバージョンを確認
node --version

# nvmを使用してNode.jsをアップグレード（推奨）
nvm install 18
nvm use 18
```

### 依存関係のインストールエラー

```bash
# node_modulesとpackage-lock.jsonを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ポート3000が既に使用されている

`.env`ファイルで別のポートを指定するか、既存のプロセスを終了します：

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 次のステップ

- [使用方法](USAGE.md) - 記事の作成とカスタマイズ方法
- [テーマ](THEMES.md) - カスタムテーマの作成方法
- [アーキテクチャ](ARCHITECTURE.md) - システム設計の詳細
