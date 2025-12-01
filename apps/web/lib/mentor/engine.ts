/**
 * Ratio AI Mentor - Conversational Engine
 * Handles conversation flow, mode detection, and response generation
 */

import type {
  MentorPersona,
  MentorMode,
  MentorContext,
  MentorMessage,
  MentorResponse,
} from "./types";
import { buildPersonaPrompt } from "./persona";
import { getConversationHistory } from "./state";

/**
 * Detect the mode/intent from user message
 */
export function detectMode(message: string): MentorMode {
  const lower = message.toLowerCase();

  if (
    lower.includes("explain") ||
    lower.includes("what is") ||
    lower.includes("tell me about")
  ) {
    return "explain";
  }

  if (
    lower.includes("strengthen") ||
    lower.includes("improve") ||
    lower.includes("better argument")
  ) {
    return "strengthen_argument";
  }

  if (lower.includes("highlight") || lower.includes("this text")) {
    return "explain_highlight";
  }

  if (
    lower.includes("test") ||
    lower.includes("quiz") ||
    lower.includes("challenge me")
  ) {
    return "test_me";
  }

  if (
    lower.includes("lesson") ||
    lower.includes("teach") ||
    lower.includes("micro-lesson")
  ) {
    return "micro_lesson";
  }

  if (
    lower.includes("socratic") ||
    lower.includes("question") ||
    lower.includes("ask me")
  ) {
    return "socratic_questions";
  }

  return "general";
}

/**
 * Generate mentor response
 * In production, this would call an LLM API (OpenAI, Anthropic, etc.)
 * For now, we'll create structured responses based on the context
 */
export async function generateResponse(
  context: MentorContext,
  userMessage: string
): Promise<MentorResponse> {
  const mode = detectMode(userMessage);
  const persona = context.persona;
  const userState = context.userState;

  // Build the prompt
  const systemPrompt = buildPersonaPrompt(persona, userState, mode, {
    currentBook: context.currentBook,
    currentHighlight: context.currentHighlight,
  });

  // In production, this would be an LLM call:
  // const response = await callLLM(systemPrompt, userMessage, conversationHistory);

  // For now, generate a structured response based on mode and persona
  const response = generateStructuredResponse(
    persona,
    mode,
    userMessage,
    userState,
    context
  );

  return response;
}

/**
 * Generate structured response (placeholder for LLM integration)
 */
function generateStructuredResponse(
  persona: MentorPersona,
  mode: MentorMode,
  userMessage: string,
  userState: any,
  context: MentorContext
): MentorResponse {
  const response: MentorResponse = {
    message: "",
    suggestions: [],
  };

  // Base message based on persona and mode
  switch (mode) {
    case "explain":
      response.message = generateExplanation(persona, userMessage, userState);
      response.suggestions = [
        "Test me on this",
        "Give me a micro-lesson",
        "Ask Socratic questions",
      ];
      break;

    case "strengthen_argument":
      response.message = generateArgumentStrengthening(persona, userMessage);
      response.improvedArgument = {
        original: userMessage,
        improved: generateImprovedArgument(userMessage),
        reasoning:
          "The improved version uses stronger premises and avoids common fallacies.",
      };
      response.suggestions = ["Explain the improvements", "Test my reasoning"];
      break;

    case "test_me":
      response.message = generateTestIntro(persona);
      response.microTest = generateMicroTest(userState);
      response.suggestions = ["Explain the answer", "Give me another test"];
      break;

    case "micro_lesson":
      response.message = generateMicroLessonIntro(persona);
      response.microTest = generateMicroTest(userState);
      response.suggestions = ["Test me", "Explain more"];
      break;

    case "socratic_questions":
      response.message = generateSocraticIntro(persona);
      response.socraticQuestions = generateSocraticQuestions(userState);
      response.suggestions = ["Answer these", "Explain my thinking"];
      break;

    case "explain_highlight":
      if (context.currentHighlight) {
        response.message = generateHighlightExplanation(
          persona,
          context.currentHighlight.text
        );
      }
      response.suggestions = ["Test me on this", "Related concepts"];
      break;

    default:
      response.message = generateGeneralResponse(
        persona,
        userMessage,
        userState
      );
      response.suggestions = [
        "Explain this",
        "Test me",
        "Strengthen my reasoning",
        "Give me a micro-lesson",
      ];
  }

  // Add fallacy alert if relevant
  if (userState.fallacyErrors.length > 0) {
    const topFallacy = userState.fallacyErrors.sort(
      (a: any, b: any) => b.count - a.count
    )[0];
    response.fallacyAlert = {
      type: topFallacy.type,
      description: getFallacyDescription(topFallacy.type),
      example: getFallacyExample(topFallacy.type),
    };
  }

  return response;
}

// Response generators (in production, these would be LLM-generated)

function generateExplanation(
  persona: MentorPersona,
  query: string,
  userState: any
): string {
  const personaStyles: Record<MentorPersona, string> = {
    classical_orator: `Discipulus, allow me to elucidate this matter with the clarity befitting our pursuit of wisdom.`,
    stoic_philosopher: `Let us examine this with the calm reason that guides all understanding.`,
    elite_tutor: `Let me break this down into clear, methodical steps.`,
    kind_mentor: `I'd be happy to explain this! Let's work through it together.`,
    harsh_drillmaster: `Pay attention. Here's how it works, and you'd better remember it.`,
    socratic_questioner: `Before I explain, what do you already understand about this?`,
    cognitive_scientist: `From a cognitive science perspective, this involves several key mechanisms.`,
  };

  return `${personaStyles[persona]}\n\n[This would be a detailed explanation generated by an LLM based on the query and user's weak areas.]`;
}

function generateArgumentStrengthening(
  persona: MentorPersona,
  argument: string
): string {
  return `Let me help you strengthen this argument. I notice a few areas where we can improve the logical structure and avoid potential fallacies.`;
}

function generateImprovedArgument(original: string): string {
  return `[Improved version of the argument with stronger premises and clearer logic]`;
}

function generateTestIntro(persona: MentorPersona): string {
  const intros: Record<MentorPersona, string> = {
    classical_orator: `Very well, discipulus. Let us test your understanding.`,
    stoic_philosopher: `A test of knowledge is also a test of character.`,
    elite_tutor: `Time to assess your mastery. Answer carefully.`,
    kind_mentor: `Let's see how well you understand this! Don't worry, it's okay to make mistakes.`,
    harsh_drillmaster: `Test time. No excuses.`,
    socratic_questioner: `Let me ask you a question to probe your understanding.`,
    cognitive_scientist: `Retrieval practice is one of the most effective learning techniques. Let's test your recall.`,
  };
  return intros[persona];
}

function generateMicroTest(userState: any): {
  question: string;
  answer: string;
  explanation: string;
} {
  // Generate test based on weak topics
  const weakTopic = userState.weakTopics[0] || "logic";

  return {
    question: `Explain the concept of ${weakTopic} and provide an example.`,
    answer: `[Answer would be generated based on the topic]`,
    explanation: `[Detailed explanation of why this answer is correct and how it relates to your studies]`,
  };
}

function generateMicroLessonIntro(persona: MentorPersona): string {
  return `Let me create a focused micro-lesson for you. This will take about 2-3 minutes.`;
}

function generateSocraticIntro(persona: MentorPersona): string {
  return `Rather than give you answers, let me ask you questions that will help you discover the truth yourself.`;
}

function generateSocraticQuestions(userState: any): string[] {
  return [
    "What do you mean by that?",
    "How do you know that to be true?",
    "What evidence supports this?",
    "What would someone who disagrees say?",
    "What are the implications of this?",
  ];
}

function generateHighlightExplanation(
  persona: MentorPersona,
  text: string
): string {
  return `This highlighted passage is significant because... [Explanation would be generated by LLM]`;
}

function generateGeneralResponse(
  persona: MentorPersona,
  message: string,
  userState: any
): string {
  const responses: Record<MentorPersona, string> = {
    classical_orator: `Discipulus, I understand your query. Let me address it with the wisdom of the ancients.`,
    stoic_philosopher: `Let us consider this matter with reason and virtue.`,
    elite_tutor: `I'll help you understand this systematically.`,
    kind_mentor: `I'm here to help! Let's work through this together.`,
    harsh_drillmaster: `Clear question. Here's the answer. Learn it.`,
    socratic_questioner: `That's an interesting point. What makes you think that?`,
    cognitive_scientist: `From a learning science perspective, this relates to several important principles.`,
  };
  return responses[persona];
}

function getFallacyDescription(type: string): string {
  const descriptions: Record<string, string> = {
    ad_hominem: "Attacking the person instead of the argument",
    straw_man: "Misrepresenting someone's argument to make it easier to attack",
    false_dilemma: "Presenting only two options when more exist",
    hasty_generalization: "Drawing conclusions from insufficient evidence",
    appeal_to_authority: "Using authority as evidence when it's not relevant",
  };
  return descriptions[type] || "A logical error in reasoning";
}

function getFallacyExample(type: string): string {
  const examples: Record<string, string> = {
    ad_hominem: "You can't trust his argument because he's not educated.",
    straw_man: "You want to raise taxes? So you want to destroy the economy!",
    false_dilemma: "Either you're with us or against us.",
    hasty_generalization:
      "I met two rude people from that city, so everyone there must be rude.",
    appeal_to_authority: "Einstein believed in God, so God must exist.",
  };
  return examples[type] || "Example of this fallacy";
}

/**
 * Format response for display
 */
export function formatResponse(response: MentorResponse): string {
  let formatted = response.message;

  if (response.microTest) {
    formatted += `\n\n**Question:** ${response.microTest.question}\n\n**Answer:** ${response.microTest.answer}\n\n**Explanation:** ${response.microTest.explanation}`;
  }

  if (response.socraticQuestions && response.socraticQuestions.length > 0) {
    formatted += `\n\n**Questions for Reflection:**\n${response.socraticQuestions
      .map((q, i) => `${i + 1}. ${q}`)
      .join("\n")}`;
  }

  if (response.improvedArgument) {
    formatted += `\n\n**Original:** ${response.improvedArgument.original}\n\n**Improved:** ${response.improvedArgument.improved}\n\n**Reasoning:** ${response.improvedArgument.reasoning}`;
  }

  if (response.fallacyAlert) {
    formatted += `\n\n⚠️ **Fallacy Alert:** ${response.fallacyAlert.type}\n${response.fallacyAlert.description}\n\nExample: ${response.fallacyAlert.example}`;
  }

  return formatted;
}
