const fs = require('fs');
const path = require('path');

// LXX書物名と英語ID/日本語名のマッピング（LXX-Sweteの略称に合わせる）
const lxxBookMapping = {
  'Gen': { id: 'genesis', name: '創世記', shortName: '創世記' },
  'Exo': { id: 'exodus', name: '出エジプト記', shortName: '出エジプト' },
  'Lev': { id: 'leviticus', name: 'レビ記', shortName: 'レビ' },
  'Num': { id: 'numbers', name: '民数記', shortName: '民数記' },
  'Deu': { id: 'deuteronomy', name: '申命記', shortName: '申命記' },
  'Jos': { id: 'joshua', name: 'ヨシュア記', shortName: 'ヨシュア' },
  'Jdg': { id: 'judges', name: '士師記', shortName: '士師記' },
  'Rut': { id: 'ruth', name: 'ルツ記', shortName: 'ルツ' },
  '1Sa': { id: '1samuel', name: 'サムエル記上', shortName: 'サムエル上' },
  '2Sa': { id: '2samuel', name: 'サムエル記下', shortName: 'サムエル下' },
  '1Ki': { id: '1kings', name: '列王紀上', shortName: '列王上' },
  '2Ki': { id: '2kings', name: '列王紀下', shortName: '列王下' },
  '1Ch': { id: '1chronicles', name: '歴代志上', shortName: '歴代上' },
  '2Ch': { id: '2chronicles', name: '歴代志下', shortName: '歴代下' },
  '1Es': { id: '1esdras', name: 'エズラ記（第一）', shortName: '1エズラ' },
  'Ezr': { id: 'ezra', name: 'エズラ記', shortName: 'エズラ' },
  'Neh': { id: 'nehemiah', name: 'ネヘミヤ記', shortName: 'ネヘミヤ' },
  'Est': { id: 'esther', name: 'エステル記', shortName: 'エステル' },
  'Job': { id: 'job', name: 'ヨブ記', shortName: 'ヨブ' },
  'Psa': { id: 'psalms', name: '詩篇', shortName: '詩篇' },
  'Pro': { id: 'proverbs', name: '箴言', shortName: '箴言' },
  'Ecc': { id: 'ecclesiastes', name: '伝道の書', shortName: '伝道' },
  'Sol': { id: 'songofsolomon', name: '雅歌', shortName: '雅歌' },
  'Isa': { id: 'isaiah', name: 'イザヤ書', shortName: 'イザヤ' },
  'Jer': { id: 'jeremiah', name: 'エレミヤ書', shortName: 'エレミヤ' },
  'Lam': { id: 'lamentations', name: '哀歌', shortName: '哀歌' },
  'Eze': { id: 'ezekiel', name: 'エゼキエル書', shortName: 'エゼキエル' },
  'Dan': { id: 'daniel', name: 'ダニエル書', shortName: 'ダニエル' },
  'Hos': { id: 'hosea', name: 'ホセア書', shortName: 'ホセア' },
  'Joe': { id: 'joel', name: 'ヨエル書', shortName: 'ヨエル' },
  'Amo': { id: 'amos', name: 'アモス書', shortName: 'アモス' },
  'Oba': { id: 'obadiah', name: 'オバデヤ書', shortName: 'オバデヤ' },
  'Jon': { id: 'jonah', name: 'ヨナ書', shortName: 'ヨナ' },
  'Mic': { id: 'micah', name: 'ミカ書', shortName: 'ミカ' },
  'Nah': { id: 'nahum', name: 'ナホム書', shortName: 'ナホム' },
  'Hab': { id: 'habakkuk', name: 'ハバクク書', shortName: 'ハバクク' },
  'Zep': { id: 'zephaniah', name: 'ゼパニヤ書', shortName: 'ゼパニヤ' },
  'Hag': { id: 'haggai', name: 'ハガイ書', shortName: 'ハガイ' },
  'Zec': { id: 'zechariah', name: 'ゼカリヤ書', shortName: 'ゼカリヤ' },
  'Mal': { id: 'malachi', name: 'マラキ書', shortName: 'マラキ' },
  // 外典（参考として含む）
  'Tob': { id: 'tobit', name: 'トビト記', shortName: 'トビト' },
  'Tbs': { id: 'tobit', name: 'トビト記', shortName: 'トビト' },
  'Jdt': { id: 'judith', name: 'ユディト記', shortName: 'ユディト' },
  'Wis': { id: 'wisdom', name: '知恵の書', shortName: '知恵' },
  'Sir': { id: 'sirach', name: 'シラ書', shortName: 'シラ' },
  'Sip': { id: 'sirach', name: 'シラ書', shortName: 'シラ' },
  'Bar': { id: 'baruch', name: 'バルク書', shortName: 'バルク' },
  '1Ma': { id: '1maccabees', name: 'マカバイ記第一', shortName: '1マカバイ' },
  '2Ma': { id: '2maccabees', name: 'マカバイ記第二', shortName: '2マカバイ' },
  '3Ma': { id: '3maccabees', name: 'マカバイ記第三', shortName: '3マカバイ' },
  '4Ma': { id: '4maccabees', name: 'マカバイ記第四', shortName: '4マカバイ' },
  'Pss': { id: 'psalmssolomon', name: 'ソロモンの詩篇', shortName: 'ソロモン詩篇' },
  'Ode': { id: 'odes', name: '頌歌', shortName: '頌歌' }
};

// 旧約聖書の正典書物順序
const canonicalOrder = [
  'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
  'joshua', 'judges', 'ruth', '1samuel', '2samuel',
  '1kings', '2kings', '1chronicles', '2chronicles', 'ezra', 'nehemiah',
  'esther', 'job', 'psalms', 'proverbs', 'ecclesiastes', 'songofsolomon',
  'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel',
  'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah',
  'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'
];

function convertLXXSwete() {
  console.log('========================================');
  console.log('LXX-Swete → JSON Converter (Greek OT)');
  console.log('========================================\n');

  const basePath = path.join(__dirname, '../temp-greek/LXX-Swete-1930-master');
  const outputPath = path.join(__dirname, '../data/bible-greek-lxx.json');

  // ファイルを読み込み
  const versification = fs.readFileSync(path.join(basePath, '00-Swete_versification.csv'), 'utf8').split('\n');
  const words = fs.readFileSync(path.join(basePath, '01-Swete_word_with_punctuations.csv'), 'utf8').split('\n');
  const translits = fs.readFileSync(path.join(basePath, '03-Swete_SBL_transliterations.csv'), 'utf8').split('\n');

  // 単語番号→ギリシャ語/トランスリテレーションのマップ
  const wordMap = {};
  for (let i = 0; i < words.length; i++) {
    const parts = words[i].split('\t');
    if (parts.length >= 2) {
      const num = parseInt(parts[0]);
      wordMap[num] = { greek: parts[1] };
    }
  }
  for (let i = 0; i < translits.length; i++) {
    const parts = translits[i].split('\t');
    if (parts.length >= 2) {
      const num = parseInt(parts[0]);
      if (wordMap[num]) {
        wordMap[num].translit = parts[1];
      }
    }
  }

  // versificationをパースして節の範囲を特定
  const verseRanges = [];
  for (let i = 0; i < versification.length; i++) {
    const line = versification[i].trim();
    if (!line) continue;
    const parts = line.split('\t');
    if (parts.length < 2) continue;

    const startWord = parseInt(parts[0]);
    const ref = parts[1]; // Gen.1:1 形式

    // 参照をパース
    const match = ref.match(/^([^.]+)\.(\d+):(\d+)$/);
    if (!match) continue;

    const bookAbbrev = match[1];
    const chapter = parseInt(match[2]);
    const verse = parseInt(match[3]);

    verseRanges.push({
      startWord,
      bookAbbrev,
      chapter,
      verse
    });
  }

  // 各節の終了単語番号を計算
  for (let i = 0; i < verseRanges.length - 1; i++) {
    verseRanges[i].endWord = verseRanges[i + 1].startWord - 1;
  }
  if (verseRanges.length > 0) {
    // Math.maxのスタックオーバーフローを避けるためループで計算
    let maxWord = 0;
    for (const key of Object.keys(wordMap)) {
      const num = parseInt(key);
      if (num > maxWord) maxWord = num;
    }
    verseRanges[verseRanges.length - 1].endWord = maxWord;
  }

  // データを書物→章→節でグループ化
  const booksData = {};

  for (const range of verseRanges) {
    const bookInfo = lxxBookMapping[range.bookAbbrev];
    if (!bookInfo) continue;

    const bookId = bookInfo.id;

    if (!booksData[bookId]) {
      booksData[bookId] = { info: bookInfo, chapters: {} };
    }
    if (!booksData[bookId].chapters[range.chapter]) {
      booksData[bookId].chapters[range.chapter] = {};
    }

    // 節のテキストを収集
    const greekWords = [];
    const translitWords = [];

    for (let w = range.startWord; w <= range.endWord; w++) {
      if (wordMap[w]) {
        greekWords.push(wordMap[w].greek || '');
        translitWords.push(wordMap[w].translit || '');
      }
    }

    booksData[bookId].chapters[range.chapter][range.verse] = {
      greek: greekWords.join(' '),
      translit: translitWords.join(' ')
    };
  }

  // JSON形式に変換（正典順序で並べる）
  const books = [];

  for (const bookId of canonicalOrder) {
    if (!booksData[bookId]) continue;

    const bookData = booksData[bookId];
    const chapters = [];
    const chapterNums = Object.keys(bookData.chapters).map(Number).sort((a, b) => a - b);

    for (const chapterNum of chapterNums) {
      const verses = [];
      const verseNums = Object.keys(bookData.chapters[chapterNum]).map(Number).sort((a, b) => a - b);

      for (const verseNum of verseNums) {
        const data = bookData.chapters[chapterNum][verseNum];
        verses.push({
          verse: verseNum,
          text: data.greek,
          ruby: data.translit // ルビとしてトランスリテレーションを使用
        });
      }

      chapters.push({
        chapter: chapterNum,
        verses: verses
      });
    }

    books.push({
      id: bookData.info.id,
      name: bookData.info.name,
      shortName: bookData.info.shortName,
      chapters: chapters
    });
  }

  const output = {
    books: books,
    metadata: {
      translation: 'ギリシャ語旧約聖書（七十人訳）',
      translationShort: 'LXX',
      language: 'grc',
      source: 'LXX-Swete-1930',
      license: 'CC BY-SA 4.0',
      hasRuby: true,
      rubyType: 'transliteration'
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

  // 統計
  let totalVerses = 0;
  let totalChapters = 0;
  for (const book of books) {
    totalChapters += book.chapters.length;
    for (const ch of book.chapters) {
      totalVerses += ch.verses.length;
    }
  }

  console.log('✅ Conversion completed!');
  console.log(`Books:    ${books.length}`);
  console.log(`Chapters: ${totalChapters}`);
  console.log(`Verses:   ${totalVerses}`);
  console.log(`Output:   ${outputPath}`);
}

convertLXXSwete();
