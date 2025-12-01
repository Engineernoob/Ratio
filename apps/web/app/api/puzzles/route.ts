import { NextResponse } from "next/server";
import { getDailyPuzzle } from "@/lib/puzzles";

export async function GET() {
  try {
    const puzzle = getDailyPuzzle();
    
    if (!puzzle) {
      return NextResponse.json(
        { error: "No puzzles available" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ puzzle });
  } catch (error) {
    console.error("Error in puzzles API:", error);
    return NextResponse.json(
      { error: "Failed to get puzzle" },
      { status: 500 }
    );
  }
}

