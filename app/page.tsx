'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getBibleData, searchVerses, getBook, getChapter } from '@/lib/bible-data';
import type { Book, Chapter, Verse, Translation } from '@/types/bible';
import { BookSelector } from '@/components/BookSelector';
import { ChapterViewer, type FontSize } from '@/components/ChapterViewer';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { Credits } from '@/components/Credits';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [primaryTranslation, setPrimaryTranslation] = useState<Translation>('kougo');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ book: Book; chapter: Chapter; verse: Verse }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 表示モード: 'single' (単体表示) or 'parallel' (2列並列表示)
  const [displayMode, setDisplayMode] = useState<'single' | 'parallel'>('parallel');

  // 単体表示時の翻訳
  const [singleTranslation, setSingleTranslation] = useState<Translation>('kougo');

  // 並列表示時の左右の翻訳
  const [leftTranslation, setLeftTranslation] = useState<Translation>('kougo');
  const [rightTranslation, setRightTranslation] = useState<Translation>('web');

  // 文字サイズ
  const [fontSize, setFontSize] = useState<FontSize>('lg');

  // スマホメニューの開閉
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // URLパラメーターから初期値を設定
  useEffect(() => {
    const book = searchParams.get('book');
    const chapterNum = searchParams.get('chapter');
    const verseNum = searchParams.get('verse');

    if (book && chapterNum) {
      const translation = displayMode === 'single' ? singleTranslation : leftTranslation;
      const bookData = getBook(translation, book);
      const chapter = bookData ? getChapter(translation, book, parseInt(chapterNum)) : null;

      if (bookData && chapter) {
        setSelectedBook(bookData);
        setSelectedChapter(chapter);
        if (verseNum) {
          setSelectedVerse(parseInt(verseNum));
        }
        return;
      }
    }

    // URLパラメーターがない場合は創世記1章を表示
    const bible = getBibleData('kougo');
    const genesis = bible.books[0];
    setSelectedBook(genesis);
    setSelectedChapter(genesis.chapters[0]);
  }, [searchParams, displayMode, singleTranslation, leftTranslation]);

  // ページタイトルを更新
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      document.title = `Bible-ONE - ${selectedBook.name} 第${selectedChapter.chapter}章`;
    } else {
      document.title = 'Bible-ONE';
    }
  }, [selectedBook, selectedChapter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // 選択中の翻訳で検索（単体モードの場合はその翻訳、並列モードの場合は左側の翻訳）
    const searchTranslation = displayMode === 'single' ? singleTranslation : leftTranslation;
    const results = searchVerses(searchTranslation, query);
    setSearchResults(results);
  };

  const handleSelectVerse = (book: Book, chapter: Chapter) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(book.chapters[0]);
    setSelectedVerse(null);
    setIsMobileMenuOpen(false); // メニューを閉じる
    updateURL(book.id, 1, null);
  };

  const handleChapterChange = (chapterNum: number) => {
    if (!selectedBook) return;
    const newChapter = selectedBook.chapters.find(ch => ch.chapter === chapterNum);
    if (newChapter) {
      setSelectedChapter(newChapter);
      setSelectedVerse(null);
      updateURL(selectedBook.id, chapterNum, null);
    }
  };

  const updateURL = (book: string, chapter: number, verse: number | null) => {
    const params = new URLSearchParams();
    params.set('book', book);
    params.set('chapter', chapter.toString());
    if (verse) {
      params.set('verse', verse.toString());
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          {/* 1行目: タイトル、検索、文字サイズ */}
          <div className="flex items-center gap-2 sm:gap-4 mb-2">
            {/* ハンバーガーメニューボタン (モバイルのみ) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex-shrink-0 p-2 hover:bg-gray-100 rounded"
              aria-label="メニュー"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex-shrink-0">Bible-ONE</h1>

            <div className="flex-1"></div>

            <div className="w-48 sm:w-64">
              <SearchBar
                onSearch={handleSearch}
                value={searchQuery}
              />
            </div>

            {/* 文字サイズ選択 */}
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

          {/* 2行目: 表示モード選択と翻訳選択 */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            {/* 表示モード */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="single"
                  checked={displayMode === 'single'}
                  onChange={(e) => setDisplayMode('single')}
                  className="w-3 h-3"
                />
                <span className="text-gray-700">単体</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="parallel"
                  checked={displayMode === 'parallel'}
                  onChange={(e) => setDisplayMode('parallel')}
                  className="w-3 h-3"
                />
                <span className="text-gray-700">並列</span>
              </label>
            </div>

            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>

            {/* 単体表示時の翻訳選択 */}
            {displayMode === 'single' && (
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="kougo"
                    checked={singleTranslation === 'kougo'}
                    onChange={(e) => setSingleTranslation('kougo')}
                    className="w-3 h-3"
                  />
                  <span className="text-gray-700">口語訳</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="kjv"
                    checked={singleTranslation === 'kjv'}
                    onChange={(e) => setSingleTranslation('kjv')}
                    className="w-3 h-3"
                  />
                  <span className="text-gray-700">KJV</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="web"
                    checked={singleTranslation === 'web'}
                    onChange={(e) => setSingleTranslation('web')}
                    className="w-3 h-3"
                  />
                  <span className="text-gray-700">NHEB</span>
                </label>
              </div>
            )}

            {/* 並列表示時の左右翻訳選択 */}
            {displayMode === 'parallel' && (
              <>
                {/* 左側 */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 font-medium"><span className="sm:hidden">上:</span><span className="hidden sm:inline">左:</span></span>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="kougo"
                      checked={leftTranslation === 'kougo'}
                      onChange={(e) => setLeftTranslation('kougo')}
                      className="w-3 h-3"
                    />
                    <span className="text-gray-700">口語</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="kjv"
                      checked={leftTranslation === 'kjv'}
                      onChange={(e) => setLeftTranslation('kjv')}
                      className="w-3 h-3"
                    />
                    <span className="text-gray-700">KJV</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="web"
                      checked={leftTranslation === 'web'}
                      onChange={(e) => setLeftTranslation('web')}
                      className="w-3 h-3"
                    />
                    <span className="text-gray-700">NHEB</span>
                  </label>
                </div>

                <div className="hidden sm:block w-px h-4 bg-gray-300"></div>

                {/* 右側 */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 font-medium"><span className="sm:hidden">下:</span><span className="hidden sm:inline">右:</span></span>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="kougo"
                      checked={rightTranslation === 'kougo'}
                      onChange={(e) => setRightTranslation('kougo')}
                      className="w-3 h-3"
                    />
                    <span className="text-gray-700">口語</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="kjv"
                      checked={rightTranslation === 'kjv'}
                      onChange={(e) => setRightTranslation('kjv')}
                      className="w-3 h-3"
                    />
                    <span className="text-gray-700">KJV</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="web"
                      checked={rightTranslation === 'web'}
                      onChange={(e) => setRightTranslation('web')}
                      className="w-3 h-3"
                    />
                    <span className="text-gray-700">NHEB</span>
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {isSearching && searchResults.length > 0 ? (
          <SearchResults
            results={searchResults}
            query={searchQuery}
            onSelectVerse={handleSelectVerse}
          />
        ) : isSearching && searchResults.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            「{searchQuery}」の検索結果が見つかりませんでした
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* モバイルメニューオーバーレイ */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* サイドバー */}
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
              overflow-y-auto lg:overflow-visible
              pt-16 lg:pt-0
            `}>
              <BookSelector
                translation={displayMode === 'single' ? singleTranslation : leftTranslation}
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
                  highlightVerse={selectedVerse}
                  onChapterChange={handleChapterChange}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <Credits />
    </div>
  );
}
