import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
// Dynamic import for pdf-parse to avoid bundling issues
const pdfParse = require("pdf-parse");

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKS_DIR = path.join(DATA_DIR, "books");

interface Chapter {
  id: string;
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

interface ChapterMetadata {
  chapter: number;
  chapter_title: string;
  summary: string;
  keyIdeas: string[];
  examples: string[];
  insights: string[];
  memoriaQuestions: string[];
  microLessons: Array<{
    title: string;
    core_idea: string;
    micro_test_q: string;
    micro_test_a: string;
  }>;
  reflectionPrompts: string[];
  previewText: string;
}

interface ChaptersManifest {
  chapterCount: number;
  titles: string[];
  estimatedReadingTime: number; // in minutes
  difficultyScore: number; // 1-10
}

interface IngestionLog {
  startedAt: string;
  completedAt: string;
  bookTitle: string;
  bookAuthor: string;
  category: string;
  slug: string;
  chaptersProcessed: number;
  totalWords: number;
  status: "success" | "error";
  error?: string;
}

/**
 * Normalize text: clean whitespace, fix hyphens, etc.
 */
function normalizeText(text: string): string {
  // Fix line breaks and excessive whitespace
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\r/g, "\n");

  // Fix hyphenated words split across lines
  text = text.replace(/(\w+)-\s*\n\s*(\w+)/g, "$1$2");

  // Normalize multiple spaces to single space
  text = text.replace(/[ \t]+/g, " ");

  // Normalize multiple newlines to double newline (paragraph breaks)
  text = text.replace(/\n{3,}/g, "\n\n");

  // Remove leading/trailing whitespace from lines
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  // Clean up any remaining issues
  text = text.replace(/\s+/g, " ");
  text = text.replace(/\n\s*\n/g, "\n\n");

  return text.trim();
}

/**
 * Detect chapter boundaries using various patterns
 */
function detectChapters(text: string): Chapter[] {
  const chapters: Chapter[] = [];
  const patterns = [
    // CHAPTER X or Chapter X
    /^(?:CHAPTER|Chapter)\s+([IVXLC]+|\d+)[\s:\.\-]*(.+?)$/gim,
    // I. II. III. (Roman numerals)
    /^([IVXLC]+)\.\s+(.+?)$/gim,
    // Part I / Part II
    /^Part\s+([IVXLC]+|\d+)[\s:\.\-]*(.+?)$/gim,
    // Book I / Book II
    /^Book\s+([IVXLC]+|\d+)[\s:\.\-]*(.+?)$/gim,
  ];

  const matches: Array<{ index: number; title: string; number: string }> = [];

  // Find all matches
  for (const pattern of patterns) {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        index: match.index,
        title: match[2] || match[1] || "Untitled",
        number: match[1] || String(matches.length + 1),
      });
    }
  }

  // Sort by index and remove duplicates (within 50 chars)
  matches.sort((a, b) => a.index - b.index);
  const uniqueMatches: typeof matches = [];
  for (const match of matches) {
    const lastMatch = uniqueMatches[uniqueMatches.length - 1];
    if (!lastMatch || match.index - lastMatch.index > 50) {
      uniqueMatches.push(match);
    }
  }

  // Create chapter objects
  for (let i = 0; i < uniqueMatches.length; i++) {
    const match = uniqueMatches[i];
    const nextMatch = uniqueMatches[i + 1];

    const startIndex = match.index;
    const endIndex = nextMatch ? nextMatch.index : text.length;

    chapters.push({
      id: `chapter-${i + 1}`,
      title: match.title.trim() || `Chapter ${i + 1}`,
      content: text.substring(startIndex, endIndex).trim(),
      startIndex,
      endIndex,
    });
  }

  // If no chapters detected, treat entire text as one chapter
  if (chapters.length === 0) {
    chapters.push({
      id: "chapter-1",
      title: "Chapter 1",
      content: text,
      startIndex: 0,
      endIndex: text.length,
    });
  }

  return chapters;
}

/**
 * Clean chapter content
 */
function cleanChapterContent(content: string): string {
  // Remove chapter header if present
  content = content.replace(
    /^(?:CHAPTER|Chapter|Part|Book)\s+[IVXLC\d]+[:\s\.\-]*/gim,
    ""
  );

  // Clean up whitespace
  content = normalizeText(content);

  // Remove excessive blank lines
  content = content.replace(/\n{4,}/g, "\n\n\n");

  return content.trim();
}

/**
 * Estimate reading time (words per minute = 200)
 */
function estimateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

/**
 * Calculate difficulty score based on text characteristics
 */
function calculateDifficultyScore(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  const avgWordLength =
    words.reduce((sum, w) => sum + w.length, 0) / Math.max(words.length, 1);

  // Simple heuristic: longer words and sentences = higher difficulty
  let score = 5; // Base score

  if (avgWordsPerSentence > 20) score += 2;
  else if (avgWordsPerSentence > 15) score += 1;

  if (avgWordLength > 5.5) score += 2;
  else if (avgWordLength > 5) score += 1;

  return Math.min(Math.max(score, 1), 10);
}

/**
 * Generate chapter content using simple extraction (in production, use AI)
 */
async function generateChapterContent(
  chapterTitle: string,
  chapterContent: string,
  chapterNumber: number
): Promise<ChapterMetadata> {
  // Extract preview text (first 300 words)
  const words = chapterContent.split(/\s+/);
  const previewText =
    words.slice(0, 300).join(" ") + (words.length > 300 ? "..." : "");

  // Simple extraction-based approach (in production, use AI/LLM)
  const sentences = chapterContent
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 20);

  // Extract key ideas (longer sentences that seem important)
  const keyIdeas = sentences
    .filter((s) => s.length > 50 && s.length < 200)
    .slice(0, 8)
    .map((s) => s.trim());

  // Extract examples (sentences with "for example", "such as", etc.)
  const examples = sentences
    .filter((s) => /(for example|such as|like|including)/i.test(s))
    .slice(0, 5)
    .map((s) => s.trim());

  // Generate insights (longer, reflective sentences)
  const insights = sentences
    .filter((s) => s.length > 80)
    .slice(0, 5)
    .map((s) => s.trim());

  // Generate summary (first few sentences or a combination)
  const summary = sentences.slice(0, 3).join(" ").substring(0, 500) + "...";

  // Generate memoria questions (based on key ideas)
  const memoriaQuestions = keyIdeas.slice(0, 5).map((idea, idx) => {
    // Extract a question from the idea or create one
    const questionMatch = idea.match(
      /(?:what|how|why|when|where|who)\s+[^.]*[?]/i
    );
    if (questionMatch) {
      return questionMatch[0];
    }
    // Create a question from the idea
    return `What is the significance of: ${idea.substring(0, 100)}?`;
  });

  // Generate micro-lessons (1-2 per chapter)
  const microLessons = keyIdeas.slice(0, 2).map((idea, idx) => {
    const words = idea.split(/\s+/);
    const coreIdea = words.slice(0, 20).join(" ") + "...";
    return {
      title: `${chapterTitle} - Key Concept ${idx + 1}`,
      core_idea: coreIdea,
      micro_test_q: `What is the main idea about ${chapterTitle}?`,
      micro_test_a: coreIdea,
    };
  });

  // Generate reflection prompts
  const reflectionPrompts = [
    `How does ${chapterTitle} relate to your current understanding?`,
    `What practical applications can you find for the ideas in ${chapterTitle}?`,
    `What questions does ${chapterTitle} raise for you?`,
  ];

  return {
    chapter: chapterNumber,
    chapter_title: chapterTitle,
    summary,
    keyIdeas:
      keyIdeas.length > 0
        ? keyIdeas
        : [chapterContent.substring(0, 200) + "..."],
    examples: examples.length > 0 ? examples : [],
    insights: insights.length > 0 ? insights : [],
    memoriaQuestions:
      memoriaQuestions.length > 0
        ? memoriaQuestions
        : [
            `What are the main points of ${chapterTitle}?`,
            `How can you apply the concepts from ${chapterTitle}?`,
          ],
    microLessons,
    reflectionPrompts,
    previewText,
  };
}

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = (formData.get("category") as string) || "";

    if (!file || !title || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const bookDir = path.join(BOOKS_DIR, slug);

    // Create book directory
    if (!fs.existsSync(bookDir)) {
      fs.mkdirSync(bookDir, { recursive: true });
    }

    const log: IngestionLog = {
      startedAt: new Date().toISOString(),
      completedAt: "",
      bookTitle: title,
      bookAuthor: author,
      category,
      slug,
      chaptersProcessed: 0,
      totalWords: 0,
      status: "success",
    };

    try {
      // Read PDF buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text from PDF
      const pdfData = await pdfParse(buffer);
      let text = pdfData.text;

      // Normalize text
      text = normalizeText(text);
      log.totalWords = text.split(/\s+/).length;

      // Detect chapters
      const chapters = detectChapters(text);

      // Process each chapter
      const chapterMetadata: ChapterMetadata[] = [];
      const chaptersManifest: ChaptersManifest = {
        chapterCount: chapters.length,
        titles: [],
        estimatedReadingTime: 0,
        difficultyScore: 0,
      };

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        const cleanedContent = cleanChapterContent(chapter.content);

        // Generate chapter content
        const metadata = await generateChapterContent(
          chapter.title,
          cleanedContent,
          i + 1
        );

        chapterMetadata.push(metadata);
        chaptersManifest.titles.push(chapter.title);

        // Calculate reading time and difficulty
        const wordCount = cleanedContent.split(/\s+/).length;
        chaptersManifest.estimatedReadingTime += estimateReadingTime(wordCount);
        chaptersManifest.difficultyScore +=
          calculateDifficultyScore(cleanedContent);

        // Save chapter JSON
        const chapterFileName = `chapter-${i + 1}.json`;
        const chapterPath = path.join(bookDir, chapterFileName);

        // Format chapter data to match ChapterContent interface
        // Also include additional fields for compatibility with other formats
        const chapterData = {
          title: metadata.chapter_title,
          summary: metadata.summary,
          keyIdeas: metadata.keyIdeas,
          examples: metadata.examples,
          exercises: metadata.memoriaQuestions, // Map memoria questions to exercises
          reflections: metadata.reflectionPrompts,
          // Additional fields for compatibility
          chapter: metadata.chapter,
          chapter_title: metadata.chapter_title,
          insights: metadata.insights,
          memoriaQuestions: metadata.memoriaQuestions,
          micro_lessons: metadata.microLessons,
          reflectionPrompts: metadata.reflectionPrompts,
          previewText: metadata.previewText,
        };

        fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2));
      }

      // Calculate average difficulty
      chaptersManifest.difficultyScore = Math.round(
        chaptersManifest.difficultyScore / chapters.length
      );

      // Save chapters manifest
      const chaptersManifestPath = path.join(bookDir, "chapters.json");
      fs.writeFileSync(
        chaptersManifestPath,
        JSON.stringify(chaptersManifest, null, 2)
      );

      // Create book manifest
      const bookManifest = {
        id: slug,
        title,
        author,
        category: category || undefined,
        chapters: chapters.map((ch, idx) => ({
          id: ch.id,
          title: ch.title,
          file: `chapter-${idx + 1}.json`,
        })),
        bookSpine: {
          x: 100 + (chapters.length % 10) * 40,
          y: 100 + Math.floor(chapters.length / 10) * 120,
          width: 32,
          height: 240,
        },
      };

      const bookManifestPath = path.join(bookDir, "book.json");
      fs.writeFileSync(bookManifestPath, JSON.stringify(bookManifest, null, 2));

      // Update ingestion log
      log.completedAt = new Date().toISOString();
      log.chaptersProcessed = chapters.length;
      log.status = "success";

      // Save log
      const logPath = path.join(bookDir, "log.json");
      fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

      // Update bookshelf map
      const bookshelfMapPath = path.join(DATA_DIR, "bookshelf-map.json");
      let bookshelfMap: {
        books: Array<{
          id: string;
          title: string;
          x: number;
          y: number;
          width: number;
          height: number;
        }>;
      } = { books: [] };

      if (fs.existsSync(bookshelfMapPath)) {
        const mapData = fs.readFileSync(bookshelfMapPath, "utf-8");
        bookshelfMap = JSON.parse(mapData);
      }

      // Check if book already exists
      const existingIndex = bookshelfMap.books.findIndex((b) => b.id === slug);
      if (existingIndex >= 0) {
        bookshelfMap.books[existingIndex] = {
          id: slug,
          title,
          x: bookManifest.bookSpine.x,
          y: bookManifest.bookSpine.y,
          width: bookManifest.bookSpine.width,
          height: bookManifest.bookSpine.height,
        };
      } else {
        bookshelfMap.books.push({
          id: slug,
          title,
          x: bookManifest.bookSpine.x,
          y: bookManifest.bookSpine.y,
          width: bookManifest.bookSpine.width,
          height: bookManifest.bookSpine.height,
        });
      }

      fs.writeFileSync(bookshelfMapPath, JSON.stringify(bookshelfMap, null, 2));

      // Also update public bookshelf map if it exists
      const publicBookshelfMapPath = path.join(
        process.cwd(),
        "public",
        "bookshelf-map.json"
      );
      if (fs.existsSync(publicBookshelfMapPath)) {
        fs.writeFileSync(
          publicBookshelfMapPath,
          JSON.stringify(bookshelfMap, null, 2)
        );
      }

      return NextResponse.json({
        success: true,
        slug,
        chaptersProcessed: chapters.length,
        message: "Book ingested successfully",
      });
    } catch (error: any) {
      log.completedAt = new Date().toISOString();
      log.status = "error";
      log.error = error.message;

      const logPath = path.join(bookDir, "log.json");
      if (fs.existsSync(bookDir)) {
        fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
      }

      console.error("Ingestion error:", error);
      return NextResponse.json(
        { error: `Ingestion failed: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
