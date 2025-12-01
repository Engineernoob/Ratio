import { NextResponse } from "next/server";
import { loadHighlights, saveHighlight, type Highlight } from "@/lib/notes";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const body = await request.json();

    // Create a note as a highlight with special tag
    const note: Omit<Highlight, "id" | "timestamp"> = {
      bookId: bookId,
      chapterId: body.chapterId,
      pageNumber: body.pageNumber || 1,
      text: body.text,
      bounds: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      tags: [
        "note",
        ...(body.selectionId ? [`highlight:${body.selectionId}`] : []),
      ],
    };

    const savedNote = saveHighlight(bookId, note);
    return NextResponse.json({ note: savedNote });
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
