import { NextResponse } from "next/server";
import { getBookManifest, getChapter } from "@/lib/books";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "manifest") {
      const manifest = getBookManifest(bookId);
      if (!manifest) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
      return NextResponse.json({ manifest });
    }

    if (action === "chapter") {
      const fileName = searchParams.get("file");
      if (!fileName) {
        return NextResponse.json(
          { error: "Chapter file name required" },
          { status: 400 }
        );
      }

      const chapter = getChapter(bookId, fileName);
      if (!chapter) {
        return NextResponse.json(
          { error: "Chapter not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ chapter });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'manifest' or 'chapter'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in books API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
