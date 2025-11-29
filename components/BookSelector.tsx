'use client';

import Link from 'next/link';
import { getBibleData } from '@/lib/bible-data';
import type { Book, Translation } from '@/types/bible';

interface BookSelectorProps {
  translation: Translation;
  selectedBook: Book | null;
  onSelectBook: (book: Book) => void;
}

export function BookSelector({ translation, selectedBook, onSelectBook }: BookSelectorProps) {
  const bible = getBibleData(translation);

  // 選択中の書物のインデックスを取得（旧約/新約の判定用）
  const selectedBookIndex = selectedBook
    ? bible.books.findIndex(b => b.id === selectedBook.id)
    : -1;

  return (
    <div className="bg-white rounded-lg shadow p-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] flex flex-col">
      {/* 選択中の書物を上部に固定表示 */}
      {selectedBook && (
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="text-xs text-gray-500 mb-1 px-1">現在の書物</div>
          <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium">
            {selectedBook.name}
            <span className="ml-2 text-xs opacity-75">
              ({selectedBookIndex < 39 ? '旧約' : '新約'})
            </span>
          </div>
        </div>
      )}

      <div className="space-y-0.5 overflow-y-auto flex-1">
        {bible.books.map((book, index) => (
          <div key={book.id}>
            {/* 旧約・新約の境界に見出しを表示 */}
            {index === 0 && (
              <div className="text-xs font-bold text-blue-600 mb-1 mt-1 px-3">
                ━━ 旧約聖書 ━━
              </div>
            )}
            {index === 39 && (
              <>
                <Link
                  href="/places"
                  className="block w-full text-center px-3 py-2 my-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded font-semibold text-sm transition-colors"
                >
                  <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  聖書地名
                </Link>
                <div className="text-xs font-bold text-green-600 mb-1 mt-3 px-3">
                  ━━ 新約聖書 ━━
                </div>
              </>
            )}

            <button
              onClick={() => onSelectBook(book)}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                selectedBook?.id === book.id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-blue-100'
              }`}
            >
              {book.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
