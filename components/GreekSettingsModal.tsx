'use client';

import type { LearningLevel } from '@/types/greek';

interface GreekSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: LearningLevel;
  onLevelChange: (level: LearningLevel) => void;
}

export function GreekSettingsModal({
  isOpen,
  onClose,
  level,
  onLevelChange
}: GreekSettingsModalProps) {
  if (!isOpen) return null;

  const levels: { value: LearningLevel; label: string; description: string }[] = [
    { value: 'beginner', label: '初級', description: 'カタカナ音写と日本語の意味を表示' },
    { value: 'intermediate', label: '中級', description: 'ローマ字音写と品詞を表示' },
    { value: 'advanced', label: '上級', description: 'ギリシャ語テキストのみ表示' }
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            学習設定
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">学習レベル</h3>
            <div className="space-y-2">
              {levels.map(l => (
                <button
                  key={l.value}
                  onClick={() => onLevelChange(l.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    level === l.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{l.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{l.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="p-4 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
