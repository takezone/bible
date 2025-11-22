/**
 * 聖書地名データの型定義
 */

export type PlaceType =
  | 'city'        // 都市・町
  | 'region'      // 地域・国
  | 'mountain'    // 山
  | 'river'       // 川
  | 'sea'         // 海・湖
  | 'desert'      // 砂漠・荒野
  | 'valley'      // 谷
  | 'island';     // 島

export type Period =
  | 'ot_patriarchs'    // 族長時代 (創世記)
  | 'ot_exodus'        // 出エジプト時代
  | 'ot_judges'        // 士師時代
  | 'ot_kingdom'       // 統一王国時代 (サウル、ダビデ、ソロモン)
  | 'ot_divided'       // 分裂王国時代 (イスラエル・ユダ)
  | 'ot_exile'         // バビロン捕囚時代
  | 'ot_return'        // 帰還時代 (エズラ、ネヘミヤ)
  | 'nt';              // 新約時代

export interface BibleReference {
  book: string;      // 書名ID (例: 'genesis', 'matthew')
  chapter: number;
  verse: number;
  context?: string;  // 文脈の説明 (例: 'アブラハムがここに住んだ')
}

export interface Place {
  id: string;

  // 地名
  names: {
    en: string;              // 英語名
    ja: string;              // 日本語名
    transliteration?: string; // 音訳 (例: 'Yerushalayim')
    hebrew?: string;         // ヘブライ語
    greek?: string;          // ギリシャ語
  };

  // 別名
  alternativeNames?: {
    en?: string[];
    ja?: string[];
  };

  // 地名のタイプ
  type: PlaceType;

  // 関連する時代
  periods: Period[];

  // 説明
  description?: {
    en: string;
    ja: string;
  };

  // 聖書での言及
  biblicalReferences?: BibleReference[];

  // 関連する地名
  relatedPlaces?: string[];  // 他の地名のID

  // 重要度 (1-5, 5が最重要)
  importance: 1 | 2 | 3 | 4 | 5;

  // 座標 (将来のLeaflet用)
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PeriodMap {
  period: Period;
  title: {
    en: string;
    ja: string;
  };
  description?: {
    en: string;
    ja: string;
  };
  imageUrl: string;
  source: string;
  license: string;
}

export interface PlacesData {
  version: string;
  lastUpdated: string;
  places: Place[];
  maps?: PeriodMap[];
}
