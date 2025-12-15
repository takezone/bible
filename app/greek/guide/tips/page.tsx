'use client';

import Link from 'next/link';

export default function TipsPage() {
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
              <h1 className="text-2xl font-bold">学習のコツ</h1>
              <p className="text-blue-200">効率的にギリシャ語を学ぶためのアドバイス</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 心構え */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">心構え</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">完璧を目指さない</h3>
                <p className="text-gray-700">
                  すべての文法を暗記してから読み始める必要はありません。
                  わからない部分があっても、とにかく聖書を読み始めましょう。
                  文脈から意味を推測する力も大切です。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">📖</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">毎日少しずつ</h3>
                <p className="text-gray-700">
                  1日5分でも良いので、毎日ギリシャ語に触れることが大切です。
                  週に1回1時間より、毎日10分の方が効果的です。
                  この学習モードを毎日の習慣にしましょう。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🔄</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">繰り返し読む</h3>
                <p className="text-gray-700">
                  同じ箇所を何度も読むことで、自然とパターンが身につきます。
                  特にヨハネ福音書の冒頭は、重要な語彙が繰り返し出てくるので
                  最初に学ぶのに最適です。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 学習方法 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">効果的な学習方法</h2>

          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-bold text-blue-900 mb-2">1. 声に出して読む</h3>
              <p className="text-blue-800">
                黙読だけでなく、声に出して読むことで記憶に定着しやすくなります。
                カタカナ読みでも構いません。発音しながら読むことで、
                単語のリズムやパターンが体に染み込みます。
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h3 className="font-bold text-green-900 mb-2">2. 日本語訳と比較する</h3>
              <p className="text-green-800">
                学習モードでは日本語訳（口語訳）も表示されます。
                ギリシャ語と日本語を見比べながら、どの単語がどの意味に
                対応しているか確認しましょう。
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-bold text-yellow-900 mb-2">3. 単語をタップして確認</h3>
              <p className="text-yellow-800">
                わからない単語があったら、タップして詳細を確認しましょう。
                レンマ（辞書形）、品詞分析、意味が表示されます。
                何度も出てくる単語は自然と覚えていきます。
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h3 className="font-bold text-purple-900 mb-2">4. レベルを段階的に上げる</h3>
              <p className="text-purple-800">
                最初は「初級」モードでカタカナと意味を見ながら読み、
                慣れてきたら「中級」でローマ字と品詞を確認、
                最終的には「上級」でギリシャ語のみで読めるようになりましょう。
              </p>
            </div>
          </div>
        </div>

        {/* 重要な単語 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">最初に覚えたい重要単語</h2>
          <p className="text-gray-700 mb-4">
            新約聖書で頻出する単語を覚えておくと、読解がぐっと楽になります。
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif">καί</span>
                <span className="text-gray-600">カイ = そして、〜も</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">新約聖書で最も多く使われる単語</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif">ὁ, ἡ, τό</span>
                <span className="text-gray-600">ホ、ヘー、ト = 定冠詞</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">英語の the に相当</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif">εἰμί</span>
                <span className="text-gray-600">エイミ = 〜である</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">英語の be 動詞に相当</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif">θεός</span>
                <span className="text-gray-600">セオス = 神</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">theology の語源</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif">λόγος</span>
                <span className="text-gray-600">ロゴス = 言葉、理性</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">biology, psychology などの -logy の語源</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif">κύριος</span>
                <span className="text-gray-600">キュリオス = 主</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Kyrie eleison の Kyrie</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif">Ἰησοῦς</span>
                <span className="text-gray-600">イエースース = イエス</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">ヘブライ語の「ヨシュア」のギリシャ語形</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif">Χριστός</span>
                <span className="text-gray-600">クリストス = キリスト</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">「油注がれた者」＝メシア</p>
            </div>
          </div>
        </div>

        {/* 覚え方のコツ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">単語を覚えるコツ</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">🔗</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">英語との関連を探す</h3>
                <p className="text-gray-700">
                  多くの英単語はギリシャ語から来ています。
                  <span className="font-serif mx-1">φῶς</span>（フォース＝光）→ photo、
                  <span className="font-serif mx-1">γράφω</span>（グラフォー＝書く）→ graph
                  など、関連を見つけると記憶に残りやすくなります。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">📝</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">文脈で覚える</h3>
                <p className="text-gray-700">
                  単語だけを暗記するより、聖句の中で覚える方が効果的です。
                  「この単語はヨハネ1:1で見た」という記憶が、
                  次に同じ単語を見たときに役立ちます。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">✍️</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">書いてみる</h3>
                <p className="text-gray-700">
                  手を動かして書くことで、文字の形が記憶に定着します。
                  聖句を書き写すことは、古くからの霊的修練でもあります。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 学習モードの活用 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-bold mb-4">この学習モードの活用法</h2>

          <div className="space-y-4">
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-bold mb-2">初級モード</h3>
              <p className="text-white/90 text-sm">
                カタカナ音写と日本語の意味が表示されます。
                まずはギリシャ語の音に慣れ、単語の意味を把握することに集中しましょう。
              </p>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-bold mb-2">中級モード</h3>
              <p className="text-white/90 text-sm">
                ローマ字音写と品詞が表示されます。
                文法的な構造を意識しながら読むことで、より深い理解が得られます。
              </p>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-bold mb-2">上級モード</h3>
              <p className="text-white/90 text-sm">
                ギリシャ語テキストのみが表示されます。
                わからない単語はタップして確認できます。
                辞書なしで読めることを目指しましょう。
              </p>
            </div>
          </div>
        </div>

        {/* 励まし */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl mb-4">💪</div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">あきらめずに続けよう</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            ギリシャ語学習は最初は難しく感じるかもしれませんが、
            続けていれば必ず成果が出ます。多くの人が最初の壁を乗り越えられずに
            やめてしまいますが、あなたはここまで学習ガイドを読んでいます。
            その意欲があれば、きっと原語で聖書を読める日が来るでしょう。
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
            <p className="text-blue-800 font-serif text-lg">
              ἐν ἀρχῇ ἦν ὁ λόγος
            </p>
            <p className="text-blue-600 text-sm mt-2">
              「初めに言葉があった」- ヨハネ1:1
            </p>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center pt-4">
          <Link
            href="/greek/guide/grammar"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>前へ：文法の基礎</span>
          </Link>
          <Link
            href="/greek/guide/john-intro"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>次へ：ヨハネ1章を読む</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
