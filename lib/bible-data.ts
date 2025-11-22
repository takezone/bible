import type { BibleData, Book, Chapter, Verse, Translation } from '@/types/bible';
import kougoData from '@/data/bible-kougo.json';
import kjvData from '@/data/bible-kjv.json';
import webData from '@/data/bible-web.json';
import bookOrderData from '@/data/book-order.json';

const bibleCache: Record<Translation, BibleData> = {
  kougo: kougoData as BibleData,
  kjv: kjvData as BibleData,
  web: webData as BibleData,
};

// 書物の順序データ
export const BOOK_ORDER: Array<{ id: string; name: string; testament: string }> = bookOrderData;

export function getBibleData(translation: Translation): BibleData {
  return bibleCache[translation];
}

export function getBook(translation: Translation, bookId: string): Book | undefined {
  const bible = getBibleData(translation);
  return bible.books.find(b => b.id === bookId);
}

export function getChapter(
  translation: Translation,
  bookId: string,
  chapterNum: number
): Chapter | undefined {
  const book = getBook(translation, bookId);
  return book?.chapters.find(ch => ch.chapter === chapterNum);
}

export function getVerse(
  translation: Translation,
  bookId: string,
  chapterNum: number,
  verseNum: number
): Verse | undefined {
  const chapter = getChapter(translation, bookId, chapterNum);
  return chapter?.verses.find(v => v.verse === verseNum);
}

export function searchVerses(
  translation: Translation,
  query: string
): Array<{ book: Book; chapter: Chapter; verse: Verse }> {
  const bible = getBibleData(translation);
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
