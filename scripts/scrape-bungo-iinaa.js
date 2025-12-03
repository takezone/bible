const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 書物の定義
const bookOrder = require('./book-order.json');

// 1つの書をスクレイピング
async function scrapeBook(bookIndex, bookData) {
  const bookNum = String(bookIndex + 1).padStart(2, '0');
  const url = `https://bungo.iinaa.net/b${bookNum}.html`;

  console.log(`\nScraping ${bookData.name} (${bookData.id}) from ${url}...`);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BibleApp/1.0; +https://github.com)'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const chapters = {};

    // 全ての節を探す
    $('span[id^="b"]').each((i, elem) => {
      const id = $(elem).attr('id');
      if (!id) return;

      // IDから章番号と節番号を抽出 (例: b01c001v001 -> 章1, 節1)
      const match = id.match(/b\d+c(\d+)v(\d+)/);
      if (!match) return;

      const chapterNum = parseInt(match[1]);
      const verseNum = parseInt(match[2]);

      // 節0はスキップ（章の見出しなど）
      if (verseNum === 0) return;

      // spanの内容を取得（<a>タグを除く）
      const $span = $(elem);

      // <a>タグを削除してからテキストを取得
      $span.find('a').remove();

      // rubyタグはそのままテキストとして抽出
      let verseText = $span.text().trim();

      if (!verseText) return;

      // 章ごとにグループ化
      if (!chapters[chapterNum]) {
        chapters[chapterNum] = [];
      }

      chapters[chapterNum].push({
        verse: verseNum,
        text: verseText
      });
    });

    // 章の配列を作成
    const chaptersArray = [];
    const chapterNumbers = Object.keys(chapters).map(Number).sort((a, b) => a - b);

    chapterNumbers.forEach(chNum => {
      const verses = chapters[chNum].sort((a, b) => a.verse - b.verse);
      chaptersArray.push({
        chapter: chNum,
        verses: verses
      });
      console.log(`  Chapter ${chNum}: ${verses.length} verses`);
    });

    return {
      id: bookData.id,
      name: bookData.name,
      shortName: bookData.name,
      chapters: chaptersArray
    };

  } catch (error) {
    console.error(`  ✗ Error scraping ${bookData.name}: ${error.message}`);
    return null;
  }
}

// メイン処理
async function main() {
  console.log('========================================');
  console.log('bungo.iinaa.net 文語訳聖書 Scraper');
  console.log('========================================\n');

  const books = [];
  let totalVerses = 0;

  for (let i = 0; i < bookOrder.length; i++) {
    const book = await scrapeBook(i, bookOrder[i]);

    if (book && book.chapters.length > 0) {
      books.push(book);
      const verseCount = book.chapters.reduce((sum, ch) => sum + ch.verses.length, 0);
      totalVerses += verseCount;
      console.log(`  ✓ Total: ${book.chapters.length} chapters, ${verseCount} verses`);
    }

    // レート制限のため待機（短めに設定）
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 結果を保存
  const output = {
    books: books,
    metadata: {
      translation: '文語訳聖書',
      language: 'ja',
      year: '1887-1917',
      source: 'bungo.iinaa.net'
    }
  };

  const outputPath = path.join(__dirname, '../data/bible-bungo.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

  console.log('\n========================================');
  console.log('✅ Scraping completed!');
  console.log('========================================');
  console.log(`Books:    ${books.length}`);
  console.log(`Chapters: ${books.reduce((sum, b) => sum + b.chapters.length, 0)}`);
  console.log(`Verses:   ${totalVerses}`);
  console.log(`Output:   ${outputPath}`);
  console.log('========================================\n');
}

main().catch(console.error);
