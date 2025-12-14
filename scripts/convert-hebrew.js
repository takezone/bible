const fs = require('fs');
const path = require('path');

// ヘブル語からローマ字への変換表（簡易版）
const hebrewToRoman = {
  'א': "'", 'ב': 'v', 'ג': 'g', 'ד': 'd', 'ה': 'h',
  'ו': 'v', 'ז': 'z', 'ח': 'ch', 'ט': 't', 'י': 'y',
  'כ': 'kh', 'ך': 'kh', 'ל': 'l', 'מ': 'm', 'ם': 'm',
  'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': "'", 'פ': 'f',
  'ף': 'f', 'צ': 'ts', 'ץ': 'ts', 'ק': 'q', 'ר': 'r',
  'ש': 'sh', 'ת': 't',
  // 母音記号（ニクダー）
  'ַ': 'a', 'ָ': 'a', 'ֲ': 'a',  // patach, qamats, hataf patach
  'ֶ': 'e', 'ֵ': 'e', 'ֱ': 'e',  // segol, tsere, hataf segol
  'ִ': 'i',                      // hiriq
  'ֹ': 'o', 'ֳ': 'o',            // holam, hataf qamats
  'ֻ': 'u', 'וּ': 'u',           // qubuts, shuruk
  'ְ': '',                       // sheva (usually silent)
  'ּ': '',                       // dagesh (doubles consonant, simplify)
  // アクセント記号は無視
  '֑': '', '֒': '', '֓': '', '֔': '', '֕': '', '֖': '', '֗': '',
  '֘': '', '֙': '', '֚': '', '֛': '', '֜': '', '֝': '', '֞': '',
  '֟': '', '֠': '', '֡': '', '֢': '', '֣': '', '֤': '', '֥': '',
  '֦': '', '֧': '', '֨': '', '֩': '', '֪': '', '֫': '', '֬': '',
  '֭': '', '֮': '', '֯': '',
  // 特殊文字
  '׀': '|', '׃': '.', '־': '-',
  // その他
  'ׁ': '', 'ׂ': '',  // shin/sin dot
};

// ヘブル語テキストをローマ字に変換
function transliterate(hebrew) {
  let result = '';
  for (const char of hebrew) {
    if (hebrewToRoman[char] !== undefined) {
      result += hebrewToRoman[char];
    } else if (/[\u0590-\u05FF]/.test(char)) {
      // 未知のヘブル語文字はそのまま
      result += char;
    } else {
      result += char;
    }
  }
  // 連続する同じ子音を削除、読みやすく整形
  result = result.replace(/(.)\1+/g, '$1');
  return result;
}

// 英語の書名からIDと日本語名へのマッピング
const bookMapping = {
  'Genesis': { id: 'genesis', name: '創世記' },
  'Exodus': { id: 'exodus', name: '出エジプト記' },
  'Leviticus': { id: 'leviticus', name: 'レビ記' },
  'Numbers': { id: 'numbers', name: '民数記' },
  'Deuteronomy': { id: 'deuteronomy', name: '申命記' },
  'Joshua': { id: 'joshua', name: 'ヨシュア記' },
  'Judges': { id: 'judges', name: '士師記' },
  'Ruth': { id: 'ruth', name: 'ルツ記' },
  'I Samuel': { id: '1samuel', name: 'サムエル記上' },
  'II Samuel': { id: '2samuel', name: 'サムエル記下' },
  'I Kings': { id: '1kings', name: '列王紀上' },
  'II Kings': { id: '2kings', name: '列王紀下' },
  'I Chronicles': { id: '1chronicles', name: '歴代志上' },
  'II Chronicles': { id: '2chronicles', name: '歴代志下' },
  'Ezra': { id: 'ezra', name: 'エズラ記' },
  'Nehemiah': { id: 'nehemiah', name: 'ネヘミヤ記' },
  'Esther': { id: 'esther', name: 'エステル記' },
  'Job': { id: 'job', name: 'ヨブ記' },
  'Psalms': { id: 'psalms', name: '詩篇' },
  'Proverbs': { id: 'proverbs', name: '箴言' },
  'Ecclesiastes': { id: 'ecclesiastes', name: '伝道の書' },
  'Song of Solomon': { id: 'songofsolomon', name: '雅歌' },
  'Isaiah': { id: 'isaiah', name: 'イザヤ書' },
  'Jeremiah': { id: 'jeremiah', name: 'エレミヤ書' },
  'Lamentations': { id: 'lamentations', name: '哀歌' },
  'Ezekiel': { id: 'ezekiel', name: 'エゼキエル書' },
  'Daniel': { id: 'daniel', name: 'ダニエル書' },
  'Hosea': { id: 'hosea', name: 'ホセア書' },
  'Joel': { id: 'joel', name: 'ヨエル書' },
  'Amos': { id: 'amos', name: 'アモス書' },
  'Obadiah': { id: 'obadiah', name: 'オバデヤ書' },
  'Jonah': { id: 'jonah', name: 'ヨナ書' },
  'Micah': { id: 'micah', name: 'ミカ書' },
  'Nahum': { id: 'nahum', name: 'ナホム書' },
  'Habakkuk': { id: 'habakkuk', name: 'ハバクク書' },
  'Zephaniah': { id: 'zephaniah', name: 'ゼパニヤ書' },
  'Haggai': { id: 'haggai', name: 'ハガイ書' },
  'Zechariah': { id: 'zechariah', name: 'ゼカリヤ書' },
  'Malachi': { id: 'malachi', name: 'マラキ書' },
};

// 旧約聖書の順序
const otOrder = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', 'I Samuel', 'II Samuel',
  'I Kings', 'II Kings', 'I Chronicles', 'II Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah',
  'Haggai', 'Zechariah', 'Malachi'
];

// 単語テキストから接頭辞のスラッシュを削除
function cleanWord(word) {
  // "ב/ראשית" -> "בראשית"
  return word.replace(/\//g, '');
}

// メイン処理
function convert() {
  const inputPath = path.join(__dirname, '../temp-hebrew/hebrew.json');
  const outputPath = path.join(__dirname, '../data/bible-hebrew.json');

  console.log('Reading Hebrew Bible data...');
  const hebrewData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const books = [];
  let totalVerses = 0;
  let totalChapters = 0;

  for (const bookName of otOrder) {
    const bookData = hebrewData[bookName];
    if (!bookData) {
      console.warn(`Warning: Book "${bookName}" not found in data`);
      continue;
    }

    const mapping = bookMapping[bookName];
    if (!mapping) {
      console.warn(`Warning: No mapping for "${bookName}"`);
      continue;
    }

    const chapters = [];

    for (let chapterIdx = 0; chapterIdx < bookData.length; chapterIdx++) {
      const chapterData = bookData[chapterIdx];
      const verses = [];

      for (let verseIdx = 0; verseIdx < chapterData.length; verseIdx++) {
        const verseWords = chapterData[verseIdx];

        // 単語を結合して節テキストを作成
        const hebrewText = verseWords.map(w => cleanWord(w[0])).join(' ');
        const transliteration = transliterate(hebrewText);

        verses.push({
          verse: verseIdx + 1,
          text: hebrewText,
          ruby: transliteration
        });
        totalVerses++;
      }

      chapters.push({
        chapter: chapterIdx + 1,
        verses
      });
      totalChapters++;
    }

    books.push({
      id: mapping.id,
      name: mapping.name,
      chapters
    });

    console.log(`  ${mapping.name}: ${chapters.length} chapters, ${chapters.reduce((sum, ch) => sum + ch.verses.length, 0)} verses`);
  }

  const result = {
    books,
    metadata: {
      translation: 'ヘブル語聖書（原典）',
      language: 'he',
      source: 'Open Scriptures Hebrew Bible (Westminster Leningrad Codex)',
      license: 'Public Domain (text), CC BY 4.0 (morphology)',
      year: '原典'
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\nConversion complete!`);
  console.log(`  Books: ${books.length}`);
  console.log(`  Chapters: ${totalChapters}`);
  console.log(`  Verses: ${totalVerses}`);
  console.log(`  Output: ${outputPath}`);
}

convert();
