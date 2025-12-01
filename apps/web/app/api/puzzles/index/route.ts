import { NextResponse } from "next/server";
import { getAllPuzzles, getDailyChallengeId } from "@/lib/puzzles/loader";

export async function GET() {
  try {
    const puzzles = getAllPuzzles();
    const dailyChallengeId = getDailyChallengeId();
    return NextResponse.json({ puzzles, dailyChallengeId });
  } catch (error) {
    console.error("Error loading puzzles:", error);
    return NextResponse.json(
      { error: "Failed to load puzzles" },
      { status: 500 }
    );
  }
}
