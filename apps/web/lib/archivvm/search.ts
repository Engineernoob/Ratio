import type { ArchivvmItem } from "./types";

/**
 * Simple fuzzy search implementation
 */
export function fuzzySearch(
  items: ArchivvmItem[],
  query: string
): ArchivvmItem[] {
  if (!query.trim()) {
    return items;
  }

  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 0);

  return items.filter((item) => {
    const searchableText = [
      item.text,
      item.summary,
      item.title,
      item.content,
      item.question,
      item.answer,
      item.bookId,
      item.chapterId,
      ...(item.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    // All query words must appear somewhere in the searchable text
    return queryWords.every((word) => searchableText.includes(word));
  });
}

/**
 * Filter items by criteria
 */
export function filterItems(
  items: ArchivvmItem[],
  filters: {
    bookId?: string;
    chapterId?: string;
    type?: string;
    tag?: string;
  }
): ArchivvmItem[] {
  return items.filter((item) => {
    if (filters.bookId && item.bookId !== filters.bookId) {
      return false;
    }
    if (filters.chapterId && item.chapterId !== filters.chapterId) {
      return false;
    }
    if (filters.type && item.type !== filters.type) {
      return false;
    }
    if (filters.tag && !item.tags?.includes(filters.tag)) {
      return false;
    }
    return true;
  });
}

/**
 * Get unique values for filters
 */
export function getUniqueValues(items: ArchivvmItem[]): {
  books: string[];
  chapters: string[];
  types: string[];
  tags: string[];
} {
  const books = new Set<string>();
  const chapters = new Set<string>();
  const types = new Set<string>();
  const tags = new Set<string>();

  for (const item of items) {
    if (item.bookId) books.add(item.bookId);
    if (item.chapterId) chapters.add(item.chapterId);
    if (item.type) types.add(item.type);
    if (item.tags) {
      for (const tag of item.tags) {
        tags.add(tag);
      }
    }
  }

  return {
    books: Array.from(books).sort(),
    chapters: Array.from(chapters).sort(),
    types: Array.from(types).sort(),
    tags: Array.from(tags).sort(),
  };
}
