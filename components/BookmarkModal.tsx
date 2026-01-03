'use client';

import { useState } from 'react';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, note?: string) => void;
  bookName: string;
  chapter: number;
  verse?: number;
}

export function BookmarkModal({
  isOpen,
  onClose,
  onSave,
  bookName,
  chapter,
  verse,
}: BookmarkModalProps) {
  const defaultTitle = `${bookName} ${chapter}章${verse ? ` ${verse}節` : ''}`;
  const [title, setTitle] = useState(defaultTitle);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(title || defaultTitle, note || undefined);
    setTitle(defaultTitle);
    setNote('');
    onClose();
  };

  const handleClose = () => {
    setTitle(defaultTitle);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* モーダル */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">しおりを追加</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                箇所
              </label>
              <p className="text-gray-900">
                {bookName} {chapter}章{verse && ` ${verse}節`}
              </p>
            </div>

            <div>
              <label htmlFor="bookmark-title" className="block text-sm font-medium text-gray-700 mb-1">
                タイトル
              </label>
              <input
                id="bookmark-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={defaultTitle}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="bookmark-note" className="block text-sm font-medium text-gray-700 mb-1">
                メモ（任意）
              </label>
              <textarea
                id="bookmark-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="このしおりについてのメモ..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
