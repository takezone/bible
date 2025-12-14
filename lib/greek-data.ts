import type { GreekWord, GreekVerse } from '@/types/greek';

// 新約聖書の書物リスト（ギリシャ語学習用）
export const NT_BOOKS = [
  // 福音書
  { id: 'matthew', name: 'マタイによる福音書', shortName: 'マタイ', chapters: 28 },
  { id: 'mark', name: 'マルコによる福音書', shortName: 'マルコ', chapters: 16 },
  { id: 'luke', name: 'ルカによる福音書', shortName: 'ルカ', chapters: 24 },
  { id: 'john', name: 'ヨハネによる福音書', shortName: 'ヨハネ', chapters: 21 },
  // 歴史
  { id: 'acts', name: '使徒行伝', shortName: '使徒', chapters: 28 },
  // パウロ書簡
  { id: 'romans', name: 'ローマ人への手紙', shortName: 'ローマ', chapters: 16 },
  { id: '1corinthians', name: 'コリント人への第一の手紙', shortName: '1コリント', chapters: 16 },
  { id: '2corinthians', name: 'コリント人への第二の手紙', shortName: '2コリント', chapters: 13 },
  { id: 'galatians', name: 'ガラテヤ人への手紙', shortName: 'ガラテヤ', chapters: 6 },
  { id: 'ephesians', name: 'エペソ人への手紙', shortName: 'エペソ', chapters: 6 },
  { id: 'philippians', name: 'ピリピ人への手紙', shortName: 'ピリピ', chapters: 4 },
  { id: 'colossians', name: 'コロサイ人への手紙', shortName: 'コロサイ', chapters: 4 },
  { id: '1thessalonians', name: 'テサロニケ人への第一の手紙', shortName: '1テサロニケ', chapters: 5 },
  { id: '2thessalonians', name: 'テサロニケ人への第二の手紙', shortName: '2テサロニケ', chapters: 3 },
  { id: '1timothy', name: 'テモテヘの第一の手紙', shortName: '1テモテ', chapters: 6 },
  { id: '2timothy', name: 'テモテヘの第二の手紙', shortName: '2テモテ', chapters: 4 },
  { id: 'titus', name: 'テトスヘの手紙', shortName: 'テトス', chapters: 3 },
  { id: 'philemon', name: 'ピレモンヘの手紙', shortName: 'ピレモン', chapters: 1 },
  // 一般書簡
  { id: 'hebrews', name: 'ヘブル人への手紙', shortName: 'ヘブル', chapters: 13 },
  { id: 'james', name: 'ヤコブの手紙', shortName: 'ヤコブ', chapters: 5 },
  { id: '1peter', name: 'ペテロの第一の手紙', shortName: '1ペテロ', chapters: 5 },
  { id: '2peter', name: 'ペテロの第二の手紙', shortName: '2ペテロ', chapters: 3 },
  { id: '1john', name: 'ヨハネの第一の手紙', shortName: '1ヨハネ', chapters: 5 },
  { id: '2john', name: 'ヨハネの第二の手紙', shortName: '2ヨハネ', chapters: 1 },
  { id: '3john', name: 'ヨハネの第三の手紙', shortName: '3ヨハネ', chapters: 1 },
  { id: 'jude', name: 'ユダの手紙', shortName: 'ユダ', chapters: 1 },
  // 黙示録
  { id: 'revelation', name: 'ヨハネの黙示録', shortName: '黙示録', chapters: 22 },
];

// 品詞コード→日本語名のマップ
const POS_NAMES: Record<string, string> = {
  adj: '形容詞',
  conj: '接続詞',
  adv: '副詞',
  interj: '間投詞',
  noun: '名詞',
  prep: '前置詞',
  art: '冠詞',
  dem: '指示代名詞',
  inter: '疑問代名詞',
  pers: '人称代名詞',
  rel: '関係代名詞',
  verb: '動詞',
  part: '不変化詞',
};

// 軽量データ形式から完全形式に変換
interface CompactWord {
  t: string;  // text
  l: string;  // lemma
  k: string;  // katakana
  p: string;  // pos
  m?: Record<string, string>;  // morph
  g?: string; // gloss
}

interface CompactVerse {
  verse: number;
  words: CompactWord[];
}

function expandWord(compact: CompactWord): GreekWord {
  return {
    text: compact.t,
    lemma: compact.l,
    katakana: compact.k,
    pos: compact.p,
    posName: POS_NAMES[compact.p] || compact.p,
    morph: compact.m || null,
    gloss: compact.g || '',
  };
}

function expandVerse(compact: CompactVerse): GreekVerse {
  return {
    verse: compact.verse,
    words: compact.words.map(expandWord),
  };
}

// 章データキャッシュ
const chapterCache: Map<string, GreekVerse[]> = new Map();

// 章データを読み込み（オンデマンド）
export async function loadGreekChapter(bookId: string, chapterNum: number): Promise<GreekVerse[] | null> {
  const cacheKey = `${bookId}/${chapterNum}`;

  // キャッシュチェック
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey)!;
  }

  try {
    // 動的インポート
    const data = await import(`@/data/greek/${bookId}/${chapterNum}.json`);
    const compactVerses: CompactVerse[] = data.default || data;
    const verses = compactVerses.map(expandVerse);
    chapterCache.set(cacheKey, verses);
    return verses;
  } catch (error) {
    console.error(`Failed to load Greek data for ${bookId}/${chapterNum}:`, error);
    return null;
  }
}

// 章を取得（互換性のため）
export async function getGreekChapter(bookId: string, chapterNum: number): Promise<{ chapter: number; verses: GreekVerse[] } | null> {
  const verses = await loadGreekChapter(bookId, chapterNum);
  if (!verses) return null;
  return { chapter: chapterNum, verses };
}

// 節を取得
export async function getGreekVerse(bookId: string, chapterNum: number, verseNum: number): Promise<GreekVerse | null> {
  const verses = await loadGreekChapter(bookId, chapterNum);
  if (!verses) return null;
  return verses.find(v => v.verse === verseNum) || null;
}

// 書物情報を取得
export function getBookInfo(bookId: string) {
  return NT_BOOKS.find(b => b.id === bookId);
}

// キャッシュをクリア（メモリ解放用）
export function clearGreekCache() {
  chapterCache.clear();
}
