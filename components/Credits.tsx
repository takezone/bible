'use client';

import { useState } from 'react';

export function Credits() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="font-medium">聖書の出典と謝辞</span>
          <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="mt-6 space-y-6 text-sm text-gray-700">
            {/* 謝辞 */}
            <div className="bg-green-50 rounded-lg p-5 border border-green-200">
              <h3 className="font-bold text-base text-gray-900 mb-3">謝辞</h3>
              <p className="leading-relaxed">
                このアプリで使用している聖書テキストは、いずれもパブリックドメインとして公開されているものです。
                これらの聖書翻訳に関わられたすべての翻訳者、学者、宣教師の方々、
                そしてデータを整備・公開してくださった方々に深く感謝いたします。
                また、長い年月をかけて聖書を読み継ぎ、守り伝えてこられたすべての信仰者の方々に敬意を表します。
              </p>
            </div>

            {/* 文語訳聖書 */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-3">文語訳聖書</h3>
              <div className="space-y-2">
                <p>
                  <strong>出版:</strong> 日本聖書協会（旧訳）/ 聖書翻訳委員社（新約改訳）
                </p>
                <p>
                  <strong>刊行年:</strong> 旧約聖書 1887年（明治元訳）、新約聖書 1880年、新約改訳 1917年（大正改訳）
                </p>
                <p>
                  <strong>翻訳:</strong> ヘボン、ブラウン、グリーンらの宣教師と日本人の協力により翻訳。旧約聖書は明治元訳として完成し、新約聖書は1917年に大正改訳として改訂されました。
                </p>
                <p>
                  <strong>特徴:</strong> 格調高い文語体による翻訳で、日本語聖書翻訳史上重要な位置を占めます。「大正改訳」として知られる新約聖書は、新共同訳以前の約70年間にわたり広く使用されました。
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://ja.wikisource.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikisource</a>、<a href="https://bungo.iinaa.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">bungo.iinaa.net</a>
                </p>
              </div>
            </div>

            {/* 口語訳聖書 */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-3">口語訳聖書</h3>
              <div className="space-y-2">
                <p>
                  <strong>出版:</strong> 日本聖書協会
                </p>
                <p>
                  <strong>刊行年:</strong> 新約聖書 1954年、旧約聖書 1955年
                </p>
                <p>
                  <strong>翻訳:</strong> 日本の聖書学者による共同翻訳。アメリカ聖書協会・イギリス聖書協会の協力のもと、1951年4月に翻訳事業が開始されました。
                </p>
                <p>
                  <strong>特徴:</strong> 戦後、広く普及した口語訳聖書。文語訳から口語訳への移行期において、日本聖書協会による標準的な翻訳として定着しました。
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  ※ 日本語の口語訳聖書としては、1952年にキリスト新聞社から賀川豊彦の影響を受けた渡瀬主一郎・武藤富男訳『新約聖書口語訳』が先行して刊行されています。
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://github.com/yuki-kimoto/biblesearch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">yuki-kimoto/biblesearch</a>
                </p>
              </div>
            </div>

            {/* ギリシャ語聖書 */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-3">ギリシャ語聖書（原典）</h3>
              <div className="space-y-2">
                <p>
                  <strong>新約聖書:</strong> OpenGNT (Open Greek New Testament)
                </p>
                <p>
                  <strong>旧約聖書:</strong> LXX-Swete（七十人訳/セプトゥアギンタ）- Swete版 (1909-1930)
                </p>
                <p>
                  <strong>特徴:</strong> 新約聖書は原典のコイネー・ギリシャ語テキスト（NA28相当）、旧約聖書は紀元前3〜2世紀に翻訳されたギリシャ語訳（七十人訳）です。発音ガイド（現代ギリシャ語発音/SBLトランスリテレーション）付き。
                </p>
                <p>
                  <strong>ライセンス:</strong> CC BY-SA 4.0
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://github.com/eliranwong/OpenGNT" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenGNT</a>、<a href="https://github.com/eliranwong/LXX-Swete-1930" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LXX-Swete-1930</a>
                </p>
              </div>
            </div>

            {/* ヘブル語聖書 */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-3">ヘブル語聖書（旧約原典）</h3>
              <div className="space-y-2">
                <p>
                  <strong>テキスト:</strong> Westminster Leningrad Codex (WLC)
                </p>
                <p>
                  <strong>特徴:</strong> レニングラード写本（1008年頃）に基づく、現存する最古の完全なヘブル語聖書写本のデジタル版です。母音記号（ニクダー）付きで、発音のローマ字転写も表示されます。
                </p>
                <p>
                  <strong>ライセンス:</strong> パブリックドメイン（テキスト）、CC BY 4.0（形態素解析データ）
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://github.com/openscriptures/morphhb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Scriptures Hebrew Bible</a>
                </p>
              </div>
            </div>

            {/* ルター訳聖書 */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-3">ルター訳聖書 1912年版 (Luther Bible)</h3>
              <div className="space-y-2">
                <p>
                  <strong>翻訳:</strong> マルティン・ルター (Martin Luther)
                </p>
                <p>
                  <strong>刊行年:</strong> 原訳 1534年、1912年改訂版
                </p>
                <p>
                  <strong>特徴:</strong> 宗教改革の時代にルターがドイツ語に翻訳した歴史的に重要な聖書。1912年版は近代ドイツ語に適合させた改訂版で、現在もドイツ語圏で広く読まれています。
                </p>
                <p>
                  <strong>ライセンス:</strong> パブリックドメイン
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://ebible.org/find/details.php?id=deu1912" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">eBible.org</a>
                </p>
              </div>
            </div>

            {/* King James Version */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-3">King James Version (KJV)</h3>
              <div className="space-y-2">
                <p>
                  <strong>翻訳:</strong> イングランド国教会の委員会による英語訳聖書
                </p>
                <p>
                  <strong>刊行年:</strong> 1611年
                </p>
                <p>
                  <strong>翻訳経緯:</strong> イングランド王ジェームズ1世の命により、約50名の学者が7年をかけて翻訳しました。
                </p>
                <p>
                  <strong>特徴:</strong> 英語圏で最も影響力のある聖書翻訳の一つとして、400年以上にわたり読み継がれています。格調高い英語表現で知られています。
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://github.com/aruljohn/Bible-kjv" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aruljohn/Bible-kjv</a>
                </p>
              </div>
            </div>

            {/* New Heart English Bible */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-3">New Heart English Bible (NHEB)</h3>
              <div className="space-y-2">
                <p>
                  <strong>翻訳:</strong> Wayne A. Mitchell による現代英語訳聖書（World English Bible をベースに改訂）
                </p>
                <p>
                  <strong>元となった翻訳:</strong> World English Bible (WEB) を改訂・改善したもの
                </p>
                <p>
                  <strong>特徴:</strong> 完全にパブリックドメインの現代英語訳聖書として、誰でも自由にコピー・配布・利用できます。WEBの自然な現代英語表現を継承しつつ、さらに読みやすく改訂されています。KJVと異なり、現代の英語表現を使用しているため読みやすくなっています。
                </p>
                <p>
                  <strong>ライセンス:</strong> パブリックドメイン（著作権なし）- 著作権料や許可なしで自由に使用可能
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://github.com/scrollmapper/bible_databases" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">scrollmapper/bible_databases</a><br />
                  NHEB公式サイト: <a href="https://nheb.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">nheb.net</a>
                </p>
              </div>
            </div>

            {/* 参考文献 */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h3 className="font-bold text-base text-gray-900 mb-3">参考文献・情報源</h3>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li>
                  • <a href="https://ja.wikipedia.org/wiki/口語訳聖書" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">口語訳聖書 - Wikipedia</a>
                </li>
                <li>
                  • <a href="https://ja.wikipedia.org/wiki/文語訳聖書" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">文語訳聖書 - Wikipedia</a>
                </li>
                <li>
                  • <a href="https://ja.wikipedia.org/wiki/明治元訳聖書" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">明治元訳聖書 - Wikipedia</a>
                </li>
                <li>
                  • <a href="https://www.bible.or.jp/know/know29.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">日本聖書協会発行の各訳について - 日本聖書協会</a>
                </li>
                <li>
                  • <a href="https://mgda.meijigakuin.ac.jp/bible/gaisetsu/meijimotoyaku.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">聖書和訳史概説：明治元訳の完成 - 明治学院大学図書館</a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 制作者表記 */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Provided by <a href="https://friendsofone.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Friends of ONE</a>
        </div>
      </div>
    </div>
  );
}
