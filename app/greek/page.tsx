'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NT_BOOKS, getGreekChapter } from '@/lib/greek-data';
import { GreekVerseView } from '@/components/GreekVerseView';
import { getChapter } from '@/lib/bible-data';
import type { GreekChapter, LearningLevel } from '@/types/greek';

export default function GreekStudyPage() {
  const [selectedBookId, setSelectedBookId] = useState('john');
  const [selectedChapterNum, setSelectedChapterNum] = useState(1);
  const [greekChapter, setGreekChapter] = useState<GreekChapter | null>(null);
  const [japaneseVerses, setJapaneseVerses] = useState<Map<number, string>>(new Map());
  const [level, setLevel] = useState<LearningLevel>('beginner');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 章データを読み込み（オンデマンド）
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const chapter = await getGreekChapter(selectedBookId, selectedChapterNum);
      setGreekChapter(chapter);

      // 日本語訳も読み込み（口語訳）
      const jpChapter = getChapter('kougo', selectedBookId, selectedChapterNum);
      if (jpChapter) {
        const verseMap = new Map<number, string>();
        jpChapter.verses.forEach(v => verseMap.set(v.verse, v.text));
        setJapaneseVerses(verseMap);
      }
      setLoading(false);
    }
    loadData();
  }, [selectedBookId, selectedChapterNum]);

  const bookInfo = NT_BOOKS.find(b => b.id === selectedBookId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-white/80 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold">ギリシャ語学習</h1>
                <p className="text-blue-200 text-sm">新約聖書原語学習モード</p>
              </div>
            </div>

            {/* 学習レベル選択 */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-blue-200">レベル:</span>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as LearningLevel)}
                className="bg-blue-600 text-white border border-blue-500 rounded px-2 py-1 text-sm"
              >
                <option value="beginner">初級（カタカナ+意味）</option>
                <option value="intermediate">中級（ローマ字+品詞）</option>
                <option value="advanced">上級（ギリシャ語のみ）</option>
              </select>
            </div>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* モバイル: レベル選択 */}
          <div className="sm:hidden mt-2">
            <select
              value={level}
              onChange={e => setLevel(e.target.value as LearningLevel)}
              className="w-full bg-blue-600 text-white border border-blue-500 rounded px-2 py-1 text-sm"
            >
              <option value="beginner">初級（カタカナ+意味）</option>
              <option value="intermediate">中級（ローマ字+品詞）</option>
              <option value="advanced">上級（ギリシャ語のみ）</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* サイドバー: 書物選択 */}
          <aside className={`lg:w-64 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow p-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h2 className="font-bold text-gray-700 mb-3">新約聖書</h2>

              {/* 選択中の書物 */}
              {bookInfo && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">現在の書物</div>
                  <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium">
                    {bookInfo.name}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {/* 福音書 */}
                <div className="text-xs font-bold text-blue-600 mb-1 mt-2 px-2">━━ 福音書 ━━</div>
                {NT_BOOKS.slice(0, 4).map(book => (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedBookId(book.id);
                      setSelectedChapterNum(1);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedBookId === book.id
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-blue-100'
                    }`}
                  >
                    {book.shortName}
                  </button>
                ))}

                {/* 使徒行伝 */}
                <div className="text-xs font-bold text-green-600 mb-1 mt-3 px-2">━━ 歴史 ━━</div>
                <button
                  onClick={() => {
                    setSelectedBookId('acts');
                    setSelectedChapterNum(1);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                    selectedBookId === 'acts'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-blue-100'
                  }`}
                >
                  使徒行伝
                </button>

                {/* パウロ書簡 */}
                <div className="text-xs font-bold text-purple-600 mb-1 mt-3 px-2">━━ パウロ書簡 ━━</div>
                {NT_BOOKS.slice(5, 18).map(book => (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedBookId(book.id);
                      setSelectedChapterNum(1);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedBookId === book.id
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-blue-100'
                    }`}
                  >
                    {book.shortName}
                  </button>
                ))}

                {/* 一般書簡 */}
                <div className="text-xs font-bold text-orange-600 mb-1 mt-3 px-2">━━ 一般書簡 ━━</div>
                {NT_BOOKS.slice(18, 26).map(book => (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedBookId(book.id);
                      setSelectedChapterNum(1);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedBookId === book.id
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-blue-100'
                    }`}
                  >
                    {book.shortName}
                  </button>
                ))}

                {/* 黙示録 */}
                <div className="text-xs font-bold text-red-600 mb-1 mt-3 px-2">━━ 黙示文学 ━━</div>
                <button
                  onClick={() => {
                    setSelectedBookId('revelation');
                    setSelectedChapterNum(1);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                    selectedBookId === 'revelation'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-blue-100'
                  }`}
                >
                  黙示録
                </button>
              </div>
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">読み込み中...</p>
              </div>
            ) : (
              <>
                {/* 章ナビゲーション */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                      {bookInfo?.name} 第{selectedChapterNum}章
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedChapterNum(prev => Math.max(1, prev - 1))}
                        disabled={selectedChapterNum === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                      >
                        ← 前章
                      </button>
                      <button
                        onClick={() => setSelectedChapterNum(prev => Math.min(bookInfo?.chapters || 1, prev + 1))}
                        disabled={selectedChapterNum === (bookInfo?.chapters || 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                      >
                        次章 →
                      </button>
                    </div>
                  </div>

                  {/* 章番号選択 */}
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: bookInfo?.chapters || 0 }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        onClick={() => setSelectedChapterNum(num)}
                        className={`px-3 py-1 rounded text-sm ${
                          num === selectedChapterNum
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* レベル説明 */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    {level === 'beginner' && (
                      <>
                        <strong>初級モード:</strong> カタカナ音写と日本語の意味を表示。単語をタップすると詳細が見られます。
                      </>
                    )}
                    {level === 'intermediate' && (
                      <>
                        <strong>中級モード:</strong> ローマ字音写と品詞を表示。文法構造を意識しながら学習できます。
                      </>
                    )}
                    {level === 'advanced' && (
                      <>
                        <strong>上級モード:</strong> ギリシャ語テキストのみ表示。単語タップで辞書を参照できます。
                      </>
                    )}
                  </p>
                </div>

                {/* 節一覧 */}
                <div className="space-y-2">
                  {greekChapter?.verses.map(verse => (
                    <GreekVerseView
                      key={verse.verse}
                      verse={verse}
                      japaneseText={japaneseVerses.get(verse.verse)}
                      level={level}
                    />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
