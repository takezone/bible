// 読書状態管理ユーティリティ
// localStorage を使用して読書位置、しおり、履歴を保存

export interface ReadingPosition {
  bookId: string;
  bookName: string;
  chapter: number;
  verse?: number;
  timestamp: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse?: number;
  title: string;
  note?: string;
  createdAt: number;
}

export interface ReadingHistory {
  bookId: string;
  bookName: string;
  chapter: number;
  timestamp: number;
}

const STORAGE_KEYS = {
  LAST_POSITION: 'bible-one-last-position',
  BOOKMARKS: 'bible-one-bookmarks',
  HISTORY: 'bible-one-history',
};

const MAX_HISTORY_ITEMS = 50;

// ストレージが利用可能かチェック
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// === 最後に読んだ位置 ===

export function saveLastPosition(position: Omit<ReadingPosition, 'timestamp'>): void {
  if (!isStorageAvailable()) return;

  const data: ReadingPosition = {
    ...position,
    timestamp: Date.now(),
  };

  localStorage.setItem(STORAGE_KEYS.LAST_POSITION, JSON.stringify(data));

  // 履歴にも追加
  addToHistory({
    bookId: position.bookId,
    bookName: position.bookName,
    chapter: position.chapter,
  });
}

export function getLastPosition(): ReadingPosition | null {
  if (!isStorageAvailable()) return null;

  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_POSITION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// === しおり機能 ===

export function getBookmarks(): Bookmark[] {
  if (!isStorageAvailable()) return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
  if (!isStorageAvailable()) {
    throw new Error('Storage not available');
  }

  const bookmarks = getBookmarks();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };

  bookmarks.unshift(newBookmark);
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));

  return newBookmark;
}

export function updateBookmark(id: string, updates: Partial<Pick<Bookmark, 'title' | 'note'>>): void {
  if (!isStorageAvailable()) return;

  const bookmarks = getBookmarks();
  const index = bookmarks.findIndex(b => b.id === id);

  if (index !== -1) {
    bookmarks[index] = { ...bookmarks[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(id: string): void {
  if (!isStorageAvailable()) return;

  const bookmarks = getBookmarks().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
}

export function isBookmarked(bookId: string, chapter: number, verse?: number): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b =>
    b.bookId === bookId &&
    b.chapter === chapter &&
    (verse === undefined || b.verse === verse)
  );
}

// === 読書履歴 ===

export function getHistory(): ReadingHistory[] {
  if (!isStorageAvailable()) return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function addToHistory(entry: Omit<ReadingHistory, 'timestamp'>): void {
  if (!isStorageAvailable()) return;

  let history = getHistory();

  // 同じ書籍・章の重複を削除
  history = history.filter(h =>
    !(h.bookId === entry.bookId && h.chapter === entry.chapter)
  );

  // 新しいエントリを先頭に追加
  history.unshift({
    ...entry,
    timestamp: Date.now(),
  });

  // 最大件数を超えたら古いものを削除
  if (history.length > MAX_HISTORY_ITEMS) {
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }

  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (!isStorageAvailable()) return;
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

// === 便利な関数 ===

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'たった今';
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;

  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
  });
}
