/**
 * ruby-parser.tsx の包括的テスト
 * 実行方法: npx ts-node lib/ruby-parser.test.ts
 */

// テスト用に正規表現ロジックのみを抽出
function createRubyPattern() {
  const hiragana = '\u3041-\u309F';
  const punctuation = '。、！？・「」『』：；';
  const excluded = `（）\\s${hiragana}${punctuation}`;
  const rubyChars = 'ぁ-んゝゞァ-ヶーヽヾ';
  return new RegExp(`([^${excluded}]+)（([${rubyChars}]+)）`, 'gu');
}

function parseRubyMatches(text: string): Array<{ full: string; base: string; ruby: string }> {
  const pattern = createRubyPattern();
  const matches: Array<{ full: string; base: string; ruby: string }> = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      full: match[0],
      base: match[1],
      ruby: match[2]
    });
  }
  return matches;
}

// テストケース
const testCases = [
  // 基本的なケース
  { input: '神（かみ）', expected: [{ base: '神', ruby: 'かみ' }], description: '基本: 1文字漢字' },
  { input: '元始（はじめ）', expected: [{ base: '元始', ruby: 'はじめ' }], description: '基本: 2文字漢字' },
  { input: '僞善者（ぎぜんしゃ）', expected: [{ base: '僞善者', ruby: 'ぎぜんしゃ' }], description: '基本: 3文字漢字' },

  // 旧字体・異体字（CJK互換漢字）
  { input: '神（かみ）', expected: [{ base: '神', ruby: 'かみ' }], description: '旧字体: 神 (U+FA19)' },
  { input: '視（み）', expected: [{ base: '視', ruby: 'み' }], description: '旧字体: 視 (U+FA61)' },
  { input: '者（もの）', expected: [{ base: '者', ruby: 'もの' }], description: '旧字体: 者 (U+FA5B)' },

  // 繰り返し記号
  { input: '代々（よよ）', expected: [{ base: '代々', ruby: 'よよ' }], description: '繰り返し: 々' },
  { input: '人々（ひとびと）', expected: [{ base: '人々', ruby: 'ひとびと' }], description: '繰り返し: 々（ひらがな重複）' },

  // 踊り字（ひらがな）
  { input: '輝（かゞや）く', expected: [{ base: '輝', ruby: 'かゞや' }], description: '踊り字: ゞ（濁点）' },
  { input: '泣（なゝ）く', expected: [{ base: '泣', ruby: 'なゝ' }], description: '踊り字: ゝ' },

  // 複数マッチ
  {
    input: '王（わう）の時（とき）',
    expected: [{ base: '王', ruby: 'わう' }, { base: '時', ruby: 'とき' }],
    description: '複数: 2つのルビ'
  },
  {
    input: '神（かみ）言（いひ）たまひけるは天（てん）の下（した）',
    expected: [
      { base: '神', ruby: 'かみ' },
      { base: '言', ruby: 'いひ' },
      { base: '天', ruby: 'てん' },
      { base: '下', ruby: 'した' }
    ],
    description: '複数: 4つのルビ（創世記1:9風）'
  },

  // 句読点の前後
  { input: '、神（かみ）、', expected: [{ base: '神', ruby: 'かみ' }], description: '句読点: 読点の間' },
  { input: '。神（かみ）。', expected: [{ base: '神', ruby: 'かみ' }], description: '句読点: 句点の間' },
  { input: 'が、視（み）よ、', expected: [{ base: '視', ruby: 'み' }], description: '句読点: 文中' },

  // ひらがなの間
  { input: 'これは神（かみ）です', expected: [{ base: '神', ruby: 'かみ' }], description: 'ひらがな: 前後にひらがな' },
  { input: 'あなたの神（かみ）を', expected: [{ base: '神', ruby: 'かみ' }], description: 'ひらがな: 助詞の間' },

  // マッチしないケース
  { input: 'ひらがな（ひらがな）', expected: [], description: '非マッチ: ひらがなのみ' },
  { input: '漢字のみ', expected: [], description: '非マッチ: ルビなし' },
  { input: '（かっこのみ）', expected: [], description: '非マッチ: 漢字なし' },

  // カタカナルビ
  { input: '基督（キリスト）', expected: [{ base: '基督', ruby: 'キリスト' }], description: 'カタカナ: キリスト' },
  { input: '天使（エンゼル）', expected: [{ base: '天使', ruby: 'エンゼル' }], description: 'カタカナ: エンゼル' },

  // 実際のデータからのサンプル
  // 注: カタカナ（ヘロデ）も漢字と一緒にマッチするため「ヘロデ王」が base になる
  {
    input: 'イエスはヘロデ王（わう）の時（とき）、ユダヤのベツレヘムに生（うま）れ給（たま）ひしが、視（み）よ、東（ひがし）の博士（はかせ）たちエルサレムに來（きた）りて言（い）ふ、',
    expected: [
      { base: 'ヘロデ王', ruby: 'わう' },  // カタカナ+漢字が一緒にマッチ
      { base: '時', ruby: 'とき' },
      { base: '生', ruby: 'うま' },
      { base: '給', ruby: 'たま' },
      { base: '視', ruby: 'み' },
      { base: '東', ruby: 'ひがし' },
      { base: '博士', ruby: 'はかせ' },
      { base: '來', ruby: 'きた' },
      { base: '言', ruby: 'い' }
    ],
    description: '実データ: マタイ2:1（カタカナ+漢字の連続）'
  }
];

// テスト実行
console.log('=== Ruby Parser テスト ===\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const matches = parseRubyMatches(testCase.input);
  const expectedCount = testCase.expected.length;
  const actualCount = matches.length;

  let success = actualCount === expectedCount;
  if (success) {
    for (let i = 0; i < expectedCount; i++) {
      if (matches[i].base !== testCase.expected[i].base ||
          matches[i].ruby !== testCase.expected[i].ruby) {
        success = false;
        break;
      }
    }
  }

  if (success) {
    console.log(`✓ [${index + 1}] ${testCase.description}`);
    passed++;
  } else {
    console.log(`✗ [${index + 1}] ${testCase.description}`);
    console.log(`  入力: ${testCase.input}`);
    console.log(`  期待: ${JSON.stringify(testCase.expected)}`);
    console.log(`  実際: ${JSON.stringify(matches.map(m => ({ base: m.base, ruby: m.ruby })))}`);
    failed++;
  }
});

console.log(`\n=== 結果: ${passed}/${passed + failed} テスト成功 ===`);

if (failed > 0) {
  console.log(`\n⚠️  ${failed} 件のテストが失敗しました`);
  process.exit(1);
} else {
  console.log('\n✅ 全テスト成功！');
  process.exit(0);
}
