const fs = require('fs');
const path = require('path');

// 品詞コードの日本語変換
const partOfSpeechMap = {
  'A-': { code: 'adj', name: '形容詞', nameEn: 'Adjective' },
  'C-': { code: 'conj', name: '接続詞', nameEn: 'Conjunction' },
  'D-': { code: 'adv', name: '副詞', nameEn: 'Adverb' },
  'I-': { code: 'interj', name: '間投詞', nameEn: 'Interjection' },
  'N-': { code: 'noun', name: '名詞', nameEn: 'Noun' },
  'P-': { code: 'prep', name: '前置詞', nameEn: 'Preposition' },
  'RA': { code: 'art', name: '冠詞', nameEn: 'Article' },
  'RD': { code: 'dem', name: '指示代名詞', nameEn: 'Demonstrative' },
  'RI': { code: 'inter', name: '疑問代名詞', nameEn: 'Interrogative' },
  'RP': { code: 'pers', name: '人称代名詞', nameEn: 'Personal Pronoun' },
  'RR': { code: 'rel', name: '関係代名詞', nameEn: 'Relative Pronoun' },
  'V-': { code: 'verb', name: '動詞', nameEn: 'Verb' },
  'X-': { code: 'part', name: '不変化詞', nameEn: 'Particle' },
};

// 文法コード解析
function parseMorphology(code, pos) {
  if (code === '--------') return null;

  const result = {};

  // 動詞の場合: 人称-時制-態-法-_-_-_-_
  if (pos.startsWith('V')) {
    const person = { '1': '1人称', '2': '2人称', '3': '3人称' }[code[0]];
    const tense = {
      'P': '現在', 'I': '未完了', 'F': '未来',
      'A': 'アオリスト', 'R': '完了', 'L': '過去完了'
    }[code[1]];
    const voice = { 'A': '能動態', 'M': '中動態', 'P': '受動態' }[code[2]];
    const mood = {
      'I': '直説法', 'S': '接続法', 'O': '希求法',
      'M': '命令法', 'N': '不定詞', 'P': '分詞'
    }[code[3]];

    if (person) result.person = person;
    if (tense) result.tense = tense;
    if (voice) result.voice = voice;
    if (mood) result.mood = mood;

    // 分詞の場合は格・数・性も
    if (code[3] === 'P') {
      const caseVal = { 'N': '主格', 'G': '属格', 'D': '与格', 'A': '対格', 'V': '呼格' }[code[4]];
      const number = { 'S': '単数', 'P': '複数' }[code[5]];
      const gender = { 'M': '男性', 'F': '女性', 'N': '中性' }[code[6]];
      if (caseVal) result.case = caseVal;
      if (number) result.number = number;
      if (gender) result.gender = gender;
    }
  } else {
    // 名詞・形容詞等: _-_-_-_-格-数-性-比較級
    const caseVal = { 'N': '主格', 'G': '属格', 'D': '与格', 'A': '対格', 'V': '呼格' }[code[4]];
    const number = { 'S': '単数', 'P': '複数' }[code[5]];
    const gender = { 'M': '男性', 'F': '女性', 'N': '中性' }[code[6]];
    const degree = { 'C': '比較級', 'S': '最上級' }[code[7]];

    if (caseVal) result.case = caseVal;
    if (number) result.number = number;
    if (gender) result.gender = gender;
    if (degree) result.degree = degree;
  }

  return Object.keys(result).length > 0 ? result : null;
}

// ギリシャ語からローマ字音写を生成
const greekToLatinMap = {
  'α': 'a', 'ά': 'á', 'ὰ': 'à', 'ᾶ': 'â', 'ἀ': 'a', 'ἁ': 'ha', 'ἄ': 'á', 'ἅ': 'há',
  'ἂ': 'à', 'ἃ': 'hà', 'ᾳ': 'ai', 'ᾴ': 'ái', 'ᾲ': 'ài', 'ᾷ': 'âi',
  'β': 'b',
  'γ': 'g',
  'δ': 'd',
  'ε': 'e', 'έ': 'é', 'ὲ': 'è', 'ἐ': 'e', 'ἑ': 'he', 'ἔ': 'é', 'ἕ': 'hé', 'ἒ': 'è', 'ἓ': 'hè',
  'ζ': 'z',
  'η': 'ē', 'ή': 'ḗ', 'ὴ': 'ḕ', 'ῆ': 'ê', 'ἠ': 'ē', 'ἡ': 'hē', 'ἤ': 'ḗ', 'ἥ': 'hḗ',
  'ἢ': 'ḕ', 'ἣ': 'hḕ', 'ῃ': 'ēi', 'ῄ': 'ḗi', 'ῂ': 'ḕi', 'ῇ': 'êi',
  'θ': 'th',
  'ι': 'i', 'ί': 'í', 'ὶ': 'ì', 'ῖ': 'î', 'ἰ': 'i', 'ἱ': 'hi', 'ἴ': 'í', 'ἵ': 'hí', 'ἲ': 'ì', 'ἳ': 'hì',
  'κ': 'k',
  'λ': 'l',
  'μ': 'm',
  'ν': 'n',
  'ξ': 'x',
  'ο': 'o', 'ό': 'ó', 'ὸ': 'ò', 'ὀ': 'o', 'ὁ': 'ho', 'ὄ': 'ó', 'ὅ': 'hó', 'ὂ': 'ò', 'ὃ': 'hò',
  'π': 'p',
  'ρ': 'r', 'ῥ': 'rh',
  'σ': 's', 'ς': 's',
  'τ': 't',
  'υ': 'y', 'ύ': 'ý', 'ὺ': 'ỳ', 'ῦ': 'ŷ', 'ὐ': 'y', 'ὑ': 'hy', 'ὔ': 'ý', 'ὕ': 'hý', 'ὒ': 'ỳ', 'ὓ': 'hỳ',
  'φ': 'ph',
  'χ': 'ch',
  'ψ': 'ps',
  'ω': 'ō', 'ώ': 'ṓ', 'ὼ': 'ṑ', 'ῶ': 'ô', 'ὠ': 'ō', 'ὡ': 'hō', 'ὤ': 'ṓ', 'ὥ': 'hṓ',
  'ὢ': 'ṑ', 'ὣ': 'hṑ', 'ῳ': 'ōi', 'ῴ': 'ṓi', 'ῲ': 'ṑi', 'ῷ': 'ôi',
  // 大文字
  'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'Ē', 'Θ': 'Th',
  'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
  'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'Ph', 'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'Ō',
  'Ἀ': 'A', 'Ἁ': 'Ha', 'Ἐ': 'E', 'Ἑ': 'He', 'Ἠ': 'Ē', 'Ἡ': 'Hē',
  'Ἰ': 'I', 'Ἱ': 'Hi', 'Ὀ': 'O', 'Ὁ': 'Ho', 'Ὑ': 'Hy', 'Ὠ': 'Ō', 'Ὡ': 'Hō',
};

function transliterate(greek) {
  let result = '';
  for (const char of greek) {
    result += greekToLatinMap[char] || char;
  }
  return result;
}

// Unicode正規化でダイアクリティカルマークを分解し、基本文字を取得
function normalizeGreekChar(char) {
  const normalized = char.normalize('NFD');
  const base = normalized.replace(/[\u0300-\u036f]/g, '');
  return base.toLowerCase();
}

// 子音+母音の音節マッピング
const syllableMap = {
  'βα': 'バ', 'βε': 'ベ', 'βη': 'ベー', 'βι': 'ビ', 'βο': 'ボ', 'βυ': 'ビュ', 'βω': 'ボー',
  'γα': 'ガ', 'γε': 'ゲ', 'γη': 'ゲー', 'γι': 'ギ', 'γο': 'ゴ', 'γυ': 'ギュ', 'γω': 'ゴー',
  'δα': 'ダ', 'δε': 'デ', 'δη': 'デー', 'δι': 'ディ', 'δο': 'ド', 'δυ': 'デュ', 'δω': 'ドー',
  'ζα': 'ザ', 'ζε': 'ゼ', 'ζη': 'ゼー', 'ζι': 'ジ', 'ζο': 'ゾ', 'ζυ': 'ジュ', 'ζω': 'ゾー',
  'θα': 'サ', 'θε': 'セ', 'θη': 'セー', 'θι': 'シ', 'θο': 'ソ', 'θυ': 'シュ', 'θω': 'ソー',
  'κα': 'カ', 'κε': 'ケ', 'κη': 'ケー', 'κι': 'キ', 'κο': 'コ', 'κυ': 'キュ', 'κω': 'コー',
  'λα': 'ラ', 'λε': 'レ', 'λη': 'レー', 'λι': 'リ', 'λο': 'ロ', 'λυ': 'リュ', 'λω': 'ロー',
  'μα': 'マ', 'με': 'メ', 'μη': 'メー', 'μι': 'ミ', 'μο': 'モ', 'μυ': 'ミュ', 'μω': 'モー',
  'να': 'ナ', 'νε': 'ネ', 'νη': 'ネー', 'νι': 'ニ', 'νο': 'ノ', 'νυ': 'ニュ', 'νω': 'ノー',
  'ξα': 'クサ', 'ξε': 'クセ', 'ξη': 'クセー', 'ξι': 'クシ', 'ξο': 'クソ', 'ξυ': 'クシュ', 'ξω': 'クソー',
  'πα': 'パ', 'πε': 'ペ', 'πη': 'ペー', 'πι': 'ピ', 'πο': 'ポ', 'πυ': 'ピュ', 'πω': 'ポー',
  'ρα': 'ラ', 'ρε': 'レ', 'ρη': 'レー', 'ρι': 'リ', 'ρο': 'ロ', 'ρυ': 'リュ', 'ρω': 'ロー',
  'σα': 'サ', 'σε': 'セ', 'ση': 'セー', 'σι': 'シ', 'σο': 'ソ', 'συ': 'シュ', 'σω': 'ソー',
  'τα': 'タ', 'τε': 'テ', 'τη': 'テー', 'τι': 'ティ', 'το': 'ト', 'τυ': 'テュ', 'τω': 'トー',
  'φα': 'ファ', 'φε': 'フェ', 'φη': 'フェー', 'φι': 'フィ', 'φο': 'フォ', 'φυ': 'フュ', 'φω': 'フォー',
  'χα': 'カ', 'χε': 'ケ', 'χη': 'ケー', 'χι': 'キ', 'χο': 'コ', 'χυ': 'キュ', 'χω': 'コー',
  'ψα': 'プサ', 'ψε': 'プセ', 'ψη': 'プセー', 'ψι': 'プシ', 'ψο': 'プソ', 'ψυ': 'プシュ', 'ψω': 'プソー',
};

// 母音のみのマップ
const vowelMap = {
  'α': 'ア', 'ε': 'エ', 'η': 'エー', 'ι': 'イ', 'ο': 'オ', 'υ': 'ウ', 'ω': 'オー',
};

// 子音のみ（語末など）
const consonantOnlyMap = {
  'β': 'ブ', 'γ': 'グ', 'δ': 'ド', 'ζ': 'ズ', 'θ': 'ス', 'κ': 'ク', 'λ': 'ル',
  'μ': 'ム', 'ν': 'ン', 'ξ': 'クス', 'π': 'プ', 'ρ': 'ル', 'σ': 'ス', 'ς': 'ス',
  'τ': 'ト', 'φ': 'フ', 'χ': 'ク', 'ψ': 'プス',
};

// 二重母音
const diphthongMap = {
  'αι': 'アイ', 'ει': 'エイ', 'οι': 'オイ', 'υι': 'ウイ',
  'αυ': 'アウ', 'ευ': 'エウ', 'ηυ': 'エーウ', 'ου': 'ウー',
};

// 有気音 (h-) の母音
const roughBreathingVowels = new Set(['ἁ', 'ἑ', 'ἡ', 'ἱ', 'ὁ', 'ὑ', 'ὡ', 'ἅ', 'ἕ', 'ἥ', 'ἵ', 'ὅ', 'ὕ', 'ὥ']);

// より正確なカタカナ変換（音節単位）
function toKatakana(greek) {
  let result = '';
  const chars = [...greek];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const charNorm = normalizeGreekChar(char);
    const next = chars[i + 1];
    const nextNorm = next ? normalizeGreekChar(next) : '';

    if (/[\s.,;:·\u0387]/.test(char)) continue;

    // 二重子音: γ + γ/κ/χ/ξ = ン
    if (charNorm === 'γ' && (nextNorm === 'γ' || nextNorm === 'κ' || nextNorm === 'χ' || nextNorm === 'ξ')) {
      result += 'ン';
      continue;
    }

    // 二重母音
    const diphthong = charNorm + nextNorm;
    if (diphthongMap[diphthong]) {
      if (roughBreathingVowels.has(char)) {
        result += 'ハ' + diphthongMap[diphthong].slice(1);
      } else {
        result += diphthongMap[diphthong];
      }
      i++;
      continue;
    }

    // 子音+母音の音節
    const syllable = charNorm + nextNorm;
    if (syllableMap[syllable]) {
      result += syllableMap[syllable];
      i++;
      continue;
    }

    // 母音
    if (vowelMap[charNorm]) {
      if (roughBreathingVowels.has(char)) {
        const hRow = { 'α': 'ハ', 'ε': 'ヘ', 'η': 'ヘー', 'ι': 'ヒ', 'ο': 'ホ', 'υ': 'フ', 'ω': 'ホー' };
        result += hRow[charNorm] || vowelMap[charNorm];
      } else {
        result += vowelMap[charNorm];
      }
      continue;
    }

    // 子音のみ
    if (consonantOnlyMap[charNorm]) {
      result += consonantOnlyMap[charNorm];
      continue;
    }
  }

  return result;
}

// Strong's辞書のXMLをパース
function parseStrongsDictionary(xmlPath) {
  const xml = fs.readFileSync(xmlPath, 'utf8');
  const dictionary = {};

  // 簡易XMLパース
  const entryRegex = /<entry strongs="(\d+)">([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const strongsNum = parseInt(match[1]);
    const content = match[2];

    // unicode属性からギリシャ語を取得
    const unicodeMatch = content.match(/unicode="([^"]+)"/);
    const translitMatch = content.match(/translit="([^"]+)"/);
    const defMatch = content.match(/<strongs_def>([\s\S]*?)<\/strongs_def>/);
    const kjvMatch = content.match(/<kjv_def>([\s\S]*?)<\/kjv_def>/);

    if (unicodeMatch) {
      const lemma = unicodeMatch[1];
      dictionary[lemma] = {
        strongs: `G${strongsNum}`,
        translit: translitMatch ? translitMatch[1] : '',
        definition: defMatch ? defMatch[1].replace(/<[^>]+>/g, '').trim() : '',
        kjvUsage: kjvMatch ? kjvMatch[1].replace(/<[^>]+>/g, '').replace(/^:--/, '').trim() : '',
      };
    }
  }

  return dictionary;
}

// 基本的な日本語グロス（頻出単語 - 拡張版）
const basicGlosses = {
  // 冠詞・代名詞
  'ὁ': 'その',
  'αὐτός': '彼',
  'οὗτος': 'この',
  'ἐκεῖνος': 'あの',
  'ὅς': '〜ところの',
  'ὅστις': '〜ところの者',
  'τίς': '誰',
  'τί': '何',
  'τὶς': 'ある人',
  'ἐγώ': '私',
  'σύ': 'あなた',
  'ἡμεῖς': '私たち',
  'ὑμεῖς': 'あなたがた',
  'ἑαυτοῦ': '自分自身',
  'ἀλλήλων': '互いに',

  // 接続詞・小辞
  'καί': 'そして',
  'δέ': 'しかし',
  'γάρ': 'なぜなら',
  'ἀλλά': 'しかし',
  'οὖν': 'それゆえ',
  'ὅτι': '〜ということ',
  'ἵνα': '〜するために',
  'εἰ': 'もし',
  'ἐάν': 'もし〜なら',
  'ὡς': '〜のように',
  'ὥστε': 'その結果',
  'ὅτε': '〜の時',
  'ὅταν': '〜する時はいつでも',
  'πρίν': '〜する前に',
  'ἕως': '〜まで',
  'μέν': '一方では',
  'τε': 'そして',
  'οὔτε': '〜もない',
  'μήτε': '〜もない',
  'οὐδέ': '〜もない',
  'μηδέ': '〜もない',
  'ἤ': 'または',
  'εἴτε': '〜であれ',
  'διότι': 'なぜなら',
  'ἐπεί': '〜なので',
  'ἐπειδή': '〜した後',

  // 否定
  'οὐ': '〜ない',
  'οὐκ': '〜ない',
  'οὐχ': '〜ない',
  'μή': '〜ない',
  'οὐδείς': '誰も〜ない',
  'μηδείς': '誰も〜ない',
  'οὔπω': 'まだ〜ない',
  'μήπω': 'まだ〜ない',
  'οὐκέτι': 'もはや〜ない',
  'μηκέτι': 'もはや〜ない',

  // 前置詞
  'ἐν': '〜の中に',
  'εἰς': '〜の中へ',
  'ἐκ': '〜から',
  'ἀπό': '〜から',
  'πρός': '〜に向かって',
  'διά': '〜を通して',
  'μετά': '〜と共に',
  'ὑπό': '〜によって',
  'περί': '〜について',
  'ἐπί': '〜の上に',
  'παρά': '〜のそばに',
  'κατά': '〜に従って',
  'ὑπέρ': '〜のために',
  'ἀντί': '〜の代わりに',
  'πρό': '〜の前に',
  'σύν': '〜と共に',
  'ἄχρι': '〜まで',
  'μέχρι': '〜まで',
  'χωρίς': '〜なしに',
  'ἔμπροσθεν': '〜の前に',
  'ὀπίσω': '〜の後ろに',
  'ἔξω': '〜の外に',
  'ἐντός': '〜の内に',

  // 数詞
  'εἷς': '一つ',
  'δύο': '二',
  'τρεῖς': '三',
  'τέσσαρες': '四',
  'πέντε': '五',
  'ἕξ': '六',
  'ἑπτά': '七',
  'ὀκτώ': '八',
  'ἐννέα': '九',
  'δέκα': '十',
  'δώδεκα': '十二',
  'ἑκατόν': '百',
  'χίλιοι': '千',
  'πρῶτος': '第一の',
  'δεύτερος': '第二の',
  'τρίτος': '第三の',
  'ἕτερος': '他の',
  'ἄλλος': '他の',

  // 形容詞
  'πᾶς': 'すべての',
  'ὅλος': '全体の',
  'πολύς': '多くの',
  'μέγας': '大きい',
  'μικρός': '小さい',
  'καλός': '良い',
  'ἀγαθός': '善い',
  'κακός': '悪い',
  'πονηρός': '悪い',
  'ἴδιος': '自分の',
  'μόνος': 'ただ〜だけ',
  'ἅγιος': '聖なる',
  'δίκαιος': '正しい',
  'πιστός': '忠実な',
  'ἀληθής': '真実の',
  'αἰώνιος': '永遠の',
  'νέος': '新しい',
  'καινός': '新しい',
  'παλαιός': '古い',
  'ἔσχατος': '最後の',
  'ἕκαστος': 'それぞれの',
  'ὅμοιος': '似た',
  'ἄξιος': 'ふさわしい',
  'δυνατός': '力強い',
  'ἀδύνατος': '不可能な',
  'ἕτοιμος': '準備ができた',

  // 副詞
  'νῦν': '今',
  'τότε': 'その時',
  'πάλιν': '再び',
  'ἔτι': 'なお',
  'ἤδη': 'すでに',
  'ἀεί': '常に',
  'πάντοτε': 'いつも',
  'ποτέ': 'かつて',
  'πώποτε': 'かつて',
  'εὐθύς': 'すぐに',
  'εὐθέως': 'すぐに',
  'ταχύ': '速く',
  'ἐκεῖ': 'そこに',
  'ὧδε': 'ここに',
  'ἐνταῦθα': 'ここに',
  'πόθεν': 'どこから',
  'ποῦ': 'どこに',
  'ὅπου': '〜する所',
  'πῶς': 'どのように',
  'οὕτως': 'このように',
  'ὅπως': '〜するように',
  'καθώς': '〜のように',
  'μᾶλλον': 'むしろ',
  'λίαν': '非常に',
  'σφόδρα': '非常に',
  'ἀμήν': 'アーメン',
  'ναί': 'はい',
  'οὐχί': 'いいえ',
  'ἄρα': 'そうすると',
  'ἰδού': '見よ',
  'δεῦρο': 'ここに来い',
  'δεῦτε': 'さあ',

  // 神・信仰関連
  'θεός': '神',
  'κύριος': '主',
  'Ἰησοῦς': 'イエス',
  'Χριστός': 'キリスト',
  'πνεῦμα': '霊',
  'ἄγγελος': '天使',
  'διάβολος': '悪魔',
  'σατανᾶς': 'サタン',
  'δαιμόνιον': '悪霊',
  'βασιλεία': '王国',
  'ἐκκλησία': '教会',
  'εὐαγγέλιον': '福音',
  'ἀπόστολος': '使徒',
  'προφήτης': '預言者',
  'μαθητής': '弟子',
  'διδάσκαλος': '教師',
  'ἱερεύς': '祭司',
  'ἀρχιερεύς': '大祭司',

  // 人間関連
  'ἄνθρωπος': '人',
  'ἀνήρ': '男',
  'γυνή': '女',
  'υἱός': '息子',
  'θυγάτηρ': '娘',
  'πατήρ': '父',
  'μήτηρ': '母',
  'ἀδελφός': '兄弟',
  'ἀδελφή': '姉妹',
  'τέκνον': '子供',
  'παιδίον': '幼子',
  'παῖς': '子供',
  'δοῦλος': '奴隷',
  'κύριος': '主人',
  'βασιλεύς': '王',
  'ἄρχων': '支配者',
  'ὄχλος': '群衆',
  'λαός': '民',
  'ἔθνος': '国民',

  // 体の部分
  'σῶμα': '体',
  'σάρξ': '肉',
  'αἷμα': '血',
  'κεφαλή': '頭',
  'πρόσωπον': '顔',
  'ὀφθαλμός': '目',
  'οὖς': '耳',
  'στόμα': '口',
  'χείρ': '手',
  'πούς': '足',
  'καρδία': '心',
  'ψυχή': '魂',

  // 自然・場所
  'οὐρανός': '天',
  'γῆ': '地',
  'κόσμος': '世',
  'θάλασσα': '海',
  'ὕδωρ': '水',
  'πῦρ': '火',
  'ἥλιος': '太陽',
  'σελήνη': '月',
  'ἀστήρ': '星',
  'νεφέλη': '雲',
  'ἄνεμος': '風',
  'ὄρος': '山',
  'πόλις': '町',
  'οἶκος': '家',
  'οἰκία': '家',
  'ναός': '神殿',
  'ἱερόν': '神殿',
  'συναγωγή': '会堂',
  'ὁδός': '道',
  'τόπος': '場所',
  'ἔρημος': '荒野',
  'ἀγρός': '畑',

  // 時間
  'ἡμέρα': '日',
  'νύξ': '夜',
  'ὥρα': '時',
  'χρόνος': '時間',
  'καιρός': '時',
  'αἰών': '時代',
  'ἔτος': '年',
  'σάββατον': '安息日',

  // 抽象概念
  'λόγος': 'ことば',
  'ῥῆμα': '言葉',
  'ὄνομα': '名',
  'ζωή': 'いのち',
  'θάνατος': '死',
  'φῶς': '光',
  'σκοτία': '闘',
  'σκότος': '闘',
  'ἀλήθεια': '真理',
  'ἀγάπη': '愛',
  'χαρά': '喜び',
  'εἰρήνη': '平和',
  'ἐλπίς': '希望',
  'πίστις': '信仰',
  'χάρις': '恵み',
  'δόξα': '栄光',
  'δύναμις': '力',
  'ἐξουσία': '権威',
  'σοφία': '知恵',
  'γνῶσις': '知識',
  'ἔργον': '業',
  'μαρτυρία': '証し',
  'νόμος': '律法',
  'ἐντολή': '戒め',
  'γραφή': '聖書',
  'ἁμαρτία': '罪',
  'ἁμάρτημα': '罪',
  'κρίσις': '裁き',
  'κρίμα': '裁き',
  'σωτηρία': '救い',
  'ἄφεσις': '赦し',
  'μετάνοια': '悔い改め',
  'βάπτισμα': 'バプテスマ',
  'διαθήκη': '契約',
  'ὑπομονή': '忍耐',
  'θέλημα': '意志',
  'βουλή': '計画',
  'δικαιοσύνη': '義',
  'ἀδικία': '不義',
  'ὀργή': '怒り',
  'φόβος': '恐れ',

  // 動詞（よく使われる基本形）
  'εἰμί': '〜である',
  'γίνομαι': '〜になる',
  'ἔχω': '持つ',
  'λέγω': '言う',
  'ποιέω': 'する',
  'ἔρχομαι': '来る',
  'ὑπάγω': '行く',
  'πορεύομαι': '行く',
  'ἀπέρχομαι': '去る',
  'εἰσέρχομαι': '入る',
  'ἐξέρχομαι': '出る',
  'βαίνω': '行く',
  'ἀναβαίνω': '上る',
  'καταβαίνω': '下る',
  'δίδωμι': '与える',
  'λαμβάνω': '受ける',
  'τίθημι': '置く',
  'ἵστημι': '立つ',
  'οἶδα': '知る',
  'γινώσκω': '知る',
  'πιστεύω': '信じる',
  'ἀκούω': '聞く',
  'βλέπω': '見る',
  'ὁράω': '見る',
  'θεωρέω': '見る',
  'εὑρίσκω': '見つける',
  'ζητέω': '求める',
  'αἰτέω': '求める',
  'θέλω': '欲する',
  'δύναμαι': '〜できる',
  'μέλλω': '〜しようとする',
  'δεῖ': '〜ねばならない',
  'ἀφίημι': '赦す',
  'ἀποστέλλω': '遣わす',
  'πέμπω': '送る',
  'καλέω': '呼ぶ',
  'κράζω': '叫ぶ',
  'φωνέω': '呼ぶ',
  'ἀποκρίνομαι': '答える',
  'μαρτυρέω': '証しする',
  'κηρύσσω': '宣べ伝える',
  'διδάσκω': '教える',
  'ἀγαπάω': '愛する',
  'φιλέω': '愛する',
  'μισέω': '憎む',
  'σῴζω': '救う',
  'ἀπόλλυμι': '滅ぼす',
  'κρίνω': '裁く',
  'ἐγείρω': '起こす',
  'ἀνίστημι': '立ち上がる',
  'καθίζω': '座る',
  'ἐσθίω': '食べる',
  'πίνω': '飲む',
  'γράφω': '書く',
  'ἀναγινώσκω': '読む',
  'προσεύχομαι': '祈る',
  'δοξάζω': '栄光を帰す',
  'εὐχαριστέω': '感謝する',
  'ἁμαρτάνω': '罪を犯す',
  'μετανοέω': '悔い改める',
  'βαπτίζω': 'バプテスマを授ける',
  'ἐκβάλλω': '追い出す',
  'θεραπεύω': '癒す',
  'ἅπτομαι': '触れる',
  'φοβέομαι': '恐れる',
  'χαίρω': '喜ぶ',
  'κλαίω': '泣く',
  'ζάω': '生きる',
  'ἀποθνῄσκω': '死ぬ',
  'μένω': '留まる',
  'πληρόω': '満たす',
  'τηρέω': '守る',
  'φυλάσσω': '守る',
  'ἄρχω': '始める',
  'παύω': '止める',
  'περιπατέω': '歩く',
  'ἀκολουθέω': '従う',
  'ἄγω': '導く',
  'φέρω': '運ぶ',
  'αἴρω': '取り上げる',
  'βάλλω': '投げる',
  'πίπτω': '落ちる',
  'ἐκπίπτω': '落ちる',
  'κρατέω': 'つかむ',
  'ἐργάζομαι': '働く',
  'δουλεύω': '仕える',
  'προσκυνέω': '礼拝する',
  'ὁμολογέω': '告白する',
  'ἀρνέομαι': '否定する',
  'παραδίδωμι': '引き渡す',
  'παραλαμβάνω': '受け取る',
  'κελεύω': '命じる',
  'ἐπιτιμάω': '叱る',
  'παρακαλέω': '励ます',
  'πείθω': '説得する',
  'ἐλέγχω': '責める',
  'σκανδαλίζω': 'つまずかせる',
  'πειράζω': '試みる',
  'νικάω': '勝つ',

  // 人名・地名
  'Ἰωάννης': 'ヨハネ',
  'Πέτρος': 'ペテロ',
  'Παῦλος': 'パウロ',
  'Μαρία': 'マリヤ',
  'Μαριάμ': 'マリヤ',
  'Μωϋσῆς': 'モーセ',
  'Ἀβραάμ': 'アブラハム',
  'Δαυίδ': 'ダビデ',
  'Ἠλίας': 'エリヤ',
  'Ἰακώβ': 'ヤコブ',
  'Ἰσραήλ': 'イスラエル',
  'Ἰουδαῖος': 'ユダヤ人',
  'Φαρισαῖος': 'パリサイ人',
  'Σαδδουκαῖος': 'サドカイ人',
  'Γαλιλαία': 'ガリラヤ',
  'Ἰερουσαλήμ': 'エルサレム',
  'Ἱεροσόλυμα': 'エルサレム',
  'Ῥώμη': 'ローマ',
  'Ἰορδάνης': 'ヨルダン',
};

// MorphGNTファイルを変換
function convertMorphGNT(inputPath, bookId, bookName, strongsDict) {
  const content = fs.readFileSync(inputPath, 'utf8');
  const lines = content.trim().split('\n');

  const chapters = {};

  for (const line of lines) {
    const parts = line.split(' ').filter(p => p);
    if (parts.length < 6) continue;

    const [ref, pos, morph, textWithPunct, text, normalized, lemma] = parts;

    // 参照を解析 (例: 040101 = ヨハネ 1:1)
    const chapter = parseInt(ref.substring(2, 4));
    const verse = parseInt(ref.substring(4, 6));

    if (!chapters[chapter]) {
      chapters[chapter] = { chapter, verses: {} };
    }
    if (!chapters[chapter].verses[verse]) {
      chapters[chapter].verses[verse] = { verse, words: [] };
    }

    // 品詞情報
    const posInfo = partOfSpeechMap[pos] || { code: pos, name: pos, nameEn: pos };

    // 文法情報
    const morphInfo = parseMorphology(morph, pos);

    // 辞書情報
    const dictInfo = strongsDict[lemma] || {};

    // 日本語グロス
    const gloss = basicGlosses[lemma] || '';

    const word = {
      text: textWithPunct.replace(/[,.\u0387;·]/g, ''), // 句読点を除去
      textWithPunct,
      lemma,
      translit: transliterate(normalized),
      katakana: toKatakana(normalized),
      pos: posInfo.code,
      posName: posInfo.name,
      morph: morphInfo,
      morphCode: morph,
      gloss,
      strongs: dictInfo.strongs || '',
      definition: dictInfo.definition || '',
    };

    chapters[chapter].verses[verse].words.push(word);
  }

  // 配列形式に変換
  const chaptersArray = Object.values(chapters).map(ch => ({
    chapter: ch.chapter,
    verses: Object.values(ch.verses),
  }));

  return {
    id: bookId,
    name: bookName,
    chapters: chaptersArray,
  };
}

// メイン処理
function main() {
  const sblgntDir = process.argv[2] || '/tmp/sblgnt';
  const strongsPath = process.argv[3] || '/tmp/strongs/strongsgreek.xml';
  const outputDir = process.argv[4] || path.join(__dirname, '../data/greek');

  // 出力ディレクトリ作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Strong's辞書を読み込み
  console.log('Loading Strong\'s dictionary...');
  const strongsDict = fs.existsSync(strongsPath) ? parseStrongsDictionary(strongsPath) : {};
  console.log(`Loaded ${Object.keys(strongsDict).length} entries`);

  // 書物のマッピング
  const books = [
    { file: '61-Mt-morphgnt.txt', id: 'matthew', name: 'マタイによる福音書' },
    { file: '62-Mk-morphgnt.txt', id: 'mark', name: 'マルコによる福音書' },
    { file: '63-Lk-morphgnt.txt', id: 'luke', name: 'ルカによる福音書' },
    { file: '64-Jn-morphgnt.txt', id: 'john', name: 'ヨハネによる福音書' },
    { file: '65-Ac-morphgnt.txt', id: 'acts', name: '使徒行伝' },
    { file: '66-Ro-morphgnt.txt', id: 'romans', name: 'ローマ人への手紙' },
    { file: '67-1Co-morphgnt.txt', id: '1corinthians', name: 'コリント人への第一の手紙' },
    { file: '68-2Co-morphgnt.txt', id: '2corinthians', name: 'コリント人への第二の手紙' },
    { file: '69-Ga-morphgnt.txt', id: 'galatians', name: 'ガラテヤ人への手紙' },
    { file: '70-Eph-morphgnt.txt', id: 'ephesians', name: 'エペソ人への手紙' },
    { file: '71-Php-morphgnt.txt', id: 'philippians', name: 'ピリピ人への手紙' },
    { file: '72-Col-morphgnt.txt', id: 'colossians', name: 'コロサイ人への手紙' },
    { file: '73-1Th-morphgnt.txt', id: '1thessalonians', name: 'テサロニケ人への第一の手紙' },
    { file: '74-2Th-morphgnt.txt', id: '2thessalonians', name: 'テサロニケ人への第二の手紙' },
    { file: '75-1Ti-morphgnt.txt', id: '1timothy', name: 'テモテヘの第一の手紙' },
    { file: '76-2Ti-morphgnt.txt', id: '2timothy', name: 'テモテヘの第二の手紙' },
    { file: '77-Tit-morphgnt.txt', id: 'titus', name: 'テトスヘの手紙' },
    { file: '78-Phm-morphgnt.txt', id: 'philemon', name: 'ピレモンヘの手紙' },
    { file: '79-Heb-morphgnt.txt', id: 'hebrews', name: 'ヘブル人への手紙' },
    { file: '80-Jas-morphgnt.txt', id: 'james', name: 'ヤコブの手紙' },
    { file: '81-1Pe-morphgnt.txt', id: '1peter', name: 'ペテロの第一の手紙' },
    { file: '82-2Pe-morphgnt.txt', id: '2peter', name: 'ペテロの第二の手紙' },
    { file: '83-1Jn-morphgnt.txt', id: '1john', name: 'ヨハネの第一の手紙' },
    { file: '84-2Jn-morphgnt.txt', id: '2john', name: 'ヨハネの第二の手紙' },
    { file: '85-3Jn-morphgnt.txt', id: '3john', name: 'ヨハネの第三の手紙' },
    { file: '86-Jud-morphgnt.txt', id: 'jude', name: 'ユダの手紙' },
    { file: '87-Re-morphgnt.txt', id: 'revelation', name: 'ヨハネの黙示録' },
  ];

  // 指定された書のみ変換（デフォルトはヨハネ福音書）
  const targetBooks = process.argv[5] ? process.argv[5].split(',') : ['john'];

  const results = [];

  for (const book of books) {
    if (targetBooks.includes('all') || targetBooks.includes(book.id)) {
      const inputPath = path.join(sblgntDir, book.file);
      if (!fs.existsSync(inputPath)) {
        console.log(`Skipping ${book.name} - file not found`);
        continue;
      }

      console.log(`Converting ${book.name}...`);
      const data = convertMorphGNT(inputPath, book.id, book.name, strongsDict);
      results.push(data);

      // 個別ファイルとして保存
      const outputPath = path.join(outputDir, `${book.id}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`  -> ${outputPath}`);
    }
  }

  // 全書まとめたファイルも作成
  if (results.length > 0) {
    const allBooksPath = path.join(outputDir, 'greek-nt.json');
    const allData = {
      books: results,
      metadata: {
        source: 'MorphGNT SBLGNT',
        license: 'CC BY-SA 3.0',
        generatedAt: new Date().toISOString(),
      },
    };
    fs.writeFileSync(allBooksPath, JSON.stringify(allData, null, 2), 'utf8');
    console.log(`\nAll books saved to ${allBooksPath}`);
  }

  console.log('\nDone!');
}

main();
