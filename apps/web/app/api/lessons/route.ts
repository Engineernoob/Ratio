import { NextResponse } from "next/server";
import { generateDailyLesson, getTodayLesson } from "@/lib/lessons";

export async function GET() {
  try {
    let lesson = getTodayLesson();
    
    if (!lesson) {
      lesson = generateDailyLesson();
    }
    
    return NextResponse.json({ lesson });
  } catch (error) {
    console.error("Error in lessons API:", error);
    return NextResponse.json(
      { error: "Failed to get lesson" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const lesson = generateDailyLesson();
    return NextResponse.json({ lesson });
  } catch (error) {
    console.error("Error generating lesson:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson" },
      { status: 500 }
    );
  }
}

