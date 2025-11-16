---
title: Mermaidダイアグラムのデモ
date: 2025-11-16
tags: [Mermaid, Diagram, Visualization]
---

## はじめに

Mermaidは、シンプルなマークダウン構文を使ってダイアグラムやチャートを描画できる強力なJavaScriptベースのツールです。プログラマーやテクニカルライターが、複雑な図表を簡単に作成し、ドキュメントに直接埋め込むことができます。

このデモでは、Mermaidでサポートされている主要なダイアグラムタイプを紹介します。各タイプは実務的な例を通じて説明されています。

---

## 1. フローチャート (Flowchart)

フローチャートは、プロセスやアルゴリズムの流れを可視化するのに最適です。以下は、ユーザーログインプロセスの例です。

```mermaid
flowchart TD
    A[ログインページを表示] --> B{ユーザー情報を入力}
    B -->|入力完了| C[入力値を検証]
    C -->|有効| D{データベース照合}
    D -->|一致| E[セッションを作成]
    E --> F[ダッシュボードへリダイレクト]
    D -->|不一致| G[エラーメッセージを表示]
    G --> B
    C -->|無効| H[バリデーションエラーを表示]
    H --> B
    F --> I[ログイン完了]
    I --> J[ユーザーセッション開始]
```

このフローチャートは以下のステップを示しています：
- ユーザー情報の入力
- 入力値のバリデーション
- データベースでの認証確認
- 成功時のセッション作成
- エラーハンドリング

---

## 2. シーケンス図 (Sequence Diagram)

シーケンス図は、複数のシステム間の相互作用と通信の流れを時系列で表示します。以下は、一般的なWebアプリケーションの通信例です。

```mermaid
sequenceDiagram
    actor ユーザー
    participant ブラウザ
    participant Webサーバー
    participant データベース

    ユーザー->>ブラウザ: ログインボタンをクリック
    ブラウザ->>Webサーバー: POST /login (ユーザー名, パスワード)
    Webサーバー->>Webサーバー: パスワードをハッシュ化
    Webサーバー->>データベース: SELECT * FROM users WHERE username=?
    データベース->>データベース: 認証情報を検索
    データベース->>Webサーバー: ユーザーレコードを返却
    Webサーバー->>Webサーバー: パスワード検証
    alt 認証成功
        Webサーバー->>Webサーバー: セッショントークン生成
        Webサーバー->>ブラウザ: 200 OK + セッションCookie
        ブラウザ->>ユーザー: ダッシュボードを表示
    else 認証失敗
        Webサーバー->>ブラウザ: 401 Unauthorized
        ブラウザ->>ユーザー: エラーメッセージを表示
    end
```

このシーケンス図では以下が示されています：
- ユーザーアクションから始まる通信フロー
- 複数のシステムコンポーネント間の相互作用
- 成功と失敗の両方のパスを含む条件分岐

---

## 3. クラス図 (Class Diagram)

クラス図は、オブジェクト指向システムの構造を表現します。以下は、ブログ記事管理システムの例です。

```mermaid
classDiagram
    class Article {
        -int id
        -string title
        -string content
        -datetime createdAt
        -datetime updatedAt
        -string status
        +publish()
        +archive()
        +getAuthor()
    }

    class Author {
        -int id
        -string name
        -string email
        -string bio
        +createArticle()
        +getArticles()
        +updateProfile()
    }

    class Tag {
        -int id
        -string name
        -string description
        +getArticles()
        +updateDescription()
    }

    class Comment {
        -int id
        -string content
        -datetime createdAt
        -int articleId
        +delete()
        +update()
    }

    Article "*" --> "1" Author : written by
    Article "*" --> "*" Tag : tagged with
    Article "1" <-- "*" Comment : has
```

このクラス図は以下を示しています：
- Articleクラスの主要なプロパティとメソッド
- Authorとの1対多の関係
- Tagとの多対多の関係
- Commentとの1対多の関係

---

## 4. ガントチャート (Gantt Chart)

ガントチャートは、プロジェクトのスケジュールと進捗を可視化するのに役立ちます。以下は、ブログプラットフォーム開発プロジェクトの例です。

```mermaid
gantt
    title ブログプラットフォーム開発スケジュール
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section バックエンド
    ユーザー認証システム構築 :a1, 2025-11-16, 10d
    データベース設計 :a2, 2025-11-16, 15d
    API開発 :a3, after a1, 20d

    section フロントエンド
    UIコンポーネント設計 :b1, 2025-11-20, 12d
    ページレイアウト実装 :b2, after b1, 18d
    機能実装 :b3, after b2, 20d

    section テスト・デプロイ
    ユニットテスト :c1, after a3, 10d
    統合テスト :c2, after c1, 8d
    ステージング環境デプロイ :c3, after c2, 3d
    本番環境リリース :c4, after c3, 1d
```

このガントチャートは以下を表示しています：
- バックエンド、フロントエンド、テスト・デプロイのタイムライン
- タスク間の依存関係
- 全体的なプロジェクト期間

---

## 5. 状態遷移図 (State Diagram)

状態遷移図は、システムの状態の変化を表現します。以下は、ブログ記事のライフサイクルの例です。

```mermaid
stateDiagram-v2
    [*] --> ドラフト: 新規作成

    ドラフト --> レビュー: 送信
    ドラフト --> [*]: キャンセル

    レビュー --> 下書き: 却下
    レビュー --> 公開: 承認

    下書き --> レビュー: 再送信
    下書き --> [*]: キャンセル

    公開 --> アーカイブ: アーカイブ
    公開 --> ドラフト: 編集

    アーカイブ --> 公開: 復元
    アーカイブ --> [*]: 削除
```

このステート図は以下を示しています：
- 記事の状態：ドラフト、レビュー、公開、アーカイブ
- 状態間の遷移とトリガーアクション
- キャンセルと削除の終了パス

---

## 6. 円グラフ (Pie Chart)

円グラフは、全体に対する部分の割合を視覚的に表示します。以下は、技術スタックの構成比率を示しています。

```mermaid
pie title 開発プロジェクトの技術スタック構成
    "JavaScript/TypeScript" : 30
    "Python" : 20
    "Java" : 15
    "SQL" : 15
    "その他" : 20
```

このパイチャートは以下を示しています：
- JavaScriptとTypeScriptが全体の30%を占める
- バックエンド言語（Python、Java）の割合
- データベース技術（SQL）の比率
- 合計で100%となる構成

---

## 使い方 (How to Use)

### マークダウン構文

Mermaidダイアグラムをマークダウンファイルに埋め込むには、以下の構文を使用します：

```markdown
\`\`\`mermaid
[Mermaidコードをここに記述]
\`\`\`
```

### 基本要素

**フローチャート**の基本要素：
- `flowchart TD` - トップダウンの方向を指定
- `A[テキスト]` - 矩形ノード
- `A --> B` - 接続矢印

**シーケンス図**の基本要素：
- `participant 名前` - 参加者を定義
- `A->>B: メッセージ` - 実線の矢印メッセージ
- `alt ... else ... end` - 条件分岐

**クラス図**の基本要素：
- `class ClassName { プロパティ メソッド }` - クラス定義
- `A --> B` - 関係を定義

**ガントチャート**の基本要素：
- `task_id : label, date1, duration` - タスク定義
- `after task_id` - 依存関係を指定

**状態図**の基本要素：
- `[*]` - 開始/終了状態
- `state_a --> state_b` - 状態遷移

**円グラフ**の基本要素：
- `"ラベル" : 値` - データポイント

---

## まとめ

Mermaidは、テクニカルドキュメンテーションに強力な視覚的表現をもたらします。本デモで紹介した6つのダイアグラムタイプを組み合わせることで、複雑なシステムやプロセスを効果的に説明できます。

### Mermaidを使用する利点：

1. **シンプルな構文** - プログラマーにとって習得が簡単
2. **バージョン管理** - ダイアグラムもコードとして管理可能
3. **動的生成** - プログラムから動的にダイアグラムを生成可能
4. **広範なサポート** - 多くのドキュメンテーションツールとの統合

これらの機能を活用することで、より質の高い技術ドキュメントを作成できます。プロジェクトに応じて適切なダイアグラムタイプを選択し、Mermaidの能力を最大限に活用しましょう。

---

**関連リソース：**
- [Mermaid公式ドキュメント](https://mermaid.js.org/)
- [Mermaidの対応ダイアグラムタイプ](https://mermaid.js.org/intro/)
- [Mermaidのシンタックスハイライト設定](https://mermaid.js.org/syntax/configuration.html)
