'use client';

import Link from 'next/link';

export default function AlphabetPage() {
  const alphabet = [
    { upper: 'Α', lower: 'α', name: 'アルファ', latin: 'alpha', sound: 'ア', note: '英語の a に相当' },
    { upper: 'Β', lower: 'β', name: 'ベータ', latin: 'beta', sound: 'ブ/ヴ', note: '英語の b/v に相当' },
    { upper: 'Γ', lower: 'γ', name: 'ガンマ', latin: 'gamma', sound: 'グ', note: '英語の g に相当。γγ, γκ, γξ, γχ の前では「ン」' },
    { upper: 'Δ', lower: 'δ', name: 'デルタ', latin: 'delta', sound: 'ド', note: '英語の d に相当' },
    { upper: 'Ε', lower: 'ε', name: 'エプシロン', latin: 'epsilon', sound: 'エ', note: '短い「エ」。英語の e に相当' },
    { upper: 'Ζ', lower: 'ζ', name: 'ゼータ', latin: 'zeta', sound: 'ズ', note: '英語の z に相当' },
    { upper: 'Η', lower: 'η', name: 'エータ', latin: 'eta', sound: 'エー', note: '長い「エー」' },
    { upper: 'Θ', lower: 'θ', name: 'シータ', latin: 'theta', sound: 'ス', note: '英語の th に相当（無声音）' },
    { upper: 'Ι', lower: 'ι', name: 'イオタ', latin: 'iota', sound: 'イ', note: '英語の i に相当' },
    { upper: 'Κ', lower: 'κ', name: 'カッパ', latin: 'kappa', sound: 'ク', note: '英語の k に相当' },
    { upper: 'Λ', lower: 'λ', name: 'ラムダ', latin: 'lambda', sound: 'ル', note: '英語の l に相当' },
    { upper: 'Μ', lower: 'μ', name: 'ミュー', latin: 'mu', sound: 'ム', note: '英語の m に相当' },
    { upper: 'Ν', lower: 'ν', name: 'ニュー', latin: 'nu', sound: 'ヌ', note: '英語の n に相当' },
    { upper: 'Ξ', lower: 'ξ', name: 'クシー', latin: 'xi', sound: 'クス', note: '英語の x に相当' },
    { upper: 'Ο', lower: 'ο', name: 'オミクロン', latin: 'omicron', sound: 'オ', note: '短い「オ」' },
    { upper: 'Π', lower: 'π', name: 'ピー', latin: 'pi', sound: 'プ', note: '英語の p に相当' },
    { upper: 'Ρ', lower: 'ρ', name: 'ロー', latin: 'rho', sound: 'ル', note: '英語の r に相当。巻き舌で発音' },
    { upper: 'Σ', lower: 'σ/ς', name: 'シグマ', latin: 'sigma', sound: 'ス', note: '語末では ς を使用' },
    { upper: 'Τ', lower: 'τ', name: 'タウ', latin: 'tau', sound: 'ト', note: '英語の t に相当' },
    { upper: 'Υ', lower: 'υ', name: 'ユプシロン', latin: 'upsilon', sound: 'ウ/ユ', note: '単独では「ユ」、二重母音では「ウ」' },
    { upper: 'Φ', lower: 'φ', name: 'ピー', latin: 'phi', sound: 'フ', note: '英語の ph/f に相当' },
    { upper: 'Χ', lower: 'χ', name: 'キー', latin: 'chi', sound: 'フ/ハ', note: 'ドイツ語の ch に近い' },
    { upper: 'Ψ', lower: 'ψ', name: 'プシー', latin: 'psi', sound: 'プス', note: 'ps の音' },
    { upper: 'Ω', lower: 'ω', name: 'オメガ', latin: 'omega', sound: 'オー', note: '長い「オー」。最後の文字' },
  ];

  const diphthongs = [
    { letters: 'αι', sound: 'アイ', example: 'καί（カイ）= そして' },
    { letters: 'ει', sound: 'エイ', example: 'εἰμί（エイミ）= 私は〜である' },
    { letters: 'οι', sound: 'オイ', example: 'οἶκος（オイコス）= 家' },
    { letters: 'υι', sound: 'ウイ', example: 'υἱός（ヒュイオス）= 息子' },
    { letters: 'αυ', sound: 'アウ', example: 'αὐτός（アウトス）= 彼自身' },
    { letters: 'ευ', sound: 'エウ', example: 'εὐαγγέλιον（エウアンゲリオン）= 福音' },
    { letters: 'ου', sound: 'ウー', example: 'οὐρανός（ウーラノス）= 天' },
  ];

  const breathings = [
    { name: '粗気音（ʽ）', example: 'ὁ', description: '語頭の母音の上につく「ʽ」は h の音を表す。ὁ は「ホ」と読む' },
    { name: '精気音（ʼ）', example: 'ὀ', description: '語頭の母音の上につく「ʼ」は h の音がないことを表す。ὀ は「オ」と読む' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/greek/guide" className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">ギリシャ語アルファベット</h1>
              <p className="text-blue-200">24文字の読み方と発音</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* イントロ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">アルファベットの基本</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            ギリシャ語のアルファベットは24文字あります。「アルファベット」という言葉自体、
            ギリシャ文字の最初の2文字「アルファ（Α）」と「ベータ（Β）」から来ています。
          </p>
          <p className="text-gray-700 leading-relaxed">
            各文字には大文字と小文字があります。聖書本文では主に小文字が使われ、
            固有名詞や文頭では大文字が使われます。
          </p>
        </div>

        {/* アルファベット表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-bold text-gray-900">アルファベット一覧</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">大文字</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">小文字</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">名前</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">発音</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">備考</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alphabet.map((letter, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-2xl font-serif">{letter.upper}</td>
                    <td className="px-4 py-3 text-2xl font-serif">{letter.lower}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{letter.name}</div>
                      <div className="text-xs text-gray-500">{letter.latin}</div>
                    </td>
                    <td className="px-4 py-3 text-blue-600 font-medium">{letter.sound}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{letter.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 母音と子音 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">母音と子音</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">母音（7つ）</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-3 text-2xl font-serif">
                  <span className="px-3 py-1 bg-white rounded">α</span>
                  <span className="px-3 py-1 bg-white rounded">ε</span>
                  <span className="px-3 py-1 bg-white rounded">η</span>
                  <span className="px-3 py-1 bg-white rounded">ι</span>
                  <span className="px-3 py-1 bg-white rounded">ο</span>
                  <span className="px-3 py-1 bg-white rounded">υ</span>
                  <span className="px-3 py-1 bg-white rounded">ω</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  α, ι, υ は長短両方あり。ε, ο は常に短く、η, ω は常に長い。
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">子音（17つ）</h3>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-3 text-2xl font-serif">
                  <span className="px-3 py-1 bg-white rounded">β</span>
                  <span className="px-3 py-1 bg-white rounded">γ</span>
                  <span className="px-3 py-1 bg-white rounded">δ</span>
                  <span className="px-3 py-1 bg-white rounded">ζ</span>
                  <span className="px-3 py-1 bg-white rounded">θ</span>
                  <span className="px-3 py-1 bg-white rounded">κ</span>
                  <span className="px-3 py-1 bg-white rounded">λ</span>
                  <span className="px-3 py-1 bg-white rounded">μ</span>
                  <span className="px-3 py-1 bg-white rounded">ν</span>
                  <span className="px-3 py-1 bg-white rounded">ξ</span>
                  <span className="px-3 py-1 bg-white rounded">π</span>
                  <span className="px-3 py-1 bg-white rounded">ρ</span>
                  <span className="px-3 py-1 bg-white rounded">σ</span>
                  <span className="px-3 py-1 bg-white rounded">τ</span>
                  <span className="px-3 py-1 bg-white rounded">φ</span>
                  <span className="px-3 py-1 bg-white rounded">χ</span>
                  <span className="px-3 py-1 bg-white rounded">ψ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 二重母音 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">二重母音（ディフソング）</h2>
          <p className="text-gray-700 mb-4">
            2つの母音が組み合わさって1つの音になるものを二重母音と呼びます。
          </p>
          <div className="grid gap-3">
            {diphthongs.map((d, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl font-serif w-12 text-center">{d.letters}</span>
                <span className="text-blue-600 font-medium w-16">{d.sound}</span>
                <span className="text-gray-600 text-sm">{d.example}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 気音記号 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">気音記号</h2>
          <p className="text-gray-700 mb-4">
            ギリシャ語では、語頭の母音に必ず気音記号がつきます。
            これは「h」の音があるかないかを示します。
          </p>
          <div className="space-y-4">
            {breathings.map((b, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-serif">{b.example}</span>
                  <span className="font-bold text-gray-900">{b.name}</span>
                </div>
                <p className="text-gray-700">{b.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>例：</strong> ἁμαρτία（ハマルティア）= 罪、ἀγάπη（アガペー）= 愛
            </p>
          </div>
        </div>

        {/* アクセント記号 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">アクセント記号</h2>
          <p className="text-gray-700 mb-4">
            ギリシャ語のアクセントは音の高さ（ピッチ）で表されます。
            初学者は「強く発音する場所」と考えても問題ありません。
          </p>
          <div className="grid gap-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-serif">ά</span>
                <div>
                  <span className="font-bold">鋭アクセント（´）</span>
                  <p className="text-sm text-gray-600">最も一般的。高く上がる音</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-serif">ὰ</span>
                <div>
                  <span className="font-bold">重アクセント（`）</span>
                  <p className="text-sm text-gray-600">語末で鋭アクセントの代わりに使用</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-serif">ᾶ</span>
                <div>
                  <span className="font-bold">曲アクセント（῀）</span>
                  <p className="text-sm text-gray-600">長母音で上がって下がる音</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 練習 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-bold mb-4">練習してみよう</h2>
          <p className="mb-4 text-white/90">
            以下の単語を声に出して読んでみましょう：
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-white/20 rounded-lg p-3">
              <span className="text-2xl font-serif">θεός</span>
              <span className="ml-3">セオス = 神</span>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <span className="text-2xl font-serif">λόγος</span>
              <span className="ml-3">ロゴス = 言葉</span>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <span className="text-2xl font-serif">ἀρχή</span>
              <span className="ml-3">アルケー = 初め</span>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <span className="text-2xl font-serif">κόσμος</span>
              <span className="ml-3">コスモス = 世界</span>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center pt-4">
          <Link
            href="/greek/guide"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>ガイド一覧</span>
          </Link>
          <Link
            href="/greek/guide/grammar"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>次へ：文法の基礎</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
