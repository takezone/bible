export interface Verse {
  verse: number;
  text: string;
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
    year: string;
  };
}

export type Translation = 'kougo' | 'kjv' | 'web' | 'bungo';

export interface BibleReference {
  bookId: string;
  chapter: number;
  verse?: number;
}
