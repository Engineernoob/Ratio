import { NextResponse } from "next/server";
import { createCard } from "@/lib/memoria/storage";
import { initializeCard } from "@/lib/memoria/review";
import type { MemorySource } from "@/lib/memoria/types";

interface SyncRequest {
  bookId: string;
  chapterId?: string;
  page: number;
  text: string;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    const body: SyncRequest = await request.json();

    // Validate required fields
    if (!body.bookId || !body.page || !body.text || !body.createdAt) {
      return NextResponse.json(
        { error: "Missing required fields: bookId, page, text, createdAt" },
        { status: 400 }
      );
    }

    // Generate ID
    const id = `memoria-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Calculate due date (1 day from now)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toISOString().split("T")[0];

    // Create memory card
    const card = initializeCard({
      id,
      title: `Highlight from ${body.bookId}`,
      content: body.text,
      question: `What does this mean? → ${body.text}`,
      answer: body.text,
      source: "bibliotheca" as MemorySource,
      sourceId: body.bookId,
      sourceMetadata: {
        chapterId: body.chapterId,
        page: body.page,
        createdAt: body.createdAt,
      },
      tags: body.chapterId ? [body.chapterId] : undefined,
    });

    // Override due date to be tomorrow (1 day from now)
    const cardWithDue = {
      ...card,
      due: dueDate,
      interval: 1, // Set initial interval to 1 day
    };

    // Save to storage
    const createdCard = createCard(cardWithDue);

    return NextResponse.json({ card: createdCard }, { status: 201 });
  } catch (error) {
    console.error("Error syncing to memoria:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to sync to memoria" },
      { status: 500 }
    );
  }
}
