'use client';

import { useState } from 'react';
import type { Bookmark, ReadingHistory, ReadingPosition } from '@/lib/reading-state';
import { formatTimestamp } from '@/lib/reading-state';

interface ReadingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lastPosition: ReadingPosition | null;
  bookmarks: Bookmark[];
  history: ReadingHistory[];
  onNavigate: (bookId: string, chapter: number, verse?: number) => void;
  onDeleteBookmark: (id: string) => void;
  onClearHistory: () => void;
}

type Tab = 'continue' | 'bookmarks' | 'history';

export function ReadingDrawer({
  isOpen,
  onClose,
  lastPosition,
  bookmarks,
  history,
  onNavigate,
  onDeleteBookmark,
  onClearHistory,
}: ReadingDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('continue');
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleNavigate = (bookId: string, chapter: number, verse?: number) => {
    onNavigate(bookId, chapter, verse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:z-40">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* ドロワー */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">読書メニュー</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('continue')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'continue'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            続きから
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'bookmarks'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            しおり ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            履歴
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'continue' && (
            <div className="p-4">
              {lastPosition ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">前回読んでいた箇所から続けられます</p>
                  <button
                    onClick={() => handleNavigate(lastPosition.bookId, lastPosition.chapter, lastPosition.verse)}
                    className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {lastPosition.bookName} {lastPosition.chapter}章
                          {lastPosition.verse && ` ${lastPosition.verse}節`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTimestamp(lastPosition.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p>まだ読書履歴がありません</p>
                  <p className="text-sm mt-1">聖書を読み始めると、続きから読めるようになります</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="p-4">
              {bookmarks.length > 0 ? (
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <button
                        onClick={() => handleNavigate(bookmark.bookId, bookmark.chapter, bookmark.verse)}
                        className="flex-1 text-left"
                      >
                        <p className="font-medium text-gray-900">
                          {bookmark.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {bookmark.bookName} {bookmark.chapter}章
                          {bookmark.verse && ` ${bookmark.verse}節`}
                        </p>
                        {bookmark.note && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {bookmark.note}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimestamp(bookmark.createdAt)}
                        </p>
                      </button>
                      <button
                        onClick={() => onDeleteBookmark(bookmark.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                        title="削除"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <p>しおりがありません</p>
                  <p className="text-sm mt-1">聖書を読んでいる時に、しおりボタンを押して保存できます</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="p-4">
              {history.length > 0 ? (
                <>
                  <div className="flex justify-end mb-3">
                    {confirmClear ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">履歴を削除しますか？</span>
                        <button
                          onClick={() => {
                            onClearHistory();
                            setConfirmClear(false);
                          }}
                          className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                        >
                          削除
                        </button>
                        <button
                          onClick={() => setConfirmClear(false)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmClear(true)}
                        className="text-sm text-gray-500 hover:text-red-500"
                      >
                        履歴をクリア
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <button
                        key={`${item.bookId}-${item.chapter}-${index}`}
                        onClick={() => handleNavigate(item.bookId, item.chapter)}
                        className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                      >
                        <p className="font-medium text-gray-900">
                          {item.bookName} {item.chapter}章
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTimestamp(item.timestamp)}
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>読書履歴がありません</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
