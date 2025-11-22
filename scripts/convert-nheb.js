const fs = require('fs');
const path = require('path');

// 英語書名からbook IDと日本語名へのマッピング
const bookMapping = {
  'Genesis': { id: 'genesis', name: '創世記', shortName: '創世' },
  'Exodus': { id: 'exodus', name: '出エジプト記', shortName: '出エ' },
  'Leviticus': { id: 'leviticus', name: 'レビ記', shortName: 'レビ' },
  'Numbers': { id: 'numbers', name: '民数記', shortName: '民数' },
  'Deuteronomy': { id: 'deuteronomy', name: '申命記', shortName: '申命' },
  'Joshua': { id: 'joshua', name: 'ヨシュア記', shortName: 'ヨシュ' },
  'Judges': { id: 'judges', name: '士師記', shortName: '士師' },
  'Ruth': { id: 'ruth', name: 'ルツ記', shortName: 'ルツ' },
  'I Samuel': { id: '1samuel', name: 'サムエル記上', shortName: 'Ⅰサム' },
  'II Samuel': { id: '2samuel', name: 'サムエル記下', shortName: 'Ⅱサム' },
  'I Kings': { id: '1kings', name: '列王記上', shortName: 'Ⅰ列王' },
  'II Kings': { id: '2kings', name: '列王記下', shortName: 'Ⅱ列王' },
  'I Chronicles': { id: '1chronicles', name: '歴代志上', shortName: 'Ⅰ歴代' },
  'II Chronicles': { id: '2chronicles', name: '歴代志下', shortName: 'Ⅱ歴代' },
  'Ezra': { id: 'ezra', name: 'エズラ記', shortName: 'エズ' },
  'Nehemiah': { id: 'nehemiah', name: 'ネヘミヤ記', shortName: 'ネヘ' },
  'Esther': { id: 'esther', name: 'エステル記', shortName: 'エス' },
  'Job': { id: 'job', name: 'ヨブ記', shortName: 'ヨブ' },
  'Psalms': { id: 'psalms', name: '詩篇', shortName: '詩' },
  'Proverbs': { id: 'proverbs', name: '箴言', shortName: '箴' },
  'Ecclesiastes': { id: 'ecclesiastes', name: '伝道の書', shortName: '伝道' },
  'Song of Solomon': { id: 'songofsolomon', name: '雅歌', shortName: '雅歌' },
  'Isaiah': { id: 'isaiah', name: 'イザヤ書', shortName: 'イザ' },
  'Jeremiah': { id: 'jeremiah', name: 'エレミヤ書', shortName: 'エレ' },
  'Lamentations': { id: 'lamentations', name: '哀歌', shortName: '哀歌' },
  'Ezekiel': { id: 'ezekiel', name: 'エゼキエル書', shortName: 'エゼ' },
  'Daniel': { id: 'daniel', name: 'ダニエル書', shortName: 'ダニ' },
  'Hosea': { id: 'hosea', name: 'ホセア書', shortName: 'ホセ' },
  'Joel': { id: 'joel', name: 'ヨエル書', shortName: 'ヨエ' },
  'Amos': { id: 'amos', name: 'アモス書', shortName: 'アモ' },
  'Obadiah': { id: 'obadiah', name: 'オバデヤ書', shortName: 'オバ' },
  'Jonah': { id: 'jonah', name: 'ヨナ書', shortName: 'ヨナ' },
  'Micah': { id: 'micah', name: 'ミカ書', shortName: 'ミカ' },
  'Nahum': { id: 'nahum', name: 'ナホム書', shortName: 'ナホ' },
  'Habakkuk': { id: 'habakkuk', name: 'ハバクク書', shortName: 'ハバ' },
  'Zephaniah': { id: 'zephaniah', name: 'ゼパニヤ書', shortName: 'ゼパ' },
  'Haggai': { id: 'haggai', name: 'ハガイ書', shortName: 'ハガ' },
  'Zechariah': { id: 'zechariah', name: 'ゼカリヤ書', shortName: 'ゼカ' },
  'Malachi': { id: 'malachi', name: 'マラキ書', shortName: 'マラ' },
  'Matthew': { id: 'matthew', name: 'マタイによる福音書', shortName: 'マタイ' },
  'Mark': { id: 'mark', name: 'マルコによる福音書', shortName: 'マルコ' },
  'Luke': { id: 'luke', name: 'ルカによる福音書', shortName: 'ルカ' },
  'John': { id: 'john', name: 'ヨハネによる福音書', shortName: 'ヨハネ' },
  'Acts': { id: 'acts', name: '使徒行伝', shortName: '使徒' },
  'Romans': { id: 'romans', name: 'ローマ人への手紙', shortName: 'ロマ' },
  'I Corinthians': { id: '1corinthians', name: 'コリント人への第一の手紙', shortName: 'Ⅰコリ' },
  'II Corinthians': { id: '2corinthians', name: 'コリント人への第二の手紙', shortName: 'Ⅱコリ' },
  'Galatians': { id: 'galatians', name: 'ガラテヤ人への手紙', shortName: 'ガラ' },
  'Ephesians': { id: 'ephesians', name: 'エペソ人への手紙', shortName: 'エペ' },
  'Philippians': { id: 'philippians', name: 'ピリピ人への手紙', shortName: 'ピリ' },
  'Colossians': { id: 'colossians', name: 'コロサイ人への手紙', shortName: 'コロ' },
  'I Thessalonians': { id: '1thessalonians', name: 'テサロニケ人への第一の手紙', shortName: 'Ⅰテサ' },
  'II Thessalonians': { id: '2thessalonians', name: 'テサロニケ人への第二の手紙', shortName: 'Ⅱテサ' },
  'I Timothy': { id: '1timothy', name: 'テモテへの第一の手紙', shortName: 'Ⅰテモ' },
  'II Timothy': { id: '2timothy', name: 'テモテへの第二の手紙', shortName: 'Ⅱテモ' },
  'Titus': { id: 'titus', name: 'テトスへの手紙', shortName: 'テト' },
  'Philemon': { id: 'philemon', name: 'ピレモンへの手紙', shortName: 'ピレ' },
  'Hebrews': { id: 'hebrews', name: 'ヘブル人への手紙', shortName: 'ヘブ' },
  'James': { id: 'james', name: 'ヤコブの手紙', shortName: 'ヤコ' },
  'I Peter': { id: '1peter', name: 'ペテロの第一の手紙', shortName: 'Ⅰペテ' },
  'II Peter': { id: '2peter', name: 'ペテロの第二の手紙', shortName: 'Ⅱペテ' },
  'I John': { id: '1john', name: 'ヨハネの第一の手紙', shortName: 'Ⅰヨハ' },
  'II John': { id: '2john', name: 'ヨハネの第二の手紙', shortName: 'Ⅱヨハ' },
  'III John': { id: '3john', name: 'ヨハネの第三の手紙', shortName: 'Ⅲヨハ' },
  'Jude': { id: 'jude', name: 'ユダの手紙', shortName: 'ユダ' },
  'Revelation': { id: 'revelation', name: 'ヨハネの黙示録', shortName: '黙示' },
  'Revelation of John': { id: 'revelation', name: 'ヨハネの黙示録', shortName: '黙示' }
};

const nhebFile = path.join(__dirname, '../temp-scrollmapper/formats/json/NHEB.json');
const outputFile = path.join(__dirname, '../data/bible-web.json');

console.log('NHEBデータを読み込み中...');
const nhebData = JSON.parse(fs.readFileSync(nhebFile, 'utf8'));

console.log('データ変換中...');
const convertedData = {
  books: [],
  metadata: {
    translation: 'New Heart English Bible',
    language: 'en',
    year: '2010'
  }
};

// 各書をマッピングして変換
nhebData.books.forEach(book => {
  const mapping = bookMapping[book.name];

  if (!mapping) {
    console.warn(`警告: "${book.name}" のマッピングが見つかりません`);
    return;
  }

  convertedData.books.push({
    id: mapping.id,
    name: mapping.name,
    shortName: mapping.shortName,
    chapters: book.chapters
  });
});

console.log(`変換完了: ${convertedData.books.length} 書を変換しました`);
console.log('ファイルに書き出し中...');
fs.writeFileSync(outputFile, JSON.stringify(convertedData, null, 2), 'utf8');
console.log(`完了: ${outputFile}`);

// 検証: 哀歌とヨエル書の章数を確認
const lamentations = convertedData.books.find(b => b.id === 'lamentations');
const joel = convertedData.books.find(b => b.id === 'joel');

console.log('\n検証結果:');
console.log(`哀歌: ${lamentations.chapters.length} 章`);
lamentations.chapters.forEach(ch => {
  console.log(`  第${ch.chapter}章: ${ch.verses.length} 節`);
});

console.log(`ヨエル書: ${joel.chapters.length} 章`);
joel.chapters.forEach(ch => {
  console.log(`  第${ch.chapter}章: ${ch.verses.length} 節`);
});
