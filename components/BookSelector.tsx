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
    <div className="bg-white rounded-lg shadow p-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] flex flex-col">
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
              <div className="text-xs font-bold text-green-600 mb-1 mt-3 px-3">
                ━━ 新約聖書 ━━
              </div>
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
