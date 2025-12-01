import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FEED_ASSIGNMENTS_FILE = path.join(DATA_DIR, "feed-assignments.json");

export async function GET() {
  try {
    if (fs.existsSync(FEED_ASSIGNMENTS_FILE)) {
      const data = fs.readFileSync(FEED_ASSIGNMENTS_FILE, "utf-8");
      const assignments = JSON.parse(data);
      return NextResponse.json({ assignments: assignments.assignments || {} });
    }
    return NextResponse.json({ assignments: {} });
  } catch (error) {
    console.error("Error loading feed assignments:", error);
    return NextResponse.json(
      { error: "Failed to load assignments" },
      { status: 500 }
    );
  }
}
