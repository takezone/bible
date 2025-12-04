export interface Verse {
  verse: number;
  text: string;
  ruby?: string; // ルビ（発音/トランスリテレーション）
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  shortName: string;
  chapters: Chapter[];
}

export interface BibleData {
  books: Book[];
  metadata: {
    translation: string;
    language: string;
    year?: string;
    source?: string;
    license?: string;
    hasRuby?: boolean;
    rubyType?: string;
    translationShort?: string;
  };
}

export type Translation = 'kougo' | 'kjv' | 'web' | 'bungo' | 'greek' | 'luther';

export interface BibleReference {
  bookId: string;
  chapter: number;
  verse?: number;
}
