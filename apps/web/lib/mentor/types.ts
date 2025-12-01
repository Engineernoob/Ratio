/**
 * Ratio AI Mentor - Type Definitions
 */

export type MentorPersona =
  | "classical_orator"
  | "stoic_philosopher"
  | "elite_tutor"
  | "kind_mentor"
  | "harsh_drillmaster"
  | "socratic_questioner"
  | "cognitive_scientist";

export type MentorMode =
  | "explain"
  | "strengthen_argument"
  | "explain_highlight"
  | "test_me"
  | "micro_lesson"
  | "socratic_questions"
  | "general";

export interface MentorMessage {
  id: string;
  role: "user" | "mentor";
  content: string;
  timestamp: string;
  mode?: MentorMode;
  metadata?: {
    persona?: MentorPersona;
    sources?: string[];
    relatedCards?: string[];
  };
}

export interface UserState {
  weakTopics: string[];
  toughMemoriaItems: Array<{
    id: string;
    title: string;
    ease: number;
    errorCount: number;
  }>;
  failedPuzzles: Array<{
    id: string;
    type: string;
    error: string;
    attempts: number;
  }>;
  fallacyErrors: Array<{
    type: string;
    context: string;
    count: number;
  }>;
  booksInProgress: Array<{
    id: string;
    title: string;
    progress: number;
    lastChapter: string;
  }>;
  logicMapErrors: Array<{
    type: string;
    description: string;
    count: number;
  }>;
  metrics: {
    memoriaAccuracy: number;
    reasoningAccuracy: number;
    bookProgress: number;
    dailyStreak: number;
    learningVelocity: number;
  };
}

export interface MentorContext {
  persona: MentorPersona;
  userState: UserState;
  currentBook?: {
    id: string;
    title: string;
    chapter?: string;
  };
  currentHighlight?: {
    text: string;
    bookId: string;
    page?: number;
  };
  conversationHistory: MentorMessage[];
}

export interface MentorResponse {
  message: string;
  suggestions?: string[];
  microTest?: {
    question: string;
    answer: string;
    explanation: string;
  };
  socraticQuestions?: string[];
  improvedArgument?: {
    original: string;
    improved: string;
    reasoning: string;
  };
  fallacyAlert?: {
    type: string;
    description: string;
    example: string;
  };
}
