'use client';

import { useState } from 'react';
import type { GreekVerse, GreekWord, LearningLevel } from '@/types/greek';
import { GreekWordDetail } from './GreekWordDetail';

interface GreekVerseViewProps {
  verse: GreekVerse;
  japaneseText?: string;
  level: LearningLevel;
  highlightVerse?: boolean;
}

function GreekWordBlock({ word, level, onClick }: {
  word: GreekWord;
  level: LearningLevel;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex flex-col items-center px-1 py-2 hover:bg-blue-50 rounded transition-colors cursor-pointer group"
    >
      {/* ギリシャ語 */}
      <span className="text-xl font-serif text-gray-900 group-hover:text-blue-600">
        {word.text}
      </span>

      {/* 音写（初級・中級のみ） */}
      {level !== 'advanced' && (
        <span className="text-xs text-gray-500">
          {word.katakana}
        </span>
      )}

      {/* 意味（初級のみ） */}
      {level === 'beginner' && word.gloss && (
        <span className="text-xs text-blue-600 font-medium">
          {word.gloss}
        </span>
      )}

      {/* 品詞（中級のみ） */}
      {level === 'intermediate' && (
        <span className="text-[10px] text-gray-400">
          {word.posName}
        </span>
      )}
    </button>
  );
}

export function GreekVerseView({ verse, japaneseText, level, highlightVerse }: GreekVerseViewProps) {
  const [selectedWord, setSelectedWord] = useState<GreekWord | null>(null);

  return (
    <>
      <div
        className={`rounded-lg p-4 transition-colors ${
          highlightVerse ? 'bg-yellow-50' : 'bg-white'
        }`}
      >
        {/* 節番号 */}
        <div className="flex items-start gap-3">
          <span className="text-gray-400 font-bold text-lg min-w-[2rem]">
            {verse.verse}
          </span>

          <div className="flex-1">
            {/* ギリシャ語（単語ごと） */}
            <div className="flex flex-wrap gap-1 mb-3">
              {verse.words.map((word, idx) => (
                <GreekWordBlock
                  key={idx}
                  word={word}
                  level={level}
                  onClick={() => setSelectedWord(word)}
                />
              ))}
            </div>

            {/* 日本語訳 */}
            {japaneseText && level === 'beginner' && (
              <div className="text-gray-600 text-sm border-t border-gray-100 pt-2 mt-2">
                {japaneseText}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 単語詳細モーダル */}
      {selectedWord && (
        <GreekWordDetail
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </>
  );
}
