import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKS_DIR = path.join(DATA_DIR, "books");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter required" },
        { status: 400 }
      );
    }

    const bookDir = path.join(BOOKS_DIR, slug);

    if (!fs.existsSync(bookDir)) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Read all chapter files
    const chapterFiles = fs
      .readdirSync(bookDir)
      .filter((f) => f.startsWith("chapter-") && f.endsWith(".json"))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/\d+/)?.[0] || "0");
        const bNum = parseInt(b.match(/\d+/)?.[0] || "0");
        return aNum - bNum;
      });

    const chapters = [];

    for (const chapterFile of chapterFiles) {
      try {
        const chapterPath = path.join(bookDir, chapterFile);
        const chapterData = fs.readFileSync(chapterPath, "utf-8");
        const chapter = JSON.parse(chapterData);

        chapters.push({
          chapter: chapter.chapter,
          chapter_title: chapter.chapter_title,
          previewText: chapter.previewText || "",
        });
      } catch (error) {
        console.error(`Error reading ${chapterFile}:`, error);
      }
    }

    return NextResponse.json(chapters);
  } catch (error: any) {
    console.error("Error loading chapter previews:", error);
    return NextResponse.json(
      { error: `Failed to load previews: ${error.message}` },
      { status: 500 }
    );
  }
}
