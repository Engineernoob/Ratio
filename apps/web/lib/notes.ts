import fs from "fs";
import path from "path";

// Re-export types from type-only file
export type { Highlight, Note } from "./notes/types";

const DATA_DIR = path.join(process.cwd(), "data");
const NOTES_DIR = path.join(DATA_DIR, "notes");

/**
 * Ensure notes directory exists
 */
function ensureNotesDir(): void {
  if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
  }
}

/**
 * Get path to notes file for a book
 */
function getNotesFilePath(bookId: string): string {
  ensureNotesDir();
  return path.join(NOTES_DIR, `${bookId}.json`);
}

/**
 * Load all highlights for a book
 */
export function loadHighlights(bookId: string): Highlight[] {
  try {
    const filePath = getNotesFilePath(bookId);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.highlights || [];
    }
  } catch (error) {
    console.error(`Error loading highlights for ${bookId}:`, error);
  }
  return [];
}

/**
 * Save a highlight
 */
export function saveHighlight(
  bookId: string,
  highlight: Omit<Highlight, "id" | "timestamp">
): Highlight {
  try {
    ensureNotesDir();
    const filePath = getNotesFilePath(bookId);

    const highlights = loadHighlights(bookId);

    const newHighlight: Highlight = {
      ...highlight,
      id: `${bookId}-${highlight.pageNumber}-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    highlights.push(newHighlight);

    fs.writeFileSync(
      filePath,
      JSON.stringify({ highlights }, null, 2),
      "utf-8"
    );

    return newHighlight;
  } catch (error) {
    console.error(`Error saving highlight for ${bookId}:`, error);
    throw error;
  }
}

/**
 * Delete a highlight
 */
export function deleteHighlight(bookId: string, highlightId: string): void {
  try {
    const filePath = getNotesFilePath(bookId);
    const highlights = loadHighlights(bookId);

    const filtered = highlights.filter((h) => h.id !== highlightId);

    fs.writeFileSync(
      filePath,
      JSON.stringify({ highlights: filtered }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error(`Error deleting highlight for ${bookId}:`, error);
    throw error;
  }
}

/**
 * Get highlights for a specific page
 */
export function getHighlightsForPage(
  bookId: string,
  pageNumber: number
): Highlight[] {
  const highlights = loadHighlights(bookId);
  return highlights.filter((h) => h.pageNumber === pageNumber);
}
