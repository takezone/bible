import React from 'react';

/**
 * 文語訳聖書のテキスト「漢字（ふりがな）」形式をHTML rubyタグに変換する
 * 例: "元始（はじめ）に神（かみ）" → <ruby>元始<rt>はじめ</rt></ruby>に<ruby>神<rt>かみ</rt></ruby>
 */
export function parseRubyText(text: string): React.ReactNode {
  // シンプルなアプローチ: 括弧・空白・ひらがな・句読点以外の文字 + （ひらがな/カタカナ）
  // \u3040-\u309F: ひらがな範囲
  // 。、！？・「」『』：；: 句読点・記号
  // ひらがな: ぁ-ん + 踊り字（ゝゞ）
  // カタカナ: ァ-ヶ + 長音（ー）+ 踊り字（ヽヾ）
  const rubyPattern = /([^（）\s\u3040-\u309F。、！？・「」『』：；]+)（([ぁ-んゝゞァ-ヶーヽヾ]+)）/gu;

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
