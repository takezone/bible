const fs = require('fs');
const path = require('path');

// 書物IDマッピング（USFX形式 → アプリ形式）
const bookMapping = {
  'GEN': { id: 'genesis', name: '創世記', shortName: '創世記' },
  'EXO': { id: 'exodus', name: '出エジプト記', shortName: '出エジプト' },
  'LEV': { id: 'leviticus', name: 'レビ記', shortName: 'レビ' },
  'NUM': { id: 'numbers', name: '民数記', shortName: '民数記' },
  'DEU': { id: 'deuteronomy', name: '申命記', shortName: '申命記' },
  'JOS': { id: 'joshua', name: 'ヨシュア記', shortName: 'ヨシュア' },
  'JDG': { id: 'judges', name: '士師記', shortName: '士師記' },
  'RUT': { id: 'ruth', name: 'ルツ記', shortName: 'ルツ' },
  '1SA': { id: '1samuel', name: 'サムエル記上', shortName: 'サムエル上' },
  '2SA': { id: '2samuel', name: 'サムエル記下', shortName: 'サムエル下' },
  '1KI': { id: '1kings', name: '列王紀上', shortName: '列王上' },
  '2KI': { id: '2kings', name: '列王紀下', shortName: '列王下' },
  '1CH': { id: '1chronicles', name: '歴代志上', shortName: '歴代上' },
  '2CH': { id: '2chronicles', name: '歴代志下', shortName: '歴代下' },
  'EZR': { id: 'ezra', name: 'エズラ記', shortName: 'エズラ' },
  'NEH': { id: 'nehemiah', name: 'ネヘミヤ記', shortName: 'ネヘミヤ' },
  'EST': { id: 'esther', name: 'エステル記', shortName: 'エステル' },
  'JOB': { id: 'job', name: 'ヨブ記', shortName: 'ヨブ' },
  'PSA': { id: 'psalms', name: '詩篇', shortName: '詩篇' },
  'PRO': { id: 'proverbs', name: '箴言', shortName: '箴言' },
  'ECC': { id: 'ecclesiastes', name: '伝道の書', shortName: '伝道' },
  'SNG': { id: 'songofsolomon', name: '雅歌', shortName: '雅歌' },
  'ISA': { id: 'isaiah', name: 'イザヤ書', shortName: 'イザヤ' },
  'JER': { id: 'jeremiah', name: 'エレミヤ書', shortName: 'エレミヤ' },
  'LAM': { id: 'lamentations', name: '哀歌', shortName: '哀歌' },
  'EZK': { id: 'ezekiel', name: 'エゼキエル書', shortName: 'エゼキエル' },
  'DAN': { id: 'daniel', name: 'ダニエル書', shortName: 'ダニエル' },
  'HOS': { id: 'hosea', name: 'ホセア書', shortName: 'ホセア' },
  'JOL': { id: 'joel', name: 'ヨエル書', shortName: 'ヨエル' },
  'AMO': { id: 'amos', name: 'アモス書', shortName: 'アモス' },
  'OBA': { id: 'obadiah', name: 'オバデヤ書', shortName: 'オバデヤ' },
  'JON': { id: 'jonah', name: 'ヨナ書', shortName: 'ヨナ' },
  'MIC': { id: 'micah', name: 'ミカ書', shortName: 'ミカ' },
  'NAM': { id: 'nahum', name: 'ナホム書', shortName: 'ナホム' },
  'HAB': { id: 'habakkuk', name: 'ハバクク書', shortName: 'ハバクク' },
  'ZEP': { id: 'zephaniah', name: 'ゼパニヤ書', shortName: 'ゼパニヤ' },
  'HAG': { id: 'haggai', name: 'ハガイ書', shortName: 'ハガイ' },
  'ZEC': { id: 'zechariah', name: 'ゼカリヤ書', shortName: 'ゼカリヤ' },
  'MAL': { id: 'malachi', name: 'マラキ書', shortName: 'マラキ' },
  // 新約聖書
  'MAT': { id: 'matthew', name: 'マタイによる福音書', shortName: 'マタイ' },
  'MRK': { id: 'mark', name: 'マルコによる福音書', shortName: 'マルコ' },
  'LUK': { id: 'luke', name: 'ルカによる福音書', shortName: 'ルカ' },
  'JHN': { id: 'john', name: 'ヨハネによる福音書', shortName: 'ヨハネ' },
  'ACT': { id: 'acts', name: '使徒行伝', shortName: '使徒' },
  'ROM': { id: 'romans', name: 'ローマ人への手紙', shortName: 'ローマ' },
  '1CO': { id: '1corinthians', name: 'コリント人への第一の手紙', shortName: '1コリント' },
  '2CO': { id: '2corinthians', name: 'コリント人への第二の手紙', shortName: '2コリント' },
  'GAL': { id: 'galatians', name: 'ガラテヤ人への手紙', shortName: 'ガラテヤ' },
  'EPH': { id: 'ephesians', name: 'エペソ人への手紙', shortName: 'エペソ' },
  'PHP': { id: 'philippians', name: 'ピリピ人への手紙', shortName: 'ピリピ' },
  'COL': { id: 'colossians', name: 'コロサイ人への手紙', shortName: 'コロサイ' },
  '1TH': { id: '1thessalonians', name: 'テサロニケ人への第一の手紙', shortName: '1テサロニケ' },
  '2TH': { id: '2thessalonians', name: 'テサロニケ人への第二の手紙', shortName: '2テサロニケ' },
  '1TI': { id: '1timothy', name: 'テモテへの第一の手紙', shortName: '1テモテ' },
  '2TI': { id: '2timothy', name: 'テモテへの第二の手紙', shortName: '2テモテ' },
  'TIT': { id: 'titus', name: 'テトスへの手紙', shortName: 'テトス' },
  'PHM': { id: 'philemon', name: 'ピレモンへの手紙', shortName: 'ピレモン' },
  'HEB': { id: 'hebrews', name: 'ヘブル人への手紙', shortName: 'ヘブル' },
  'JAS': { id: 'james', name: 'ヤコブの手紙', shortName: 'ヤコブ' },
  '1PE': { id: '1peter', name: 'ペテロの第一の手紙', shortName: '1ペテロ' },
  '2PE': { id: '2peter', name: 'ペテロの第二の手紙', shortName: '2ペテロ' },
  '1JN': { id: '1john', name: 'ヨハネの第一の手紙', shortName: '1ヨハネ' },
  '2JN': { id: '2john', name: 'ヨハネの第二の手紙', shortName: '2ヨハネ' },
  '3JN': { id: '3john', name: 'ヨハネの第三の手紙', shortName: '3ヨハネ' },
  'JUD': { id: 'jude', name: 'ユダの手紙', shortName: 'ユダ' },
  'REV': { id: 'revelation', name: 'ヨハネの黙示録', shortName: '黙示録' }
};

// 書物の順序
const bookOrder = [
  'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
  'joshua', 'judges', 'ruth', '1samuel', '2samuel',
  '1kings', '2kings', '1chronicles', '2chronicles', 'ezra', 'nehemiah',
  'esther', 'job', 'psalms', 'proverbs', 'ecclesiastes', 'songofsolomon',
  'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel',
  'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah',
  'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi',
  'matthew', 'mark', 'luke', 'john', 'acts',
  'romans', '1corinthians', '2corinthians', 'galatians', 'ephesians',
  'philippians', 'colossians', '1thessalonians', '2thessalonians',
  '1timothy', '2timothy', 'titus', 'philemon', 'hebrews',
  'james', '1peter', '2peter', '1john', '2john', '3john', 'jude', 'revelation'
];

function convertLuther() {
  console.log('========================================');
  console.log('Luther 1912 USFX → JSON Converter');
  console.log('========================================\n');

  const inputPath = path.join(__dirname, '../temp-greek/deu1912_usfx.xml');
  const outputPath = path.join(__dirname, '../data/bible-luther.json');

  const content = fs.readFileSync(inputPath, 'utf8');

  // 書物データを格納
  const booksData = {};

  // 正規表現で書物、章、節を抽出
  const bookRegex = /<book id="([^"]+)">([\s\S]*?)<\/book>/g;
  let bookMatch;

  while ((bookMatch = bookRegex.exec(content)) !== null) {
    const bookCode = bookMatch[1];
    const bookContent = bookMatch[2];

    const bookInfo = bookMapping[bookCode];
    if (!bookInfo) {
      console.log(`Skipping unknown book: ${bookCode}`);
      continue;
    }

    const chapters = {};

    // 章と節を抽出
    let currentChapter = null;
    let currentVerseNum = null;
    let currentVerseText = '';

    // <c id="X" /> で章を検出
    // <v id="X" bcv="..." /> で節を検出
    // テキストは<w>タグ内またはプレーンテキスト

    const lines = bookContent.split(/(<[^>]+>)/);

    for (const part of lines) {
      // 章の開始
      const chapterMatch = part.match(/<c id="(\d+)"/);
      if (chapterMatch) {
        // 前の節を保存
        if (currentChapter && currentVerseNum && currentVerseText.trim()) {
          if (!chapters[currentChapter]) chapters[currentChapter] = {};
          chapters[currentChapter][currentVerseNum] = currentVerseText.trim();
        }
        currentChapter = parseInt(chapterMatch[1]);
        currentVerseNum = null;
        currentVerseText = '';
        continue;
      }

      // 節の開始
      const verseMatch = part.match(/<v id="(\d+)"/);
      if (verseMatch) {
        // 前の節を保存
        if (currentChapter && currentVerseNum && currentVerseText.trim()) {
          if (!chapters[currentChapter]) chapters[currentChapter] = {};
          chapters[currentChapter][currentVerseNum] = currentVerseText.trim();
        }
        currentVerseNum = parseInt(verseMatch[1]);
        currentVerseText = '';
        continue;
      }

      // 節の終了タグ
      if (part.match(/<ve\s*\/>/)) {
        continue;
      }

      // タグ以外のテキストを収集
      if (currentChapter && currentVerseNum && !part.startsWith('<')) {
        // 改行と余分な空白を整理
        const text = part.replace(/\s+/g, ' ').trim();
        if (text) {
          currentVerseText += (currentVerseText ? ' ' : '') + text;
        }
      }
    }

    // 最後の節を保存
    if (currentChapter && currentVerseNum && currentVerseText.trim()) {
      if (!chapters[currentChapter]) chapters[currentChapter] = {};
      chapters[currentChapter][currentVerseNum] = currentVerseText.trim();
    }

    booksData[bookInfo.id] = {
      info: bookInfo,
      chapters: chapters
    };
  }

  // JSON形式に変換（正しい順序で）
  const books = [];

  for (const bookId of bookOrder) {
    if (!booksData[bookId]) continue;

    const bookData = booksData[bookId];
    const chapters = [];
    const chapterNums = Object.keys(bookData.chapters).map(Number).sort((a, b) => a - b);

    for (const chapterNum of chapterNums) {
      const verses = [];
      const verseNums = Object.keys(bookData.chapters[chapterNum]).map(Number).sort((a, b) => a - b);

      for (const verseNum of verseNums) {
        verses.push({
          verse: verseNum,
          text: bookData.chapters[chapterNum][verseNum]
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
      translation: 'ルター訳聖書 1912年版',
      translationShort: 'Luther 1912',
      language: 'de',
      year: '1912',
      source: 'eBible.org',
      license: 'Public Domain'
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

convertLuther();
