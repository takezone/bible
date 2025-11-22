# 聖書アプリ

パブリックドメインの日本語聖書(口語訳)と英語聖書(KJV)を対訳で読める、検索可能な Web アプリケーションです。

## 主な機能

- **全文検索**: 日本語・英語の聖書全体から語句を検索
- **対訳表示**: 口語訳聖書と King James Version を並べて表示
- **章単位の閲覧**: 書と章を選択して快適に読書
- **URL共有**: 特定の章へのリンクを簡単に共有
- **閲覧履歴**: localStorage に最近読んだ章を自動保存

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データ**: JSON 静的ファイル (SQLite からの変換)
- **検索**: クライアントサイド全文検索
- **デプロイ**: Vercel (推奨)

## データソース

- **口語訳聖書**: 1954-1955年版 (パブリックドメイン)
- **King James Version**: 1611年版 (パブリックドメイン)

## セットアップ

### 前提条件

- Node.js 18.17 以上

### インストール

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

### ビルド

```bash
npm run build
npm start
```

## Vercel へのデプロイ

### 方法1: Vercel CLI を使う

```bash
# Vercel CLI のインストール
npm i -g vercel

# bible-app ディレクトリに移動
cd bible-app

# デプロイ
vercel
```

### 方法2: GitHub 連携

1. このプロジェクトを GitHub にプッシュ
2. [Vercel](https://vercel.com) にログイン
3. "New Project" → GitHub リポジトリを選択
4. "Deploy" をクリック (設定は自動検出)

### 環境変数

特に必要な環境変数はありません。すべて静的データで動作します。

## ライセンス

### コード

MIT License

### 聖書テキスト

- 口語訳聖書: パブリックドメイン (著作権満了)
- King James Version: パブリックドメイン

## クレジット

- 口語訳聖書データ: [yuki-kimoto/biblesearch](https://github.com/yuki-kimoto/biblesearch)
- KJV データ: [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv)
