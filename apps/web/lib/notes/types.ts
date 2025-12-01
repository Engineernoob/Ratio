/**
 * Notes - Type definitions only
 * This file contains only types/interfaces, no runtime code
 */

export interface Highlight {
  id: string;
  bookId: string;
  chapterId?: string;
  pageNumber: number;
  text: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: string;
  tags?: string[];
}

// Alias for Note (same structure)
export type Note = Highlight;
