import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const OUTPUT_FILE = path.join(DATA_DIR, "feed-items.json");

interface FeedItem {
  id: string;
  type: "external" | "summary" | "chapter-summary" | "micro-lesson";
  source: string;
  difficulty: number;
  priority: number;
  srs_due: string | null;
  chapter?: number;
  title?: string;
  content?: string;
}

function generateFeedItems(): FeedItem[] {
  const items: FeedItem[] = [];

  // 1. TikTok lessons
  try {
    const tiktokFile = path.join(DATA_DIR, "tiktok_lessons.json");
    if (fs.existsSync(tiktokFile)) {
      const data = fs.readFileSync(tiktokFile, "utf-8");
      const tiktok = JSON.parse(data);
      for (const lesson of tiktok.lessons || []) {
        items.push({
          id: lesson.id,
          type: "external",
          source: "tiktok",
          difficulty: 1,
          priority: 0.5,
          srs_due: null,
          title: `${lesson.topic.toUpperCase()}: ${lesson.insight.substring(0, 50)}...`,
          content: lesson.insight
        });
      }
    }
  } catch (error) {
    console.error("Error processing TikTok lessons:", error);
  }

  // 2. Book summaries
  try {
    const summariesDir = path.join(DATA_DIR, "book_summaries");
    if (fs.existsSync(summariesDir)) {
      const files = fs.readdirSync(summariesDir).filter(f => f.endsWith(".json"));
      for (const file of files) {
        try {
          const data = fs.readFileSync(path.join(summariesDir, file), "utf-8");
          const summary = JSON.parse(data);
          const bookName = summary.title.toLowerCase().replace(/\s+/g, "-");
          
          // Add book summary
          items.push({
            id: `${bookName}:summary`,
            type: "summary",
            source: bookName,
            difficulty: 1,
            priority: 1.0,
            srs_due: null,
            title: `${summary.title} by ${summary.author}`,
            content: summary.key_ideas?.[0] || ""
          });
        } catch (error) {
          console.error(`Error processing summary ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error processing book summaries:", error);
  }

  // 3. Book chapters (Meditations and others)
  try {
    const booksDir = path.join(DATA_DIR, "books");
    if (fs.existsSync(booksDir)) {
      const bookDirs = fs.readdirSync(booksDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const bookDir of bookDirs) {
        const bookPath = path.join(booksDir, bookDir);
        const chapterFiles = fs.readdirSync(bookPath)
          .filter(f => f.endsWith(".json"))
          .sort((a, b) => {
            const aNum = parseInt(a.match(/\d+/)?.[0] || "0");
            const bNum = parseInt(b.match(/\d+/)?.[0] || "0");
            return aNum - bNum;
          });

        for (const chapterFile of chapterFiles) {
          try {
            const data = fs.readFileSync(path.join(bookPath, chapterFile), "utf-8");
            const chapter = JSON.parse(data);
            const chapterNum = chapter.chapter;

            // Add chapter summary
            items.push({
              id: `${bookDir}:chapter:${chapterNum}:summary`,
              type: "chapter-summary",
              source: bookDir,
              chapter: chapterNum,
              difficulty: 1,
              priority: 0.9,
              srs_due: null,
              title: `Chapter ${chapterNum}: ${chapter.chapter_title}`,
              content: chapter.summary
            });

            // Add micro-lessons from chapter
            if (chapter.micro_lessons && Array.isArray(chapter.micro_lessons)) {
              chapter.micro_lessons.forEach((micro: any, index: number) => {
                items.push({
                  id: `${bookDir}:chapter:${chapterNum}:micro:${index}`,
                  type: "micro-lesson",
                  source: bookDir,
                  chapter: chapterNum,
                  difficulty: 1,
                  priority: 0.7,
                  srs_due: null,
                  title: micro.title,
                  content: micro.core_idea
                });
              });
            }
          } catch (error) {
            console.error(`Error processing chapter ${chapterFile}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error processing book chapters:", error);
  }

  // 4. Lessons from lessons.json (if exists)
  try {
    const lessonsFile = path.join(DATA_DIR, "lessons.json");
    if (fs.existsSync(lessonsFile)) {
      const data = fs.readFileSync(lessonsFile, "utf-8");
      const lessons = JSON.parse(data);
      for (const lesson of lessons.lessons || []) {
        items.push({
          id: lesson.id,
          type: "external",
          source: "lessons",
          difficulty: 1,
          priority: 0.6,
          srs_due: null,
          title: lesson.title,
          content: lesson.explanation
        });
      }
    }
  } catch (error) {
    console.error("Error processing lessons:", error);
  }

  return items;
}

// Generate and save
const feedItems = generateFeedItems();
fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify({ items: feedItems }, null, 2),
  "utf-8"
);

console.log(`Generated ${feedItems.length} feed items in ${OUTPUT_FILE}`);

