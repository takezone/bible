# 文語訳聖書のルビ表示で学んだこと：CJK互換漢字とNFKC正規化

## 概要

日本語テキストの `漢字（ふりがな）` 形式を HTML `<ruby>` タグに変換する処理で、**一部の漢字だけがマッチしない**という問題に遭遇しました。原因は「CJK互換漢字」という Unicode の仕様にありました。

## 問題の症状

文語訳聖書のテキストで、ほとんどのルビは正しく変換されるのに、特定の漢字だけが変換されない：

```
✓ 元始（はじめ）  → 正常に変換
✓ 天地（あめつち）→ 正常に変換
✗ 神（かみ）      → 変換されない
✗ 視（み）る      → 変換されない
```

ローカル環境（Node.js）では動作するのに、**ブラウザでは動作しない**という現象も発生。

## 原因：CJK互換漢字（U+F900-U+FAFF）

問題の漢字を調査すると、通常の漢字とは異なるコードポイントを持っていました：

| 見た目 | 通常の漢字 | 互換漢字 |
|--------|------------|----------|
| 神     | U+795E     | U+FA19   |
| 視     | U+8996     | U+FA61   |
| 福     | U+798F     | U+FA1B   |

これらは「CJK互換漢字」と呼ばれ、旧JIS規格との互換性のために存在します。**見た目は同じでも、内部的には別の文字**として扱われます。

### なぜブラウザで問題が起きたか

```javascript
// この正規表現は通常の漢字にはマッチするが...
const pattern = /[^\s（）ぁ-んァ-ヶ]+（[ぁ-ん]+）/gu;

// CJK互換漢字（U+FA19など）は漢字の範囲外と判定されることがある
pattern.test('神（かみ）');  // 神=U+795E → true
pattern.test('神（かみ）');  // 神=U+FA19 → false（ブラウザによる）
```

Node.js と ブラウザの正規表現エンジンで、Unicode 文字の扱いに微妙な差異があったのです。

## 解決策：NFKC正規化

Unicode の **NFKC正規化** を適用することで、互換漢字を通常の漢字に変換できます：

```javascript
// NFKC正規化で互換漢字を通常漢字に変換
const normalizedText = text.normalize('NFKC');

// U+FA19（互換漢字の神）→ U+795E（通常の神）に変換される
```

### 注意点：NFKC は括弧も変換する

NFKC正規化には副作用があります。**全角括弧が半角に変換**されます：

```javascript
'神（かみ）'.normalize('NFKC')
// → '神(かみ)'  ※括弧が半角になる
```

そのため、正規表現パターンも半角括弧に対応させる必要があります：

```javascript
// Before: 全角括弧を想定
const pattern = /([^（）]+)（([ぁ-ん]+)）/gu;

// After: NFKC後は半角括弧
const pattern = /([^()]+)\(([ぁ-ん]+)\)/gu;
```

## 最終的な実装

```typescript
export function parseRubyText(text: string): React.ReactNode {
  // 1. NFKC正規化でCJK互換漢字を通常漢字に変換
  const normalizedText = text.normalize('NFKC');

  // 2. 半角括弧でマッチ（NFKC後は全角→半角に変換済み）
  const excluded = `()\\s\\u3041-\\u309F\\u30A0-\\u30FF`;  // 括弧、空白、ひらがな、カタカナ
  const rubyChars = 'ぁ-んゝゞァ-ヶーヽヾ\\u3033-\\u3035'; // ひらがな、踊り字、くの字点
  const pattern = new RegExp(`([^${excluded}]+)\\(([${rubyChars}]+)\\)`, 'gu');

  // 3. マッチした部分を<ruby>タグに変換
  // ...
}
```

## その他の学び

### 1. カタカナは除外リストに入れる

「ヘロデ王（わう）」のような場合、「ヘロデ」までルビのベースに含まれてしまう問題：

```javascript
// カタカナ（U+30A0-U+30FF）も除外リストに追加
const excluded = `()\\s\\u3041-\\u309F\\u30A0-\\u30FF`;
```

### 2. くの字点（〳〴〵）のサポート

古い日本語には「人々（ひと〴〵）」のような表記があります：

```javascript
// くの字点（U+3033-U+3035）をルビ文字に追加
const rubyChars = 'ぁ-んゝゞァ-ヶーヽヾ\\u3033-\\u3035';
```

### 3. デバッグモードの実装

本番環境でのデバッグのため、`?debug=ruby` パラメータで詳細情報を表示：

```typescript
const isDebugMode = () => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('debug') === 'ruby';
};
```

## まとめ

| 問題 | 原因 | 解決策 |
|------|------|--------|
| 特定の漢字がマッチしない | CJK互換漢字（U+F900-U+FAFF） | NFKC正規化 |
| NFKC後に括弧がマッチしない | 全角→半角変換 | 半角括弧でパターン修正 |
| カタカナがベースに含まれる | 除外リスト不足 | カタカナ範囲を除外に追加 |
| くの字点がマッチしない | ルビ文字リスト不足 | U+3033-3035を追加 |

**教訓**: 日本語テキスト処理では、見た目が同じでも内部表現が異なる文字の存在を意識する必要があります。`normalize('NFKC')` は多くの問題を解決してくれる強力なツールです。

## 参考リンク

- [Unicode正規化 - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
- [CJK互換漢字 - Wikipedia](https://ja.wikipedia.org/wiki/CJK%E4%BA%92%E6%8F%9B%E6%BC%A2%E5%AD%97)
- [Unicode Character Categories](https://www.unicode.org/reports/tr44/#General_Category_Values)
