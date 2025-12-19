import React from 'react';

/**
 * 文語訳聖書のテキスト「漢字（ふりがな）」形式をHTML rubyタグに変換する
 * 例: "元始（はじめ）に神（かみ）" → <ruby>元始<rt>はじめ</rt></ruby>に<ruby>神<rt>かみ</rt></ruby>
 */
// デバッグモード（URLに?debug=rubyがある場合に有効）
const isDebugMode = () => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('debug') === 'ruby';
};

export function parseRubyText(text: string): React.ReactNode {
  // シンプルなアプローチ: 括弧・空白・ひらがな・カタカナ・句読点以外の文字 + （ひらがな/カタカナ）
  // ひらがな範囲: ぁ-ゟ (U+3041-U+309F)
  // カタカナ範囲: ァ-ヿ (U+30A0-U+30FF)
  // 句読点・記号: 。、！？・「」『』：；
  // ルビ部分: ひらがな + カタカナ + 踊り字（ゝゞヽヾ）+ 長音（ー）
  const hiragana = '\u3041-\u309F';
  const katakana = '\u30A0-\u30FF';
  const punctuation = '。、！？・「」『』：；';
  const excluded = `（）\\s${hiragana}${katakana}${punctuation}`;
  const rubyChars = 'ぁ-んゝゞァ-ヶーヽヾ';
  const rubyPattern = new RegExp(`([^${excluded}]+)（([${rubyChars}]+)）`, 'gu');

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

  // デバッグモード: マッチ情報を表示
  if (isDebugMode() && text.includes('（')) {
    const debugMatches = [...text.matchAll(new RegExp(`([^${excluded}]+)（([${rubyChars}]+)）`, 'gu'))];

    // マッチしなかった（...）パターンを検出 - 直前の1-3文字を取得
    const allParenPatterns = [...text.matchAll(/(.{0,3})（([^）]+)）/gu)];
    const unmatchedPatterns = allParenPatterns.filter(p => {
      // この括弧パターンがデバッグマッチのいずれかに含まれているかチェック
      const parenStart = p.index! + p[1].length;
      return !debugMatches.some(m => {
        const matchEnd = m.index! + m[0].length;
        const matchParenStart = m.index! + m[1].length;
        return matchParenStart === parenStart;
      });
    });

    // 各文字のUnicodeコードを取得するヘルパー
    const charCodes = (str: string) => [...str].map(c => `${c}(${c.codePointAt(0)?.toString(16).toUpperCase()})`).join(' ');

    return (
      <>
        <div style={{ background: '#ffeb3b', padding: '4px', fontSize: '10px', marginBottom: '4px' }}>
          [DEBUG] マッチ数: {debugMatches.length} / ruby要素数: {parts.filter(p => typeof p !== 'string').length}
          {debugMatches.length > 0 && ` / 最初: ${debugMatches[0][0]}`}
        </div>
        {unmatchedPatterns.length > 0 && (
          <div style={{ background: '#ff5722', color: 'white', padding: '4px', fontSize: '10px', marginBottom: '4px', wordBreak: 'break-all' }}>
            [未マッチ] {unmatchedPatterns.map((p, i) => {
              const context = p[1];
              const ruby = p[2];
              return (
                <span key={i}>
                  「{context}（{ruby}）」= [{charCodes(context)}]
                  {i < unmatchedPatterns.length - 1 ? ', ' : ''}
                </span>
              );
            })}
          </div>
        )}
        <div style={{ background: '#2196f3', color: 'white', padding: '4px', fontSize: '10px', marginBottom: '4px' }}>
          [Pattern] excluded: ひらがな(U+3041-309F) + カタカナ(U+30A0-30FF) + 句読点
        </div>
        <div style={{ background: '#9c27b0', color: 'white', padding: '4px', fontSize: '10px', marginBottom: '4px' }}>
          [Self-test] 視(FA61)（み）: {new RegExp(`([^${excluded}]+)（([${rubyChars}]+)）`, 'gu').test('\uFA61（み）') ? '✓' : '✗'}
          | 視(8996)（み）: {new RegExp(`([^${excluded}]+)（([${rubyChars}]+)）`, 'gu').test('\u8996（み）') ? '✓' : '✗'}
          | 神(FA19)（かみ）: {new RegExp(`([^${excluded}]+)（([${rubyChars}]+)）`, 'gu').test('\uFA19（かみ）') ? '✓' : '✗'}
        </div>
        <div style={{ background: '#607d8b', color: 'white', padding: '4px', fontSize: '10px', marginBottom: '4px', wordBreak: 'break-all' }}>
          [入力テキスト] 長さ: {text.length} / CJK互換: {[...text].filter(c => { const code = c.codePointAt(0) || 0; return code >= 0xF900 && code <= 0xFAFF; }).map(c => `${c}(${c.codePointAt(0)?.toString(16).toUpperCase()})`).join(' ') || 'なし'}
          / IVS: {[...text].filter(c => { const code = c.codePointAt(0) || 0; return code >= 0xE0100 && code <= 0xE01EF; }).length || 'なし'}
        </div>
        {parts}
      </>
    );
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
