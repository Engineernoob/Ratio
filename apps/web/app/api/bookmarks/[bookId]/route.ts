import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKMARKS_DIR = path.join(DATA_DIR, "bookmarks");

interface Bookmark {
  id: string;
  bookId: string;
  chapterId?: string;
  pageNumber: number;
  note?: string;
  timestamp: string;
}

function ensureBookmarksDir(): void {
  if (!fs.existsSync(BOOKMARKS_DIR)) {
    fs.mkdirSync(BOOKMARKS_DIR, { recursive: true });
  }
}

function getBookmarksFilePath(bookId: string): string {
  ensureBookmarksDir();
  return path.join(BOOKMARKS_DIR, `${bookId}.json`);
}

function loadBookmarks(bookId: string): Bookmark[] {
  try {
    const filePath = getBookmarksFilePath(bookId);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.bookmarks || [];
    }
  } catch (error) {
    console.error(`Error loading bookmarks for ${bookId}:`, error);
  }
  return [];
}

function saveBookmarks(bookId: string, bookmarks: Bookmark[]): void {
  try {
    ensureBookmarksDir();
    const filePath = getBookmarksFilePath(bookId);
    fs.writeFileSync(filePath, JSON.stringify({ bookmarks }, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error saving bookmarks for ${bookId}:`, error);
    throw error;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const bookmarks = loadBookmarks(bookId);
    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Error loading bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to load bookmarks" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const body = await request.json();
    const bookmarks = loadBookmarks(bookId);

    const newBookmark: Bookmark = {
      id: `${bookId}-${Date.now()}`,
      bookId: bookId,
      chapterId: body.chapterId,
      pageNumber: body.pageNumber || 1,
      note: body.note,
      timestamp: new Date().toISOString(),
    };

    bookmarks.push(newBookmark);
    saveBookmarks(bookId, bookmarks);

    return NextResponse.json({ bookmark: newBookmark });
  } catch (error) {
    console.error("Error saving bookmark:", error);
    return NextResponse.json(
      { error: "Failed to save bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get("id");

    if (!bookmarkId) {
      return NextResponse.json(
        { error: "Bookmark ID required" },
        { status: 400 }
      );
    }

    const bookmarks = loadBookmarks(bookId);
    const filtered = bookmarks.filter((b) => b.id !== bookmarkId);
    saveBookmarks(bookId, filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
