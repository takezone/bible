'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getBibleData, searchVerses, getBook, getChapter, getPreviousBook, getNextBook } from '@/lib/bible-data';
import type { Book, Chapter, Verse, Translation } from '@/types/bible';
import { BookSelector } from '@/components/BookSelector';
import { ChapterViewer, type FontSize } from '@/components/ChapterViewer';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { Credits } from '@/components/Credits';
import { SettingsModal } from '@/components/SettingsModal';
import { PlacesList } from '@/components/PlacesList';
import { PlaceDetail } from '@/components/PlaceDetail';
import { getAllPlaces } from '@/lib/places-data';
import type { Place } from '@/types/places';

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

  // 表示モード: 'bible' (聖書) or 'places' (地図)
  const [viewMode, setViewMode] = useState<'bible' | 'places'>('bible');

  // 地名モード用の状態
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // URLパラメーターから状態を同期する関数
  const syncStateFromURL = (urlSearchParams?: URLSearchParams) => {
    const params = urlSearchParams || new URLSearchParams(window.location.search);
    const book = params.get('book');
    const chapterNum = params.get('chapter');
    const verseNum = params.get('verse');
    const mode = params.get('mode') as 'single' | 'parallel' | null;
    const translationParam = params.get('translation') as Translation | null;
    const leftParam = params.get('left') as Translation | null;
    const rightParam = params.get('right') as Translation | null;

    // 翻訳設定をURLから復元
    if (mode) {
      setDisplayMode(mode);
      if (mode === 'single' && translationParam) {
        setSingleTranslation(translationParam);
      } else if (mode === 'parallel') {
        if (leftParam) setLeftTranslation(leftParam);
        if (rightParam) setRightTranslation(rightParam);
      }
    }

    // 使用する翻訳を決定
    const effectiveTranslation = mode === 'single'
      ? (translationParam || singleTranslation)
      : (leftParam || leftTranslation);

    if (book && chapterNum) {
      const bookData = getBook(effectiveTranslation, book);
      const chapter = bookData ? getChapter(effectiveTranslation, book, parseInt(chapterNum)) : null;

      if (bookData && chapter) {
        setSelectedBook(bookData);
        setSelectedChapter(chapter);
        if (verseNum) {
          setSelectedVerse(parseInt(verseNum));
        } else {
          setSelectedVerse(null);
        }
        return true;
      }
    }
    return false;
  };

  // 初回ロード時にURLから状態を復元
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const synced = syncStateFromURL();
    if (!synced) {
      // URLパラメーターがない場合は創世記1章を表示
      const bible = getBibleData('kougo');
      const genesis = bible.books[0];
      setSelectedBook(genesis);
      setSelectedChapter(genesis.chapters[0]);
    }
    setInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ブラウザの戻る/進むボタンに対応
  useEffect(() => {
    const handlePopState = () => {
      syncStateFromURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleTranslation, leftTranslation]);

  // ページタイトルを更新
  useEffect(() => {
    if (viewMode === 'bible' && selectedBook && selectedChapter) {
      document.title = `Bible-ONE - ${selectedBook.name} 第${selectedChapter.chapter}章`;
    } else if (viewMode === 'places' && selectedPlace) {
      document.title = `Bible-ONE - ${selectedPlace.names.ja}`;
    } else {
      document.title = 'Bible-ONE';
    }
  }, [viewMode, selectedBook, selectedChapter, selectedPlace]);

  // 地名モードに切り替えた時に最初の地名を選択
  useEffect(() => {
    if (viewMode === 'places' && !selectedPlace) {
      const places = getAllPlaces();
      if (places.length > 0) {
        setSelectedPlace(places[0]);
      }
    }
  }, [viewMode, selectedPlace]);

  // 翻訳設定が変更されたらURLを更新
  useEffect(() => {
    if (!initialized || !selectedBook || !selectedChapter) return;
    updateURL(selectedBook.id, selectedChapter.chapter, selectedVerse);
  }, [displayMode, singleTranslation, leftTranslation, rightTranslation]);

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

  const handleSelectVerse = (book: Book, chapter: Chapter, verseNum: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setSelectedVerse(verseNum);
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
    updateURL(book.id, chapter.chapter, verseNum);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(book.chapters[0]);
    setSelectedVerse(null);
    setIsMobileMenuOpen(false); // メニューを閉じる
    updateURL(book.id, 1, null);
    // ページトップにスクロール
    window.scrollTo(0, 0);
  };

  const handleChapterChange = (chapterNum: number) => {
    if (!selectedBook) return;
    const newChapter = selectedBook.chapters.find(ch => ch.chapter === chapterNum);
    if (newChapter) {
      setSelectedChapter(newChapter);
      setSelectedVerse(null);
      updateURL(selectedBook.id, chapterNum, null);
      // ページトップにスクロール
      window.scrollTo(0, 0);
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

    // ページトップにスクロール
    window.scrollTo(0, 0);
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

    // ページトップにスクロール
    window.scrollTo(0, 0);
  };

  const handleVerseClick = (verseNum: number) => {
    if (!selectedBook || !selectedChapter) return;
    setSelectedVerse(verseNum);

    // 新しいURLを構築
    const params = new URLSearchParams();
    params.set('book', selectedBook.id);
    params.set('chapter', selectedChapter.chapter.toString());
    params.set('verse', verseNum.toString());
    params.set('mode', displayMode);
    if (displayMode === 'single') {
      params.set('translation', singleTranslation);
    } else {
      params.set('left', leftTranslation);
      params.set('right', rightTranslation);
    }

    const newUrl = `${window.location.origin}/?${params.toString()}`;

    // URLを更新
    router.replace(`/?${params.toString()}`, { scroll: false });

    // クリップボードにコピー
    navigator.clipboard.writeText(newUrl).then(() => {
      // コピー成功通知（一時的なalertの代わりにトースト表示）
      const toast = document.createElement('div');
      toast.textContent = 'URLをコピーしました';
      toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    });
  };

  const updateURL = (
    book: string,
    chapter: number,
    verse: number | null,
    options?: {
      mode?: 'single' | 'parallel';
      single?: Translation;
      left?: Translation;
      right?: Translation;
      replaceHistory?: boolean; // trueの場合は履歴を上書き（デフォルトは履歴追加）
    }
  ) => {
    const params = new URLSearchParams();
    params.set('book', book);
    params.set('chapter', chapter.toString());
    if (verse) {
      params.set('verse', verse.toString());
    }
    // 翻訳設定をURLに追加
    const mode = options?.mode ?? displayMode;
    params.set('mode', mode);
    if (mode === 'single') {
      params.set('translation', options?.single ?? singleTranslation);
    } else {
      params.set('left', options?.left ?? leftTranslation);
      params.set('right', options?.right ?? rightTranslation);
    }
    const url = `/?${params.toString()}`;
    // デフォルトでブラウザ履歴に追加（戻るボタンで戻れるように）
    // replaceHistoryがtrueの場合のみ履歴を上書き
    if (options?.replaceHistory) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url, { scroll: false });
    }
  };

  const handleNavigateToBible = (bookId: string, chapterNum: number, verseNum: number) => {
    const translation = displayMode === 'single' ? singleTranslation : leftTranslation;
    const book = getBook(translation, bookId);
    const chapter = book ? getChapter(translation, bookId, chapterNum) : null;

    if (book && chapter) {
      setSelectedBook(book);
      setSelectedChapter(chapter);
      setSelectedVerse(verseNum);
      setViewMode('bible');
      updateURL(bookId, chapterNum, verseNum);
    }
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

            {/* 現在の書物と章の表示 */}
            {viewMode === 'bible' && selectedBook && selectedChapter && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-semibold text-blue-900">
                  {selectedBook.name}：{selectedChapter.chapter}章
                </span>
              </div>
            )}

            {/* 聖書/地図 切り替えタブ */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('bible')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'bible'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-base">📖</span>
                <span>聖書</span>
              </button>
              <button
                onClick={() => setViewMode('places')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'places'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-base">🗺️</span>
                <span>地図</span>
              </button>
            </div>

            {/* 原典学習リンク */}
            <Link
              href="/greek"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <span className="text-base">🇬🇷</span>
              <span>原典学習</span>
            </Link>

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
        ) : viewMode === 'bible' ? (
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
                  onVerseClick={handleVerseClick}
                  onNavigateToReference={handleNavigateToBible}
                />
              )}
            </div>
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

            {/* サイドバー - 地名リスト */}
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
              <PlacesList
                selectedPlace={selectedPlace}
                onSelectPlace={(place) => {
                  setSelectedPlace(place);
                  setIsMobileMenuOpen(false);
                }}
              />
            </aside>

            {/* メインコンテンツ - 地名詳細 */}
            <div className="lg:col-span-3 relative">
              {selectedPlace && (
                <PlaceDetail
                  place={selectedPlace}
                  onNavigateToBible={handleNavigateToBible}
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
