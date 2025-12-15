'use client';

import Link from 'next/link';

export default function GreekGuidePage() {
  const guides = [
    {
      href: '/greek/guide/alphabet',
      title: 'ギリシャ語アルファベット',
      description: '24文字のギリシャ文字と発音を学ぶ',
      icon: 'Αα',
      color: 'bg-blue-500',
      difficulty: '入門',
    },
    {
      href: '/greek/guide/grammar',
      title: '文法の基礎知識',
      description: '格変化・動詞活用などの文法用語を理解する',
      icon: '📝',
      color: 'bg-green-500',
      difficulty: '基礎',
    },
    {
      href: '/greek/guide/tips',
      title: '学習のコツ',
      description: '効率的にギリシャ語を学ぶためのアドバイス',
      icon: '💡',
      color: 'bg-yellow-500',
      difficulty: '全般',
    },
    {
      href: '/greek/guide/john-intro',
      title: '実践：ヨハネ1章を読む',
      description: '福音書の冒頭を実際に読みながら学ぶ',
      icon: '📖',
      color: 'bg-purple-500',
      difficulty: '実践',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/greek" className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">ギリシャ語学習ガイド</h1>
              <p className="text-blue-200">新約聖書を原語で読むための基礎知識</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* イントロダクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">はじめに</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            新約聖書は紀元1世紀にコイネー・ギリシャ語（共通ギリシャ語）で書かれました。
            原語で聖書を読むことで、翻訳では伝わりにくいニュアンスや、
            著者が選んだ言葉の深い意味を直接味わうことができます。
          </p>
          <p className="text-gray-700 leading-relaxed">
            このガイドでは、ギリシャ語の基礎から実践的な読解まで、
            段階的に学んでいきます。完璧を目指す必要はありません。
            少しずつ原語に触れることで、聖書の理解が深まっていくでしょう。
          </p>
        </div>

        {/* ガイド一覧 */}
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 flex gap-4"
            >
              <div className={`${guide.color} text-white w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold flex-shrink-0`}>
                {guide.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{guide.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {guide.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{guide.description}</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* 学習の進め方 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-bold text-blue-900 mb-3">学習の進め方</h2>
          <ol className="space-y-2 text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>まずアルファベットを覚えて、文字が読めるようになりましょう</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>文法用語を理解して、品詞分析の見方を学びましょう</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>学習のコツを参考に、効率的な学習方法を身につけましょう</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>ヨハネ福音書で実践！実際の聖句を読んでみましょう</span>
            </li>
          </ol>
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <Link
            href="/greek"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>学習モードで実践する</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
