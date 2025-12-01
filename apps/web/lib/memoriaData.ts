export interface ReviewItem {
  id: string;
  title: string;
  description: string;
  origo: string;
  tags: string[];
  dueNow: boolean;
  singleTabula: boolean;
  interrogatum: string;
  responsumRevelatum: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  memoryStrength: "FIRMVS" | "MEDIVS" | "DEBILIS";
  source: string;
  dateAdded: string;
}

export interface ArchivumStats {
  totalKnowledgeStored: number;
  persistentCards: number;
  sources: number;
  dialecticEntries: number;
  state: string;
}

export interface Concept {
  title: string;
}

export const reviewQueue: ReviewItem[] = [
  {
    id: "1",
    title: "BAYESIAN UPDATE ON DAILY DECISIONS",
    description: "Apply Bayesian reasoning to everyday choices",
    origo: "MICRO-LESSON",
    tags: ["MICRO_TEST_Q B7 MEMORIA CHAMBER"],
    dueNow: true,
    singleTabula: true,
    interrogatum:
      "Recall one concrete decision from today. What was your prior expectation, and what evidence did you observe? Update your belief using Bayesian reasoning.",
    responsumRevelatum:
      "Good practice: state a numerical prior (e.g., 'I gave this plan a 40% chance of working'), describe the evidence, then calculate the posterior. Show your work.",
  },
  {
    id: "2",
    title: "THREE-COLUMN ARGUMENT DECOMPOSITION",
    description: "Break down complex arguments systematically",
    origo: "DIALECTIC ENTRY",
    tags: ["DIALECTIC", "LOGIC"],
    dueNow: true,
    singleTabula: false,
    interrogatum:
      "Take a recent argument you encountered. Decompose it into: (1) Premises, (2) Inferences, (3) Conclusion. Identify any logical gaps.",
    responsumRevelatum:
      "Focus on clarity: each premise should be a single, testable claim. Inferences should be explicit logical steps. The conclusion should follow necessarily from premises + inferences.",
  },
  {
    id: "3",
    title: "LIBRARY OF ALEXANDRIA",
    description: "Historical context of knowledge preservation",
    origo: "LOGIC PUZZLE",
    tags: ["HISTORY", "KNOWLEDGE"],
    dueNow: false,
    singleTabula: false,
    interrogatum:
      "What were the primary methods of knowledge preservation used in the Library of Alexandria?",
    responsumRevelatum:
      "The Library used scrolls (papyrus and parchment), systematic cataloging, translation efforts, and copying. Consider what was lost and why.",
  },
];

export const memoryItems: MemoryItem[] = [
  {
    id: "m1",
    title: "Signal vs Noise in Daily Notes",
    memoryStrength: "FIRMVS",
    source: "MICRO-LESSON",
    dateAdded: "2024-01-15",
  },
  {
    id: "m2",
    title: "Three Types of Uncertainty",
    memoryStrength: "FIRMVS",
    source: "DIALECTIC",
    dateAdded: "2024-01-20",
  },
  {
    id: "m3",
    title: "Steelmanning as Default Stance",
    memoryStrength: "MEDIVS",
    source: "LESSON",
    dateAdded: "2024-02-01",
  },
  {
    id: "m4",
    title: "First-Principle Decomposition Routine",
    memoryStrength: "MEDIVS",
    source: "PUZZLE",
    dateAdded: "2024-02-05",
  },
  {
    id: "m5",
    title: "Handling Second-Order Uncertainty",
    memoryStrength: "DEBILIS",
    source: "DIALECTIC",
    dateAdded: "2024-02-10",
  },
  {
    id: "m6",
    title: "Tracking Hidden Opportunity Costs",
    memoryStrength: "DEBILIS",
    source: "MICRO-LESSON",
    dateAdded: "2024-02-12",
  },
];

export const archivumStats: ArchivumStats = {
  totalKnowledgeStored: 312,
  persistentCards: 312,
  sources: 7,
  dialecticEntries: 89,
  state: "ARCHIVVM VIVVM B7 CONTINVA REFRESHIONE",
};

export const strongestConcepts: Concept[] = [
  { title: "Steelmanning as default stance." },
  { title: "First-principle decomposition routine." },
  { title: "Bayesian update protocols." },
  { title: "Three-column argument structure." },
];

export const weakestConcepts: Concept[] = [
  { title: "Handling second-order uncertainty." },
  { title: "Tracking hidden opportunity costs." },
  { title: "Signal extraction from noisy data." },
  { title: "Temporal discounting calibration." },
];

export const arcanaMemoria = {
  reviewPath:
    "Dialectic entries b7 micro-lessons b7 puzzles. The order stabilizes concepts before testing them with paradox.",
  timeEstimate: "512 minutes b7 depends on depth of written answers.",
  includedItemTypes: [
    "R7 4 D7 DIALECTIC NOTES",
    "---LESSONS",
    "PROBLEMS",
    "SUMMARIES",
    "REVIEVS",
  ],
};

export const statsData = {
  itemsDueToday: 17,
  itemsDueLabel: "TABVLC6 POSCUNT REVISIONEM",
  newConceptsLearned: 5,
  newConceptsLabel: "NOVITATES HODIERNC6",
  currentReviewStreak: 23,
  reviewStreakLabel: "DIES CONTINVI",
};
