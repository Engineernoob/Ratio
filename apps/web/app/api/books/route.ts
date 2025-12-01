import { NextResponse } from "next/server";
import { getBookSummaryByTitle, getBookMicroLessonsByBook } from "@/lib/feed";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

interface BookChapter {
  chapter: number;
  chapter_title: string;
  summary: string;
  micro_lessons: any[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const book = searchParams.get("book");
    
    // Handle chapters request
    if (book) {
      const booksDir = path.join(DATA_DIR, "books");
      const bookPath = path.join(booksDir, book);
      
      if (!fs.existsSync(bookPath)) {
        return NextResponse.json(
          { error: "Book not found" },
          { status: 404 }
        );
      }
      
      const chapterFiles = fs.readdirSync(bookPath)
        .filter((f) => f.endsWith(".json"))
        .sort((a, b) => {
          const aNum = parseInt(a.match(/\d+/)?.[0] || "0");
          const bNum = parseInt(b.match(/\d+/)?.[0] || "0");
          return aNum - bNum;
        });
      
      const chapters: BookChapter[] = [];
      for (const chapterFile of chapterFiles) {
        try {
          const data = fs.readFileSync(path.join(bookPath, chapterFile), "utf-8");
          const chapter = JSON.parse(data);
          chapters.push({
            chapter: chapter.chapter,
            chapter_title: chapter.chapter_title,
            summary: chapter.summary,
            micro_lessons: chapter.micro_lessons || [],
          });
        } catch (error) {
          console.error(`Error reading ${chapterFile}:`, error);
        }
      }
      
      return NextResponse.json({ chapters });
    }
    
    // Handle book summary request
    if (title) {
      const summary = getBookSummaryByTitle(title);
      if (!summary) {
        return NextResponse.json(
          { error: "Book not found" },
          { status: 404 }
        );
      }
      
      const bookName = title.toLowerCase().replace(/\s+/g, "-");
      const microLessons = getBookMicroLessonsByBook(bookName);
      
      return NextResponse.json({ 
        summary,
        microLessons 
      });
    }
    
    return NextResponse.json(
      { error: "Title or book parameter required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in books API:", error);
    return NextResponse.json(
      { error: "Failed to get book" },
      { status: 500 }
    );
  }
}
