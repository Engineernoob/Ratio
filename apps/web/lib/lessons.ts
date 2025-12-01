import fs from "fs";
import path from "path";

export interface Lesson {
  id: string;
  title: string;
  explanation: string;
  example: string;
  micro_test_question: string;
  micro_test_answer: string;
  date_assigned: string;
  topic_id: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const LESSONS_FILE = path.join(DATA_DIR, "lessons.json");
const TOPICS_FILE = path.join(DATA_DIR, "topics.json");

// Lesson templates by topic
interface LessonTemplate {
  title: string;
  explanation: string;
  example: string;
  micro_test_question: string;
  micro_test_answer: string;
}

const lessonTemplates: Record<string, LessonTemplate[]> = {
  "classical-logic": [
    {
      title: "Categorical Syllogisms",
      explanation: "A categorical syllogism consists of three parts: a major premise, a minor premise, and a conclusion. The major premise contains the major term (predicate of conclusion), the minor premise contains the minor term (subject of conclusion), and both contain the middle term.",
      example: "Major premise: All humans are mortal. Minor premise: Socrates is human. Conclusion: Therefore, Socrates is mortal.",
      micro_test_question: "In the syllogism 'All birds fly. Penguins are birds. Therefore penguins fly.', what is the middle term?",
      micro_test_answer: "The middle term is 'birds', as it appears in both premises but not in the conclusion."
    },
    {
      title: "Logical Fallacies: Ad Hominem",
      explanation: "Ad hominem (against the person) is a fallacy where one attacks the person making the argument rather than addressing the argument itself. This diverts attention from the logical content.",
      example: "Person A: 'We should invest in renewable energy.' Person B: 'You drive a gas car, so your argument is invalid.' This attacks Person A's character rather than addressing the energy proposal.",
      micro_test_question: "What makes an ad hominem attack a logical fallacy?",
      micro_test_answer: "It attacks the person rather than the argument, which is irrelevant to the truth value of the claim being made."
    }
  ],
  "rhetoric": [
    {
      title: "The Three Modes of Persuasion",
      explanation: "Aristotle identified three modes of persuasion: Ethos (credibility/character), Pathos (emotion), and Logos (logic/reason). Effective rhetoric combines all three.",
      example: "A speech using ethos: 'As a doctor with 20 years of experience...' Pathos: 'Imagine the suffering of patients...' Logos: 'Studies show that...'",
      micro_test_question: "Which mode of persuasion appeals to the audience's emotions?",
      micro_test_answer: "Pathos appeals to emotions, while ethos appeals to credibility and logos appeals to logic."
    }
  ],
  "memory-techniques": [
    {
      title: "The Method of Loci",
      explanation: "The method of loci (memory palace) involves associating information with specific locations in a familiar place. You mentally walk through these locations to recall the information.",
      example: "To remember a shopping list, imagine placing each item in different rooms of your house: milk in the kitchen, bread in the dining room, etc.",
      micro_test_question: "What is the key principle behind the method of loci?",
      micro_test_answer: "Spatial memory is stronger than abstract memory, so associating information with physical locations makes it easier to recall."
    }
  ]
};

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getLessons(): Lesson[] {
  try {
    if (fs.existsSync(LESSONS_FILE)) {
      const data = fs.readFileSync(LESSONS_FILE, "utf-8");
      return JSON.parse(data).lessons || [];
    }
  } catch (error) {
    console.error("Error reading lessons:", error);
  }
  return [];
}

function saveLessons(lessons: Lesson[]): void {
  try {
    fs.writeFileSync(LESSONS_FILE, JSON.stringify({ lessons }, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving lessons:", error);
  }
}

function getTopics() {
  try {
    const data = fs.readFileSync(TOPICS_FILE, "utf-8");
    return JSON.parse(data).topics || [];
  } catch (error) {
    console.error("Error reading topics:", error);
    return [];
  }
}

export function generateDailyLesson(): Lesson {
  const today = getTodayDateString();
  const existingLessons = getLessons();
  
  // Check if lesson already exists for today
  const todayLesson = existingLessons.find(l => l.date_assigned === today);
  if (todayLesson) {
    return todayLesson;
  }

  // Get all topics
  const topics = getTopics();
  if (topics.length === 0) {
    throw new Error("No topics available");
  }

  // Select a random topic
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  // Get templates for this topic, or use a default
  const templates = lessonTemplates[randomTopic.id] || [{
    title: `${randomTopic.name} Fundamentals`,
    explanation: `An introduction to ${randomTopic.name.toLowerCase()}. ${randomTopic.description}`,
    example: `Consider a basic example from ${randomTopic.name.toLowerCase()}.`,
    micro_test_question: `What is a key concept in ${randomTopic.name.toLowerCase()}?`,
    micro_test_answer: `The fundamental principles of ${randomTopic.name.toLowerCase()} involve understanding its core definitions and applications.`
  }];

  const template = templates[Math.floor(Math.random() * templates.length)];

  // Generate new lesson
  const lesson: Lesson = {
    id: `lesson-${Date.now()}`,
    title: template.title,
    explanation: template.explanation,
    example: template.example,
    micro_test_question: template.micro_test_question,
    micro_test_answer: template.micro_test_answer,
    date_assigned: today,
    topic_id: randomTopic.id
  };

  // Save lesson
  existingLessons.push(lesson);
  saveLessons(existingLessons);

  return lesson;
}

export function getTodayLesson(): Lesson | null {
  const today = getTodayDateString();
  const lessons = getLessons();
  return lessons.find(l => l.date_assigned === today) || null;
}

export function getAllLessons(): Lesson[] {
  return getLessons();
}

