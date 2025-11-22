# 聖書アプリ

パブリックドメインの日本語聖書(口語訳)と英語聖書(KJV)を対訳で読める、検索可能な Web アプリケーションです。

## 主な機能

- **全文検索**: 日本語・英語の聖書全体から語句を検索
- **多言語対応**: 口語訳、KJV、WEBの3つの翻訳に対応
- **柔軟な表示モード**:
  - 単体表示: 1つの翻訳を大きく表示
  - 並列表示: 2つの翻訳を左右に並べて表示
- **フォントサイズ調整**: 小・中・大の3段階で文字サイズを変更可能
- **章単位の閲覧**: 書と章を選択して快適に読書
- **URL共有**: 特定の章へのリンクを簡単に共有
- **閲覧履歴**: localStorage に最近読んだ章を自動保存
- **レスポンシブデザイン**: スマホでも快適に閲覧可能

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データ**: JSON 静的ファイル
- **検索**: クライアントサイド全文検索
- **デプロイ**: Vercel (推奨)

## データソース

- **口語訳聖書**: 1954-1955年版 (パブリックドメイン)
- **King James Version (KJV)**: 1611年版 (パブリックドメイン)
- **World English Bible (WEB)**: 現代英語訳 (パブリックドメイン)

## プロジェクト構成

```
bible/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ (検索・閲覧UI)
│   ├── layout.tsx         # ルートレイアウト
│   ├── globals.css        # グローバルスタイル
│   └── [bookId]/          # 動的ルーティング (将来の拡張用)
├── components/            # Reactコンポーネント
│   ├── BookSelector.tsx   # 書・章選択UI
│   ├── ChapterViewer.tsx  # 章の表示コンポーネント
│   ├── SearchBar.tsx      # 検索バー
│   ├── SearchResults.tsx  # 検索結果表示
│   └── Credits.tsx        # クレジット表示
├── lib/                   # ユーティリティ
│   └── bible-data.ts      # 聖書データ読み込み・検索ロジック
├── types/                 # TypeScript型定義
│   └── bible.ts           # 聖書データの型定義
├── data/                  # 聖書データ (JSON)
│   ├── bible-kougo.json   # 口語訳聖書 (REQUIRED)
│   ├── bible-kjv.json     # King James Version (REQUIRED)
│   ├── bible-web.json     # World English Bible (REQUIRED)
│   └── book-order.json    # 書物の正規順序 (REQUIRED - 絶対に削除しないこと!)
├── public/                # 静的ファイル
│   └── biblemap.pdf       # 聖書地図 (32MB, Git管理外)
├── scripts/               # データ変換スクリプト
└── temp-*/                # 一時ファイル (Git管理外)
```

### 主要なコンポーネント

- **BibleApp** (`app/page.tsx`): メインアプリケーション。検索、閲覧、履歴管理を統合
- **ChapterViewer**: 章の表示。単体/並列表示、フォントサイズ調整機能
- **BookSelector**: 66書の選択と章選択UI
- **SearchBar / SearchResults**: 全文検索機能
- **Credits**: データソースのクレジット表示

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

### 重要なデータファイル

以下のファイルはアプリの動作に**必須**です。絶対に削除しないでください:

- `data/bible-kougo.json`: 口語訳聖書データ
- `data/bible-kjv.json`: KJV聖書データ
- `data/bible-web.json`: WEB聖書データ
- `data/book-order.json`: 聖書66書の正規順序データ（章移動機能で使用）

これらのファイルは `.gitignore` で明示的に保護されています。

### 大きなファイルについて

`public/biblemap.pdf` (32MB) など大きなファイルは `.gitignore` で除外されています。
必要に応じて以下からダウンロードしてください:

- 聖書地図データは別途パブリックドメインのソースから取得可能です

## ライセンス

### コード

MIT License

### 聖書テキスト

- 口語訳聖書: パブリックドメイン (著作権満了)
- King James Version: パブリックドメイン

## クレジット

- 口語訳聖書データ: [yuki-kimoto/biblesearch](https://github.com/yuki-kimoto/biblesearch)
- KJV データ: [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv)
