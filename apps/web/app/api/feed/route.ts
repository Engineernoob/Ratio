import { NextResponse } from "next/server";
import { getDailyFeed, getAllTikTokLessons, getAllBookSummaries } from "@/lib/feed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    
    const feed = await getDailyFeed(date);
    
    return NextResponse.json({ feed });
  } catch (error) {
    console.error("Error in feed API:", error);
    return NextResponse.json(
      { error: "Failed to get feed" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const summaries = getAllBookSummaries();
    const tiktokLessons = getAllTikTokLessons();
    
    return NextResponse.json({ 
      summaries,
      tiktokLessons 
    });
  } catch (error) {
    console.error("Error in feed API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

