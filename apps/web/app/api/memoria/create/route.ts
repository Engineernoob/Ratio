import { NextResponse } from "next/server";
import { createCard } from "@/lib/memoria/storage";
import { initializeCard } from "@/lib/memoria/review";
import type { CreateMemoryCardInput } from "@/lib/memoria/types";

export async function POST(request: Request) {
  try {
    const body: CreateMemoryCardInput = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.source) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, source" },
        { status: 400 }
      );
    }

    // Generate ID
    const id = `memoria-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Initialize card
    const card = initializeCard({
      id,
      title: body.title,
      content: body.content,
      question: body.question,
      answer: body.answer,
      source: body.source,
      sourceId: body.sourceId,
      sourceMetadata: body.sourceMetadata,
      tags: body.tags,
    });

    // Save to storage
    const createdCard = createCard(card);

    return NextResponse.json({ card: createdCard }, { status: 201 });
  } catch (error) {
    console.error("Error creating memory card:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to create memory card" },
      { status: 500 }
    );
  }
}
