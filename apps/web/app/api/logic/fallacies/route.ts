import { NextResponse } from "next/server";
import { loadFallacies } from "@/lib/logic/fallacies";

export async function GET() {
  try {
    const fallacies = loadFallacies();
    return NextResponse.json({ fallacies });
  } catch (error) {
    console.error("Error loading fallacies:", error);
    return NextResponse.json(
      { error: "Failed to load fallacies" },
      { status: 500 }
    );
  }
}
