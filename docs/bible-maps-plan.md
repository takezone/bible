# 聖書地図機能 実装計画

## プロジェクト概要
パブリックドメインの英語地図データを基に、日英バイリンガル対応の聖書地図機能を実装する。

## 現状
- 2025-01-23: 日本聖書協会の地図を一旦実装したが、著作権への配慮により削除
- ブランチ: `feature/bible-maps` を作成し、新しいアプローチで実装予定

## データソース候補

### 1. Wikimedia Commons
**URL**: https://commons.wikimedia.org/wiki/Category:Maps_of_the_Bible

利点:
- 大量のパブリックドメイン地図
- 高解像度画像
- ライセンスが明確

主要な地図セット:
- Smith's Bible Dictionary (1863) の地図
- Jamieson-Fausset-Brown Bible Commentary の地図
- Westminster Historical Atlas to the Bible

### 2. Digital Atlas of the Roman Empire (DARE)
**URL**: https://dare.ht.lu.se/

利点:
- インタラクティブ地図
- 正確な地理データ
- CC BY-SA 4.0ライセンス

### 3. Ancient World Mapping Center
**URL**: http://awmc.unc.edu/

利点:
- 学術的に正確
- ベースマップが利用可能

## データ構造設計

### 地名データベース
```typescript
interface Place {
  id: string;
  names: {
    en: string;
    ja: string;
    transliteration?: string;
    hebrew?: string;
    greek?: string;
  };
  alternativeNames?: {
    en: string[];
    ja: string[];
  };
  type: 'city' | 'region' | 'mountain' | 'river' | 'sea' | 'desert';
  periods: Period[];
  locations: Location[];
  description: {
    en: string;
    ja: string;
  };
  biblicalReferences: BibleReference[];
}

type Period =
  | 'ot_patriarchs'    // 族長時代
  | 'ot_exodus'        // 出エジプト
  | 'ot_judges'        // 士師時代
  | 'ot_kingdom'       // 統一王国
  | 'ot_divided'       // 分裂王国
  | 'ot_exile'         // バビロン捕囚
  | 'ot_return'        // 帰還時代
  | 'nt';              // 新約時代

interface Location {
  mapId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  gridReference?: string;  // 例: "3B-3"
}

interface BibleReference {
  book: string;
  chapter: number;
  verse: number;
}
```

### 地図メタデータ
```typescript
interface MapData {
  id: string;
  title: {
    en: string;
    ja: string;
  };
  period: Period;
  description: {
    en: string;
    ja: string;
  };
  imageUrl: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  attribution: string;
  license: string;
  source: string;
}
```

## 実装アーキテクチャ

### コンポーネント構成
```
/app/maps/
  page.tsx              # メインページ

/components/maps/
  MapViewer.tsx         # 地図表示コンポーネント
  PlaceSearch.tsx       # 地名検索
  PeriodSelector.tsx    # 時代選択
  PlaceDetail.tsx       # 地名詳細
  MapSelector.tsx       # 地図選択

/lib/maps/
  places-data.ts        # 地名データ
  maps-data.ts          # 地図データ
  search.ts             # 検索ロジック

/public/maps/
  [period]/
    [map-id].jpg        # 地図画像
```

### 検索機能
- Fuse.js を使用した曖昧検索
- 日本語・英語・音訳すべてで検索可能
- オートコンプリート機能
- 部分一致・前方一致対応

## 実装ステップ

### Step 1: データ準備 (1-2週間)
- [ ] Wikimedia Commonsから10-15枚の地図を選定
- [ ] 主要地名100箇所のリストアップ
- [ ] 日英対訳データの作成（既存の聖書データから地名を抽出）

### Step 2: 基本UI実装 (1週間)
- [ ] MapViewer コンポーネント
- [ ] 静的画像の表示
- [ ] ズーム・パン機能

### Step 3: 検索機能 (1週間)
- [ ] PlaceSearch コンポーネント
- [ ] Fuse.js統合
- [ ] オートコンプリート

### Step 4: 詳細情報 (1週間)
- [ ] PlaceDetail コンポーネント
- [ ] 聖書本文へのリンク
- [ ] 時代フィルター

### Step 5: 最適化 (1週間)
- [ ] パフォーマンス改善
- [ ] モバイル対応
- [ ] アクセシビリティ

## 主要地名リスト（第1フェーズ）

### 都市・町（50箇所）
- エルサレム (Jerusalem)
- ベツレヘム (Bethlehem)
- ナザレ (Nazareth)
- カペナウム (Capernaum)
- エリコ (Jericho)
- サマリア (Samaria)
- ダマスコ (Damascus)
- カイザリヤ (Caesarea)
- テベリヤ (Tiberias)
- ...（以下続く）

### 地域（20箇所）
- ガリラヤ (Galilee)
- ユダヤ (Judea)
- サマリア (Samaria)
- ガド (Gad)
- ...

### 自然地形（30箇所）
- ヨルダン川 (Jordan River)
- 死海 (Dead Sea)
- ガリラヤ湖 (Sea of Galilee)
- シナイ山 (Mount Sinai)
- オリーブ山 (Mount of Olives)
- ...

## ライセンス表記
各地図に以下の情報を明記：
- 出典
- 著作権状況（Public Domain, CC BY-SA等）
- 取得元URL
- 元の発行年

## 参考文献
1. Smith's Bible Dictionary (William Smith, 1863)
2. Westminster Historical Atlas to the Bible (1945)
3. Carta's Atlas of the Bible (Dan Bahat, 2011) - 参考のみ
4. The Macmillan Bible Atlas (Yohanan Aharoni, 1968) - 参考のみ

## 注意事項
- 著作権への十分な配慮
- 正確性の確保（学術的資料の参照）
- 多言語対応の一貫性
- アクセシビリティ（alt text等）
