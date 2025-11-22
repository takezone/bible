# 聖書地図機能の実装

## 概要
パブリックドメインの英語地図データを活用し、日英両言語で利用可能な聖書地図機能を実装する。

## 背景
- 当初、日本聖書協会の地図（1956年版）を使用する計画だったが、著作権への配慮により断念
- Amazonで販売されており、現在も著作権保護されている可能性が高い
- パブリックドメインの英語データを活用し、日本語翻訳を追加する方向に変更

## 目標
1. パブリックドメインの英語聖書地図データを取得
2. 日英対訳の地名データベースを構築
3. 複数の時代（出エジプト、王国時代、新約時代など）に対応
4. 地名検索機能（日本語・英語両対応）
5. インタラクティブな地図表示

## 技術的課題

### 1. データソースの選定
- [ ] Wikimedia Commonsからパブリックドメイン確実な地図を選定
- [ ] Smith's Bible Dictionary (1863)などの歴史的地図の調査
- [ ] ライセンス確認（CC0, Public Domain Mark等）

### 2. 地名データベースの構築
```json
{
  "places": [
    {
      "id": "jerusalem",
      "names": {
        "en": "Jerusalem",
        "ja": "エルサレム",
        "transliteration": "Yerushalayim"
      },
      "alternativeNames": {
        "en": ["Zion", "City of David"],
        "ja": ["シオン", "ダビデの町"]
      },
      "periods": ["ot_early", "ot_kingdom", "ot_exile", "nt"],
      "locations": [
        {
          "mapId": "palestine_nt",
          "coordinates": { "lat": 31.7683, "lng": 35.2137 },
          "gridReference": "3B-3"
        }
      ],
      "description": {
        "en": "Capital of ancient Judea and Israel",
        "ja": "古代ユダとイスラエルの首都"
      },
      "biblicalReferences": [
        { "book": "2samuel", "chapter": 5, "verse": 6 },
        { "book": "1kings", "chapter": 11, "verse": 13 }
      ]
    }
  ]
}
```

### 3. 時代区分の設計
- `ot_patriarchs`: 族長時代（アブラハム、イサク、ヤコブ）
- `ot_exodus`: 出エジプト時代
- `ot_judges`: 士師時代
- `ot_kingdom`: 統一王国時代（サウル、ダビデ、ソロモン）
- `ot_divided`: 分裂王国時代（イスラエル・ユダ）
- `ot_exile`: バビロン捕囚時代
- `ot_return`: 帰還時代
- `nt`: 新約時代（イエス、パウロ）

### 4. 地図の種類
1. 古代世界全図
2. カナンの地（複数時代）
3. エジプトとシナイ半島
4. パレスチナ（北部・中部・南部）
5. エルサレム詳細図
6. 地中海世界（パウロの伝道旅行）
7. 古代帝国（アッシリア、バビロニア、ペルシア、ローマ）

### 5. UI/UX設計
- [ ] 地図ビューアコンポーネント
- [ ] 時代選択機能
- [ ] 地名検索（日英両対応、オートコンプリート）
- [ ] 地名クリックで詳細情報表示
- [ ] 関連する聖書箇所へのリンク
- [ ] レスポンシブデザイン（PC/タブレット/スマホ）

### 6. 技術スタック候補
- **地図表示**: Leaflet.js または OpenLayers
- **画像**: GeoTIFF または通常の画像タイル
- **検索**: Fuse.js（曖昧検索対応）
- **データ**: JSON（静的）またはSQLite（動的）

## 実装フェーズ

### Phase 1: データ収集と準備
1. パブリックドメイン地図の収集
2. 主要地名リスト作成（100-200箇所）
3. 日英対訳データの作成

### Phase 2: 基本機能実装
1. 地図ビューアの実装
2. 地名データベースの統合
3. 基本的な検索機能

### Phase 3: 高度な機能
1. 複数時代の切り替え
2. 詳細な地名情報表示
3. 聖書本文との連携

### Phase 4: 最適化とテスト
1. パフォーマンス最適化
2. モバイル対応の改善
3. アクセシビリティ対応

## 参考リソース
- Wikimedia Commons: Bible Maps
- Smith's Bible Dictionary (1863)
- Digital Atlas of the Roman Empire
- Ancient World Mapping Center

## 関連Issue
（なし）

## 担当
（未定）

## マイルストーン
（未定）
