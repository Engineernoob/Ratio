import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PUBLIC_BOOKS_DIR = path.join(process.cwd(), "public", "books");

export async function GET() {
  try {
    const books: any[] = [];

    if (!fs.existsSync(PUBLIC_BOOKS_DIR)) {
      return NextResponse.json({ books: [] });
    }

    const bookDirs = fs
      .readdirSync(PUBLIC_BOOKS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const bookDir of bookDirs) {
      const metaPath = path.join(PUBLIC_BOOKS_DIR, bookDir, "meta.json");
      if (fs.existsSync(metaPath)) {
        try {
          const metaContent = fs.readFileSync(metaPath, "utf-8");
          const meta = JSON.parse(metaContent);
          books.push(meta);
        } catch (error) {
          console.error(`Error reading meta.json for ${bookDir}:`, error);
        }
      }
    }

    return NextResponse.json({ books });
  } catch (error: any) {
    console.error("Error loading books:", error);
    return NextResponse.json(
      { error: `Failed to load books: ${error.message}` },
      { status: 500 }
    );
  }
}
