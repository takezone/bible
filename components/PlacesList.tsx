'use client';

import { useMemo, useState } from 'react';
import {
  getAllPlaces,
  searchPlaces,
  getPlaceTypeName,
  getAllPlaceTypes,
  getPeriodName
} from '@/lib/places-data';
import type { Place, PlaceType, Period } from '@/types/places';

interface PlacesListProps {
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
}

export function PlacesList({ selectedPlace, onSelectPlace }: PlacesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PlaceType | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<Period | 'all'>('all');

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
      return a.names.ja.localeCompare(b.names.ja);
    });
  }, [searchQuery, selectedType, selectedPeriod]);

  return (
    <div className="bg-white rounded-lg shadow p-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] flex flex-col">
      {/* 検索 */}
      <div className="mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="地名を検索..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* タイプフィルター */}
      <div className="mb-3">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as PlaceType | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">種類: すべて</option>
          {getAllPlaceTypes().map(type => (
            <option key={type} value={type}>
              {getPlaceTypeName(type, 'ja')}
            </option>
          ))}
        </select>
      </div>

      {/* 時代フィルター */}
      <div className="mb-3">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as Period | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">時代: すべて</option>
          <option value="ot_patriarchs">{getPeriodName('ot_patriarchs', 'ja')}</option>
          <option value="ot_exodus">{getPeriodName('ot_exodus', 'ja')}</option>
          <option value="ot_judges">{getPeriodName('ot_judges', 'ja')}</option>
          <option value="ot_kingdom">{getPeriodName('ot_kingdom', 'ja')}</option>
          <option value="ot_divided">{getPeriodName('ot_divided', 'ja')}</option>
          <option value="ot_exile">{getPeriodName('ot_exile', 'ja')}</option>
          <option value="ot_return">{getPeriodName('ot_return', 'ja')}</option>
          <option value="nt">{getPeriodName('nt', 'ja')}</option>
        </select>
      </div>

      {/* 結果表示 */}
      <div className="text-xs text-gray-500 mb-2 px-1">
        {filteredPlaces.length}件の地名
      </div>

      {/* 地名リスト */}
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {filteredPlaces.map((place) => (
          <button
            key={place.id}
            onClick={() => onSelectPlace(place)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
              selectedPlace?.id === place.id
                ? 'bg-purple-500 text-white'
                : 'hover:bg-purple-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{place.names.ja}</div>
                <div className="text-xs opacity-75 truncate">{place.names.en}</div>
              </div>
              <div className="flex-shrink-0 ml-2 text-xs">
                {'⭐'.repeat(place.importance)}
              </div>
            </div>
          </button>
        ))}

        {filteredPlaces.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            該当する地名が見つかりません
          </div>
        )}
      </div>
    </div>
  );
}
