import { NextResponse } from "next/server";
import {
  updateUserState,
  getConversationHistory,
  addToConversationHistory,
} from "@/lib/mentor/state";
import { generateResponse, formatResponse } from "@/lib/mentor/engine";
import type {
  MentorPersona,
  MentorMode,
  MentorContext,
  MentorMessage,
} from "@/lib/mentor/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      message,
      persona = "stoic_philosopher",
      mode,
      currentBook,
      currentHighlight,
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Update user state
    const userState = await updateUserState();

    // Get conversation history
    const conversationHistory = getConversationHistory();

    // Create context
    const context: MentorContext = {
      persona: persona as MentorPersona,
      userState,
      currentBook,
      currentHighlight,
      conversationHistory,
    };

    // Add user message to history
    const userMessage: MentorMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
      mode: mode as MentorMode,
    };
    addToConversationHistory(userMessage);

    // Generate response
    const response = await generateResponse(context, message);

    // Format response
    const formattedMessage = formatResponse(response);

    // Create mentor message
    const mentorMessage: MentorMessage = {
      id: `msg-${Date.now()}-mentor`,
      role: "mentor",
      content: formattedMessage,
      timestamp: new Date().toISOString(),
      mode: mode as MentorMode,
      metadata: {
        persona: persona as MentorPersona,
        sources: response.suggestions,
      },
    };

    addToConversationHistory(mentorMessage);

    // Return response
    return NextResponse.json({
      message: formattedMessage,
      suggestions: response.suggestions || [],
      microTest: response.microTest,
      socraticQuestions: response.socraticQuestions,
      improvedArgument: response.improvedArgument,
      fallacyAlert: response.fallacyAlert,
      conversationId: mentorMessage.id,
    });
  } catch (error) {
    console.error("Error in mentor API:", error);
    return NextResponse.json(
      { error: "Failed to generate mentor response" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "history") {
      const history = getConversationHistory();
      return NextResponse.json({ history });
    }

    if (action === "state") {
      const userState = await updateUserState();
      return NextResponse.json({ userState });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in mentor API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
