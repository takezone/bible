'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  getAllPlaces,
  searchPlaces,
  getPlaceTypeName,
  getPeriodName,
  getAllPlaceTypes,
  getAllPeriods
} from '@/lib/places-data';
import type { Place, PlaceType, Period } from '@/types/places';

export default function PlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PlaceType | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<Period | 'all'>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');

  // フィルター適用
  const filteredPlaces = useMemo(() => {
    let places = searchQuery
      ? searchPlaces(searchQuery)
      : getAllPlaces();

    if (selectedType !== 'all') {
      places = places.filter(p => p.type === selectedType);
    }

    if (selectedPeriod !== 'all') {
      places = places.filter(p => p.periods.includes(selectedPeriod));
    }

    // 重要度と名前でソート
    return places.sort((a, b) => {
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }
      return a.names[language].localeCompare(b.names[language]);
    });
  }, [searchQuery, selectedType, selectedPeriod, language]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ja' ? '聖書地名一覧' : 'Biblical Places'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'ja'
                  ? `全${getAllPlaces().length}箇所の地名（日英対訳）`
                  : `${getAllPlaces().length} places with Japanese-English translations`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                {language === 'ja' ? 'English' : '日本語'}
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                {language === 'ja' ? '聖書に戻る' : 'Back to Bible'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバー: フィルター */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h2 className="text-lg font-bold mb-4 text-gray-900">
                {language === 'ja' ? 'フィルター' : 'Filters'}
              </h2>

              {/* 検索 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ja' ? '検索' : 'Search'}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ja' ? '地名を検索...' : 'Search places...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* タイプフィルター */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ja' ? 'タイプ' : 'Type'}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as PlaceType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{language === 'ja' ? 'すべて' : 'All'}</option>
                  {getAllPlaceTypes().map(type => (
                    <option key={type} value={type}>
                      {getPlaceTypeName(type, language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* 時代フィルター */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ja' ? '時代' : 'Period'}
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as Period | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">{language === 'ja' ? 'すべて' : 'All'}</option>
                  {getAllPeriods().map(period => (
                    <option key={period} value={period}>
                      {getPeriodName(period, language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* リセットボタン */}
              {(searchQuery || selectedType !== 'all' || selectedPeriod !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedPeriod('all');
                  }}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  {language === 'ja' ? 'リセット' : 'Reset'}
                </button>
              )}
            </div>
          </div>

          {/* メインコンテンツ: 地名一覧 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">
                  {language === 'ja'
                    ? `検索結果: ${filteredPlaces.length}件`
                    : `Results: ${filteredPlaces.length} places`}
                </h2>
              </div>

              {filteredPlaces.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {language === 'ja'
                    ? '該当する地名が見つかりませんでした'
                    : 'No places found'}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredPlaces.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => setSelectedPlace(place)}
                      className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {place.names[language]}
                            </h3>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {getPlaceTypeName(place.type, language)}
                            </span>
                            {'⭐'.repeat(place.importance)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {language === 'ja' ? place.names.en : place.names.ja}
                            {place.names.transliteration && (
                              <span className="ml-2 text-gray-400">
                                ({place.names.transliteration})
                              </span>
                            )}
                          </p>
                          {place.description && (
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {place.description[language]}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedPlace && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPlace(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* ヘッダー */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPlace.names[language]}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {language === 'ja' ? selectedPlace.names.en : selectedPlace.names.ja}
                  </p>
                  {selectedPlace.names.transliteration && (
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'ja' ? '音訳: ' : 'Transliteration: '}
                      {selectedPlace.names.transliteration}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* メタ情報 */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {getPlaceTypeName(selectedPlace.type, language)}
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                  {'⭐'.repeat(selectedPlace.importance)}
                </span>
              </div>

              {/* 別名 */}
              {selectedPlace.alternativeNames && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {language === 'ja' ? '別名' : 'Alternative Names'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlace.alternativeNames[language]?.map((name, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 説明 */}
              {selectedPlace.description && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {language === 'ja' ? '説明' : 'Description'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPlace.description[language]}
                  </p>
                </div>
              )}

              {/* 時代 */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === 'ja' ? '関連する時代' : 'Related Periods'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPlace.periods.map(period => (
                    <span
                      key={period}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {getPeriodName(period, language)}
                    </span>
                  ))}
                </div>
              </div>

              {/* 聖書の引用 */}
              {selectedPlace.biblicalReferences && selectedPlace.biblicalReferences.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {language === 'ja' ? '聖書での言及' : 'Biblical References'}
                  </h3>
                  <div className="space-y-2">
                    {selectedPlace.biblicalReferences.map((ref, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Link
                          href={`/?book=${ref.book}&chapter=${ref.chapter}&verse=${ref.verse}`}
                          className="text-blue-600 hover:underline font-medium text-sm flex-shrink-0"
                          onClick={() => setSelectedPlace(null)}
                        >
                          {ref.book} {ref.chapter}:{ref.verse}
                        </Link>
                        {ref.context && (
                          <span className="text-sm text-gray-600">- {ref.context}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 閉じるボタン */}
              <button
                onClick={() => setSelectedPlace(null)}
                className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'ja' ? '閉じる' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
