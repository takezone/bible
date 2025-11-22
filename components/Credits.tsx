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
                  <strong>特徴:</strong> 日本人の聖書学者による初の口語訳聖書として、戦後の日本で広く読まれるようになりました。
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://github.com/yuki-kimoto/biblesearch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">yuki-kimoto/biblesearch (SQLiteデータベース)</a>
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
                  データソース: <a href="https://github.com/aruljohn/Bible-kjv" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aruljohn/Bible-kjv (JSONデータ)</a>
                </p>
              </div>
            </div>

            {/* World English Bible */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-3">World English Bible (WEB)</h3>
              <div className="space-y-2">
                <p>
                  <strong>翻訳:</strong> Michael Paul Johnson と多数のボランティアによる現代英語訳聖書
                </p>
                <p>
                  <strong>翻訳期間:</strong> 1994年 - 2020年
                </p>
                <p>
                  <strong>元となった翻訳:</strong> American Standard Version (1901) を現代英語に改訂
                </p>
                <p>
                  <strong>特徴:</strong> 完全にパブリックドメインの現代英語訳聖書として、誰でも自由にコピー・配布・利用できます。KJVと異なり、現代の英語表現を使用しているため読みやすくなっています。
                </p>
                <p>
                  <strong>ライセンス:</strong> パブリックドメイン（著作権なし）- 著作権料や許可なしで自由に使用可能
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  データソース: <a href="https://github.com/TehShrike/world-english-bible" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TehShrike/world-english-bible (JSONデータ)</a><br />
                  公式サイト: <a href="https://worldenglish.bible/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">worldenglish.bible</a>
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
          </div>
        )}
      </div>
    </div>
  );
}
