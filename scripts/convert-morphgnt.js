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

// 基本的な日本語グロス（頻出単語）
const basicGlosses = {
  'ὁ': 'その',
  'καί': 'そして',
  'αὐτός': '彼',
  'δέ': 'しかし',
  'ἐν': '〜の中に',
  'εἰμί': '〜である',
  'λέγω': '言う',
  'οὗτος': 'この',
  'ὅς': '〜ところの',
  'οὐ': '〜ない',
  'εἰς': '〜の中へ',
  'ἐγώ': '私',
  'σύ': 'あなた',
  'ὅτι': '〜ということ',
  'πᾶς': 'すべての',
  'γάρ': 'なぜなら',
  'ἐκ': '〜から',
  'ἐπί': '〜の上に',
  'κύριος': '主',
  'θεός': '神',
  'Ἰησοῦς': 'イエス',
  'Χριστός': 'キリスト',
  'πατήρ': '父',
  'ἄνθρωπος': '人',
  'υἱός': '息子',
  'λόγος': 'ことば',
  'πνεῦμα': '霊',
  'κόσμος': '世',
  'ζωή': 'いのち',
  'φῶς': '光',
  'ἀλήθεια': '真理',
  'ἀγάπη': '愛',
  'πίστις': '信仰',
  'ἔργον': '業',
  'δόξα': '栄光',
  'γίνομαι': '〜になる',
  'ἔχω': '持つ',
  'ποιέω': 'する',
  'ἔρχομαι': '来る',
  'οἶδα': '知る',
  'γινώσκω': '知る',
  'πιστεύω': '信じる',
  'ἀκούω': '聞く',
  'βλέπω': '見る',
  'θέλω': '欲する',
  'δίδωμι': '与える',
  'λαμβάνω': '受ける',
  'ἀποστέλλω': '遣わす',
  'μαρτυρέω': '証しする',
  'ἀγαπάω': '愛する',
  'πρός': '〜に向かって',
  'διά': '〜を通して',
  'μετά': '〜と共に',
  'ὑπό': '〜によって',
  'περί': '〜について',
  'ἀπό': '〜から',
  'ἀρχή': '初め',
  'ἡμέρα': '日',
  'οὐρανός': '天',
  'γῆ': '地',
  'σκοτία': '闘',
  'μαρτυρία': '証し',
  'χάρις': '恵み',
  'νόμος': '律法',
  'μή': '〜ない',
  'ἵνα': '〜するために',
  'ἀλλά': 'しかし',
  'οὖν': 'それゆえ',
  'εἰ': 'もし',
  'ὡς': '〜のように',
  'τίς': '誰',
  'τί': '何',
  'οὐδείς': '誰も〜ない',
  'πολύς': '多くの',
  'μέγας': '大きい',
  'καλός': '良い',
  'ἴδιος': '自分の',
  'μόνος': 'ただ〜だけ',
  'ἄλλος': '他の',
  'νῦν': '今',
  'πάλιν': '再び',
  'ἐκεῖ': 'そこに',
  'ὧδε': 'ここに',
  'Ἰωάννης': 'ヨハネ',
  'Πέτρος': 'ペテロ',
  'Μωϋσῆς': 'モーセ',
  'Ἀβραάμ': 'アブラハム',
  'Ἰσραήλ': 'イスラエル',
  'Ἰουδαῖος': 'ユダヤ人',
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
