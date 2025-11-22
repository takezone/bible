'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getBibleData, searchVerses, getBook, getChapter, getPreviousBook, getNextBook } from '@/lib/bible-data';
import type { Book, Chapter, Verse, Translation } from '@/types/bible';
import { BookSelector } from '@/components/BookSelector';
import { ChapterViewer, type FontSize } from '@/components/ChapterViewer';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { Credits } from '@/components/Credits';
import { SettingsModal } from '@/components/SettingsModal';

function BibleApp() {
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

  // 設定モーダルの開閉
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const handlePreviousChapter = () => {
    if (!selectedBook || !selectedChapter) return;

    const currentChapterIndex = selectedBook.chapters.findIndex(ch => ch.chapter === selectedChapter.chapter);

    if (currentChapterIndex > 0) {
      // 同じ書の前の章へ
      const prevChapter = selectedBook.chapters[currentChapterIndex - 1];
      setSelectedChapter(prevChapter);
      setSelectedVerse(null);
      updateURL(selectedBook.id, prevChapter.chapter, null);
    } else {
      // 前の書の最後の章へ
      const prevBookInfo = getPreviousBook(selectedBook.id);
      if (prevBookInfo) {
        const translation = displayMode === 'single' ? singleTranslation : leftTranslation;
        const prevBook = getBook(translation, prevBookInfo.id);
        if (prevBook) {
          const lastChapter = prevBook.chapters[prevBook.chapters.length - 1];
          setSelectedBook(prevBook);
          setSelectedChapter(lastChapter);
          setSelectedVerse(null);
          updateURL(prevBook.id, lastChapter.chapter, null);
        }
      }
    }
  };

  const handleNextChapter = () => {
    if (!selectedBook || !selectedChapter) return;

    const currentChapterIndex = selectedBook.chapters.findIndex(ch => ch.chapter === selectedChapter.chapter);

    if (currentChapterIndex < selectedBook.chapters.length - 1) {
      // 同じ書の次の章へ
      const nextChapter = selectedBook.chapters[currentChapterIndex + 1];
      setSelectedChapter(nextChapter);
      setSelectedVerse(null);
      updateURL(selectedBook.id, nextChapter.chapter, null);
    } else {
      // 次の書の最初の章へ
      const nextBookInfo = getNextBook(selectedBook.id);
      if (nextBookInfo) {
        const translation = displayMode === 'single' ? singleTranslation : leftTranslation;
        const nextBook = getBook(translation, nextBookInfo.id);
        if (nextBook) {
          const firstChapter = nextBook.chapters[0];
          setSelectedBook(nextBook);
          setSelectedChapter(firstChapter);
          setSelectedVerse(null);
          updateURL(nextBook.id, firstChapter.chapter, null);
        }
      }
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-4">
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

            {/* 設定アイコン */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="設定"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 設定モーダル */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        singleTranslation={singleTranslation}
        leftTranslation={leftTranslation}
        rightTranslation={rightTranslation}
        onSingleTranslationChange={setSingleTranslation}
        onLeftTranslationChange={setLeftTranslation}
        onRightTranslationChange={setRightTranslation}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

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

            <div className="lg:col-span-3 relative">
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
                  onPreviousChapter={handlePreviousChapter}
                  onNextChapter={handleNextChapter}
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <BibleApp />
    </Suspense>
  );
}
