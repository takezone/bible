// 新約聖書における旧約聖書の引用・参照データ
// 形式: { [NT書物ID]: { [章番号]: 引用配列 } }

export interface CrossReference {
  verse: number | string;  // NT節番号（範囲も可: "4-6"）
  source: string;          // 旧約の出典（例: "イザヤ書 40:3"）
  sourceBook: string;      // 書物ID
  sourceChapter: number;
  sourceVerse: number | string;
  type: 'quote' | 'allusion' | 'reference';  // 引用/暗示/参照
  note?: string;           // 補足説明
}

export interface ChapterReferences {
  [chapter: number]: CrossReference[];
}

export interface BookReferences {
  [bookId: string]: ChapterReferences;
}

// マタイによる福音書
const matthew: ChapterReferences = {
  1: [
    { verse: 23, source: 'イザヤ書 7:14', sourceBook: 'isaiah', sourceChapter: 7, sourceVerse: 14, type: 'quote', note: '処女懐胎の預言「インマヌエル」' },
  ],
  2: [
    { verse: 6, source: 'ミカ書 5:2', sourceBook: 'micah', sourceChapter: 5, sourceVerse: 2, type: 'quote', note: 'メシアはベツレヘムから出る' },
    { verse: 15, source: 'ホセア書 11:1', sourceBook: 'hosea', sourceChapter: 11, sourceVerse: 1, type: 'quote', note: '「エジプトからわが子を呼び出した」' },
    { verse: 18, source: 'エレミヤ書 31:15', sourceBook: 'jeremiah', sourceChapter: 31, sourceVerse: 15, type: 'quote', note: 'ラケルの嘆き' },
  ],
  3: [
    { verse: 3, source: 'イザヤ書 40:3', sourceBook: 'isaiah', sourceChapter: 40, sourceVerse: 3, type: 'quote', note: '荒野で叫ぶ者の声' },
  ],
  4: [
    { verse: 4, source: '申命記 8:3', sourceBook: 'deuteronomy', sourceChapter: 8, sourceVerse: 3, type: 'quote', note: '人はパンだけで生きるのではない' },
    { verse: 6, source: '詩篇 91:11-12', sourceBook: 'psalms', sourceChapter: 91, sourceVerse: '11-12', type: 'quote', note: '天使たちに命じて守らせる' },
    { verse: 7, source: '申命記 6:16', sourceBook: 'deuteronomy', sourceChapter: 6, sourceVerse: 16, type: 'quote', note: '主を試みてはならない' },
    { verse: 10, source: '申命記 6:13', sourceBook: 'deuteronomy', sourceChapter: 6, sourceVerse: 13, type: 'quote', note: '主のみを拝せよ' },
    { verse: '15-16', source: 'イザヤ書 9:1-2', sourceBook: 'isaiah', sourceChapter: 9, sourceVerse: '1-2', type: 'quote', note: 'ガリラヤに大いなる光' },
  ],
  5: [
    { verse: 21, source: '出エジプト記 20:13', sourceBook: 'exodus', sourceChapter: 20, sourceVerse: 13, type: 'quote', note: '殺してはならない' },
    { verse: 27, source: '出エジプト記 20:14', sourceBook: 'exodus', sourceChapter: 20, sourceVerse: 14, type: 'quote', note: '姦淫してはならない' },
    { verse: 31, source: '申命記 24:1', sourceBook: 'deuteronomy', sourceChapter: 24, sourceVerse: 1, type: 'reference', note: '離婚状について' },
    { verse: 33, source: 'レビ記 19:12', sourceBook: 'leviticus', sourceChapter: 19, sourceVerse: 12, type: 'reference', note: '偽りの誓いをしてはならない' },
    { verse: 38, source: '出エジプト記 21:24', sourceBook: 'exodus', sourceChapter: 21, sourceVerse: 24, type: 'quote', note: '目には目を、歯には歯を' },
    { verse: 43, source: 'レビ記 19:18', sourceBook: 'leviticus', sourceChapter: 19, sourceVerse: 18, type: 'quote', note: '隣人を愛せよ' },
  ],
  8: [
    { verse: 17, source: 'イザヤ書 53:4', sourceBook: 'isaiah', sourceChapter: 53, sourceVerse: 4, type: 'quote', note: '彼はわれわれの病を負った' },
  ],
  9: [
    { verse: 13, source: 'ホセア書 6:6', sourceBook: 'hosea', sourceChapter: 6, sourceVerse: 6, type: 'quote', note: 'わたしが好むのはあわれみ' },
  ],
  11: [
    { verse: 10, source: 'マラキ書 3:1', sourceBook: 'malachi', sourceChapter: 3, sourceVerse: 1, type: 'quote', note: '使者を遣わす' },
  ],
  12: [
    { verse: 7, source: 'ホセア書 6:6', sourceBook: 'hosea', sourceChapter: 6, sourceVerse: 6, type: 'quote', note: 'あわれみを好む' },
    { verse: '18-21', source: 'イザヤ書 42:1-4', sourceBook: 'isaiah', sourceChapter: 42, sourceVerse: '1-4', type: 'quote', note: '主の僕の歌' },
  ],
  13: [
    { verse: '14-15', source: 'イザヤ書 6:9-10', sourceBook: 'isaiah', sourceChapter: 6, sourceVerse: '9-10', type: 'quote', note: '聞いても悟らない' },
    { verse: 35, source: '詩篇 78:2', sourceBook: 'psalms', sourceChapter: 78, sourceVerse: 2, type: 'quote', note: 'たとえで語る' },
  ],
  15: [
    { verse: '8-9', source: 'イザヤ書 29:13', sourceBook: 'isaiah', sourceChapter: 29, sourceVerse: 13, type: 'quote', note: '口先だけで敬う' },
  ],
  19: [
    { verse: 4, source: '創世記 1:27', sourceBook: 'genesis', sourceChapter: 1, sourceVerse: 27, type: 'quote', note: '男と女に創造された' },
    { verse: 5, source: '創世記 2:24', sourceBook: 'genesis', sourceChapter: 2, sourceVerse: 24, type: 'quote', note: '一体となる' },
  ],
  21: [
    { verse: 5, source: 'ゼカリヤ書 9:9', sourceBook: 'zechariah', sourceChapter: 9, sourceVerse: 9, type: 'quote', note: 'ろばに乗って来る王' },
    { verse: 9, source: '詩篇 118:26', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: 26, type: 'quote', note: '主の名によって来る者' },
    { verse: 13, source: 'イザヤ書 56:7', sourceBook: 'isaiah', sourceChapter: 56, sourceVerse: 7, type: 'quote', note: '祈りの家' },
    { verse: 16, source: '詩篇 8:2', sourceBook: 'psalms', sourceChapter: 8, sourceVerse: 2, type: 'quote', note: '幼子の口から賛美' },
    { verse: 42, source: '詩篇 118:22-23', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: '22-23', type: 'quote', note: '捨てられた石が隅の親石に' },
  ],
  22: [
    { verse: 32, source: '出エジプト記 3:6', sourceBook: 'exodus', sourceChapter: 3, sourceVerse: 6, type: 'quote', note: 'アブラハムの神' },
    { verse: 37, source: '申命記 6:5', sourceBook: 'deuteronomy', sourceChapter: 6, sourceVerse: 5, type: 'quote', note: '心を尽くして神を愛せよ' },
    { verse: 39, source: 'レビ記 19:18', sourceBook: 'leviticus', sourceChapter: 19, sourceVerse: 18, type: 'quote', note: '隣人を愛せよ' },
    { verse: 44, source: '詩篇 110:1', sourceBook: 'psalms', sourceChapter: 110, sourceVerse: 1, type: 'quote', note: '主はわが主に言われた' },
  ],
  23: [
    { verse: 39, source: '詩篇 118:26', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: 26, type: 'quote', note: '主の名によって来る者' },
  ],
  24: [
    { verse: 15, source: 'ダニエル書 9:27', sourceBook: 'daniel', sourceChapter: 9, sourceVerse: 27, type: 'reference', note: '荒らす憎むべきもの' },
    { verse: 29, source: 'イザヤ書 13:10', sourceBook: 'isaiah', sourceChapter: 13, sourceVerse: 10, type: 'allusion', note: '日は暗くなり' },
    { verse: 30, source: 'ダニエル書 7:13', sourceBook: 'daniel', sourceChapter: 7, sourceVerse: 13, type: 'quote', note: '人の子が雲に乗って来る' },
  ],
  26: [
    { verse: 31, source: 'ゼカリヤ書 13:7', sourceBook: 'zechariah', sourceChapter: 13, sourceVerse: 7, type: 'quote', note: '羊飼いを打て' },
  ],
  27: [
    { verse: 9, source: 'ゼカリヤ書 11:12-13', sourceBook: 'zechariah', sourceChapter: 11, sourceVerse: '12-13', type: 'quote', note: '銀三十枚' },
    { verse: 35, source: '詩篇 22:18', sourceBook: 'psalms', sourceChapter: 22, sourceVerse: 18, type: 'quote', note: '衣を分け合う' },
    { verse: 46, source: '詩篇 22:1', sourceBook: 'psalms', sourceChapter: 22, sourceVerse: 1, type: 'quote', note: 'わが神、なぜ見捨てたのか' },
  ],
};

// マルコによる福音書
const mark: ChapterReferences = {
  1: [
    { verse: 2, source: 'マラキ書 3:1', sourceBook: 'malachi', sourceChapter: 3, sourceVerse: 1, type: 'quote', note: '使者を遣わす' },
    { verse: 3, source: 'イザヤ書 40:3', sourceBook: 'isaiah', sourceChapter: 40, sourceVerse: 3, type: 'quote', note: '荒野で叫ぶ者の声' },
  ],
  4: [
    { verse: 12, source: 'イザヤ書 6:9-10', sourceBook: 'isaiah', sourceChapter: 6, sourceVerse: '9-10', type: 'quote', note: '見ても認めない' },
  ],
  7: [
    { verse: '6-7', source: 'イザヤ書 29:13', sourceBook: 'isaiah', sourceChapter: 29, sourceVerse: 13, type: 'quote', note: '口先だけの敬い' },
    { verse: 10, source: '出エジプト記 20:12', sourceBook: 'exodus', sourceChapter: 20, sourceVerse: 12, type: 'quote', note: '父母を敬え' },
  ],
  10: [
    { verse: 6, source: '創世記 1:27', sourceBook: 'genesis', sourceChapter: 1, sourceVerse: 27, type: 'quote', note: '男と女に創造された' },
    { verse: '7-8', source: '創世記 2:24', sourceBook: 'genesis', sourceChapter: 2, sourceVerse: 24, type: 'quote', note: '一体となる' },
    { verse: 19, source: '出エジプト記 20:12-16', sourceBook: 'exodus', sourceChapter: 20, sourceVerse: '12-16', type: 'quote', note: '十戒' },
  ],
  11: [
    { verse: 9, source: '詩篇 118:26', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: 26, type: 'quote', note: '主の名によって来る者' },
    { verse: 17, source: 'イザヤ書 56:7', sourceBook: 'isaiah', sourceChapter: 56, sourceVerse: 7, type: 'quote', note: '祈りの家' },
  ],
  12: [
    { verse: '10-11', source: '詩篇 118:22-23', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: '22-23', type: 'quote', note: '隅の親石' },
    { verse: 26, source: '出エジプト記 3:6', sourceBook: 'exodus', sourceChapter: 3, sourceVerse: 6, type: 'quote', note: 'アブラハムの神' },
    { verse: '29-30', source: '申命記 6:4-5', sourceBook: 'deuteronomy', sourceChapter: 6, sourceVerse: '4-5', type: 'quote', note: '聞け、イスラエルよ' },
    { verse: 31, source: 'レビ記 19:18', sourceBook: 'leviticus', sourceChapter: 19, sourceVerse: 18, type: 'quote', note: '隣人を愛せよ' },
    { verse: 36, source: '詩篇 110:1', sourceBook: 'psalms', sourceChapter: 110, sourceVerse: 1, type: 'quote', note: '主の右に座せ' },
  ],
  13: [
    { verse: 14, source: 'ダニエル書 9:27', sourceBook: 'daniel', sourceChapter: 9, sourceVerse: 27, type: 'reference', note: '荒らす憎むべきもの' },
    { verse: 26, source: 'ダニエル書 7:13', sourceBook: 'daniel', sourceChapter: 7, sourceVerse: 13, type: 'quote', note: '人の子が来る' },
  ],
  14: [
    { verse: 27, source: 'ゼカリヤ書 13:7', sourceBook: 'zechariah', sourceChapter: 13, sourceVerse: 7, type: 'quote', note: '羊飼いを打て' },
    { verse: 62, source: 'ダニエル書 7:13', sourceBook: 'daniel', sourceChapter: 7, sourceVerse: 13, type: 'allusion', note: '人の子' },
  ],
  15: [
    { verse: 24, source: '詩篇 22:18', sourceBook: 'psalms', sourceChapter: 22, sourceVerse: 18, type: 'quote', note: '衣を分ける' },
    { verse: 34, source: '詩篇 22:1', sourceBook: 'psalms', sourceChapter: 22, sourceVerse: 1, type: 'quote', note: 'エロイ、エロイ' },
  ],
};

// ルカによる福音書
const luke: ChapterReferences = {
  1: [
    { verse: '46-55', source: 'サムエル記上 2:1-10', sourceBook: '1samuel', sourceChapter: 2, sourceVerse: '1-10', type: 'allusion', note: 'マリアの賛歌（ハンナの祈りに類似）' },
  ],
  2: [
    { verse: 23, source: '出エジプト記 13:2', sourceBook: 'exodus', sourceChapter: 13, sourceVerse: 2, type: 'quote', note: '初子は聖別される' },
    { verse: 24, source: 'レビ記 12:8', sourceBook: 'leviticus', sourceChapter: 12, sourceVerse: 8, type: 'reference', note: '山鳩のささげ物' },
  ],
  3: [
    { verse: '4-6', source: 'イザヤ書 40:3-5', sourceBook: 'isaiah', sourceChapter: 40, sourceVerse: '3-5', type: 'quote', note: '主の道を備えよ' },
  ],
  4: [
    { verse: 4, source: '申命記 8:3', sourceBook: 'deuteronomy', sourceChapter: 8, sourceVerse: 3, type: 'quote', note: 'パンだけではない' },
    { verse: 8, source: '申命記 6:13', sourceBook: 'deuteronomy', sourceChapter: 6, sourceVerse: 13, type: 'quote', note: '主を拝せよ' },
    { verse: 12, source: '申命記 6:16', sourceBook: 'deuteronomy', sourceChapter: 6, sourceVerse: 16, type: 'quote', note: '主を試みるな' },
    { verse: '18-19', source: 'イザヤ書 61:1-2', sourceBook: 'isaiah', sourceChapter: 61, sourceVerse: '1-2', type: 'quote', note: '貧しい者に福音を' },
  ],
  7: [
    { verse: 27, source: 'マラキ書 3:1', sourceBook: 'malachi', sourceChapter: 3, sourceVerse: 1, type: 'quote', note: '使者を遣わす' },
  ],
  10: [
    { verse: 27, source: '申命記 6:5', sourceBook: 'deuteronomy', sourceChapter: 6, sourceVerse: 5, type: 'quote', note: '心を尽くして神を愛せよ' },
    { verse: 27, source: 'レビ記 19:18', sourceBook: 'leviticus', sourceChapter: 19, sourceVerse: 18, type: 'quote', note: '隣人を愛せよ' },
  ],
  13: [
    { verse: 35, source: '詩篇 118:26', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: 26, type: 'quote', note: '主の名によって来る者' },
  ],
  18: [
    { verse: 20, source: '出エジプト記 20:12-16', sourceBook: 'exodus', sourceChapter: 20, sourceVerse: '12-16', type: 'quote', note: '十戒' },
  ],
  19: [
    { verse: 38, source: '詩篇 118:26', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: 26, type: 'quote', note: '王として来る者' },
    { verse: 46, source: 'イザヤ書 56:7', sourceBook: 'isaiah', sourceChapter: 56, sourceVerse: 7, type: 'quote', note: '祈りの家' },
  ],
  20: [
    { verse: 17, source: '詩篇 118:22', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: 22, type: 'quote', note: '隅の親石' },
    { verse: 37, source: '出エジプト記 3:6', sourceBook: 'exodus', sourceChapter: 3, sourceVerse: 6, type: 'quote', note: 'アブラハムの神' },
    { verse: 42, source: '詩篇 110:1', sourceBook: 'psalms', sourceChapter: 110, sourceVerse: 1, type: 'quote', note: '主の右に座せ' },
  ],
  22: [
    { verse: 37, source: 'イザヤ書 53:12', sourceBook: 'isaiah', sourceChapter: 53, sourceVerse: 12, type: 'quote', note: '罪人の一人に数えられた' },
  ],
  23: [
    { verse: 46, source: '詩篇 31:5', sourceBook: 'psalms', sourceChapter: 31, sourceVerse: 5, type: 'quote', note: '霊を御手にゆだねます' },
  ],
};

// ヨハネによる福音書
const john: ChapterReferences = {
  1: [
    { verse: 23, source: 'イザヤ書 40:3', sourceBook: 'isaiah', sourceChapter: 40, sourceVerse: 3, type: 'quote', note: '荒野で叫ぶ声' },
  ],
  2: [
    { verse: 17, source: '詩篇 69:9', sourceBook: 'psalms', sourceChapter: 69, sourceVerse: 9, type: 'quote', note: 'あなたの家を思う熱心' },
  ],
  6: [
    { verse: 31, source: '詩篇 78:24', sourceBook: 'psalms', sourceChapter: 78, sourceVerse: 24, type: 'quote', note: '天からのパン' },
    { verse: 45, source: 'イザヤ書 54:13', sourceBook: 'isaiah', sourceChapter: 54, sourceVerse: 13, type: 'quote', note: '神に教えられる' },
  ],
  10: [
    { verse: 34, source: '詩篇 82:6', sourceBook: 'psalms', sourceChapter: 82, sourceVerse: 6, type: 'quote', note: 'あなたがたは神々である' },
  ],
  12: [
    { verse: 13, source: '詩篇 118:26', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: 26, type: 'quote', note: '主の名によって来る者' },
    { verse: 15, source: 'ゼカリヤ書 9:9', sourceBook: 'zechariah', sourceChapter: 9, sourceVerse: 9, type: 'quote', note: 'ろばの子に乗って' },
    { verse: 38, source: 'イザヤ書 53:1', sourceBook: 'isaiah', sourceChapter: 53, sourceVerse: 1, type: 'quote', note: '誰が信じたか' },
    { verse: 40, source: 'イザヤ書 6:10', sourceBook: 'isaiah', sourceChapter: 6, sourceVerse: 10, type: 'quote', note: '目を見えなくした' },
  ],
  13: [
    { verse: 18, source: '詩篇 41:9', sourceBook: 'psalms', sourceChapter: 41, sourceVerse: 9, type: 'quote', note: 'パンを食べた者が裏切る' },
  ],
  15: [
    { verse: 25, source: '詩篇 35:19', sourceBook: 'psalms', sourceChapter: 35, sourceVerse: 19, type: 'quote', note: '理由なく憎んだ' },
  ],
  19: [
    { verse: 24, source: '詩篇 22:18', sourceBook: 'psalms', sourceChapter: 22, sourceVerse: 18, type: 'quote', note: '衣をくじで分ける' },
    { verse: 36, source: '詩篇 34:20', sourceBook: 'psalms', sourceChapter: 34, sourceVerse: 20, type: 'quote', note: '骨は一本も折られない' },
    { verse: 37, source: 'ゼカリヤ書 12:10', sourceBook: 'zechariah', sourceChapter: 12, sourceVerse: 10, type: 'quote', note: '刺し貫いた者を見る' },
  ],
};

// 使徒行伝
const acts: ChapterReferences = {
  1: [
    { verse: 20, source: '詩篇 69:25', sourceBook: 'psalms', sourceChapter: 69, sourceVerse: 25, type: 'quote', note: 'その住まいは荒れ果てよ' },
    { verse: 20, source: '詩篇 109:8', sourceBook: 'psalms', sourceChapter: 109, sourceVerse: 8, type: 'quote', note: 'その職は他の者に取らせよ' },
  ],
  2: [
    { verse: '17-21', source: 'ヨエル書 2:28-32', sourceBook: 'joel', sourceChapter: 2, sourceVerse: '28-32', type: 'quote', note: '終わりの日に霊を注ぐ' },
    { verse: 25, source: '詩篇 16:8-11', sourceBook: 'psalms', sourceChapter: 16, sourceVerse: '8-11', type: 'quote', note: 'わたしは絶えず主を目の前に置く' },
    { verse: 34, source: '詩篇 110:1', sourceBook: 'psalms', sourceChapter: 110, sourceVerse: 1, type: 'quote', note: '主はわが主に言われた' },
  ],
  3: [
    { verse: '22-23', source: '申命記 18:15-19', sourceBook: 'deuteronomy', sourceChapter: 18, sourceVerse: '15-19', type: 'quote', note: 'モーセのような預言者を起こす' },
    { verse: 25, source: '創世記 22:18', sourceBook: 'genesis', sourceChapter: 22, sourceVerse: 18, type: 'quote', note: '地のすべての民族が祝福される' },
  ],
  4: [
    { verse: 11, source: '詩篇 118:22', sourceBook: 'psalms', sourceChapter: 118, sourceVerse: 22, type: 'quote', note: '隅の親石となった' },
    { verse: '25-26', source: '詩篇 2:1-2', sourceBook: 'psalms', sourceChapter: 2, sourceVerse: '1-2', type: 'quote', note: '国々は何故騒ぎ立つのか' },
  ],
  7: [
    { verse: '3', source: '創世記 12:1', sourceBook: 'genesis', sourceChapter: 12, sourceVerse: 1, type: 'quote', note: 'あなたの土地を離れよ' },
    { verse: '6-7', source: '創世記 15:13-14', sourceBook: 'genesis', sourceChapter: 15, sourceVerse: '13-14', type: 'quote', note: '400年間苦しめられる' },
    { verse: 27, source: '出エジプト記 2:14', sourceBook: 'exodus', sourceChapter: 2, sourceVerse: 14, type: 'quote', note: '誰がお前を支配者にしたか' },
    { verse: 33, source: '出エジプト記 3:5', sourceBook: 'exodus', sourceChapter: 3, sourceVerse: 5, type: 'quote', note: '履物を脱げ' },
    { verse: 37, source: '申命記 18:15', sourceBook: 'deuteronomy', sourceChapter: 18, sourceVerse: 15, type: 'quote', note: 'わたしのような預言者を起こす' },
    { verse: '42-43', source: 'アモス書 5:25-27', sourceBook: 'amos', sourceChapter: 5, sourceVerse: '25-27', type: 'quote', note: '40年間荒野でいけにえを捧げたか' },
    { verse: '49-50', source: 'イザヤ書 66:1-2', sourceBook: 'isaiah', sourceChapter: 66, sourceVerse: '1-2', type: 'quote', note: '天はわたしの王座' },
  ],
  8: [
    { verse: '32-33', source: 'イザヤ書 53:7-8', sourceBook: 'isaiah', sourceChapter: 53, sourceVerse: '7-8', type: 'quote', note: '屠り場に引かれる羊のように' },
  ],
  13: [
    { verse: 22, source: '詩篇 89:20', sourceBook: 'psalms', sourceChapter: 89, sourceVerse: 20, type: 'allusion', note: 'わたしの僕ダビデを見いだした' },
    { verse: 22, source: 'サムエル記上 13:14', sourceBook: '1samuel', sourceChapter: 13, sourceVerse: 14, type: 'quote', note: '心にかなう者' },
    { verse: 33, source: '詩篇 2:7', sourceBook: 'psalms', sourceChapter: 2, sourceVerse: 7, type: 'quote', note: 'あなたはわたしの子' },
    { verse: 34, source: 'イザヤ書 55:3', sourceBook: 'isaiah', sourceChapter: 55, sourceVerse: 3, type: 'quote', note: 'ダビデへの確かな恵み' },
    { verse: 35, source: '詩篇 16:10', sourceBook: 'psalms', sourceChapter: 16, sourceVerse: 10, type: 'quote', note: '聖なる者に朽ち果てることを許さない' },
    { verse: 41, source: 'ハバクク書 1:5', sourceBook: 'habakkuk', sourceChapter: 1, sourceVerse: 5, type: 'quote', note: '驚け、そして滅びよ' },
    { verse: 47, source: 'イザヤ書 49:6', sourceBook: 'isaiah', sourceChapter: 49, sourceVerse: 6, type: 'quote', note: '異邦人の光となる' },
  ],
  15: [
    { verse: '16-17', source: 'アモス書 9:11-12', sourceBook: 'amos', sourceChapter: 9, sourceVerse: '11-12', type: 'quote', note: 'ダビデの倒れた幕屋を建て直す' },
  ],
  28: [
    { verse: '26-27', source: 'イザヤ書 6:9-10', sourceBook: 'isaiah', sourceChapter: 6, sourceVerse: '9-10', type: 'quote', note: '聞いても悟らない' },
  ],
};

// ローマ人への手紙
const romans: ChapterReferences = {
  1: [
    { verse: 17, source: 'ハバクク書 2:4', sourceBook: 'habakkuk', sourceChapter: 2, sourceVerse: 4, type: 'quote', note: '義人は信仰によって生きる' },
  ],
  3: [
    { verse: '10-12', source: '詩篇 14:1-3', sourceBook: 'psalms', sourceChapter: 14, sourceVerse: '1-3', type: 'quote', note: '義人はいない、一人もいない' },
    { verse: 13, source: '詩篇 5:9', sourceBook: 'psalms', sourceChapter: 5, sourceVerse: 9, type: 'quote', note: '彼らの喉は開いた墓' },
    { verse: 13, source: '詩篇 140:3', sourceBook: 'psalms', sourceChapter: 140, sourceVerse: 3, type: 'quote', note: '蝮の毒が唇にある' },
    { verse: 14, source: '詩篇 10:7', sourceBook: 'psalms', sourceChapter: 10, sourceVerse: 7, type: 'quote', note: '呪いと苦味で満ちている' },
    { verse: '15-17', source: 'イザヤ書 59:7-8', sourceBook: 'isaiah', sourceChapter: 59, sourceVerse: '7-8', type: 'quote', note: '血を流すのに足が速い' },
    { verse: 18, source: '詩篇 36:1', sourceBook: 'psalms', sourceChapter: 36, sourceVerse: 1, type: 'quote', note: '神への畏れがない' },
  ],
  4: [
    { verse: 3, source: '創世記 15:6', sourceBook: 'genesis', sourceChapter: 15, sourceVerse: 6, type: 'quote', note: 'アブラハムは信じた' },
    { verse: '7-8', source: '詩篇 32:1-2', sourceBook: 'psalms', sourceChapter: 32, sourceVerse: '1-2', type: 'quote', note: '罪を赦された人は幸い' },
    { verse: 17, source: '創世記 17:5', sourceBook: 'genesis', sourceChapter: 17, sourceVerse: 5, type: 'quote', note: '多くの国民の父とした' },
    { verse: 18, source: '創世記 15:5', sourceBook: 'genesis', sourceChapter: 15, sourceVerse: 5, type: 'quote', note: 'あなたの子孫はこのようになる' },
  ],
  8: [
    { verse: 36, source: '詩篇 44:22', sourceBook: 'psalms', sourceChapter: 44, sourceVerse: 22, type: 'quote', note: '屠られる羊と見なされている' },
  ],
  9: [
    { verse: 7, source: '創世記 21:12', sourceBook: 'genesis', sourceChapter: 21, sourceVerse: 12, type: 'quote', note: 'イサクによって子孫が起こる' },
    { verse: 9, source: '創世記 18:10', sourceBook: 'genesis', sourceChapter: 18, sourceVerse: 10, type: 'quote', note: 'サラに男の子が生まれる' },
    { verse: 12, source: '創世記 25:23', sourceBook: 'genesis', sourceChapter: 25, sourceVerse: 23, type: 'quote', note: '兄は弟に仕える' },
    { verse: 13, source: 'マラキ書 1:2-3', sourceBook: 'malachi', sourceChapter: 1, sourceVerse: '2-3', type: 'quote', note: 'ヤコブを愛し、エサウを憎んだ' },
    { verse: 15, source: '出エジプト記 33:19', sourceBook: 'exodus', sourceChapter: 33, sourceVerse: 19, type: 'quote', note: '憐れもうとする者を憐れむ' },
    { verse: 17, source: '出エジプト記 9:16', sourceBook: 'exodus', sourceChapter: 9, sourceVerse: 16, type: 'quote', note: 'ファラオを立てた目的' },
    { verse: 25, source: 'ホセア書 2:23', sourceBook: 'hosea', sourceChapter: 2, sourceVerse: 23, type: 'quote', note: 'わが民でない者をわが民と呼ぶ' },
    { verse: 26, source: 'ホセア書 1:10', sourceBook: 'hosea', sourceChapter: 1, sourceVerse: 10, type: 'quote', note: '生ける神の子と呼ばれる' },
    { verse: '27-28', source: 'イザヤ書 10:22-23', sourceBook: 'isaiah', sourceChapter: 10, sourceVerse: '22-23', type: 'quote', note: '残りの者だけが救われる' },
    { verse: 29, source: 'イザヤ書 1:9', sourceBook: 'isaiah', sourceChapter: 1, sourceVerse: 9, type: 'quote', note: '子孫を残してくださらなければ' },
    { verse: 33, source: 'イザヤ書 28:16', sourceBook: 'isaiah', sourceChapter: 28, sourceVerse: 16, type: 'quote', note: 'つまずきの石を置く' },
  ],
  10: [
    { verse: 5, source: 'レビ記 18:5', sourceBook: 'leviticus', sourceChapter: 18, sourceVerse: 5, type: 'quote', note: '律法を行う者は生きる' },
    { verse: '6-8', source: '申命記 30:12-14', sourceBook: 'deuteronomy', sourceChapter: 30, sourceVerse: '12-14', type: 'quote', note: '御言葉はあなたの近くにある' },
    { verse: 11, source: 'イザヤ書 28:16', sourceBook: 'isaiah', sourceChapter: 28, sourceVerse: 16, type: 'quote', note: '信じる者は失望しない' },
    { verse: 13, source: 'ヨエル書 2:32', sourceBook: 'joel', sourceChapter: 2, sourceVerse: 32, type: 'quote', note: '主の名を呼ぶ者は救われる' },
    { verse: 15, source: 'イザヤ書 52:7', sourceBook: 'isaiah', sourceChapter: 52, sourceVerse: 7, type: 'quote', note: '良い知らせを伝える者の足は美しい' },
    { verse: 16, source: 'イザヤ書 53:1', sourceBook: 'isaiah', sourceChapter: 53, sourceVerse: 1, type: 'quote', note: '誰が信じたか' },
    { verse: 18, source: '詩篇 19:4', sourceBook: 'psalms', sourceChapter: 19, sourceVerse: 4, type: 'quote', note: '声は全地に響き渡った' },
    { verse: 19, source: '申命記 32:21', sourceBook: 'deuteronomy', sourceChapter: 32, sourceVerse: 21, type: 'quote', note: '国でない者によって妬みを起こさせる' },
    { verse: 20, source: 'イザヤ書 65:1', sourceBook: 'isaiah', sourceChapter: 65, sourceVerse: 1, type: 'quote', note: '求めない者に見いだされた' },
    { verse: 21, source: 'イザヤ書 65:2', sourceBook: 'isaiah', sourceChapter: 65, sourceVerse: 2, type: 'quote', note: '不従順な民に手を差し伸べた' },
  ],
  11: [
    { verse: '3-4', source: '列王記上 19:10,18', sourceBook: '1kings', sourceChapter: 19, sourceVerse: 10, type: 'quote', note: 'エリヤの訴えと神の答え' },
    { verse: 8, source: 'イザヤ書 29:10', sourceBook: 'isaiah', sourceChapter: 29, sourceVerse: 10, type: 'quote', note: '眠りの霊を与えた' },
    { verse: '9-10', source: '詩篇 69:22-23', sourceBook: 'psalms', sourceChapter: 69, sourceVerse: '22-23', type: 'quote', note: '食卓が罠となれ' },
    { verse: 26, source: 'イザヤ書 59:20', sourceBook: 'isaiah', sourceChapter: 59, sourceVerse: 20, type: 'quote', note: '救い主がシオンから来る' },
    { verse: 27, source: 'イザヤ書 27:9', sourceBook: 'isaiah', sourceChapter: 27, sourceVerse: 9, type: 'quote', note: '罪を取り除く契約' },
    { verse: '34-35', source: 'イザヤ書 40:13', sourceBook: 'isaiah', sourceChapter: 40, sourceVerse: 13, type: 'quote', note: '主の心を知った者がいるか' },
  ],
  12: [
    { verse: 19, source: '申命記 32:35', sourceBook: 'deuteronomy', sourceChapter: 32, sourceVerse: 35, type: 'quote', note: '復讐はわたしのもの' },
    { verse: 20, source: '箴言 25:21-22', sourceBook: 'proverbs', sourceChapter: 25, sourceVerse: '21-22', type: 'quote', note: '敵が飢えていたら食べさせよ' },
  ],
  15: [
    { verse: 3, source: '詩篇 69:9', sourceBook: 'psalms', sourceChapter: 69, sourceVerse: 9, type: 'quote', note: 'あなたを侮る者の侮りが降りかかった' },
    { verse: 9, source: '詩篇 18:49', sourceBook: 'psalms', sourceChapter: 18, sourceVerse: 49, type: 'quote', note: '異邦人の中であなたをほめたたえる' },
    { verse: 10, source: '申命記 32:43', sourceBook: 'deuteronomy', sourceChapter: 32, sourceVerse: 43, type: 'quote', note: '異邦人よ、主の民と共に喜べ' },
    { verse: 11, source: '詩篇 117:1', sourceBook: 'psalms', sourceChapter: 117, sourceVerse: 1, type: 'quote', note: 'すべての異邦人よ、主をほめたたえよ' },
    { verse: 12, source: 'イザヤ書 11:10', sourceBook: 'isaiah', sourceChapter: 11, sourceVerse: 10, type: 'quote', note: 'エッサイの根が立ち上がる' },
    { verse: 21, source: 'イザヤ書 52:15', sourceBook: 'isaiah', sourceChapter: 52, sourceVerse: 15, type: 'quote', note: '聞いたことのない者が悟る' },
  ],
};

// 全データをエクスポート
export const crossReferences: BookReferences = {
  matthew,
  mark,
  luke,
  john,
  acts,
  romans,
};

// 特定の書物・章の引用を取得する関数
export function getCrossReferences(bookId: string, chapter: number): CrossReference[] {
  const bookRefs = crossReferences[bookId];
  if (!bookRefs) return [];
  return bookRefs[chapter] || [];
}

// 新約聖書かどうかを判定
export function isNewTestament(bookId: string): boolean {
  const ntBooks = [
    'matthew', 'mark', 'luke', 'john', 'acts',
    'romans', '1corinthians', '2corinthians', 'galatians', 'ephesians',
    'philippians', 'colossians', '1thessalonians', '2thessalonians',
    '1timothy', '2timothy', 'titus', 'philemon', 'hebrews',
    'james', '1peter', '2peter', '1john', '2john', '3john', 'jude', 'revelation'
  ];
  return ntBooks.includes(bookId);
}
