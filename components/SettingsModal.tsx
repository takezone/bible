'use client';

import type { Translation } from '@/types/bible';
import type { FontSize } from './ChapterViewer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;

  // 表示モード
  displayMode: 'single' | 'parallel';
  onDisplayModeChange: (mode: 'single' | 'parallel') => void;

  // 翻訳設定
  singleTranslation: Translation;
  leftTranslation: Translation;
  rightTranslation: Translation;
  onSingleTranslationChange: (translation: Translation) => void;
  onLeftTranslationChange: (translation: Translation) => void;
  onRightTranslationChange: (translation: Translation) => void;

  // フォントサイズ
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  displayMode,
  onDisplayModeChange,
  singleTranslation,
  leftTranslation,
  rightTranslation,
  onSingleTranslationChange,
  onLeftTranslationChange,
  onRightTranslationChange,
  fontSize,
  onFontSizeChange
}: SettingsModalProps) {
  if (!isOpen) return null;

  const translations: { value: Translation; label: string }[] = [
    { value: 'kougo', label: '口語訳' },
    { value: 'kjv', label: 'King James Version (KJV)' },
    { value: 'web', label: 'New Heart English Bible (WEB)' }
  ];

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'sm', label: '小' },
    { value: 'lg', label: '大' },
    { value: 'xl', label: '特大' }
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            設定
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
        <div className="p-6 space-y-6">
          {/* 表示モード */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">表示モード</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onDisplayModeChange('single')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  displayMode === 'single'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📖</div>
                  <div className="font-semibold text-gray-900">単体表示</div>
                  <div className="text-sm text-gray-600 mt-1">1つの翻訳を表示</div>
                </div>
              </button>
              <button
                onClick={() => onDisplayModeChange('parallel')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  displayMode === 'parallel'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-semibold text-gray-900">並列表示</div>
                  <div className="text-sm text-gray-600 mt-1">2つの翻訳を比較</div>
                </div>
              </button>
            </div>
          </div>

          {/* 翻訳選択 */}
          {displayMode === 'single' ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">翻訳</h3>
              <select
                value={singleTranslation}
                onChange={(e) => onSingleTranslationChange(e.target.value as Translation)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {translations.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">左側の翻訳</h3>
                <select
                  value={leftTranslation}
                  onChange={(e) => onLeftTranslationChange(e.target.value as Translation)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {translations.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">右側の翻訳</h3>
                <select
                  value={rightTranslation}
                  onChange={(e) => onRightTranslationChange(e.target.value as Translation)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {translations.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* フォントサイズ */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">文字サイズ</h3>
            <div className="grid grid-cols-3 gap-3">
              {fontSizes.map(fs => (
                <button
                  key={fs.value}
                  onClick={() => onFontSizeChange(fs.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    fontSize === fs.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`font-bold ${
                      fs.value === 'sm' ? 'text-base' :
                      fs.value === 'lg' ? 'text-xl' :
                      'text-2xl'
                    }`}>
                      A
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{fs.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="p-6 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
