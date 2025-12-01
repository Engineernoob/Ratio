import { NextResponse } from "next/server";

type AIToolAction = "explain" | "summarize" | "expand" | "memoria";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, text, bookId, chapterId } = body;

    if (!action || !text) {
      return NextResponse.json(
        { error: "Action and text are required" },
        { status: 400 }
      );
    }

    // Build prompt based on action
    let prompt = "";
    switch (action as AIToolAction) {
      case "explain":
        prompt = `Explain the following paragraph in detail:\n\n"${text}"`;
        break;
      case "summarize":
        prompt = `Summarize this chapter:\n\n"${text}"`;
        break;
      case "expand":
        prompt = `Expand on this idea and provide additional context:\n\n"${text}"`;
        break;
      case "memoria":
        prompt = `Create a Memoria flashcard from this content:\n\n"${text}"\n\nFormat as: Question: ... Answer: ...`;
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Call Mentor API (placeholder - replace with actual API endpoint)
    // For now, return a mock response
    const mockResponse = `This is a mock response for ${action}. The actual Mentor API integration would process: "${text.substring(
      0,
      100
    )}..."`;

    return NextResponse.json({
      response: mockResponse,
      action,
      bookId,
      chapterId,
    });
  } catch (error) {
    console.error("Error in Mentor API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
