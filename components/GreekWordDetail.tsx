'use client';

import type { GreekWord } from '@/types/greek';

interface GreekWordDetailProps {
  word: GreekWord;
  onClose: () => void;
}

export function GreekWordDetail({ word, onClose }: GreekWordDetailProps) {
  // 文法情報を文字列に変換
  const morphString = word.morph
    ? Object.entries(word.morph)
        .filter(([, v]) => v)
        .map(([, v]) => v)
        .join(' / ')
    : '—';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="bg-blue-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-serif">{word.lemma}</h2>
              <p className="text-blue-100 text-lg">{word.translit}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* 発音 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">発音（カタカナ）</div>
            <div className="text-xl">{word.katakana || '—'}</div>
          </div>

          {/* 活用形 */}
          {word.text !== word.lemma && (
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="text-sm text-gray-500 mb-1">本文での形</div>
              <div className="text-xl font-serif">{word.text}</div>
              <div className="text-sm text-gray-600">{word.translit}</div>
            </div>
          )}

          {/* 品詞 */}
          <div>
            <div className="text-sm text-gray-500 mb-1">品詞</div>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {word.posName}
            </span>
          </div>

          {/* 文法情報 */}
          {word.morph && (
            <div>
              <div className="text-sm text-gray-500 mb-1">文法</div>
              <div className="flex flex-wrap gap-2">
                {word.morph.person && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {word.morph.person}
                  </span>
                )}
                {word.morph.tense && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                    {word.morph.tense}
                  </span>
                )}
                {word.morph.voice && (
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm">
                    {word.morph.voice}
                  </span>
                )}
                {word.morph.mood && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                    {word.morph.mood}
                  </span>
                )}
                {word.morph.case && (
                  <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-sm">
                    {word.morph.case}
                  </span>
                )}
                {word.morph.number && (
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                    {word.morph.number}
                  </span>
                )}
                {word.morph.gender && (
                  <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-sm">
                    {word.morph.gender}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 意味 */}
          <div>
            <div className="text-sm text-gray-500 mb-1">意味</div>
            <div className="text-lg font-medium">
              {word.gloss || '—'}
            </div>
          </div>

          {/* 英語定義 */}
          {word.definition && (
            <div>
              <div className="text-sm text-gray-500 mb-1">定義（英語）</div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {word.definition}
              </div>
            </div>
          )}

          {/* Strong's番号 */}
          {word.strongs && (
            <div className="text-sm text-gray-400">
              Strong's: {word.strongs}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
