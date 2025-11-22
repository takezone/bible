'use client';

import type { Book, Chapter, Verse } from '@/types/bible';

interface SearchResultsProps {
  results: Array<{ book: Book; chapter: Chapter; verse: Verse }>;
  query: string;
  onSelectVerse: (book: Book, chapter: Chapter) => void;
}

export function SearchResults({ results, query, onSelectVerse }: SearchResultsProps) {
  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold">
          検索結果: {results.length}件
        </h2>
        <p className="text-sm text-gray-600">「{query}」を含む節</p>
      </div>

      <div className="divide-y divide-gray-200">
        {results.map((result, index) => (
          <button
            key={index}
            onClick={() => onSelectVerse(result.book, result.chapter)}
            className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                  {result.book.name} {result.chapter.chapter}:{result.verse.verse}
                </span>
              </div>
              <p className="text-gray-800 leading-relaxed">
                {highlightText(result.verse.text, query)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
