import { NextResponse } from "next/server";
import { getDueReviews, addToMemoria, updateReview, getAllConcepts } from "@/lib/memoria";

export async function GET() {
  try {
    const reviews = getDueReviews();
    const allConcepts = getAllConcepts();
    
    return NextResponse.json({ 
      dueReviews: reviews,
      allConcepts: allConcepts
    });
  } catch (error) {
    console.error("Error in memoria API:", error);
    return NextResponse.json(
      { error: "Failed to get reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, concept, conceptId, result } = body;

    if (action === "add") {
      if (!concept) {
        return NextResponse.json(
          { error: "Concept data required" },
          { status: 400 }
        );
      }
      const newConcept = addToMemoria(concept);
      return NextResponse.json({ concept: newConcept });
    }

    if (action === "update") {
      if (!conceptId || !result) {
        return NextResponse.json(
          { error: "conceptId and result required" },
          { status: 400 }
        );
      }
      const updated = updateReview(conceptId, result);
      if (!updated) {
        return NextResponse.json(
          { error: "Concept not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ concept: updated });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in memoria API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

