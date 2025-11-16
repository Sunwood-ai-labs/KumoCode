---
title: TypeScript ベストプラクティス 2025
date: 2025-11-12
tags: [TypeScript, JavaScript, Best Practices]
---

# TypeScript ベストプラクティス 2025

TypeScriptは、JavaScriptに静的型付けを追加したスーパーセットです。適切に使用することで、バグを減らし、コードの保守性を大幅に向上させることができます。

## 型定義の基本

### プリミティブ型

TypeScriptの基本的な型：

```typescript
// 基本型
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
let items: string[] = ["item1", "item2"];
let tuple: [string, number] = ["age", 30];

// any は避ける
let data: any; // ❌ 避けるべき
let data: unknown; // ✅ unknownを使用
```

### インターフェースと型エイリアス

インターフェースと型エイリアスの使い分け：

```typescript
// インターフェース: オブジェクトの形状を定義
interface User {
  id: number;
  name: string;
  email: string;
}

// 型エイリアス: より柔軟な型定義
type Status = "active" | "inactive" | "pending";
type UserWithStatus = User & { status: Status };
```

## ジェネリクス

再利用可能な型安全なコードを書くためのジェネリクス：

```typescript
// 基本的なジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

// ジェネリック制約
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 複数の型パラメータ
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
```

## ユーティリティ型

TypeScriptの組み込みユーティリティ型を活用しましょう：

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial: すべてのプロパティをオプショナルに
type PartialUser = Partial<User>;

// Pick: 特定のプロパティのみを選択
type UserPreview = Pick<User, "id" | "name">;

// Omit: 特定のプロパティを除外
type UserWithoutEmail = Omit<User, "email">;

// Readonly: すべてのプロパティを読み取り専用に
type ReadonlyUser = Readonly<User>;

// Record: キーと値の型を指定
type UserRoles = Record<string, string[]>;
```

## 型ガード

型の絞り込みを行うための型ガード：

```typescript
// typeof型ガード
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// instanceof型ガード
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// カスタム型ガード
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## 非同期処理の型付け

Promiseと非同期関数の型定義：

```typescript
// Promise の型付け
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// エラーハンドリング
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safelyFetchUser(id: number): Promise<Result<User>> {
  try {
    const user = await fetchUser(id);
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}
```

## 列挙型（Enum）の使用

列挙型は定数のグループを定義するのに便利です：

```typescript
// 数値列挙型
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

// 文字列列挙型（推奨）
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING"
}

// const enum（パフォーマンス向上）
const enum LogLevel {
  Error = "ERROR",
  Warning = "WARNING",
  Info = "INFO"
}
```

## ベストプラクティス まとめ

1. **strictモードを有効にする**: `tsconfig.json`で`"strict": true`を設定
2. **anyを避ける**: `unknown`や適切な型を使用
3. **型推論を活用する**: 明示的な型注釈が不要な場合は省略
4. **ユニオン型を活用する**: 柔軟で型安全なコードを実現
5. **nullチェックを徹底**: `strictNullChecks`を有効化
6. **ジェネリクスで再利用性を高める**: 型安全な汎用コードを書く

## 数式の例

TypeScriptでの計算量の表現例：

- **時間計算量**: $O(n \log n)$
- **空間計算量**: $O(n)$

より複雑な数式:

$$
f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi) e^{2\pi i \xi x} d\xi
$$

## まとめ

TypeScriptを効果的に使用することで、開発体験と製品の品質を大幅に向上させることができます。継続的に学習し、ベストプラクティスを取り入れていきましょう。
