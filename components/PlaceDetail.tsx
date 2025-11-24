'use client';

import { useState } from 'react';
import type { Place } from '@/types/places';
import { getPlaceTypeName, getPeriodName, getMapsForPlace } from '@/lib/places-data';

interface PlaceDetailProps {
  place: Place;
  onNavigateToBible?: (book: string, chapter: number, verse: number) => void;
}

export function PlaceDetail({ place, onNavigateToBible }: PlaceDetailProps) {
  const maps = getMapsForPlace(place);
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.names.ja}</h1>
            <div className="space-y-1">
              <p className="text-xl text-gray-600">{place.names.en}</p>
              {place.names.transliteration && (
                <p className="text-sm text-gray-500">{place.names.transliteration}</p>
              )}
              <div className="flex items-center gap-3 text-sm">
                {place.names.hebrew && (
                  <span className="text-gray-600">ヘブライ語: {place.names.hebrew}</span>
                )}
                {place.names.greek && (
                  <span className="text-gray-600">ギリシャ語: {place.names.greek}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="text-2xl">
              {'⭐'.repeat(place.importance)}
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              重要度 {place.importance}
            </div>
          </div>
        </div>
      </div>

      {/* メタ情報 */}
      <div className="border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">地名の種類</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {getPlaceTypeName(place.type, 'ja')}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">関連する時代</h3>
            <div className="flex flex-wrap gap-2">
              {place.periods.map(period => (
                <span
                  key={period}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {getPeriodName(period, 'ja')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 説明 */}
      {place.description && (
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">説明</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">日本語</h3>
              <p className="text-gray-700 leading-relaxed">{place.description.ja}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">English</h3>
              <p className="text-gray-700 leading-relaxed">{place.description.en}</p>
            </div>
          </div>
        </div>
      )}

      {/* 地図表示 */}
      {maps.length > 0 && (
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連する地図</h2>

          {/* 地図選択タブ（複数の地図がある場合） */}
          {maps.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {maps.map((map, index) => (
                <button
                  key={map.period}
                  onClick={() => setSelectedMapIndex(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedMapIndex === index
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {map.title.ja}
                </button>
              ))}
            </div>
          )}

          {/* 地図画像 */}
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={maps[selectedMapIndex].imageUrl}
                alt={maps[selectedMapIndex].title.ja}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>

            {/* 地図情報 */}
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold">{maps[selectedMapIndex].title.ja}</p>
              {maps[selectedMapIndex].description && (
                <p className="text-gray-500">{maps[selectedMapIndex].description.ja}</p>
              )}
              <p className="text-xs text-gray-400">
                出典: {maps[selectedMapIndex].source} | {maps[selectedMapIndex].license}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 聖書の参照箇所 */}
      {place.biblicalReferences && place.biblicalReferences.length > 0 && (
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">聖書の参照箇所</h2>
          <div className="space-y-3">
            {place.biblicalReferences.map((ref, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <button
                      onClick={() => onNavigateToBible?.(ref.book, ref.chapter, ref.verse || 1)}
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm mb-1 hover:underline"
                    >
                      {ref.book} {ref.chapter}章{ref.verse ? `${ref.verse}節` : ''}
                      {ref.endVerse && ref.endVerse !== ref.verse && `-${ref.endVerse}節`}
                    </button>
                    {ref.context && (
                      <p className="text-gray-600 text-sm mt-2">
                        {typeof ref.context === 'string' ? ref.context : ref.context.ja}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 参照箇所がない場合 */}
      {(!place.biblicalReferences || place.biblicalReferences.length === 0) && (
        <div className="p-6 text-center text-gray-500">
          聖書の参照箇所はまだ登録されていません
        </div>
      )}
    </div>
  );
}
