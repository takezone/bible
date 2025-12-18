import React from 'react';

/**
 * 文語訳聖書のテキスト「漢字（ふりがな）」形式をHTML rubyタグに変換する
 * 例: "元始（はじめ）に神（かみ）" → <ruby>元始<rt>はじめ</rt></ruby>に<ruby>神<rt>かみ</rt></ruby>
 */
export function parseRubyText(text: string): React.ReactNode {
  // 「漢字（ふりがな）」のパターンにマッチする正規表現
  // CJK統合漢字、CJK統合漢字拡張、異体字セレクタを含む漢字の後に全角括弧でひらがな/カタカナ
  // \u4E00-\u9FFF: CJK統合漢字
  // \u3400-\u4DBF: CJK統合漢字拡張A
  // \uF900-\uFAFF: CJK互換漢字
  // \u{20000}-\u{2A6DF}: CJK統合漢字拡張B
  // \u{E0100}-\u{E01EF}: 異体字セレクタ
  // ひらがな: ぁ-ん + 踊り字（ゝゞ）
  // カタカナ: ァ-ヶ + 長音（ー）+ 踊り字（ヽヾ）
  const rubyPattern = /([\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u{20000}-\u{2A6DF}\u{E0100}-\u{E01EF}]+)（([ぁ-んゝゞァ-ヶーヽヾ]+)）/gu;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = rubyPattern.exec(text)) !== null) {
    // マッチより前のテキストを追加
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // rubyタグで囲む
    const baseText = match[1];
    const rubyText = match[2];
    parts.push(
      <ruby key={key++}>
        {baseText}
        <rt>{rubyText}</rt>
      </ruby>
    );

    lastIndex = match.index + match[0].length;
  }

  // 残りのテキストを追加
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

/**
 * テキストにルビが含まれているかどうかを判定
 */
export function hasRuby(text: string): boolean {
  const rubyPattern = /[^\s（）]+?（[ぁ-んァ-ヶー]+?）/;
  return rubyPattern.test(text);
}
