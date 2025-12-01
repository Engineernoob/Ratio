import fs from "fs";
import path from "path";

// Core FeedItem interface matching registry structure
export interface FeedItem {
  id: string;
  type: string;
  source: string;
  difficulty: number;
  priority: number;
  chapter?: number;
  srs_due?: string | null;
  title?: string;
  content?: string;
}

// UI FeedItem interface (for API responses)
export interface UIFeedItem {
  id: string;
  type: "tiktok" | "book_summary" | "book_micro" | "puzzle";
  title: string;
  content: string;
  example?: string;
  micro_test_q?: string;
  micro_test_a?: string;
  source?: string;
  date_assigned: string;
}

export interface FeedAssignment {
  id: string;
  type: "external" | "summary" | "chapter-summary" | "micro-lesson";
  source: string;
  difficulty: number;
  priority: number;
  srs_due: string | null;
  chapter?: number;
}

// Legacy interfaces for backward compatibility
export interface TikTokLesson {
  id: string;
  topic: string;
  insight: string;
  example?: string;
}

export interface BookSummary {
  title: string;
  author: string;
  year?: number;
  key_ideas: string[];
  micro_lessons?: MicroLesson[];
}

export interface MicroLesson {
  id: string;
  title: string;
  core_idea: string;
  micro_test_q: string;
  micro_test_a: string;
}

export interface BookChapter {
  chapter: number;
  chapter_title: string;
  summary: string;
  micro_lessons: MicroLesson[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const FEED_ITEMS_FILE = path.join(DATA_DIR, "feed-items.json");
const FEED_ASSIGNMENTS_FILE = path.join(DATA_DIR, "feed-assignments.json");

// Load feed items registry
let FEED_ITEMS: FeedItem[] | null = null;

function loadFeedItems(): FeedItem[] {
  if (FEED_ITEMS) {
    return FEED_ITEMS;
  }

  try {
    if (fs.existsSync(FEED_ITEMS_FILE)) {
      const data = fs.readFileSync(FEED_ITEMS_FILE, "utf-8");
      const registry = JSON.parse(data);
      FEED_ITEMS = (registry.items || []) as FeedItem[];
      return FEED_ITEMS;
    }
  } catch (error) {
    console.error("Error loading feed items:", error);
  }

  FEED_ITEMS = [];
  return FEED_ITEMS;
}

function loadAssignments(): Record<string, (string | FeedAssignment)[]> {
  try {
    if (fs.existsSync(FEED_ASSIGNMENTS_FILE)) {
      const data = fs.readFileSync(FEED_ASSIGNMENTS_FILE, "utf-8");
      return JSON.parse(data).assignments || {};
    }
  } catch (error) {
    console.error("Error loading assignments:", error);
  }
  return {};
}

function normalizeAssignment(assignment: string | FeedAssignment): FeedAssignment {
  if (typeof assignment === "string") {
    return {
      id: assignment,
      type: "external",
      source: "legacy",
      difficulty: 1,
      priority: 0.5,
      srs_due: null,
    };
  }
  return assignment;
}

export function getAssignmentsForDate(date: string): FeedAssignment[] {
  const assignments = loadAssignments();
  const dateAssignments = assignments[date] || [];
  return dateAssignments.map(normalizeAssignment);
}

export function resolveFeedItem(id: string): FeedItem | null {
  const items = loadFeedItems();
  return items.find((item) => item.id === id) || null;
}

export function getSRSItemsDue(date: string): FeedItem[] {
  const items = loadFeedItems();
  return items.filter(
    (item) => item.srs_due && item.srs_due <= date
  );
}

export function getSRSItemsDueAsUI(date: string): UIFeedItem[] {
  const items = getSRSItemsDue(date);
  return items
    .map((item) => convertToUIFeedItem(item, date))
    .filter((item): item is UIFeedItem => item !== null);
}

export function getNextMeditationsItem(): FeedItem | null {
  const items = loadFeedItems();
  const meditationsItems = items
    .filter((item) => item.source === "meditations" && item.type === "micro-lesson")
    .sort((a, b) => {
      // Sort by chapter, then by micro index
      const aChapter = a.chapter || 0;
      const bChapter = b.chapter || 0;
      if (aChapter !== bChapter) {
        return aChapter - bChapter;
      }
      // Extract micro index from ID (meditations:chapter:X:micro:Y)
      const aMatch = a.id.match(/micro:(\d+)$/);
      const bMatch = b.id.match(/micro:(\d+)$/);
      const aIndex = aMatch ? parseInt(aMatch[1]) : 0;
      const bIndex = bMatch ? parseInt(bMatch[1]) : 0;
      return aIndex - bIndex;
    });

  // Find the first item that hasn't been assigned recently
  // For now, return the first item (can be enhanced with assignment tracking)
  return meditationsItems[0] || null;
}

export function getRandomFeedItems(count: number): FeedItem[] {
  const items = loadFeedItems();
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getMaxChapterFromAssignments(): number {
  const assignments = loadAssignments();
  let maxChapter = 0;

  for (const date in assignments) {
    for (const assignment of assignments[date]) {
      const normalized = normalizeAssignment(assignment);
      if (normalized.source === "meditations" && normalized.chapter) {
        maxChapter = Math.max(maxChapter, normalized.chapter);
      }
    }
  }

  return maxChapter;
}

function getNextUnreadMeditationsChapter(): number {
  const maxChapter = getMaxChapterFromAssignments();
  const items = loadFeedItems();
  const meditationsChapters = new Set(
    items
      .filter((item) => item.source === "meditations" && item.chapter)
      .map((item) => item.chapter!)
  );

  // Find next chapter after maxChapter
  for (let chapter = maxChapter + 1; chapter <= 12; chapter++) {
    if (meditationsChapters.has(chapter)) {
      return chapter;
    }
  }

  // If all chapters read, return first chapter for review
  return 1;
}

function convertToUIFeedItem(registryItem: FeedItem, date: string): UIFeedItem | null {
  // Map registry type to UI type
  let uiType: "tiktok" | "book_summary" | "book_micro" | "puzzle" = "tiktok";
  
  if (registryItem.source === "tiktok" || registryItem.type === "external") {
    uiType = "tiktok";
  } else if (registryItem.type === "summary") {
    uiType = "book_summary";
  } else if (registryItem.type === "micro-lesson" || registryItem.type === "chapter-summary") {
    uiType = "book_micro";
  }

  // For micro-lessons, we need to fetch the full data from chapter files
  let micro_test_q: string | undefined;
  let micro_test_a: string | undefined;
  let example: string | undefined;

  if (registryItem.id.startsWith("meditations:chapter:") && registryItem.id.includes(":micro:")) {
    // Extract chapter and micro index
    const match = registryItem.id.match(/meditations:chapter:(\d+):micro:(\d+)/);
    if (match) {
      const chapterNum = parseInt(match[1]);
      const microIndex = parseInt(match[2]);
      try {
        const chapterPath = path.join(DATA_DIR, "books", "meditations", `chapter-${chapterNum}.json`);
        if (fs.existsSync(chapterPath)) {
          const data = fs.readFileSync(chapterPath, "utf-8");
          const chapter: BookChapter = JSON.parse(data);
          if (chapter.micro_lessons && chapter.micro_lessons[microIndex]) {
            const micro = chapter.micro_lessons[microIndex];
            micro_test_q = micro.micro_test_q;
            micro_test_a = micro.micro_test_a;
          }
        }
      } catch (error) {
        console.error(`Error loading micro-lesson data:`, error);
      }
    }
  } else if (registryItem.id.startsWith("tiktok-")) {
    // Get example from TikTok lessons
    try {
      const tiktokFile = path.join(DATA_DIR, "tiktok_lessons.json");
      if (fs.existsSync(tiktokFile)) {
        const data = fs.readFileSync(tiktokFile, "utf-8");
        const tiktok = JSON.parse(data);
        const lesson = tiktok.lessons?.find((l: TikTokLesson) => l.id === registryItem.id);
        if (lesson) {
          example = lesson.example;
        }
      }
    } catch (error) {
      console.error("Error loading TikTok example:", error);
    }
  }

  return {
    id: registryItem.id,
    type: uiType,
    title: registryItem.title || "Feed Item",
    content: registryItem.content || "",
    example,
    micro_test_q,
    micro_test_a,
    source: registryItem.source,
    date_assigned: date,
  };
}

export async function getDailyFeed(date: string): Promise<UIFeedItem[]> {
  const items = loadFeedItems();
  const assignments = getAssignmentsForDate(date);
  const selectedItems: FeedItem[] = [];
  const selectedIds = new Set<string>();

  // Step 1: Add items from today's assignments
  for (const assignment of assignments) {
    const item = resolveFeedItem(assignment.id);
    if (item && !selectedIds.has(item.id)) {
      selectedItems.push(item);
      selectedIds.add(item.id);
    }
  }

  // Step 2: Add SRS items due today or overdue (highest priority)
  const srsItems = getSRSItemsDue(date);
  for (const item of srsItems) {
    if (!selectedIds.has(item.id)) {
      selectedItems.push(item);
      selectedIds.add(item.id);
    }
  }

  // Step 3: Add high-priority items (priority >= 0.8)
  const highPriorityItems = items
    .filter(
      (item) =>
        !selectedIds.has(item.id) &&
        item.priority >= 0.8 &&
        (!item.srs_due || item.srs_due > date)
    )
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);

  for (const item of highPriorityItems) {
    selectedItems.push(item);
    selectedIds.add(item.id);
  }

  // Step 4: Add chapter progression - next unread Meditations chapter
  const nextChapter = getNextUnreadMeditationsChapter();
  const chapterItems = items
    .filter(
      (item) =>
        !selectedIds.has(item.id) &&
        item.source === "meditations" &&
        item.chapter === nextChapter &&
        item.type === "micro-lesson"
    )
    .sort((a, b) => {
      // Sort by micro index
      const aMatch = a.id.match(/micro:(\d+)$/);
      const bMatch = b.id.match(/micro:(\d+)$/);
      const aIndex = aMatch ? parseInt(aMatch[1]) : 0;
      const bIndex = bMatch ? parseInt(bMatch[1]) : 0;
      return aIndex - bIndex;
    })
    .slice(0, 2); // Add 2 micro-lessons from next chapter

  for (const item of chapterItems) {
    selectedItems.push(item);
    selectedIds.add(item.id);
  }

  // Step 5: Add random items for variety (1-2 items)
  const remainingSlots = Math.max(0, 12 - selectedItems.length);
  if (remainingSlots > 0) {
    const randomItems = getRandomFeedItems(remainingSlots).filter(
      (item) => !selectedIds.has(item.id)
    );
    for (const item of randomItems) {
      selectedItems.push(item);
      selectedIds.add(item.id);
    }
  }

  // Step 6: Sort final feed
  selectedItems.sort((a, b) => {
    // First: priority DESC
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Second: difficulty ASC
    if (a.difficulty !== b.difficulty) {
      return a.difficulty - b.difficulty;
    }
    // Third: chapter ASC (if same source)
    if (a.source === b.source && a.chapter && b.chapter) {
      return a.chapter - b.chapter;
    }
    return 0;
  });

  // Step 7: Ensure minimum 5 items, maximum 12 items
  const finalItems = selectedItems.slice(0, 12);
  
  if (finalItems.length < 5) {
    // Fill with random items if needed
    const additionalItems = getRandomFeedItems(5 - finalItems.length).filter(
      (item) => !finalItems.find((fi) => fi.id === item.id)
    );
    finalItems.push(...additionalItems);
  }

  // Convert to UI format
  const uiItems = finalItems
    .map((item) => convertToUIFeedItem(item, date))
    .filter((item): item is UIFeedItem => item !== null);

  return uiItems;
}

// Legacy exports for backward compatibility
export function getAllTikTokLessons(): TikTokLesson[] {
  try {
    const tiktokFile = path.join(DATA_DIR, "tiktok_lessons.json");
    if (fs.existsSync(tiktokFile)) {
      const data = fs.readFileSync(tiktokFile, "utf-8");
      return JSON.parse(data).lessons || [];
    }
  } catch (error) {
    console.error("Error reading TikTok lessons:", error);
  }
  return [];
}

export function getAllBookSummaries(): BookSummary[] {
  try {
    const summariesDir = path.join(DATA_DIR, "book_summaries");
    if (!fs.existsSync(summariesDir)) return [];

    const files = fs.readdirSync(summariesDir).filter((f) => f.endsWith(".json"));
    const summaries: BookSummary[] = [];

    for (const file of files) {
      try {
        const data = fs.readFileSync(path.join(summariesDir, file), "utf-8");
        summaries.push(JSON.parse(data));
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    }

    return summaries;
  } catch (error) {
    console.error("Error reading book summaries:", error);
    return [];
  }
}

export function getBookSummaryByTitle(title: string): BookSummary | null {
  const summaries = getAllBookSummaries();
  return (
    summaries.find((s) => s.title.toLowerCase() === title.toLowerCase()) || null
  );
}

export function getBookMicroLessonsByBook(bookName: string): MicroLesson[] {
  try {
    const booksDir = path.join(DATA_DIR, "books");
    if (!fs.existsSync(booksDir)) return [];

    const bookPath = path.join(booksDir, bookName);
    if (!fs.existsSync(bookPath)) return [];

    const microLessons: MicroLesson[] = [];
    const chapterFiles = fs.readdirSync(bookPath).filter((f) =>
      f.endsWith(".json")
    );

    for (const chapterFile of chapterFiles) {
      try {
        const data = fs.readFileSync(
          path.join(bookPath, chapterFile),
          "utf-8"
        );
        const chapter: BookChapter = JSON.parse(data);
        if (chapter.micro_lessons) {
          microLessons.push(...chapter.micro_lessons);
        }
      } catch (error) {
        console.error(`Error reading ${chapterFile}:`, error);
      }
    }

    return microLessons;
  } catch (error) {
    console.error("Error reading book micro-lessons:", error);
    return [];
  }
}
