import fs from "fs";
import path from "path";

// Re-export types from type-only file
export type {
  BookChapterRef,
  BookSpine,
  BookManifest,
  ChapterContent,
} from "./books/types";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKS_DIR = path.join(DATA_DIR, "books");

/**
 * Load book manifest from /data/books/{bookId}/book.json
 */
export function getBookManifest(bookId: string): BookManifest | null {
  try {
    const bookDir = path.join(BOOKS_DIR, bookId);
    const manifestPath = path.join(bookDir, "book.json");

    if (!fs.existsSync(manifestPath)) {
      console.error(`Book manifest not found: ${manifestPath}`);
      return null;
    }

    const data = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(data) as BookManifest;

    // Validate required fields
    if (
      !manifest.id ||
      !manifest.title ||
      !manifest.author ||
      !manifest.chapters ||
      !manifest.bookSpine
    ) {
      console.error(`Invalid book manifest structure for ${bookId}`);
      return null;
    }

    // Validate bookSpine structure
    const { bookSpine } = manifest;
    if (
      typeof bookSpine.x !== "number" ||
      typeof bookSpine.y !== "number" ||
      typeof bookSpine.width !== "number" ||
      typeof bookSpine.height !== "number"
    ) {
      console.error(`Invalid bookSpine structure for ${bookId}`);
      return null;
    }

    // Validate chapters structure
    if (!Array.isArray(manifest.chapters)) {
      console.error(`Invalid chapters array for ${bookId}`);
      return null;
    }

    for (const chapter of manifest.chapters) {
      if (!chapter.id || !chapter.title || !chapter.file) {
        console.error(`Invalid chapter structure in ${bookId}`);
        return null;
      }
    }

    return manifest;
  } catch (error) {
    console.error(`Error loading book manifest for ${bookId}:`, error);
    return null;
  }
}

/**
 * Load chapter JSON content from /data/books/{bookId}/{fileName}
 */
export function getChapter(
  bookId: string,
  fileName: string
): ChapterContent | null {
  try {
    const bookDir = path.join(BOOKS_DIR, bookId);
    const chapterPath = path.join(bookDir, fileName);

    if (!fs.existsSync(chapterPath)) {
      console.error(`Chapter file not found: ${chapterPath}`);
      return null;
    }

    const data = fs.readFileSync(chapterPath, "utf-8");
    const chapter = JSON.parse(data) as ChapterContent;

    // Validate required fields - be flexible with different chapter formats
    // Accept either the AtomicHabits format (title, summary, keyIdeas, etc.)
    // or the Meditations format (chapter, chapter_title, summary, micro_lessons, content)
    const hasAtomicHabitsFormat =
      chapter.title &&
      chapter.summary &&
      Array.isArray(chapter.keyIdeas) &&
      Array.isArray(chapter.examples) &&
      Array.isArray(chapter.exercises) &&
      Array.isArray(chapter.reflections);

    const hasMeditationsFormat =
      (chapter.chapter || chapter.chapter_title) &&
      chapter.summary &&
      (chapter.content || chapter.text || Array.isArray(chapter.micro_lessons));

    if (!hasAtomicHabitsFormat && !hasMeditationsFormat) {
      // Still return the chapter if it has basic content
      if (chapter.content || chapter.text || chapter.summary) {
        return chapter;
      }
      console.error(`Invalid chapter structure: ${fileName}`);
      return null;
    }

    return chapter;
  } catch (error) {
    console.error(`Error loading chapter ${fileName} for ${bookId}:`, error);
    return null;
  }
}

/**
 * Get all available book IDs
 */
export function getAllBookIds(): string[] {
  try {
    if (!fs.existsSync(BOOKS_DIR)) {
      return [];
    }

    const entries = fs.readdirSync(BOOKS_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    console.error("Error reading books directory:", error);
    return [];
  }
}
