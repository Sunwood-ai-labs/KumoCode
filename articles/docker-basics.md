---
title: Docker基礎 - コンテナ技術入門
date: 2025-11-08
tags: [Docker, DevOps, Container]
---

# Docker基礎 - コンテナ技術入門

Dockerは、アプリケーションをコンテナとしてパッケージ化し、どの環境でも同じように実行できるようにするプラットフォームです。

## Dockerとは？

Dockerを使うことで、開発環境と本番環境の差異をなくし、「私の環境では動くのに」問題を解決できます。

### 主な概念

- **イメージ**: アプリケーションとその依存関係をパッケージ化したもの
- **コンテナ**: イメージから作成された実行可能なインスタンス
- **Dockerfile**: イメージを構築するための設計図
- **Docker Hub**: イメージの公開リポジトリ

## Dockerfileの書き方

基本的なDockerfileの例：

```dockerfile
# ベースイメージ
FROM node:18-alpine

# 作業ディレクトリの設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm ci --only=production

# アプリケーションのソースコードをコピー
COPY . .

# ポートの公開
EXPOSE 3000

# アプリケーションの起動
CMD ["npm", "start"]
```

## マルチステージビルド

本番用イメージのサイズを小さくするテクニック：

```dockerfile
# ビルドステージ
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 実行ステージ
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Docker Composeの活用

複数のコンテナを管理するための`docker-compose.yml`：

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/myapp
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## よく使うDockerコマンド

```bash
# イメージのビルド
docker build -t myapp:latest .

# コンテナの起動
docker run -d -p 3000:3000 --name myapp myapp:latest

# 実行中のコンテナの確認
docker ps

# コンテナのログ確認
docker logs myapp

# コンテナに入る
docker exec -it myapp sh

# コンテナの停止
docker stop myapp

# コンテナの削除
docker rm myapp

# イメージの削除
docker rmi myapp:latest

# Docker Composeでサービスを起動
docker-compose up -d

# Docker Composeでサービスを停止
docker-compose down
```

## ベストプラクティス

### 1. レイヤーを最適化する

変更頻度の低いコマンドを先に実行：

```dockerfile
# ✅ Good
COPY package*.json ./
RUN npm install
COPY . .

# ❌ Bad
COPY . .
RUN npm install
```

### 2. .dockerignoreを活用する

不要なファイルをイメージに含めない：

```
node_modules
npm-debug.log
.git
.gitignore
.env
*.md
```

### 3. 軽量なベースイメージを使用する

```dockerfile
# ✅ Alpine版を使用（サイズが小さい）
FROM node:18-alpine

# ❌ 通常版（サイズが大きい）
FROM node:18
```

### 4. セキュリティ対策

```dockerfile
# 非rootユーザーで実行
FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

WORKDIR /app
COPY --chown=nodejs:nodejs . .

CMD ["node", "index.js"]
```

## イメージサイズの比較

| ベースイメージ | サイズ |
|--------------|--------|
| node:18 | ~900 MB |
| node:18-slim | ~200 MB |
| node:18-alpine | ~170 MB |

## トラブルシューティング

### コンテナが起動しない

```bash
# ログを確認
docker logs <container_id>

# コンテナ内に入って調査
docker exec -it <container_id> sh
```

### ボリュームのデータが消えた

```bash
# 名前付きボリュームを使用
docker volume create mydata
docker run -v mydata:/data myapp

# ボリュームの一覧
docker volume ls
```

### ネットワークの問題

```bash
# ネットワークの作成
docker network create mynetwork

# ネットワークに接続してコンテナを起動
docker run --network mynetwork myapp
```

## まとめ

Dockerは現代の開発に欠かせないツールです。基本をしっかり理解し、ベストプラクティスに従うことで、効率的な開発環境を構築できます。

次のステップ：
- Kubernetesでのオーケストレーション
- CI/CDパイプラインへの統合
- セキュリティスキャンの導入
