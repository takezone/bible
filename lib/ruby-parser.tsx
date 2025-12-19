import React from 'react';

/**
 * 文語訳聖書のテキスト「漢字（ふりがな）」形式をHTML rubyタグに変換する
 * 例: "元始（はじめ）に神（かみ）" → <ruby>元始<rt>はじめ</rt></ruby>に<ruby>神<rt>かみ</rt></ruby>
 */
export function parseRubyText(text: string): React.ReactNode {
  // シンプルなアプローチ: 括弧・空白・ひらがな・句読点以外の文字 + （ひらがな/カタカナ）
  // ひらがな範囲: ぁ-ゟ (U+3041-U+309F)
  // 句読点・記号: 。、！？・「」『』：；
  // ルビ部分: ひらがな + カタカナ + 踊り字（ゝゞヽヾ）+ 長音（ー）
  const hiragana = '\u3041-\u309F';
  const punctuation = '。、！？・「」『』：；';
  const excluded = `（）\\s${hiragana}${punctuation}`;
  const rubyChars = 'ぁ-んゝゞァ-ヶーヽヾ';
  const rubyPattern = new RegExp(`([^${excluded}]+)（([${rubyChars}]+)）`, 'gu');

  // デバッグ: 最初の100文字と正規表現の動作確認
  if (typeof window !== 'undefined' && text.includes('（')) {
    const matches = [...text.matchAll(new RegExp(`([^${excluded}]+)（([${rubyChars}]+)）`, 'gu'))];
    console.log('[parseRubyText] テキスト先頭:', text.slice(0, 50));
    console.log('[parseRubyText] マッチ数:', matches.length);
    if (matches.length > 0) {
      console.log('[parseRubyText] 最初のマッチ:', matches[0][0]);
    }
  }

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
