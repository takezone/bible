/**
 * カタカナ表記揺れを正規化する関数
 *
 * 聖書の地名・人名は翻訳によって表記が異なるため、
 * 検索時に表記の違いを吸収する
 */

/**
 * カタカナを正規化（基本的な変換）
 */
export function normalizeKatakana(text: string): string {
  return text
    // 長音記号を削除
    .replace(/ー/g, '')
    // 小文字カタカナを大文字に統一
    .replace(/ァ/g, 'ア')
    .replace(/ィ/g, 'イ')
    .replace(/ゥ/g, 'ウ')
    .replace(/ェ/g, 'エ')
    .replace(/ォ/g, 'オ')
    .replace(/ヵ/g, 'カ')
    .replace(/ヶ/g, 'ケ')
    .replace(/ッ/g, 'ツ')
    .replace(/ャ/g, 'ヤ')
    .replace(/ュ/g, 'ユ')
    .replace(/ョ/g, 'ヨ')
    .replace(/ヮ/g, 'ワ')
    // ヴをブに統一
    .replace(/ヴ/g, 'ブ')
    // 濁点・半濁点のバリエーション
    .replace(/ガ/g, 'カ').replace(/ギ/g, 'キ').replace(/グ/g, 'ク')
    .replace(/ゲ/g, 'ケ').replace(/ゴ/g, 'コ')
    .replace(/ザ/g, 'サ').replace(/ジ/g, 'シ').replace(/ズ/g, 'ス')
    .replace(/ゼ/g, 'セ').replace(/ゾ/g, 'ソ')
    .replace(/ダ/g, 'タ').replace(/ヂ/g, 'チ').replace(/ヅ/g, 'ツ')
    .replace(/デ/g, 'テ').replace(/ド/g, 'ト')
    .replace(/バ/g, 'ハ').replace(/ビ/g, 'ヒ').replace(/ブ/g, 'フ')
    .replace(/ベ/g, 'ヘ').replace(/ボ/g, 'ホ')
    .replace(/パ/g, 'ハ').replace(/ピ/g, 'ヒ').replace(/プ/g, 'フ')
    .replace(/ペ/g, 'ヘ').replace(/ポ/g, 'ホ');
}

/**
 * より柔軟な正規化（あいまい検索用）
 *
 * 以下のような表記揺れに対応:
 * - ベタニア/ベタニヤ → ベタニ
 * - ベッサイダ/ベツサイダ/ベトサイダ → ベサイタ
 * - ファラオ/パロ → ハラオ/ハロ
 */
export function fuzzyNormalizeKatakana(text: string): string {
  return normalizeKatakana(text)
    // 促音を削除
    .replace(/ッ/g, '')
    // ン系の揺れを削除
    .replace(/ン/g, '')
    // ヤ行の揺れを削除（ア/ヤ、イ/ユなど）
    .replace(/ヤ/g, '')
    .replace(/ユ/g, '')
    .replace(/ヨ/g, '');
}

/**
 * 検索用の正規化（複数のバリエーションを生成）
 */
export function generateSearchVariants(text: string): string[] {
  const variants = new Set<string>();

  // オリジナル
  variants.add(text.toLowerCase());

  // 基本正規化
  variants.add(normalizeKatakana(text).toLowerCase());

  // あいまい正規化
  variants.add(fuzzyNormalizeKatakana(text).toLowerCase());

  // 長音記号のバリエーション
  const withoutLongVowel = text.replace(/ー/g, '');
  variants.add(withoutLongVowel.toLowerCase());

  // よくある表記揺れのパターン
  const patterns: [RegExp, string][] = [
    [/ヤ$/, 'ア'],    // ベタニヤ → ベタニア
    [/ア$/, 'ヤ'],    // ベタニア → ベタニヤ
    [/ッサ/g, 'ツサ'], // ベッサイダ → ベツサイダ
    [/ツサ/g, 'ッサ'], // ベツサイダ → ベッサイダ
    [/ト/g, 'ッ'],    // ベトサイダ → ベッサイダ
    [/ッ/g, 'ト'],    // ベッサイダ → ベトサイダ
    [/ファ/g, 'パ'],   // ファラオ → パラオ
    [/パ/g, 'ファ'],   // パラオ → ファラオ
    [/ラオ$/, 'ロ'],   // ファラオ → ファロ、パラオ → パロ
    [/ロ$/, 'ラオ'],   // ファロ → ファラオ、パロ → パラオ
  ];

  patterns.forEach(([pattern, replacement]) => {
    const variant = text.replace(pattern, replacement);
    if (variant !== text) {
      variants.add(variant.toLowerCase());
      variants.add(normalizeKatakana(variant).toLowerCase());
    }
  });

  return Array.from(variants);
}

/**
 * 2つの文字列が表記揺れを考慮して一致するかチェック
 */
export function matchesWithVariants(text1: string, text2: string): boolean {
  const variants1 = generateSearchVariants(text1);
  const variants2 = generateSearchVariants(text2);

  return variants1.some(v1 => variants2.includes(v1));
}
