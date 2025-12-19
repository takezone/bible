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
  // CJK互換漢字（U+F900-U+FAFF）をNFKC正規化で通常漢字に変換
  // これによりブラウザの正規表現エンジンで正しくマッチするようになる
  const normalizedText = text.normalize('NFKC');

  // シンプルなアプローチ: 括弧・空白・ひらがな・カタカナ・句読点以外の文字 + (ひらがな/カタカナ)
  // NFKC正規化後は全角括弧（）が半角()に変換されるため、半角を使用
  // ひらがな範囲: ぁ-ゟ (U+3041-U+309F)
  // カタカナ範囲: ァ-ヿ (U+30A0-U+30FF)
  // 句読点・記号: 。、！？・「」『』：；（NFKC後も変化なし）
  // ルビ部分: ひらがな + カタカナ + 踊り字（ゝゞヽヾ）+ 長音（ー）
  const hiragana = '\u3041-\u309F';
  const katakana = '\u30A0-\u30FF';
  const punctuation = '。、！？・「」『』：；';
  const excluded = `()\\s${hiragana}${katakana}${punctuation}`;
  const rubyChars = 'ぁ-んゝゞァ-ヶーヽヾ';
  const rubyPattern = new RegExp(`([^${excluded}]+)\\(([${rubyChars}]+)\\)`, 'gu');

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = rubyPattern.exec(normalizedText)) !== null) {
    // マッチより前のテキストを追加
    if (match.index > lastIndex) {
      parts.push(normalizedText.slice(lastIndex, match.index));
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
  if (lastIndex < normalizedText.length) {
    parts.push(normalizedText.slice(lastIndex));
  }

  // デバッグモード: マッチ情報を表示（NFKC後は半角括弧）
  if (isDebugMode() && normalizedText.includes('(')) {
    const debugMatches = [...normalizedText.matchAll(new RegExp(`([^${excluded}]+)\\(([${rubyChars}]+)\\)`, 'gu'))];

    // マッチしなかった(...)パターンを検出 - 直前の1-3文字を取得
    const allParenPatterns = [...normalizedText.matchAll(/(.{0,3})\(([^)]+)\)/gu)];
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
          [Self-test NFKC] 視(FA61→NFKC): {new RegExp(`([^${excluded}]+)\\(([${rubyChars}]+)\\)`, 'gu').test('\uFA61（み）'.normalize('NFKC')) ? '✓' : '✗'}
          | 神(FA19→NFKC): {new RegExp(`([^${excluded}]+)\\(([${rubyChars}]+)\\)`, 'gu').test('\uFA19（かみ）'.normalize('NFKC')) ? '✓' : '✗'}
        </div>
        <div style={{ background: '#607d8b', color: 'white', padding: '4px', fontSize: '10px', marginBottom: '4px', wordBreak: 'break-all' }}>
          [NFKC正規化] 元: {text.length}文字 → 後: {normalizedText.length}文字
          / CJK互換→通常変換: {text.length !== normalizedText.length ? '実行済' : '変化なし'}
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
