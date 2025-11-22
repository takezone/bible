'use client';

import { getBibleData } from '@/lib/bible-data';
import type { Book, Translation } from '@/types/bible';

interface BookSelectorProps {
  translation: Translation;
  selectedBook: Book | null;
  onSelectBook: (book: Book) => void;
}

export function BookSelector({ translation, selectedBook, onSelectBook }: BookSelectorProps) {
  const bible = getBibleData(translation);

  return (
    <div className="bg-white rounded-lg shadow p-4 lg:sticky lg:top-24">
      <h2 className="font-bold text-lg mb-3">書を選択</h2>

      <div className="space-y-1 max-h-[calc(100vh-150px)] overflow-y-auto">
        {bible.books.map((book, index) => (
          <div key={book.id}>
            {/* 旧約・新約の境界に見出しを表示 */}
            {index === 0 && (
              <div className="text-xs font-bold text-blue-600 mb-2 mt-2 px-3">
                ━━ 旧約聖書 ━━
              </div>
            )}
            {index === 39 && (
              <div className="text-xs font-bold text-green-600 mb-2 mt-4 px-3">
                ━━ 新約聖書 ━━
              </div>
            )}

            <button
              onClick={() => onSelectBook(book)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedBook?.id === book.id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
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
