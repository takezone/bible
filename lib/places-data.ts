import placesData from '@/data/places.json';
import type { Place, PlacesData, PlaceType, Period, PeriodMap } from '@/types/places';
import { generateSearchVariants } from './katakana-normalizer';

/**
 * 全地名データを取得
 */
export function getAllPlaces(): Place[] {
  return (placesData as PlacesData).places;
}

/**
 * IDで地名を取得
 */
export function getPlaceById(id: string): Place | undefined {
  return getAllPlaces().find(place => place.id === id);
}

/**
 * タイプで地名をフィルター
 */
export function getPlacesByType(type: PlaceType): Place[] {
  return getAllPlaces().filter(place => place.type === type);
}

/**
 * 時代で地名をフィルター
 */
export function getPlacesByPeriod(period: Period): Place[] {
  return getAllPlaces().filter(place => place.periods.includes(period));
}

/**
 * 重要度で地名をフィルター
 */
export function getPlacesByImportance(importance: number): Place[] {
  return getAllPlaces().filter(place => place.importance >= importance);
}

/**
 * 地名を検索（日本語・英語両対応、表記揺れ対応）
 */
export function searchPlaces(query: string, language: 'ja' | 'en' | 'both' = 'both'): Place[] {
  const lowerQuery = query.toLowerCase();

  // 検索クエリのバリエーションを生成（カタカナ表記揺れ対応）
  const queryVariants = generateSearchVariants(query);

  return getAllPlaces().filter(place => {
    if (language === 'ja' || language === 'both') {
      // 地名のバリエーションを生成
      const nameVariants = generateSearchVariants(place.names.ja);

      // クエリのいずれかのバリエーションが地名のいずれかのバリエーションに含まれるか
      if (queryVariants.some(qv => nameVariants.some(nv => nv.includes(qv)))) {
        return true;
      }

      // 通常の検索（バックアップ）
      if (place.names.ja.toLowerCase().includes(lowerQuery)) return true;

      // 別名でも検索
      if (place.alternativeNames?.ja?.some(name => {
        const altVariants = generateSearchVariants(name);
        return queryVariants.some(qv => altVariants.some(av => av.includes(qv)));
      })) {
        return true;
      }
    }

    if (language === 'en' || language === 'both') {
      if (place.names.en.toLowerCase().includes(lowerQuery)) return true;
      if (place.alternativeNames?.en?.some(name =>
        name.toLowerCase().includes(lowerQuery)
      )) return true;
      if (place.names.transliteration?.toLowerCase().includes(lowerQuery)) return true;
    }

    return false;
  });
}

/**
 * タイプの日本語名を取得
 */
export function getPlaceTypeName(type: PlaceType, language: 'ja' | 'en' = 'ja'): string {
  const typeNames: Record<PlaceType, { ja: string; en: string }> = {
    city: { ja: '都市', en: 'City' },
    region: { ja: '地域', en: 'Region' },
    mountain: { ja: '山', en: 'Mountain' },
    river: { ja: '川', en: 'River' },
    sea: { ja: '海・湖', en: 'Sea/Lake' },
    desert: { ja: '砂漠', en: 'Desert' },
    valley: { ja: '谷', en: 'Valley' },
    island: { ja: '島', en: 'Island' }
  };

  return typeNames[type][language];
}

/**
 * 時代の日本語名を取得
 */
export function getPeriodName(period: Period, language: 'ja' | 'en' = 'ja'): string {
  const periodNames: Record<Period, { ja: string; en: string }> = {
    ot_patriarchs: { ja: '族長時代', en: 'Patriarchal Period' },
    ot_exodus: { ja: '出エジプト時代', en: 'Exodus Period' },
    ot_judges: { ja: '士師時代', en: 'Period of Judges' },
    ot_kingdom: { ja: '統一王国時代', en: 'United Kingdom' },
    ot_divided: { ja: '分裂王国時代', en: 'Divided Kingdom' },
    ot_exile: { ja: 'バビロン捕囚時代', en: 'Babylonian Exile' },
    ot_return: { ja: '帰還時代', en: 'Post-Exilic Period' },
    nt: { ja: '新約時代', en: 'New Testament Period' }
  };

  return periodNames[period][language];
}

/**
 * 全タイプのリストを取得
 */
export function getAllPlaceTypes(): PlaceType[] {
  return ['city', 'region', 'mountain', 'river', 'sea', 'desert', 'valley', 'island'];
}

/**
 * 全時代のリストを取得
 */
export function getAllPeriods(): Period[] {
  return [
    'ot_patriarchs',
    'ot_exodus',
    'ot_judges',
    'ot_kingdom',
    'ot_divided',
    'ot_exile',
    'ot_return',
    'nt'
  ];
}

/**
 * 全地図データを取得
 */
export function getAllMaps(): PeriodMap[] {
  return (placesData as PlacesData).maps || [];
}

/**
 * 時代別の地図を取得
 */
export function getMapByPeriod(period: Period): PeriodMap | undefined {
  return getAllMaps().find(map => map.period === period);
}

/**
 * 地名に関連する地図を取得（地名の時代から最も関連する地図を選択）
 */
export function getMapsForPlace(place: Place): PeriodMap[] {
  return place.periods
    .map(period => getMapByPeriod(period))
    .filter((map): map is PeriodMap => map !== undefined);
}
