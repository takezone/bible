import type { BibleData, Book, Chapter, Verse, Translation } from '@/types/bible';
import kougoData from '@/data/bible-kougo.json';
import kjvData from '@/data/bible-kjv.json';
import webData from '@/data/bible-web.json';

const bibleCache: Record<Translation, BibleData> = {
  kougo: kougoData as BibleData,
  kjv: kjvData as BibleData,
  web: webData as BibleData,
};

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

// 書名を日本語から英語IDにマッピング（不要になったため削除）
// 現在は両方のデータが同じIDを使用しているため、直接IDでアクセス可能
