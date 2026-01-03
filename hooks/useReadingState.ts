'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ReadingPosition,
  Bookmark,
  ReadingHistory,
  getLastPosition,
  saveLastPosition,
  getBookmarks,
  addBookmark,
  removeBookmark,
  updateBookmark,
  getHistory,
  clearHistory,
  isBookmarked as checkIsBookmarked,
} from '@/lib/reading-state';

export function useReadingState() {
  const [lastPosition, setLastPosition] = useState<ReadingPosition | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初期読み込み
  useEffect(() => {
    setLastPosition(getLastPosition());
    setBookmarks(getBookmarks());
    setHistory(getHistory());
    setIsLoaded(true);
  }, []);

  // 読書位置を保存
  const savePosition = useCallback((position: Omit<ReadingPosition, 'timestamp'>) => {
    saveLastPosition(position);
    setLastPosition({ ...position, timestamp: Date.now() });
    // 履歴も更新
    setHistory(getHistory());
  }, []);

  // しおりを追加
  const addNewBookmark = useCallback((bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark = addBookmark(bookmark);
    setBookmarks(getBookmarks());
    return newBookmark;
  }, []);

  // しおりを削除
  const deleteBookmark = useCallback((id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  }, []);

  // しおりを更新
  const editBookmark = useCallback((id: string, updates: Partial<Pick<Bookmark, 'title' | 'note'>>) => {
    updateBookmark(id, updates);
    setBookmarks(getBookmarks());
  }, []);

  // しおり済みかチェック
  const isBookmarked = useCallback((bookId: string, chapter: number, verse?: number) => {
    return checkIsBookmarked(bookId, chapter, verse);
  }, []);

  // 履歴をクリア
  const clearReadingHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return {
    lastPosition,
    bookmarks,
    history,
    isLoaded,
    savePosition,
    addBookmark: addNewBookmark,
    deleteBookmark,
    editBookmark,
    isBookmarked,
    clearHistory: clearReadingHistory,
  };
}
