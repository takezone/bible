import type { GreekBook, GreekChapter, GreekVerse } from '@/types/greek';

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

// データキャッシュ
const dataCache: Map<string, GreekBook> = new Map();

// ギリシャ語データを読み込み
export async function loadGreekBook(bookId: string): Promise<GreekBook | null> {
  // キャッシュチェック
  if (dataCache.has(bookId)) {
    return dataCache.get(bookId)!;
  }

  try {
    // 動的インポート
    const data = await import(`@/data/greek/${bookId}.json`);
    const book = data.default || data;
    dataCache.set(bookId, book);
    return book;
  } catch (error) {
    console.error(`Failed to load Greek data for ${bookId}:`, error);
    return null;
  }
}

// 章を取得
export async function getGreekChapter(bookId: string, chapterNum: number): Promise<GreekChapter | null> {
  const book = await loadGreekBook(bookId);
  if (!book) return null;

  return book.chapters.find(ch => ch.chapter === chapterNum) || null;
}

// 節を取得
export async function getGreekVerse(bookId: string, chapterNum: number, verseNum: number): Promise<GreekVerse | null> {
  const chapter = await getGreekChapter(bookId, chapterNum);
  if (!chapter) return null;

  return chapter.verses.find(v => v.verse === verseNum) || null;
}

// 書物情報を取得
export function getBookInfo(bookId: string) {
  return NT_BOOKS.find(b => b.id === bookId);
}
