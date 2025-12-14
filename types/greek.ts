// ギリシャ語単語の型定義

export interface GreekMorphology {
  person?: string;    // 人称: "1人称", "2人称", "3人称"
  tense?: string;     // 時制: "現在", "未完了", "未来", "アオリスト", "完了", "過去完了"
  voice?: string;     // 態: "能動態", "中動態", "受動態"
  mood?: string;      // 法: "直説法", "接続法", "希求法", "命令法", "不定詞", "分詞"
  case?: string;      // 格: "主格", "属格", "与格", "対格", "呼格"
  number?: string;    // 数: "単数", "複数"
  gender?: string;    // 性: "男性", "女性", "中性"
  degree?: string;    // 比較級: "比較級", "最上級"
}

export interface GreekWord {
  text: string;           // ギリシャ語テキスト（活用形）
  textWithPunct: string;  // 句読点付きテキスト
  lemma: string;          // 辞書形（原形）
  translit: string;       // ローマ字音写
  katakana: string;       // カタカナ音写
  pos: string;            // 品詞コード
  posName: string;        // 品詞名（日本語）
  morph: GreekMorphology | null;  // 文法情報
  morphCode: string;      // 文法コード（生）
  gloss: string;          // 日本語グロス（簡潔な意味）
  strongs: string;        // Strong's番号
  definition: string;     // 英語定義
}

export interface GreekVerse {
  verse: number;
  words: GreekWord[];
}

export interface GreekChapter {
  chapter: number;
  verses: GreekVerse[];
}

export interface GreekBook {
  id: string;
  name: string;
  chapters: GreekChapter[];
}

export interface GreekNT {
  books: GreekBook[];
  metadata: {
    source: string;
    license: string;
    generatedAt: string;
  };
}

// 学習レベル
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';
