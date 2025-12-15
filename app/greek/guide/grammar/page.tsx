'use client';

import Link from 'next/link';

export default function GrammarPage() {
  const cases = [
    {
      name: '主格',
      greek: 'ὀνομαστική',
      latin: 'Nominative',
      abbr: 'N / 主',
      function: '主語を表す',
      question: '「〜が」「〜は」',
      example: 'ὁ θεός（神が）',
      color: 'bg-blue-100 border-blue-400',
    },
    {
      name: '属格',
      greek: 'γενική',
      latin: 'Genitive',
      abbr: 'G / 属',
      function: '所有・起源・分離を表す',
      question: '「〜の」',
      example: 'τοῦ θεοῦ（神の）',
      color: 'bg-green-100 border-green-400',
    },
    {
      name: '与格',
      greek: 'δοτική',
      latin: 'Dative',
      abbr: 'D / 与',
      function: '間接目的語・場所・手段を表す',
      question: '「〜に」「〜で」',
      example: 'τῷ θεῷ（神に）',
      color: 'bg-yellow-100 border-yellow-400',
    },
    {
      name: '対格',
      greek: 'αἰτιατική',
      latin: 'Accusative',
      abbr: 'A / 対',
      function: '直接目的語を表す',
      question: '「〜を」',
      example: 'τὸν θεόν（神を）',
      color: 'bg-red-100 border-red-400',
    },
    {
      name: '呼格',
      greek: 'κλητική',
      latin: 'Vocative',
      abbr: 'V / 呼',
      function: '呼びかけを表す',
      question: '「〜よ」',
      example: 'θεέ（神よ）',
      color: 'bg-purple-100 border-purple-400',
    },
  ];

  const numbers = [
    { name: '単数', latin: 'Singular', abbr: 'S / 単', description: '1つのもの' },
    { name: '複数', latin: 'Plural', abbr: 'P / 複', description: '2つ以上のもの' },
  ];

  const genders = [
    { name: '男性', latin: 'Masculine', abbr: 'M / 男', article: 'ὁ', example: 'ὁ λόγος（言葉）' },
    { name: '女性', latin: 'Feminine', abbr: 'F / 女', article: 'ἡ', example: 'ἡ ζωή（命）' },
    { name: '中性', latin: 'Neuter', abbr: 'N / 中', article: 'τό', example: 'τὸ φῶς（光）' },
  ];

  const verbTenses = [
    { name: '現在', latin: 'Present', abbr: 'Pres', aspect: '継続・反復', example: 'λέγω（私は言う/言っている）' },
    { name: '未完了過去', latin: 'Imperfect', abbr: 'Impf', aspect: '過去の継続', example: 'ἔλεγον（私は言っていた）' },
    { name: '未来', latin: 'Future', abbr: 'Fut', aspect: '将来の行為', example: 'λέξω（私は言うだろう）' },
    { name: 'アオリスト', latin: 'Aorist', abbr: 'Aor', aspect: '単純な行為', example: 'εἶπον（私は言った）' },
    { name: '完了', latin: 'Perfect', abbr: 'Perf', aspect: '完了した状態', example: 'εἴρηκα（私は言ってしまった）' },
    { name: '過去完了', latin: 'Pluperfect', abbr: 'Plup', aspect: '過去の完了', example: 'εἰρήκειν（私は言ってしまっていた）' },
  ];

  const verbVoices = [
    { name: '能動態', latin: 'Active', description: '主語が動作を行う', example: 'λύω（私は解く）' },
    { name: '中動態', latin: 'Middle', description: '主語自身のために行う', example: 'λύομαι（私は自分のために解く）' },
    { name: '受動態', latin: 'Passive', description: '主語が動作を受ける', example: 'λύομαι（私は解かれる）' },
  ];

  const verbMoods = [
    { name: '直説法', latin: 'Indicative', abbr: 'Ind', description: '事実を述べる' },
    { name: '命令法', latin: 'Imperative', abbr: 'Impv', description: '命令・要求を表す' },
    { name: '接続法', latin: 'Subjunctive', abbr: 'Subj', description: '可能性・目的を表す' },
    { name: '希求法', latin: 'Optative', abbr: 'Opt', description: '願望を表す（稀）' },
  ];

  const partsOfSpeech = [
    { name: '名詞', latin: 'Noun', abbr: 'N', description: '人・物・概念', example: 'θεός（神）、λόγος（言葉）' },
    { name: '動詞', latin: 'Verb', abbr: 'V', description: '動作・状態', example: 'εἰμί（〜である）、λέγω（言う）' },
    { name: '形容詞', latin: 'Adjective', abbr: 'Adj', description: '名詞を修飾', example: 'ἀγαθός（良い）、μέγας（大きい）' },
    { name: '冠詞', latin: 'Article', abbr: 'Art', description: '定冠詞', example: 'ὁ, ἡ, τό（その）' },
    { name: '代名詞', latin: 'Pronoun', abbr: 'Pron', description: '名詞の代わり', example: 'ἐγώ（私）、σύ（あなた）' },
    { name: '前置詞', latin: 'Preposition', abbr: 'Prep', description: '関係を示す', example: 'ἐν（〜の中に）、εἰς（〜へ）' },
    { name: '副詞', latin: 'Adverb', abbr: 'Adv', description: '動詞等を修飾', example: 'νῦν（今）、οὐ（〜ない）' },
    { name: '接続詞', latin: 'Conjunction', abbr: 'Conj', description: '語句を結ぶ', example: 'καί（そして）、ἀλλά（しかし）' },
    { name: '分詞', latin: 'Participle', abbr: 'Part', description: '動詞の形容詞形', example: 'λέγων（言いながら）' },
    { name: '不定詞', latin: 'Infinitive', abbr: 'Inf', description: '動詞の名詞形', example: 'λέγειν（言うこと）' },
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
              <h1 className="text-2xl font-bold">文法の基礎知識</h1>
              <p className="text-blue-200">格変化・動詞活用などの文法用語</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* イントロ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ギリシャ語文法の特徴</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            ギリシャ語は「屈折語」と呼ばれ、単語の語尾が変化することで
            文中での役割（主語、目的語など）を示します。
            英語では語順が重要ですが、ギリシャ語では語尾を見ることで
            文の構造を理解できます。
          </p>
          <p className="text-gray-700 leading-relaxed">
            この特徴により、ギリシャ語では語順が比較的自由で、
            強調したい語を文頭に置くことができます。
          </p>
        </div>

        {/* 格（Case） */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">格（Case）- 名詞の役割</h2>
          <p className="text-gray-700 mb-4">
            「格」は名詞が文中でどのような役割を果たすかを示します。
            日本語の「〜が」「〜を」「〜に」などの助詞に相当します。
          </p>
          <div className="space-y-4">
            {cases.map((c) => (
              <div key={c.name} className={`p-4 rounded-lg border-l-4 ${c.color}`}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-bold text-lg text-gray-900">{c.name}</span>
                  <span className="text-sm text-gray-500">({c.latin})</span>
                  <span className="px-2 py-0.5 bg-gray-200 rounded text-sm font-mono">{c.abbr}</span>
                </div>
                <p className="text-gray-700 mb-2">{c.function} → {c.question}</p>
                <p className="text-sm">
                  <span className="font-serif text-lg">{c.example}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 性と数 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 性 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">性（Gender）</h2>
            <p className="text-gray-700 mb-4">
              ギリシャ語の名詞には文法上の「性」があります。
              これは生物学的な性別とは必ずしも一致しません。
            </p>
            <div className="space-y-3">
              {genders.map((g) => (
                <div key={g.name} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{g.name}</span>
                    <span className="text-sm text-gray-500">({g.latin})</span>
                    <span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-mono">{g.abbr}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    冠詞: <span className="font-serif">{g.article}</span> → {g.example}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 数 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">数（Number）</h2>
            <p className="text-gray-700 mb-4">
              名詞・動詞は単数と複数で形が変わります。
            </p>
            <div className="space-y-3">
              {numbers.map((n) => (
                <div key={n.name} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{n.name}</span>
                    <span className="text-sm text-gray-500">({n.latin})</span>
                    <span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-mono">{n.abbr}</span>
                  </div>
                  <p className="text-sm text-gray-600">{n.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>注：</strong>古典ギリシャ語には「双数」もありましたが、
                新約聖書のコイネー・ギリシャ語では使われません。
              </p>
            </div>
          </div>
        </div>

        {/* 動詞の時制 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">動詞の時制（Tense）</h2>
          <p className="text-gray-700 mb-4">
            ギリシャ語の時制は、時間よりも「アスペクト（動作の様相）」を重視します。
            動作が継続しているか、完了しているか、単純な行為かを表します。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">時制</th>
                  <th className="px-4 py-2 text-left">略号</th>
                  <th className="px-4 py-2 text-left">アスペクト</th>
                  <th className="px-4 py-2 text-left">例</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {verbTenses.map((t) => (
                  <tr key={t.name}>
                    <td className="px-4 py-2 font-medium">{t.name}<br /><span className="text-xs text-gray-500">{t.latin}</span></td>
                    <td className="px-4 py-2 font-mono text-sm">{t.abbr}</td>
                    <td className="px-4 py-2 text-sm">{t.aspect}</td>
                    <td className="px-4 py-2 text-sm font-serif">{t.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 態と法 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 態 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">態（Voice）</h2>
            <div className="space-y-3">
              {verbVoices.map((v) => (
                <div key={v.name} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold mb-1">{v.name} <span className="text-sm text-gray-500">({v.latin})</span></div>
                  <p className="text-sm text-gray-600 mb-1">{v.description}</p>
                  <p className="text-sm font-serif">{v.example}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                中動態と受動態は多くの形が同じで、文脈から判断します。
              </p>
            </div>
          </div>

          {/* 法 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">法（Mood）</h2>
            <div className="space-y-3">
              {verbMoods.map((m) => (
                <div key={m.name} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{m.name}</span>
                    <span className="text-sm text-gray-500">({m.latin})</span>
                    <span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-mono">{m.abbr}</span>
                  </div>
                  <p className="text-sm text-gray-600">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 品詞 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">品詞（Parts of Speech）</h2>
          <p className="text-gray-700 mb-4">
            学習モードで表示される品詞の略号と意味を確認しましょう。
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {partsOfSpeech.map((p) => (
              <div key={p.name} className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono flex-shrink-0">{p.abbr}</span>
                <div>
                  <div className="font-medium">{p.name} <span className="text-sm text-gray-500">({p.latin})</span></div>
                  <p className="text-sm text-gray-600">{p.description}</p>
                  <p className="text-xs text-gray-500 font-serif mt-1">{p.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 品詞分析の読み方 */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-bold mb-4">品詞分析の読み方</h2>
          <p className="mb-4 text-white/90">
            学習モードで表示される品詞コードの読み方：
          </p>
          <div className="bg-white/20 rounded-lg p-4 mb-4">
            <div className="text-center">
              <span className="text-3xl font-serif">λόγος</span>
              <div className="mt-2 font-mono">N-NSM</div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono bg-white/30 px-2 py-1 rounded">N</span>
              <span>= 名詞（Noun）</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono bg-white/30 px-2 py-1 rounded">N</span>
              <span>= 主格（Nominative）</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono bg-white/30 px-2 py-1 rounded">S</span>
              <span>= 単数（Singular）</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono bg-white/30 px-2 py-1 rounded">M</span>
              <span>= 男性（Masculine）</span>
            </div>
          </div>
          <p className="mt-4 text-white/90 text-sm">
            つまり「λόγος」は「男性名詞・単数・主格」＝「言葉が」という主語の形です。
          </p>
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center pt-4">
          <Link
            href="/greek/guide/alphabet"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>前へ：アルファベット</span>
          </Link>
          <Link
            href="/greek/guide/tips"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>次へ：学習のコツ</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
