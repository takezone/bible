const fs = require('fs');
const path = require('path');

// 正しい書物の順番とID
const bookOrder = require('./book-order.json');

// 既存のデータを修正する関数
function fixBibleData(inputFile, outputFile) {
  console.log(`\nProcessing ${inputFile}...`);

  const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  // 書物名からIDのマッピングを作成（日本語名と英語名の両方）
  const nameToNewId = {};

  // 日本語名のマッピング
  bookOrder.forEach(book => {
    nameToNewId[book.name] = book.id;
  });

  // 英語名のマッピング（KJV用）
  const engMapping = {
    'Genesis': 'genesis',
    'Exodus': 'exodus',
    'Leviticus': 'leviticus',
    'Numbers': 'numbers',
    'Deuteronomy': 'deuteronomy',
    'Joshua': 'joshua',
    'Judges': 'judges',
    'Ruth': 'ruth',
    '1 Samuel': '1samuel',
    '2 Samuel': '2samuel',
    '1 Kings': '1kings',
    '2 Kings': '2kings',
    '1 Chronicles': '1chronicles',
    '2 Chronicles': '2chronicles',
    'Ezra': 'ezra',
    'Nehemiah': 'nehemiah',
    'Esther': 'esther',
    'Job': 'job',
    'Psalms': 'psalms',
    'Proverbs': 'proverbs',
    'Ecclesiastes': 'ecclesiastes',
    'Song of Solomon': 'songofsolomon',
    'Isaiah': 'isaiah',
    'Jeremiah': 'jeremiah',
    'Lamentations': 'lamentations',
    'Ezekiel': 'ezekiel',
    'Daniel': 'daniel',
    'Hosea': 'hosea',
    'Joel': 'joel',
    'Amos': 'amos',
    'Obadiah': 'obadiah',
    'Jonah': 'jonah',
    'Micah': 'micah',
    'Nahum': 'nahum',
    'Habakkuk': 'habakkuk',
    'Zephaniah': 'zephaniah',
    'Haggai': 'haggai',
    'Zechariah': 'zechariah',
    'Malachi': 'malachi',
    'Matthew': 'matthew',
    'Mark': 'mark',
    'Luke': 'luke',
    'John': 'john',
    'Acts': 'acts',
    'Romans': 'romans',
    '1 Corinthians': '1corinthians',
    '2 Corinthians': '2corinthians',
    'Galatians': 'galatians',
    'Ephesians': 'ephesians',
    'Philippians': 'philippians',
    'Colossians': 'colossians',
    '1 Thessalonians': '1thessalonians',
    '2 Thessalonians': '2thessalonians',
    '1 Timothy': '1timothy',
    '2 Timothy': '2timothy',
    'Titus': 'titus',
    'Philemon': 'philemon',
    'Hebrews': 'hebrews',
    'James': 'james',
    '1 Peter': '1peter',
    '2 Peter': '2peter',
    '1 John': '1john',
    '2 John': '2john',
    '3 John': '3john',
    'Jude': 'jude',
    'Revelation': 'revelation'
  };

  Object.assign(nameToNewId, engMapping);

  // 各書物のIDを更新
  data.books.forEach(book => {
    const newId = nameToNewId[book.name];
    if (newId) {
      book.id = newId;
    } else {
      console.warn(`Warning: No mapping found for "${book.name}"`);
    }
  });

  // 正しい順番にソート
  const sortedBooks = [];
  bookOrder.forEach(orderBook => {
    const found = data.books.find(b => b.id === orderBook.id);
    if (found) {
      sortedBooks.push(found);
    } else {
      console.warn(`Warning: Book "${orderBook.name}" (${orderBook.id}) not found in data`);
    }
  });

  data.books = sortedBooks;

  // 結果を保存
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Saved to ${outputFile}`);
  console.log(`  Total books: ${sortedBooks.length}`);
}

// 口語訳を修正
const kougoInput = path.join(__dirname, '../data/bible-kougo.json');
const kougoOutput = path.join(__dirname, '../data/bible-kougo-fixed.json');
fixBibleData(kougoInput, kougoOutput);

// KJVを修正
const kjvInput = path.join(__dirname, '../data/bible-kjv.json');
const kjvOutput = path.join(__dirname, '../data/bible-kjv-fixed.json');
fixBibleData(kjvInput, kjvOutput);

console.log('\n✅ All done!');
console.log('\nNext steps:');
console.log('1. Review the fixed files');
console.log('2. If everything looks good, rename them:');
console.log('   mv data/bible-kougo-fixed.json data/bible-kougo.json');
console.log('   mv data/bible-kjv-fixed.json data/bible-kjv.json');
