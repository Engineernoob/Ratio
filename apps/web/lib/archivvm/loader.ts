import type { Highlight } from "@/lib/notes/types";
import type { MemoryCard } from "@/lib/memoria/types";
import type { ArchivvmItem } from "./types";
import { loadCards } from "@/lib/memoria/storage";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const NOTES_DIR = path.join(DATA_DIR, "notes");
const BOOKS_DIR = path.join(DATA_DIR, "books");

/**
 * Load all highlights from all books
 */
function loadAllHighlights(): ArchivvmItem[] {
  const items: ArchivvmItem[] = [];

  try {
    if (!fs.existsSync(NOTES_DIR)) {
      return items;
    }

    const noteFiles = fs.readdirSync(NOTES_DIR);
    for (const file of noteFiles) {
      if (file.endsWith(".json")) {
        const bookId = file.replace(".json", "");
        const filePath = path.join(NOTES_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const highlights: Highlight[] = data.highlights || [];

        for (const highlight of highlights) {
          items.push({
            id: highlight.id,
            type: "highlight",
            bookId,
            chapterId: highlight.chapterId,
            page: highlight.pageNumber,
            text: highlight.text,
            createdAt: highlight.timestamp,
            tags: highlight.tags,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error loading highlights:", error);
  }

  return items;
}

/**
 * Load all memoria cards
 */
function loadAllMemoria(): ArchivvmItem[] {
  const items: ArchivvmItem[] = [];

  try {
    const cards = loadCards();

    for (const card of cards) {
      items.push({
        id: card.id,
        type: "memoria",
        bookId: card.sourceId || "unknown",
        chapterId: card.sourceMetadata?.chapterId as string | undefined,
        page: card.sourceMetadata?.page as number | undefined,
        text: card.content,
        summary: card.title,
        question: card.question,
        answer: card.answer,
        createdAt: card.createdAt,
        tags: card.tags,
        title: card.title,
        content: card.content,
      });
    }
  } catch (error) {
    console.error("Error loading memoria:", error);
  }

  return items;
}

/**
 * Load chapter summaries from all books
 */
function loadAllChapterSummaries(): ArchivvmItem[] {
  const items: ArchivvmItem[] = [];

  try {
    if (!fs.existsSync(BOOKS_DIR)) {
      return items;
    }

    const bookDirs = fs.readdirSync(BOOKS_DIR);
    for (const bookDir of bookDirs) {
      const bookPath = path.join(BOOKS_DIR, bookDir);
      if (!fs.statSync(bookPath).isDirectory()) continue;

      const bookId = bookDir;
      const chapterFiles = fs
        .readdirSync(bookPath)
        .filter((f) => f.startsWith("chapter-") && f.endsWith(".json"));

      for (const chapterFile of chapterFiles) {
        try {
          const chapterPath = path.join(bookPath, chapterFile);
          const chapterData = JSON.parse(fs.readFileSync(chapterPath, "utf-8"));

          const chapterId = chapterFile.replace(".json", "");
          items.push({
            id: `${bookId}-${chapterId}`,
            type: "chapter",
            bookId,
            chapterId,
            summary: chapterData.summary,
            text: chapterData.summary,
            createdAt: new Date().toISOString(), // Chapters don't have timestamps
            tags: [bookId, chapterId],
            title: chapterData.title,
          });
        } catch (error) {
          console.error(`Error loading chapter ${chapterFile}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error loading chapter summaries:", error);
  }

  return items;
}

/**
 * Load all Archivvm items from all sources
 */
export function loadAllArchivvmItems(): ArchivvmItem[] {
  const highlights = loadAllHighlights();
  const memoria = loadAllMemoria();
  const chapters = loadAllChapterSummaries();

  return [...highlights, ...memoria, ...chapters];
}
