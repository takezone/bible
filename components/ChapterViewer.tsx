'use client';

import { useEffect } from 'react';
import { getBook, getChapter } from '@/lib/bible-data';
import type { Book, Chapter, Translation } from '@/types/bible';

export type FontSize = 'sm' | 'lg' | 'xl';

interface ChapterViewerProps {
  book: Book;
  chapter: Chapter;
  displayMode: 'single' | 'parallel';
  singleTranslation: Translation;
  leftTranslation: Translation;
  rightTranslation: Translation;
  fontSize: FontSize;
  highlightVerse: number | null;
  onChapterChange: (chapterNum: number) => void;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
}

export function ChapterViewer({
  book,
  chapter,
  displayMode,
  singleTranslation,
  leftTranslation,
  rightTranslation,
  fontSize,
  highlightVerse,
  onChapterChange,
  onPreviousChapter,
  onNextChapter
}: ChapterViewerProps) {
  // 翻訳名のマッピング
  const translationNames: Record<Translation, string> = {
    kougo: '口語訳',
    kjv: 'King James Version',
    web: 'New Heart English Bible'
  };

  // 節へのスクロール
  useEffect(() => {
    if (highlightVerse) {
      const element = document.getElementById(`verse-${highlightVerse}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [highlightVerse, chapter]);

  // 単体表示時のデータ取得
  const singleBook = displayMode === 'single' ? getBook(singleTranslation, book.id) : null;
  const singleChapter = singleBook ? getChapter(singleTranslation, singleBook.id, chapter.chapter) : null;

  // 並列表示時のデータ取得
  const leftBook = displayMode === 'parallel' ? getBook(leftTranslation, book.id) : null;
  const leftChapter = leftBook ? getChapter(leftTranslation, leftBook.id, chapter.chapter) : null;

  const rightBook = displayMode === 'parallel' ? getBook(rightTranslation, book.id) : null;
  const rightChapter = rightBook ? getChapter(rightTranslation, rightBook.id, chapter.chapter) : null;

  useEffect(() => {
    // 履歴をlocalStorageに保存
    const history = JSON.parse(localStorage.getItem('bibleHistory') || '[]');
    const newEntry = {
      bookId: book.id,
      bookName: book.name,
      chapter: chapter.chapter,
      timestamp: new Date().toISOString()
    };

    // 重複を削除して最新を追加
    const filtered = history.filter((h: any) =>
      !(h.bookId === newEntry.bookId && h.chapter === newEntry.chapter)
    );
    filtered.unshift(newEntry);

    // 最大50件まで保存
    localStorage.setItem('bibleHistory', JSON.stringify(filtered.slice(0, 50)));
  }, [book.id, chapter.chapter, book.name]);

  return (
    <>
      {/* PC: 画面左右に固定されるナビゲーションボタン */}
      <button
        onClick={onPreviousChapter}
        disabled={chapter.chapter === 1}
        className="fixed left-[calc(25%-1rem)] top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-700 rounded-full shadow-lg p-3 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 hidden lg:block xl:left-[calc((100vw-1280px)/2+320px-1rem)]"
        aria-label="前の章へ"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onNextChapter}
        disabled={chapter.chapter === book.chapters.length}
        className="fixed right-[-1rem] top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-700 rounded-full shadow-lg p-3 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 hidden lg:block xl:right-[calc((100vw-1280px)/2-1rem)]"
        aria-label="次の章へ"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* スマホ: 画面下部に固定されるナビゲーションボタン */}
      <div className="fixed bottom-4 left-0 right-0 z-20 flex justify-center gap-4 lg:hidden">
        <button
          onClick={onPreviousChapter}
          disabled={chapter.chapter === 1}
          className="bg-white hover:bg-gray-100 text-gray-700 rounded-full shadow-lg p-4 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="前の章へ"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onNextChapter}
          disabled={chapter.chapter === book.chapters.length}
          className="bg-white hover:bg-gray-100 text-gray-700 rounded-full shadow-lg p-4 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="次の章へ"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
      {/* 章ナビゲーション */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {book.name} 第{chapter.chapter}章
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => onChapterChange(chapter.chapter - 1)}
              disabled={chapter.chapter === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              ← 前章
            </button>
            <button
              onClick={() => onChapterChange(chapter.chapter + 1)}
              disabled={chapter.chapter === book.chapters.length}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              次章 →
            </button>
          </div>
        </div>

        {/* 章番号選択 */}
        <div className="flex flex-wrap gap-2">
          {book.chapters.map((ch) => (
            <button
              key={ch.chapter}
              onClick={() => onChapterChange(ch.chapter)}
              className={`px-3 py-1 rounded text-sm ${
                ch.chapter === chapter.chapter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {ch.chapter}
            </button>
          ))}
        </div>
      </div>

      {/* 本文表示 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        {/* 単体表示モード */}
        {displayMode === 'single' && singleChapter && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {translationNames[singleTranslation]}
            </h3>
            <div className="space-y-3">
              {singleChapter.verses.map((verse) => (
                <div
                  key={verse.verse}
                  id={`verse-${verse.verse}`}
                  className={`flex gap-3 rounded p-2 -mx-2 transition-colors ${
                    highlightVerse === verse.verse ? 'bg-yellow-100' : ''
                  }`}
                >
                  <span className="text-gray-400 text-sm font-medium min-w-[2rem] flex-shrink-0">
                    {verse.verse}
                  </span>
                  <p className={`text-gray-800 leading-relaxed ${
                    fontSize === 'sm' ? 'text-base' :
                    fontSize === 'lg' ? 'text-xl' :
                    'text-2xl'
                  }`}>
                    {verse.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 並列表示モード - PC: 左右2列、スマホ: 上下交互 */}
        {displayMode === 'parallel' && leftChapter && rightChapter && (
          <>
            {/* PC: 2列表示 */}
            <div className="hidden md:block">
              {/* ヘッダー */}
              <div className="grid grid-cols-2 gap-8 mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {translationNames[leftTranslation]}
                </h3>
                <h3 className="text-lg font-semibold text-gray-700 border-l border-gray-200 pl-8">
                  {translationNames[rightTranslation]}
                </h3>
              </div>

              {/* 節ごとに左右を並べる */}
              <div className="space-y-3">
                {leftChapter.verses.map((leftVerse) => {
                  const rightVerse = rightChapter.verses.find(v => v.verse === leftVerse.verse);
                  return (
                    <div
                      key={leftVerse.verse}
                      id={`verse-${leftVerse.verse}`}
                      className={`grid grid-cols-2 gap-8 rounded p-2 -mx-2 transition-colors ${
                        highlightVerse === leftVerse.verse ? 'bg-yellow-100' : ''
                      }`}
                    >
                      {/* 左側 */}
                      <div className="flex gap-3">
                        <span className="text-gray-400 text-sm font-medium min-w-[2rem] flex-shrink-0">
                          {leftVerse.verse}
                        </span>
                        <p className={`text-gray-800 leading-relaxed ${
                          fontSize === 'sm' ? 'text-base' :
                          fontSize === 'lg' ? 'text-xl' :
                          'text-2xl'
                        }`}>
                          {leftVerse.text}
                        </p>
                      </div>

                      {/* 右側 */}
                      <div className="flex gap-3 border-l border-gray-200 pl-8">
                        <span className="text-gray-400 text-sm font-medium min-w-[2rem] flex-shrink-0">
                          {rightVerse?.verse}
                        </span>
                        <p className={`text-gray-800 leading-relaxed ${
                          fontSize === 'sm' ? 'text-base' :
                          fontSize === 'lg' ? 'text-xl' :
                          'text-2xl'
                        }`}>
                          {rightVerse?.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* スマホ: 節ごとに上下交互表示 */}
            <div className="md:hidden space-y-4">
              {leftChapter.verses.map((leftVerse) => {
                const rightVerse = rightChapter.verses.find(v => v.verse === leftVerse.verse);
                return (
                  <div
                    key={leftVerse.verse}
                    id={`verse-${leftVerse.verse}`}
                    className={`rounded p-3 transition-colors ${
                      highlightVerse === leftVerse.verse ? 'bg-yellow-100' : 'bg-gray-50'
                    }`}
                  >
                    {/* 左側の翻訳 */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 text-sm font-bold">{leftVerse.verse}</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {translationNames[leftTranslation]}
                        </span>
                      </div>
                      <p className={`text-gray-800 leading-relaxed ${
                        fontSize === 'sm' ? 'text-base' :
                        fontSize === 'lg' ? 'text-xl' :
                        'text-2xl'
                      }`}>
                        {leftVerse.text}
                      </p>
                    </div>

                    {/* 右側の翻訳 */}
                    {rightVerse && (
                      <div className="pt-3 border-t border-gray-300">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-400 text-sm font-bold">{rightVerse.verse}</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {translationNames[rightTranslation]}
                          </span>
                        </div>
                        <p className={`text-gray-800 leading-relaxed ${
                          fontSize === 'sm' ? 'text-base' :
                          fontSize === 'lg' ? 'text-xl' :
                          'text-2xl'
                        }`}>
                          {rightVerse.text}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* URL共有 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>共有用URL:</strong>{' '}
          <code className="bg-white px-2 py-1 rounded text-blue-600 text-xs sm:text-sm break-all">
            {typeof window !== 'undefined' && `${window.location.origin}/?book=${book.id}&chapter=${chapter.chapter}`}
          </code>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          特定の節を共有する場合は、URLの最後に「&verse=節番号」を追加してください。<br />
          例: {typeof window !== 'undefined' && `${window.location.origin}/?book=${book.id}&chapter=${chapter.chapter}&verse=3`}
        </p>
      </div>
      </div>
    </>
  );
}
