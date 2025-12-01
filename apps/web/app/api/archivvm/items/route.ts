import { NextResponse } from "next/server";
import { loadAllArchivvmItems } from "@/lib/archivvm/loader";

export async function GET() {
  try {
    const items = loadAllArchivvmItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error loading Archivvm items:", error);
    return NextResponse.json(
      { error: "Failed to load items" },
      { status: 500 }
    );
  }
}
