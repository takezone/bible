'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getBibleData, getBook, getChapter } from '@/lib/bible-data';
import type { Book, Chapter, Translation } from '@/types/bible';
import { BookSelector } from '@/components/BookSelector';
import { ChapterViewer, type FontSize } from '@/components/ChapterViewer';
import { SearchBar } from '@/components/SearchBar';
import { Credits } from '@/components/Credits';

export default function BiblePage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const chapterNum = parseInt(params.chapter as string);
  const paramsArray = params.params as string[] | undefined;
  const verseNum = paramsArray && paramsArray.length > 0 ? parseInt(paramsArray[0]) : null;

  const [displayMode, setDisplayMode] = useState<'single' | 'parallel'>('parallel');
  const [singleTranslation, setSingleTranslation] = useState<Translation>('kougo');
  const [leftTranslation, setLeftTranslation] = useState<Translation>('kougo');
  const [rightTranslation, setRightTranslation] = useState<Translation>('web');
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 現在の翻訳でデータを取得
  const translation = displayMode === 'single' ? singleTranslation : leftTranslation;
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    const book = getBook(translation, bookId);
    const chapter = book ? getChapter(translation, bookId, chapterNum) : null;
    setSelectedBook(book || null);
    setSelectedChapter(chapter || null);
  }, [bookId, chapterNum, translation]);

  const handleBookSelect = (book: Book) => {
    window.location.href = `/${book.id}/1`;
  };

  const handleChapterChange = (newChapterNum: number) => {
    window.location.href = `/${bookId}/${newChapterNum}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4 mb-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex-shrink-0 p-2 hover:bg-gray-100 rounded"
              aria-label="メニュー"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex-shrink-0">
              <a href="/">Bible-ONE</a>
            </h1>

            <div className="flex-1"></div>

            <div className="w-48 sm:w-64">
              <SearchBar onSearch={() => {}} value="" />
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className="text-xs text-gray-700 font-medium hidden sm:inline">文字:</span>
              <div className="flex gap-1">
                {[
                  { value: 'sm' as FontSize, label: '小' },
                  { value: 'lg' as FontSize, label: '中' },
                  { value: 'xl' as FontSize, label: '大' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      fontSize === size.value
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="single"
                  checked={displayMode === 'single'}
                  onChange={() => setDisplayMode('single')}
                  className="w-3 h-3"
                />
                <span className="text-gray-700">単体</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="parallel"
                  checked={displayMode === 'parallel'}
                  onChange={() => setDisplayMode('parallel')}
                  className="w-3 h-3"
                />
                <span className="text-gray-700">並列</span>
              </label>
            </div>

            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>

            {displayMode === 'single' && (
              <div className="flex items-center gap-2 flex-wrap">
                {['kougo', 'kjv', 'web'].map((trans) => (
                  <label key={trans} className="flex items-center gap-1">
                    <input
                      type="radio"
                      value={trans}
                      checked={singleTranslation === trans}
                      onChange={() => setSingleTranslation(trans as Translation)}
                      className="w-3 h-3"
                    />
                    <span className="text-gray-700">
                      {trans === 'kougo' ? '口語訳' : trans === 'kjv' ? 'KJV' : 'WEB'}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {displayMode === 'parallel' && (
              <>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 font-medium">左:</span>
                  {['kougo', 'kjv', 'web'].map((trans) => (
                    <label key={trans} className="flex items-center gap-1">
                      <input
                        type="radio"
                        value={trans}
                        checked={leftTranslation === trans}
                        onChange={() => setLeftTranslation(trans as Translation)}
                        className="w-3 h-3"
                      />
                      <span className="text-gray-700">
                        {trans === 'kougo' ? '口語' : trans.toUpperCase()}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="hidden sm:block w-px h-4 bg-gray-300"></div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 font-medium">右:</span>
                  {['kougo', 'kjv', 'web'].map((trans) => (
                    <label key={trans} className="flex items-center gap-1">
                      <input
                        type="radio"
                        value={trans}
                        checked={rightTranslation === trans}
                        onChange={() => setRightTranslation(trans as Translation)}
                        className="w-3 h-3"
                      />
                      <span className="text-gray-700">
                        {trans === 'kougo' ? '口語' : trans.toUpperCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          <aside className={`
            lg:col-span-1
            fixed lg:relative
            inset-y-0 left-0
            w-80 lg:w-auto
            bg-white lg:bg-transparent
            z-50 lg:z-auto
            transform lg:transform-none
            transition-transform duration-300
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
            pt-16 lg:pt-0
          `}>
            <BookSelector
              translation={translation}
              selectedBook={selectedBook}
              onSelectBook={handleBookSelect}
            />
          </aside>

          <div className="lg:col-span-3">
            {selectedBook && selectedChapter && (
              <ChapterViewer
                book={selectedBook}
                chapter={selectedChapter}
                displayMode={displayMode}
                singleTranslation={singleTranslation}
                leftTranslation={leftTranslation}
                rightTranslation={rightTranslation}
                fontSize={fontSize}
                highlightVerse={verseNum}
                onChapterChange={handleChapterChange}
              />
            )}
          </div>
        </div>
      </main>

      <Credits />
    </div>
  );
}
