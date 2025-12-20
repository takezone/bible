import type { BibleData, Book, Chapter, Verse, Translation } from '@/types/bible';
import bookOrderData from '@/data/book-order.json';

// 翻訳データのキャッシュ（動的に読み込まれた後に保存）
const bibleCache: Partial<Record<Translation, BibleData>> = {};

// 読み込み中のPromiseをキャッシュ（重複読み込み防止）
const loadingPromises: Partial<Record<Translation, Promise<BibleData>>> = {};

// 書物の順序データ（軽量なので静的インポート）
export const BOOK_ORDER: Array<{ id: string; name: string; testament: string }> = bookOrderData;

/**
 * 翻訳データを動的に読み込む
 * キャッシュがあればキャッシュから返す
 */
export async function loadBibleData(translation: Translation): Promise<BibleData> {
  // キャッシュにあればそれを返す
  if (bibleCache[translation]) {
    return bibleCache[translation]!;
  }

  // 既に読み込み中ならそのPromiseを返す（重複読み込み防止）
  if (loadingPromises[translation]) {
    return loadingPromises[translation]!;
  }

  // 翻訳ごとに動的インポート
  const loadPromise = (async () => {
    let data: BibleData;

    switch (translation) {
      case 'kougo':
        data = (await import('@/data/bible-kougo.json')).default as BibleData;
        break;
      case 'bungo':
        data = (await import('@/data/bible-bungo.json')).default as BibleData;
        break;
      case 'kjv':
        data = (await import('@/data/bible-kjv.json')).default as BibleData;
        break;
      case 'web':
        data = (await import('@/data/bible-web.json')).default as BibleData;
        break;
      case 'luther':
        data = (await import('@/data/bible-luther.json')).default as BibleData;
        break;
      case 'hebrew':
        data = (await import('@/data/bible-hebrew.json')).default as BibleData;
        break;
      case 'greek':
        // ギリシャ語は2つのファイルを統合
        const [greekNt, greekLxx] = await Promise.all([
          import('@/data/bible-greek-nt.json'),
          import('@/data/bible-greek-lxx.json'),
        ]);
        data = {
          books: [...(greekLxx.default as BibleData).books, ...(greekNt.default as BibleData).books],
          metadata: {
            translation: 'ギリシャ語聖書',
            language: 'grc',
            year: '原典',
          },
        };
        break;
      default:
        throw new Error(`Unknown translation: ${translation}`);
    }

    // キャッシュに保存
    bibleCache[translation] = data;
    // 読み込み完了したのでPromiseキャッシュから削除
    delete loadingPromises[translation];

    return data;
  })();

  // 読み込み中のPromiseをキャッシュ
  loadingPromises[translation] = loadPromise;

  return loadPromise;
}

/**
 * 翻訳データを同期的に取得（キャッシュからのみ）
 * データがまだ読み込まれていない場合はundefinedを返す
 */
export function getBibleData(translation: Translation): BibleData | undefined {
  return bibleCache[translation];
}

/**
 * 翻訳データが読み込み済みかどうか
 */
export function isTranslationLoaded(translation: Translation): boolean {
  return !!bibleCache[translation];
}

/**
 * 書を取得（同期版 - キャッシュからのみ）
 */
export function getBook(translation: Translation, bookId: string): Book | undefined {
  const bible = getBibleData(translation);
  return bible?.books.find(b => b.id === bookId);
}

/**
 * 書を取得（非同期版 - 必要なら読み込む）
 */
export async function getBookAsync(translation: Translation, bookId: string): Promise<Book | undefined> {
  const bible = await loadBibleData(translation);
  return bible.books.find(b => b.id === bookId);
}

/**
 * 章を取得（同期版）
 */
export function getChapter(
  translation: Translation,
  bookId: string,
  chapterNum: number
): Chapter | undefined {
  const book = getBook(translation, bookId);
  return book?.chapters.find(ch => ch.chapter === chapterNum);
}

/**
 * 章を取得（非同期版）
 */
export async function getChapterAsync(
  translation: Translation,
  bookId: string,
  chapterNum: number
): Promise<Chapter | undefined> {
  const book = await getBookAsync(translation, bookId);
  return book?.chapters.find(ch => ch.chapter === chapterNum);
}

/**
 * 節を取得（同期版）
 */
export function getVerse(
  translation: Translation,
  bookId: string,
  chapterNum: number,
  verseNum: number
): Verse | undefined {
  const chapter = getChapter(translation, bookId, chapterNum);
  return chapter?.verses.find(v => v.verse === verseNum);
}

/**
 * 節を取得（非同期版）
 */
export async function getVerseAsync(
  translation: Translation,
  bookId: string,
  chapterNum: number,
  verseNum: number
): Promise<Verse | undefined> {
  const chapter = await getChapterAsync(translation, bookId, chapterNum);
  return chapter?.verses.find(v => v.verse === verseNum);
}

/**
 * 検索（非同期版のみ）
 */
export async function searchVerses(
  translation: Translation,
  query: string
): Promise<Array<{ book: Book; chapter: Chapter; verse: Verse }>> {
  const bible = await loadBibleData(translation);
  const results: Array<{ book: Book; chapter: Chapter; verse: Verse }> = [];
  const lowerQuery = query.toLowerCase();

  bible.books.forEach(book => {
    book.chapters.forEach(chapter => {
      chapter.verses.forEach(verse => {
        if (verse.text.toLowerCase().includes(lowerQuery)) {
          results.push({ book, chapter, verse });
        }
      });
    });
  });

  return results;
}

// 前の書物を取得
export function getPreviousBook(currentBookId: string): { id: string; name: string } | null {
  const currentIndex = BOOK_ORDER.findIndex(b => b.id === currentBookId);
  if (currentIndex > 0) {
    return BOOK_ORDER[currentIndex - 1];
  }
  return null;
}

// 次の書物を取得
export function getNextBook(currentBookId: string): { id: string; name: string } | null {
  const currentIndex = BOOK_ORDER.findIndex(b => b.id === currentBookId);
  if (currentIndex >= 0 && currentIndex < BOOK_ORDER.length - 1) {
    return BOOK_ORDER[currentIndex + 1];
  }
  return null;
}

/**
 * 複数の翻訳を同時に読み込む
 */
export async function loadMultipleTranslations(translations: Translation[]): Promise<void> {
  await Promise.all(translations.map(t => loadBibleData(t)));
}

/**
 * 初期データのプリロード（デフォルト翻訳）
 */
export async function preloadDefaultTranslation(): Promise<void> {
  await loadBibleData('kougo');
}
