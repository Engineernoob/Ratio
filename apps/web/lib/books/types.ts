/**
 * Books - Type definitions only
 * This file contains only types/interfaces, no runtime code
 */

export interface BookChapterRef {
  id: string;
  title: string;
  file: string;
  pageStart?: number;
  pageEnd?: number;
}

export interface BookSpine {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BookManifest {
  id: string;
  title: string;
  author: string;
  chapters: BookChapterRef[];
  bookSpine: BookSpine;
  pdf?: string;
}

export interface ChapterContent {
  title: string;
  summary: string;
  keyIdeas: string[];
  examples: string[];
  exercises: string[];
  reflections: string[];
}
