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
    const chaptersManifestPath = path.join(bookDir, "chapters.json");

    if (!fs.existsSync(chaptersManifestPath)) {
      return NextResponse.json(
        { error: "Chapters manifest not found" },
        { status: 404 }
      );
    }

    const manifestData = fs.readFileSync(chaptersManifestPath, "utf-8");
    const manifest = JSON.parse(manifestData);

    return NextResponse.json(manifest);
  } catch (error: any) {
    console.error("Error loading chapters manifest:", error);
    return NextResponse.json(
      { error: `Failed to load manifest: ${error.message}` },
      { status: 500 }
    );
  }
}
