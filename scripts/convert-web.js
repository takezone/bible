const fs = require('fs');
const path = require('path');

// 書物の順序を読み込み
const bookOrder = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'book-order.json'), 'utf8')
);

// WEBのJSONディレクトリ
const webJsonDir = path.join(__dirname, '../temp-web/json');

// 出力ファイル
const outputFile = path.join(__dirname, '../data/bible-web.json');

// 書物名のマッピング（英語名 → 英語名）
// WEBのファイル名は既に英語の小文字なので、book-orderのIDと一致するはず
const bookNameMapping = {};
bookOrder.forEach(book => {
  bookNameMapping[book.id] = book.id;
});

// 最終的なBibleデータ構造
const bibleData = {
  translation: 'World English Bible',
  books: []
};

// 各書物を処理
bookOrder.forEach(bookInfo => {
  const bookId = bookInfo.id;
  const jsonFile = path.join(webJsonDir, `${bookId}.json`);

  if (!fs.existsSync(jsonFile)) {
    console.log(`Warning: ${bookId}.json not found`);
    return;
  }

  console.log(`Processing ${bookId}...`);

  const rawData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

  // 章ごとにグループ化
  const chaptersMap = {};

  rawData.forEach(item => {
    if (item.type === 'paragraph text' && item.chapterNumber && item.verseNumber) {
      const chNum = item.chapterNumber;
      const vNum = item.verseNumber;
      const text = item.value.trim();

      if (!chaptersMap[chNum]) {
        chaptersMap[chNum] = {};
      }

      if (!chaptersMap[chNum][vNum]) {
        chaptersMap[chNum][vNum] = text;
      } else {
        // 同じ節が複数回出現する場合は結合
        chaptersMap[chNum][vNum] += ' ' + text;
      }
    }
  });

  // 章の配列を作成
  const chapters = [];
  const chapterNumbers = Object.keys(chaptersMap).map(Number).sort((a, b) => a - b);

  chapterNumbers.forEach(chNum => {
    const versesMap = chaptersMap[chNum];
    const verseNumbers = Object.keys(versesMap).map(Number).sort((a, b) => a - b);

    const verses = verseNumbers.map(vNum => ({
      verse: vNum,
      text: versesMap[vNum]
    }));

    chapters.push({
      chapter: chNum,
      verses: verses
    });
  });

  // 書物データを追加
  bibleData.books.push({
    id: bookId,
    name: bookId.charAt(0).toUpperCase() + bookId.slice(1), // 英語名を使用
    chapters: chapters
  });
});

// JSONファイルとして保存
fs.writeFileSync(outputFile, JSON.stringify(bibleData, null, 2), 'utf8');

console.log(`\nConversion complete!`);
console.log(`Output: ${outputFile}`);
console.log(`Books: ${bibleData.books.length}`);
console.log(`Total chapters: ${bibleData.books.reduce((sum, book) => sum + book.chapters.length, 0)}`);
console.log(`Total verses: ${bibleData.books.reduce((sum, book) =>
  sum + book.chapters.reduce((s, ch) => s + ch.verses.length, 0), 0)}`);
