---
title: React入門 - モダンなWebアプリケーション開発
date: 2025-11-10
tags:
  - React
  - JavaScript
  - Frontend
author:
  name: Maki Sunwood
  github: Sunwood-ai-labs
  twitter: hAru_mAki_ch
---

# React入門 - モダンなWebアプリケーション開発

Reactは、Facebookが開発したユーザーインターフェースを構築するためのJavaScriptライブラリです。コンポーネントベースのアーキテクチャにより、再利用可能で保守性の高いコードを書くことができます。

## Reactとは？

Reactは以下の特徴を持っています：

- **コンポーネントベース**: UIを独立した再利用可能な部品として構築
- **宣言的**: UIの状態を宣言的に記述することで、コードの可読性が向上
- **仮想DOM**: 効率的なレンダリングを実現
- **豊富なエコシステム**: React Router、Redux、Next.jsなど多数のライブラリ

## はじめてのReactコンポーネント

最もシンプルなReactコンポーネントは以下のようになります：

```jsx
import React from 'react';

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

export default Welcome;
```

このコンポーネントは、`name`プロパティを受け取り、挨拶メッセージを表示します。

## フック（Hooks）を使った状態管理

React 16.8から導入されたフックにより、関数コンポーネントでも状態管理が可能になりました：

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>現在のカウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        クリック
      </button>
    </div>
  );
}
```

### よく使用されるフック

| フック名 | 用途 |
|---------|------|
| `useState` | コンポーネントの状態管理 |
| `useEffect` | 副作用の処理（API呼び出しなど） |
| `useContext` | コンテキストの値へのアクセス |
| `useRef` | DOM要素への参照 |

## useEffectによる副作用の処理

`useEffect`フックを使うと、データの取得やDOM操作などの副作用を扱えます：

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`)
      .then(response => response.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) return <div>読み込み中...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## パフォーマンス最適化

Reactアプリケーションのパフォーマンスを最適化するテクニック：

1. **React.memo**: コンポーネントのメモ化
2. **useMemo**: 値の計算結果をキャッシュ
3. **useCallback**: 関数をメモ化
4. **コード分割**: `React.lazy`と`Suspense`を使用

```jsx
import React, { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => /* 重い処理 */ item);
  }, [data]);

  return <div>{/* レンダリング */}</div>;
}
```

## まとめ

Reactは強力で柔軟なライブラリです。基本的な概念を理解することで、複雑なWebアプリケーションを効率的に開発できるようになります。

次のステップとして、以下のトピックを学習することをおすすめします：

- React Router によるルーティング
- 状態管理ライブラリ（Redux、Zustand）
- Next.js によるサーバーサイドレンダリング

> **参考リンク**
> - [React公式ドキュメント](https://react.dev/)
> - [React Hooks API Reference](https://react.dev/reference/react)
