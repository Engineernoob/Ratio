import { NextResponse } from "next/server";
import { getAllCards } from "@/lib/memoria/storage";
import { getDueCards } from "@/lib/memoria/review";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Load all cards
    const allCards = getAllCards();

    // Get due cards
    const dueCards = getDueCards(allCards, date);

    return NextResponse.json({
      due: dueCards,
      total: dueCards.length,
      date,
    });
  } catch (error) {
    console.error("Error getting due cards:", error);
    return NextResponse.json(
      { error: "Failed to get due cards" },
      { status: 500 }
    );
  }
}
