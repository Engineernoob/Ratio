import { NextResponse } from "next/server";
import { calculateCardReview } from "@/lib/memoria/utils";
import { getCardById, updateCard } from "@/lib/memoria/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cardId, quality } = body;

    if (!cardId || !quality) {
      return NextResponse.json(
        { error: "Missing cardId or quality" },
        { status: 400 }
      );
    }

    const card = getCardById(cardId);
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Calculate review result (client-safe function)
    const updatedCard = calculateCardReview(card, quality);
    
    // Save to storage (server-side only)
    updateCard(updatedCard);

    return NextResponse.json({ card: updatedCard });
  } catch (error) {
    console.error("Error reviewing card:", error);
    return NextResponse.json(
      { error: "Failed to review card" },
      { status: 500 }
    );
  }
}
