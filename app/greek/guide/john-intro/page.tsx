'use client';

import Link from 'next/link';

export default function JohnIntroPage() {
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
              <h1 className="text-2xl font-bold">実践：ヨハネ1章を読む</h1>
              <p className="text-blue-200">福音書の冒頭を詳しく解説</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* イントロ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ヨハネ福音書の冒頭</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            ヨハネ福音書の冒頭（1:1-5）は、新約聖書の中でも最も有名な箇所の一つです。
            ギリシャ語学習の教材としても非常に優れており、
            重要な語彙と文法が凝縮されています。
          </p>
          <p className="text-gray-700 leading-relaxed">
            ここでは、1節から5節までを一つ一つ丁寧に見ていきましょう。
          </p>
        </div>

        {/* 1:1 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-bold">ヨハネ 1:1</h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-serif mb-2">
                Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.
              </p>
              <p className="text-gray-600">
                初めに言があった。言は神と共にあった。言は神であった。
              </p>
            </div>

            <div className="space-y-4">
              {/* Ἐν ἀρχῇ */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">Ἐν ἀρχῇ</span>
                  <span className="text-gray-500">エン アルケー</span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">ἐν</span>
                    <span>前置詞「〜の中に」（+与格）</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-green-100 px-2 py-0.5 rounded">ἀρχῇ</span>
                    <span>ἀρχή（アルケー）の与格単数「初め・始まり」</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>意味：</strong>「初めに」- 創世記1:1「初めに神は天地を創造された」を想起させます。
                  ヨハネはここで、言（ロゴス）が創造以前から存在していたことを示しています。
                </p>
              </div>

              {/* ἦν ὁ λόγος */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">ἦν ὁ λόγος</span>
                  <span className="text-gray-500">エーン ホ ロゴス</span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-red-100 px-2 py-0.5 rounded">ἦν</span>
                    <span>εἰμί（〜である）の未完了過去3人称単数「〜であった」</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded">ὁ</span>
                    <span>定冠詞（男性主格単数）</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-green-100 px-2 py-0.5 rounded">λόγος</span>
                    <span>名詞・男性主格単数「言葉、理性」</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>意味：</strong>「言葉があった」- λόγος は単なる「言葉」以上の意味を持ち、
                  理性、論理、神の自己表現を含みます。ここでは神の御子キリストを指します。
                </p>
              </div>

              {/* καὶ ὁ λόγος ἦν πρὸς τὸν θεόν */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">καὶ ὁ λόγος ἦν πρὸς τὸν θεόν</span>
                </div>
                <div className="text-gray-500 mb-2">カイ ホ ロゴス エーン プロス トン セオン</div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-purple-100 px-2 py-0.5 rounded">καί</span>
                    <span>接続詞「そして」</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">πρός</span>
                    <span>前置詞「〜に向かって、〜と共に」（+対格）</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded">τὸν θεόν</span>
                    <span>θεός の対格単数（冠詞付き）「神を」</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>意味：</strong>「言葉は神と共にあった」- πρός は単なる「一緒に」ではなく、
                  「向かい合って」というニュアンスがあり、父なる神との親密な関係を示します。
                </p>
              </div>

              {/* καὶ θεὸς ἦν ὁ λόγος */}
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">καὶ θεὸς ἦν ὁ λόγος</span>
                </div>
                <div className="text-gray-500 mb-2">カイ セオス エーン ホ ロゴス</div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-green-100 px-2 py-0.5 rounded">θεός</span>
                    <span>名詞・主格単数（冠詞なし！）「神」</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>文法ポイント：</strong>ここで θεός には冠詞がありません。
                  ギリシャ語では、冠詞のない述語名詞は「性質」を強調します。
                  「言葉は神であった」つまり、言葉は神の本質を持っていた、という意味です。
                </p>
                <p className="mt-2 text-gray-700">
                  <strong>語順について：</strong>θεός が文頭に来ているのは強調のためです。
                  「神こそが言葉であった」というニュアンスが込められています。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1:2 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-bold">ヨハネ 1:2</h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-serif mb-2">
                οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν.
              </p>
              <p className="text-gray-600">
                この言は初めに神と共にあった。
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-serif">οὗτος</span>
                <span className="text-gray-500">フートス</span>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">οὗτος</span>
                  <span>指示代名詞・男性主格単数「この者、この人」</span>
                </div>
              </div>
              <p className="mt-3 text-gray-700">
                <strong>意味：</strong>1節の内容を要約し、言（ロゴス）が初めから神と共に存在していたことを再確認しています。
                「この方は」と人格を持った存在として言及しています。
              </p>
            </div>
          </div>
        </div>

        {/* 1:3 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-bold">ヨハネ 1:3</h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-serif mb-2">
                πάντα δι᾽ αὐτοῦ ἐγένετο, καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἕν ὃ γέγονεν.
              </p>
              <p className="text-gray-600">
                すべてのものは、これによってできた。できたもののうち、一つとしてこれによらないものはなかった。
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">πάντα δι᾽ αὐτοῦ ἐγένετο</span>
                </div>
                <div className="text-gray-500 mb-2">パンタ ディ アウトゥー エゲネト</div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">πάντα</span>
                    <span>πᾶς の中性対格複数「すべてのもの」</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-green-100 px-2 py-0.5 rounded">δι᾽ (διά)</span>
                    <span>前置詞「〜を通して」（+属格）</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded">αὐτοῦ</span>
                    <span>αὐτός の属格単数「彼の、彼を通して」</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-red-100 px-2 py-0.5 rounded">ἐγένετο</span>
                    <span>γίνομαι（なる、生じる）のアオリスト中動態3人称単数</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>意味：</strong>「すべてのものは彼を通して生じた」-
                  言（ロゴス）が創造の仲介者であることを示します。
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἕν</span>
                </div>
                <div className="text-gray-500 mb-2">コーリス アウトゥー エゲネト ウーデ ヘン</div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">χωρίς</span>
                    <span>前置詞「〜なしに」（+属格）</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-purple-100 px-2 py-0.5 rounded">οὐδέ</span>
                    <span>否定詞「〜もない」</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-green-100 px-2 py-0.5 rounded">ἕν</span>
                    <span>εἷς（一つ）の中性主格単数「一つのものも」</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>意味：</strong>「彼なしには一つのものも生じなかった」-
                  否定を強調して、言（ロゴス）の創造における不可欠性を示します。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1:4 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-bold">ヨハネ 1:4</h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-serif mb-2">
                ἐν αὐτῷ ζωὴ ἦν, καὶ ἡ ζωὴ ἦν τὸ φῶς τῶν ἀνθρώπων.
              </p>
              <p className="text-gray-600">
                この言に命があった。そしてこの命は人の光であった。
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">ἐν αὐτῷ ζωὴ ἦν</span>
                  <span className="text-gray-500">エン アウトー ゾーエー エーン</span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">αὐτῷ</span>
                    <span>αὐτός の与格単数「彼の中に」</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-green-100 px-2 py-0.5 rounded">ζωή</span>
                    <span>名詞・女性主格単数「命、生命」</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>意味：</strong>「彼の中に命があった」-
                  ζωή はヨハネ福音書の重要なテーマで、「永遠の命」を指します。
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">ἡ ζωὴ ἦν τὸ φῶς τῶν ἀνθρώπων</span>
                </div>
                <div className="text-gray-500 mb-2">ヘー ゾーエー エーン ト フォース トーン アンスローポーン</div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded">τὸ φῶς</span>
                    <span>φῶς（光）の中性主格単数（冠詞付き）</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-green-100 px-2 py-0.5 rounded">τῶν ἀνθρώπων</span>
                    <span>ἄνθρωπος（人間）の属格複数「人々の」</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>意味：</strong>「その命は人々の光であった」-
                  φῶς（光）もヨハネ福音書の重要なテーマです。命と光は対になっています。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1:5 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-bold">ヨハネ 1:5</h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-serif mb-2">
                καὶ τὸ φῶς ἐν τῇ σκοτίᾳ φαίνει, καὶ ἡ σκοτία αὐτὸ οὐ κατέλαβεν.
              </p>
              <p className="text-gray-600">
                光はやみの中に輝いている。そして、やみはこれに勝たなかった。
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">τὸ φῶς ἐν τῇ σκοτίᾳ φαίνει</span>
                </div>
                <div className="text-gray-500 mb-2">ト フォース エン テー スコティア ファイネイ</div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">σκοτία</span>
                    <span>名詞・女性与格単数「闇の中に」</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-red-100 px-2 py-0.5 rounded">φαίνει</span>
                    <span>φαίνω（輝く）の現在能動態3人称単数</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>意味：</strong>「光は闇の中で輝いている」-
                  現在形が使われていることに注目。今もなお輝き続けていることを示します。
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-serif">ἡ σκοτία αὐτὸ οὐ κατέλαβεν</span>
                </div>
                <div className="text-gray-500 mb-2">ヘー スコティア アウト ウー カテラベン</div>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono bg-purple-100 px-2 py-0.5 rounded">οὐ</span>
                    <span>否定詞「〜ない」</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-red-100 px-2 py-0.5 rounded">κατέλαβεν</span>
                    <span>καταλαμβάνω のアオリスト能動態3人称単数</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  <strong>文法ポイント：</strong>κατέλαβεν は二重の意味を持ちます：
                </p>
                <ul className="mt-2 text-gray-700 list-disc list-inside">
                  <li>「理解する、把握する」→ 闇は光を理解しなかった</li>
                  <li>「打ち勝つ、捕らえる」→ 闇は光に勝てなかった</li>
                </ul>
                <p className="mt-2 text-gray-700">
                  ヨハネはこの二重の意味を意図的に使っている可能性があります。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* まとめ */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-bold mb-4">学んだ重要語彙</h2>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="bg-white/20 rounded p-2">
              <span className="font-serif">ἀρχή</span> - 初め
            </div>
            <div className="bg-white/20 rounded p-2">
              <span className="font-serif">λόγος</span> - 言葉
            </div>
            <div className="bg-white/20 rounded p-2">
              <span className="font-serif">θεός</span> - 神
            </div>
            <div className="bg-white/20 rounded p-2">
              <span className="font-serif">ζωή</span> - 命
            </div>
            <div className="bg-white/20 rounded p-2">
              <span className="font-serif">φῶς</span> - 光
            </div>
            <div className="bg-white/20 rounded p-2">
              <span className="font-serif">σκοτία</span> - 闇
            </div>
            <div className="bg-white/20 rounded p-2">
              <span className="font-serif">ἄνθρωπος</span> - 人間
            </div>
            <div className="bg-white/20 rounded p-2">
              <span className="font-serif">πᾶς</span> - すべて
            </div>
          </div>
        </div>

        {/* 次のステップ */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">次のステップ</h2>
          <p className="text-gray-700 mb-6">
            ここまで学んだことを活かして、実際に学習モードで読んでみましょう！
            ヨハネ福音書1章を、初級モードから始めてみてください。
          </p>
          <Link
            href="/greek?book=john&chapter=1"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>ヨハネ1章を学習モードで読む</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center pt-4">
          <Link
            href="/greek/guide/tips"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>前へ：学習のコツ</span>
          </Link>
          <Link
            href="/greek/guide"
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <span>ガイド一覧に戻る</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
