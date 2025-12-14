const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 書物の定義（book-order.jsonから読み込み）
const bookOrder = require('./book-order.json');

// 書名からWikisource名へのマッピング（文語訳での書名）
// book-order.jsonの書名 → Wikisourceでの文語訳書名
const bookNameToWikisourceName = {
  // 旧約聖書
  '創世記': '創世記',
  '出エジプト記': '出エジプト記',
  'レビ記': 'レビ記',
  '民数記': '民數紀略',
  '申命記': '申命記',
  'ヨシュア記': 'ヨシュア記',
  '士師記': '士師記',
  'ルツ記': 'ルツ記',
  'サムエル記上': 'サムエル前書',
  'サムエル記下': 'サムエル後書',
  '列王紀上': '列王紀略上',
  '列王紀下': '列王紀略下',
  '歴代志上': '歴代志略上',
  '歴代志下': '歴代志略下',
  'エズラ記': 'エズラ書',
  'ネヘミヤ記': 'ネヘミヤ記',
  'エステル記': 'エステル記',
  'ヨブ記': 'ヨブ記',
  '詩篇': '詩篇',
  '箴言': '箴言',
  '伝道の書': '傳道之書',
  '雅歌': '雅歌',
  'イザヤ書': 'イザヤ書',
  'エレミヤ書': 'ヱレミヤ記',
  '哀歌': '哀歌',
  'エゼキエル書': 'エゼキエル書',
  'ダニエル書': 'ダニエル書',
  'ホセア書': 'ホセア書',
  'ヨエル書': 'ヨエル書',
  'アモス書': 'アモス書',
  'オバデヤ書': 'オバデヤ書',
  'ヨナ書': 'ヨナ書',
  'ミカ書': 'ミカ書',
  'ナホム書': 'ナホム書',
  'ハバクク書': 'ハバクク書',
  'ゼパニヤ書': 'ゼパニヤ書',
  'ハガイ書': 'ハガイ書',
  'ゼカリヤ書': 'ゼカリヤ書',
  'マラキ書': 'マラキ書',
  // 新約聖書
  'マタイによる福音書': 'マタイ傳福音書',
  'マルコによる福音書': 'マルコ傳福音書',
  'ルカによる福音書': 'ルカ傳福音書',
  'ヨハネによる福音書': 'ヨハネ傳福音書',
  '使徒行伝': '使徒行傳',
  'ローマ人への手紙': 'ロマ書',
  'コリント人への第一の手紙': 'コリント前書',
  'コリント人への第二の手紙': 'コリント後書',
  'ガラテヤ人への手紙': 'ガラテヤ書',
  'エペソ人への手紙': 'エペソ書',
  'ピリピ人への手紙': 'ピリピ書',
  'コロサイ人への手紙': 'コロサイ書',
  'テサロニケ人への第一の手紙': 'テサロニケ前書',
  'テサロニケ人への第二の手紙': 'テサロニケ後書',
  'テモテヘの第一の手紙': 'テモテ前書',
  'テモテヘの第二の手紙': 'テモテ後書',
  'テトスヘの手紙': 'テトス書',
  'ピレモンヘの手紙': 'ピレモン書',
  'ヘブル人への手紙': 'ヘブル書',
  'ヤコブの手紙': 'ヤコブ書',
  'ペテロの第一の手紙': 'ペテロ前書',
  'ペテロの第二の手紙': 'ペテロ後書',
  'ヨハネの第一の手紙': 'ヨハネ第一書',
  'ヨハネの第二の手紙': 'ヨハネ第二書',
  'ヨハネの第三の手紙': 'ヨハネ第三書',
  'ユダの手紙': 'ユダ書',
  'ヨハネの黙示録': 'ヨハネ黙示録'
};

// 各書の章数（book-order.jsonの書名に対応）
const chapterCounts = {
  // 旧約聖書
  '創世記': 50,
  '出エジプト記': 40,
  'レビ記': 27,
  '民数記': 36,
  '申命記': 34,
  'ヨシュア記': 24,
  '士師記': 21,
  'ルツ記': 4,
  'サムエル記上': 31,
  'サムエル記下': 24,
  '列王紀上': 22,
  '列王紀下': 25,
  '歴代志上': 29,
  '歴代志下': 36,
  'エズラ記': 10,
  'ネヘミヤ記': 13,
  'エステル記': 10,
  'ヨブ記': 42,
  '詩篇': 150,
  '箴言': 31,
  '伝道の書': 12,
  '雅歌': 8,
  'イザヤ書': 66,
  'エレミヤ書': 52,
  '哀歌': 5,
  'エゼキエル書': 48,
  'ダニエル書': 12,
  'ホセア書': 14,
  'ヨエル書': 3,
  'アモス書': 9,
  'オバデヤ書': 1,
  'ヨナ書': 4,
  'ミカ書': 7,
  'ナホム書': 3,
  'ハバクク書': 3,
  'ゼパニヤ書': 3,
  'ハガイ書': 2,
  'ゼカリヤ書': 14,
  'マラキ書': 4,
  // 新約聖書
  'マタイによる福音書': 28,
  'マルコによる福音書': 16,
  'ルカによる福音書': 24,
  'ヨハネによる福音書': 21,
  '使徒行伝': 28,
  'ローマ人への手紙': 16,
  'コリント人への第一の手紙': 16,
  'コリント人への第二の手紙': 13,
  'ガラテヤ人への手紙': 6,
  'エペソ人への手紙': 6,
  'ピリピ人への手紙': 4,
  'コロサイ人への手紙': 4,
  'テサロニケ人への第一の手紙': 5,
  'テサロニケ人への第二の手紙': 3,
  'テモテヘの第一の手紙': 6,
  'テモテヘの第二の手紙': 4,
  'テトスヘの手紙': 3,
  'ピレモンヘの手紙': 1,
  'ヘブル人への手紙': 13,
  'ヤコブの手紙': 5,
  'ペテロの第一の手紙': 5,
  'ペテロの第二の手紙': 3,
  'ヨハネの第一の手紙': 5,
  'ヨハネの第二の手紙': 1,
  'ヨハネの第三の手紙': 1,
  'ユダの手紙': 1,
  'ヨハネの黙示録': 22
};

// HTMLからルビタグを含むテキストを抽出
function extractTextWithRuby($, elem) {
  let result = '';

  $(elem).contents().each((i, node) => {
    if (node.type === 'text') {
      result += $(node).text();
    } else if (node.type === 'tag') {
      if (node.name === 'ruby') {
        // rubyタグをそのまま保持
        const base = $(node).clone().children('rt, rp').remove().end().text();
        const rt = $(node).find('rt').text();
        if (base && rt) {
          result += `<ruby>${base}<rt>${rt}</rt></ruby>`;
        } else {
          result += $(node).text();
        }
      } else if (node.name === 'sup') {
        // 節番号のsupタグはスキップ
        return;
      } else if (node.name === 'br') {
        // brタグは無視
        return;
      } else {
        // 他のタグは再帰的に処理
        result += extractTextWithRuby($, node);
      }
    }
  });

  return result.trim();
}

// 1章をスクレイピング
async function scrapeChapter(bookName, chapterNum) {
  // ルビ付きURLを試す
  const urlWithRuby = `https://ja.wikisource.org/wiki/${encodeURIComponent(bookName)}(文語訳)第${chapterNum}章`;
  const urlAlt = `https://ja.wikisource.org/wiki/${encodeURIComponent(bookName)}_第${chapterNum}章_(文語訳)`;
  const urlSimple = `https://ja.wikisource.org/wiki/${encodeURIComponent(bookName)}${chapterNum}章_(文語訳)`;

  const urls = [urlWithRuby, urlAlt, urlSimple];

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BibleApp/1.0; educational purpose)'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      const verses = [];

      // Wikisourceの構造に基づいて節を抽出
      // 各節は <p> タグ内または <div class="poem"> 内にある
      let verseNum = 0;

      $('.mw-parser-output').find('p, div.poem p, span.verse').each((i, elem) => {
        const html = $(elem).html();
        if (!html) return;

        // 節番号を検出（先頭の数字）
        const text = $(elem).text().trim();
        const verseMatch = text.match(/^(\d+)[^\d]/);

        if (verseMatch) {
          verseNum = parseInt(verseMatch[1]);

          // 節番号を除いたテキストを取得（ルビ保持）
          const cleanedHtml = html.replace(/^<sup[^>]*>\d+<\/sup>\s*/, '').replace(/^\d+\s*/, '');
          const $temp = cheerio.load(`<div>${cleanedHtml}</div>`);
          const textWithRuby = extractTextWithRuby($temp, $temp('div'));

          if (textWithRuby) {
            verses.push({
              verse: verseNum,
              text: textWithRuby
            });
          }
        }
      });

      if (verses.length > 0) {
        // 節番号順にソート
        verses.sort((a, b) => a.verse - b.verse);
        return verses;
      }
    } catch (error) {
      // このURLでは見つからなかった、次を試す
      continue;
    }
  }

  return null;
}

// 1つの書をスクレイピング
async function scrapeBook(bookData) {
  console.log(`\nScraping ${bookData.name} (${bookData.id})...`);

  const wikisourceName = bookNameToWikisourceName[bookData.name];
  const totalChapters = chapterCounts[bookData.name];

  if (!wikisourceName || !totalChapters) {
    console.log(`  ⚠ Skipping ${bookData.name} - not configured`);
    return null;
  }

  const chapters = [];

  for (let chNum = 1; chNum <= totalChapters; chNum++) {
    process.stdout.write(`  Chapter ${chNum}/${totalChapters}...`);

    const verses = await scrapeChapter(wikisourceName, chNum);

    if (verses && verses.length > 0) {
      chapters.push({
        chapter: chNum,
        verses: verses
      });
      console.log(` ✓ ${verses.length} verses`);
    } else {
      console.log(` ✗ Failed`);
    }

    // レート制限のため待機
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  if (chapters.length === 0) {
    return null;
  }

  return {
    id: bookData.id,
    name: bookData.name,
    shortName: bookData.name,
    chapters: chapters
  };
}

// 進捗を保存（中断時に再開可能にするため）
function saveProgress(books, outputPath) {
  const output = {
    books: books,
    metadata: {
      translation: 'bungo',
      name: '文語訳聖書',
      language: 'ja',
      year: '1887-1917',
      source: 'Wikisource',
      hasRuby: true
    }
  };
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
}

// メイン処理
async function main() {
  console.log('========================================');
  console.log('Wikisource 文語訳聖書 Scraper (ルビ付き)');
  console.log('========================================\n');

  const outputPath = path.join(__dirname, '../data/bible-bungo.json');

  // 既存のデータがあれば読み込み
  let existingBooks = [];
  let existingBookIds = new Set();

  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      existingBooks = existing.books || [];
      existingBookIds = new Set(existingBooks.map(b => b.id));
      console.log(`Found existing data with ${existingBooks.length} books\n`);
    } catch (e) {
      console.log('Could not load existing data, starting fresh\n');
    }
  }

  const books = [...existingBooks];
  let totalVerses = existingBooks.reduce((sum, b) =>
    sum + b.chapters.reduce((s, ch) => s + ch.verses.length, 0), 0);

  // コマンドライン引数で処理範囲を指定可能
  const startIndex = parseInt(process.argv[2]) || 0;
  const endIndex = parseInt(process.argv[3]) || bookOrder.length;

  console.log(`Processing books ${startIndex + 1} to ${endIndex} of ${bookOrder.length}\n`);

  for (let i = startIndex; i < endIndex && i < bookOrder.length; i++) {
    const bookData = bookOrder[i];

    // 既にスクレイピング済みならスキップ
    if (existingBookIds.has(bookData.id)) {
      console.log(`Skipping ${bookData.name} - already scraped`);
      continue;
    }

    const book = await scrapeBook(bookData);
    if (book) {
      books.push(book);
      const verseCount = book.chapters.reduce((sum, ch) => sum + ch.verses.length, 0);
      totalVerses += verseCount;

      // 各書の後に進捗を保存
      saveProgress(books, outputPath);
    }
  }

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
