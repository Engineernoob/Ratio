import { NextResponse } from "next/server";
import { getAllCards } from "@/lib/memoria/storage";

export async function GET() {
  try {
    const cards = getAllCards();
    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Error loading memoria cards:", error);
    return NextResponse.json(
      { error: "Failed to load cards" },
      { status: 500 }
    );
  }
}
