const fs = require('fs');
const path = require('path');

// 新約聖書の書物番号と英語ID/日本語名のマッピング
const ntBookMapping = {
  40: { id: 'matthew', name: 'マタイによる福音書', shortName: 'マタイ' },
  41: { id: 'mark', name: 'マルコによる福音書', shortName: 'マルコ' },
  42: { id: 'luke', name: 'ルカによる福音書', shortName: 'ルカ' },
  43: { id: 'john', name: 'ヨハネによる福音書', shortName: 'ヨハネ' },
  44: { id: 'acts', name: '使徒行伝', shortName: '使徒' },
  45: { id: 'romans', name: 'ローマ人への手紙', shortName: 'ローマ' },
  46: { id: '1corinthians', name: 'コリント人への第一の手紙', shortName: '1コリント' },
  47: { id: '2corinthians', name: 'コリント人への第二の手紙', shortName: '2コリント' },
  48: { id: 'galatians', name: 'ガラテヤ人への手紙', shortName: 'ガラテヤ' },
  49: { id: 'ephesians', name: 'エペソ人への手紙', shortName: 'エペソ' },
  50: { id: 'philippians', name: 'ピリピ人への手紙', shortName: 'ピリピ' },
  51: { id: 'colossians', name: 'コロサイ人への手紙', shortName: 'コロサイ' },
  52: { id: '1thessalonians', name: 'テサロニケ人への第一の手紙', shortName: '1テサロニケ' },
  53: { id: '2thessalonians', name: 'テサロニケ人への第二の手紙', shortName: '2テサロニケ' },
  54: { id: '1timothy', name: 'テモテへの第一の手紙', shortName: '1テモテ' },
  55: { id: '2timothy', name: 'テモテへの第二の手紙', shortName: '2テモテ' },
  56: { id: 'titus', name: 'テトスへの手紙', shortName: 'テトス' },
  57: { id: 'philemon', name: 'ピレモンへの手紙', shortName: 'ピレモン' },
  58: { id: 'hebrews', name: 'ヘブル人への手紙', shortName: 'ヘブル' },
  59: { id: 'james', name: 'ヤコブの手紙', shortName: 'ヤコブ' },
  60: { id: '1peter', name: 'ペテロの第一の手紙', shortName: '1ペテロ' },
  61: { id: '2peter', name: 'ペテロの第二の手紙', shortName: '2ペテロ' },
  62: { id: '1john', name: 'ヨハネの第一の手紙', shortName: '1ヨハネ' },
  63: { id: '2john', name: 'ヨハネの第二の手紙', shortName: '2ヨハネ' },
  64: { id: '3john', name: 'ヨハネの第三の手紙', shortName: '3ヨハネ' },
  65: { id: 'jude', name: 'ユダの手紙', shortName: 'ユダ' },
  66: { id: 'revelation', name: 'ヨハネの黙示録', shortName: '黙示録' }
};

// CSVの特殊フィールドをパース
function parseField(field) {
  if (!field) return {};
  // 〔...｜...｜...〕 形式をパース
  const match = field.match(/〔(.*)〕/);
  if (!match) return {};
  return match[1].split('｜');
}

function convertOpenGNT() {
  console.log('========================================');
  console.log('OpenGNT → JSON Converter (Greek NT)');
  console.log('========================================\n');

  const inputPath = path.join(__dirname, '../temp-greek/OpenGNT-master/OpenGNT_version3_3.csv');
  const outputPath = path.join(__dirname, '../data/bible-greek-nt.json');

  const content = fs.readFileSync(inputPath, 'utf8');
  const lines = content.split('\n');

  // データを書物→章→節でグループ化
  const booksData = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split('\t');
    if (columns.length < 10) continue;

    // 〔Book｜Chapter｜Verse〕
    const bcvField = parseField(columns[6]);
    if (bcvField.length < 3) continue;

    const bookNum = parseInt(bcvField[0]);
    const chapter = parseInt(bcvField[1]);
    const verse = parseInt(bcvField[2]);

    // 新約聖書のみ（40-66）
    if (bookNum < 40 || bookNum > 66) continue;

    // 〔OGNTk｜OGNTu｜OGNTa｜lexeme｜rmac｜sn〕
    const textField = parseField(columns[7]);
    const greekText = textField[2] || textField[1] || ''; // OGNTa（アクセント付き）を優先

    // 〔transSBLcap｜transSBL｜modernGreek｜Fonética_Transliteración〕
    const transField = parseField(columns[9]);
    const transliteration = transField[1] || ''; // transSBL
    const modernGreek = transField[2] || ''; // 現代ギリシャ語発音

    if (!booksData[bookNum]) {
      booksData[bookNum] = {};
    }
    if (!booksData[bookNum][chapter]) {
      booksData[bookNum][chapter] = {};
    }
    if (!booksData[bookNum][chapter][verse]) {
      booksData[bookNum][chapter][verse] = {
        greek: [],
        translit: [],
        pronunciation: []
      };
    }

    booksData[bookNum][chapter][verse].greek.push(greekText);
    booksData[bookNum][chapter][verse].translit.push(transliteration);
    booksData[bookNum][chapter][verse].pronunciation.push(modernGreek);
  }

  // JSON形式に変換
  const books = [];
  const bookNums = Object.keys(booksData).map(Number).sort((a, b) => a - b);

  for (const bookNum of bookNums) {
    const bookInfo = ntBookMapping[bookNum];
    if (!bookInfo) continue;

    const chapters = [];
    const chapterNums = Object.keys(booksData[bookNum]).map(Number).sort((a, b) => a - b);

    for (const chapterNum of chapterNums) {
      const verses = [];
      const verseNums = Object.keys(booksData[bookNum][chapterNum]).map(Number).sort((a, b) => a - b);

      for (const verseNum of verseNums) {
        const data = booksData[bookNum][chapterNum][verseNum];
        verses.push({
          verse: verseNum,
          text: data.greek.join(' '),
          ruby: data.pronunciation.join(' ') // ルビとして現代ギリシャ語発音を使用
        });
      }

      chapters.push({
        chapter: chapterNum,
        verses: verses
      });
    }

    books.push({
      id: bookInfo.id,
      name: bookInfo.name,
      shortName: bookInfo.shortName,
      chapters: chapters
    });
  }

  const output = {
    books: books,
    metadata: {
      translation: 'ギリシャ語新約聖書',
      translationShort: 'Greek NT',
      language: 'grc',
      source: 'OpenGNT',
      license: 'CC BY-SA 4.0',
      hasRuby: true,
      rubyType: 'pronunciation'
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

convertOpenGNT();
