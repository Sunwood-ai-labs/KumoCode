# テーマ作成ガイド

## テーマの概要

KumoCodeのテーマは、JSONファイルで定義されています。各テーマには、ライトモードとダークモードの両方の設定が含まれています。

## テーマファイルの構造

テーマファイルは `themes/` ディレクトリに配置されます。例: `themes/my-theme.json`

### 基本的なテーマファイル

```json
{
  "name": "My Custom Theme",
  "version": "1.0.0",
  "description": "カスタムテーマの説明",
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

## テーマのプロパティ

### メタデータ

- **name**: テーマの表示名
- **version**: テーマのバージョン（SemVer形式）
- **description**: テーマの説明

### フォント

```json
"fonts": {
  "primary": "メインフォント（本文、見出しなど）",
  "code": "コードブロック用のフォント"
}
```

推奨されるフォント：
- **Primary**: Inter, Roboto, Open Sans, Noto Sans JP
- **Code**: Fira Code, Source Code Pro, JetBrains Mono, Consolas

### シンタックスハイライトテーマ

```json
"highlight_themes": {
  "light": "ライトモード用のHighlight.js CSSファイルURL",
  "dark": "ダークモード用のHighlight.js CSSファイルURL"
}
```

利用可能なHighlight.jsテーマ：
- **Light**: github, stackoverflow-light, atom-one-light
- **Dark**: nord, monokai, atom-one-dark, vs2015

### カラーパレット

#### Colors

| プロパティ | 説明 | 使用箇所 |
|----------|------|---------|
| primary | プライマリーカラー | ボタン、リンクなど |
| accent | アクセントカラー | ホバー状態など |
| background | 背景色 | ページ全体の背景 |
| surface | サーフェスカラー | カード、パネルの背景 |
| text_primary | 主要テキストカラー | 見出し、本文 |
| text_secondary | 二次テキストカラー | サブテキスト |
| text_muted | 控えめなテキストカラー | メタ情報など |
| border | ボーダーカラー | カード、パネルの枠線 |
| code_bg | コードブロックの背景色 | コードブロック |
| link | リンクカラー | 通常状態のリンク |
| link_hover | リンクホバーカラー | ホバー状態のリンク |
| header_text | ヘッダーテキストカラー | ヘッダー内のテキスト |

#### Gradients

```json
"gradients": {
  "header": "ヘッダーのグラデーション",
  "card_hover": "カードホバー時のグラデーション"
}
```

CSS linear-gradient形式で指定します。

#### Backgrounds

```json
"backgrounds": {
  "header_image": "ヘッダー背景画像のURL（オプション）",
  "body_image": "ボディ背景画像のURL（オプション）",
  "card_image": "カード背景画像のURL（オプション）"
}
```

### スタイル

```json
"styles": {
  "border_radius": "角丸の半径（例: 8px）",
  "card_shadow": "カードの影（CSS box-shadow形式）",
  "header_height": "ヘッダーの高さ（例: 80px）",
  "backdrop_blur": "背景のぼかし効果（例: 10px）"
}
```

## カスタムテーマの作成手順

### 1. 既存のテーマをコピー

```bash
cp themes/ocean.json themes/my-theme.json
```

### 2. テーマファイルを編集

お好みのテキストエディタで `themes/my-theme.json` を開き、カラーやフォントを変更します。

### 3. テーマのテスト

開発サーバーを起動して、テーマの見た目を確認します：

```bash
npm run dev
```

### 4. デフォルトテーマに設定（オプション）

`.env`ファイルで新しいテーマをデフォルトに設定：

```env
NEXT_PUBLIC_DEFAULT_THEME=my-theme
```

## カラーパレットの選び方

### コントラスト比

アクセシビリティのため、テキストと背景のコントラスト比は以下を推奨します：
- **通常テキスト**: 4.5:1以上
- **大きなテキスト**: 3:1以上

### カラーハーモニー

- **モノクロマティック**: 同じ色相の異なる明度・彩度
- **アナロガス**: 色相環で隣接する色
- **コンプリメンタリー**: 色相環で反対側の色

### 推奨ツール

- [Coolors](https://coolors.co/) - カラーパレットジェネレーター
- [Adobe Color](https://color.adobe.com/) - カラーホイールとハーモニー
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - コントラスト比チェック

## 既存のテーマ

KumoCodeには以下のテーマが付属しています：

### Ocean
青を基調とした爽やかなテーマ。デフォルトテーマとして推奨。

### Default
シンプルで使いやすいベーシックなテーマ。

### Sunset
オレンジとピンクを基調とした温かみのあるテーマ。

### Cyberpunk
ネオンカラーを使用した近未来的なテーマ。

## トラブルシューティング

### テーマが反映されない

1. JSONファイルの構文エラーを確認（JSONバリデーターを使用）
2. ブラウザのキャッシュをクリア
3. 開発サーバーを再起動

### 色がおかしい

1. カラーコードの形式を確認（#RRGGBB形式）
2. light/darkの両方のモードで確認
3. コントラスト比を確認

## 次のステップ

- [アーキテクチャ](ARCHITECTURE.md) - テーマシステムの内部構造
- [使用方法](USAGE.md) - テーマの使い方
