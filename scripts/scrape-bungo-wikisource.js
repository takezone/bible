const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 書物の定義（book-order.jsonから読み込み）
const bookOrder = require('./book-order.json');

// 書名から英語IDへのマッピング
const bookNameToWikisourceName = {
  '創世記': '創世記',
  '出エジプト記': '出エジプト記',
  'レビ記': 'レビ記',
  '民数記': '民数記',
  '申命記': '申命記',
  'ヨシュア記': 'ヨシュア記',
  '士師記': '士師記',
  'ルツ記': 'ルツ記',
  'サムエル記上': 'サムエル記上',
  'サムエル記下': 'サムエル記下',
  '列王紀上': '列王紀上',
  '列王紀下': '列王紀下',
  '歴代志上': '歴代志上',
  '歴代志下': '歴代志下',
  'エズラ記': 'エズラ記',
  'ネヘミヤ記': 'ネヘミヤ記',
  'エステル記': 'エステル記',
  'ヨブ記': 'ヨブ記',
  '詩篇': '詩篇',
  '箴言': '箴言',
  '伝道の書': '伝道の書',
  '雅歌': '雅歌',
  'イザヤ書': 'イザヤ書',
  'エレミヤ書': 'エレミヤ書',
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
  'マタイによる福音書': 'マタイによる福音書',
  'マルコによる福音書': 'マルコによる福音書',
  'ルカによる福音書': 'ルカによる福音書',
  'ヨハネによる福音書': 'ヨハネによる福音書',
  '使徒行伝': '使徒行伝',
  'ローマ人への手紙': 'ローマ人への手紙',
  'コリント人への第一の手紙': 'コリント人への第一の手紙',
  'コリント人への第二の手紙': 'コリント人への第二の手紙',
  'ガラテヤ人への手紙': 'ガラテヤ人への手紙',
  'エペソ人への手紙': 'エペソ人への手紙',
  'ピリピ人への手紙': 'ピリピ人への手紙',
  'コロサイ人への手紙': 'コロサイ人への手紙',
  'テサロニケ人への第一の手紙': 'テサロニケ人への第一の手紙',
  'テサロニケ人への第二の手紙': 'テサロニケ人への第二の手紙',
  'テモテヘの第一の手紙': 'テモテへの第一の手紙',
  'テモテヘの第二の手紙': 'テモテへの第二の手紙',
  'テトスヘの手紙': 'テトスへの手紙',
  'ピレモンヘの手紙': 'ピレモンへの手紙',
  'ヘブル人への手紙': 'ヘブル人への手紙',
  'ヤコブの手紙': 'ヤコブの手紙',
  'ペテロの第一の手紙': 'ペテロの第一の手紙',
  'ペテロの第二の手紙': 'ペテロの第二の手紙',
  'ヨハネの第一の手紙': 'ヨハネの第一の手紙',
  'ヨハネの第二の手紙': 'ヨハネの第二の手紙',
  'ヨハネの第三の手紙': 'ヨハネの第三の手紙',
  'ユダの手紙': 'ユダの手紙',
  'ヨハネの黙示録': 'ヨハネの黙示録'
};

// 各書の章数
const chapterCounts = {
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
  'テモテへの第一の手紙': 6,
  'テモテへの第二の手紙': 4,
  'テトスへの手紙': 3,
  'ピレモンへの手紙': 1,
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

// テキストのクリーンアップ（ルビを保持したまま）
function cleanText(html) {
  // rubyタグをそのまま保持し、他のHTMLタグを削除
  return html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<!--.*?-->/g, '')
    .trim();
}

// ルビを抽出してプレーンテキストとルビ情報に分ける
function extractRuby(html) {
  const $ = cheerio.load(`<div>${html}</div>`);
  const text = $.root().text().replace(/\s+/g, '');

  // ルビ情報を配列で保存
  const rubies = [];
  $('ruby').each((i, elem) => {
    const base = $(elem).find('rb, :not(rt)').first().text();
    const rt = $(elem).find('rt').text();
    if (base && rt) {
      rubies.push({ base, ruby: rt });
    }
  });

  return { text, rubies };
}

// 1章をスクレイピング
async function scrapeChapter(bookName, chapterNum, withRuby = true) {
  const suffix = withRuby ? '_(文語訳ルビ付)' : '_(文語訳)';
  const url = `https://ja.wikisource.org/wiki/${encodeURIComponent(bookName + chapterNum + suffix)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BibleApp/1.0; +https://github.com)'
      }
    });

    const $ = cheerio.load(response.data);
    const verses = [];

    // Wikisourceの構造に基づいて節を抽出
    // 各節は <p> タグ内にあり、節番号は <sup> や特定のクラスで示されている
    $('.mw-parser-output > p').each((i, elem) => {
      const html = $(elem).html();
      if (!html) return;

      // 節番号を検出
      const verseMatch = html.match(/^(\d+)/);
      if (!verseMatch) return;

      const verseNum = parseInt(verseMatch[1]);
      const verseHtml = html.replace(/^\d+\s*/, '');

      if (withRuby) {
        const { text, rubies } = extractRuby(verseHtml);
        verses.push({
          verse: verseNum,
          text: text,
          rubies: rubies.length > 0 ? rubies : undefined
        });
      } else {
        verses.push({
          verse: verseNum,
          text: cleanText(verseHtml)
        });
      }
    });

    return verses;
  } catch (error) {
    console.error(`  ✗ Error scraping ${bookName} ${chapterNum}: ${error.message}`);
    return null;
  }
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

    // まずルビ付きを試す
    let verses = await scrapeChapter(wikisourceName, chNum, true);

    // ルビ付きがない場合は通常版を試す
    if (!verses || verses.length === 0) {
      verses = await scrapeChapter(wikisourceName, chNum, false);
    }

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
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return {
    id: bookData.id,
    name: bookData.name,
    shortName: bookData.name,
    chapters: chapters
  };
}

// メイン処理
async function main() {
  console.log('========================================');
  console.log('Wikisource 文語訳聖書 Scraper (ルビ付き)');
  console.log('========================================\n');

  const books = [];
  let totalVerses = 0;

  // 全ての書物をスクレイピング
  for (const bookData of bookOrder) {
    const book = await scrapeBook(bookData);
    if (book) {
      books.push(book);
      const verseCount = book.chapters.reduce((sum, ch) => sum + ch.verses.length, 0);
      totalVerses += verseCount;
    }
  }

  // 結果を保存
  const output = {
    books: books,
    metadata: {
      translation: '文語訳聖書',
      language: 'ja',
      year: '1887-1917',
      source: 'Wikisource',
      hasRuby: true
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
