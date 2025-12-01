"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TopNavBar } from "@/components/core/TopNavBar";
import { ScholarivmShell } from "@/components/Scholarivm/ScholarivmShell";
import { TempleHero } from "@/components/Scholarivm/TempleHero";
import {
  TrackSelector,
  type TrackInfo,
  type TrackKey,
} from "@/components/Scholarivm/TrackSelector";
import { DisciplineCard } from "@/components/Scholarivm/DisciplineCard";
import {
  ScholarPathway,
  type PathwayStep,
} from "@/components/Scholarivm/ScholarPathway";
import {
  ScholarChallenges,
  type ChallengeSection,
} from "@/components/Scholarivm/ScholarChallenges";
import { PageWrapper, SectionWrapper } from "@/app/components/ui/layout";
import {
  BodyText,
  DisplayTitle,
  PageSubtitle,
  SectionTitle,
} from "@/app/components/ui/typography";
import type { MemoryCard } from "@/lib/memoria/types";
import {
  calculateMemoryRetention,
  calculateLearningVelocity,
  calculateBookProgress,
  calculateMasteryXP,
  calculateReasoningStats,
  calculateStreak,
  calculateMasteryLevel,
  type BookProgress,
  type MasteryData,
} from "@/lib/scholarivm/utils";
import { BackgroundArt } from "@/components/ui/BackgroundArt";
import { getBackgroundForPage } from "@/lib/backgrounds";
import "@/styles/scholarivm.css";

interface BookManifest {
  id: string;
  title: string;
  author: string;
  chapters: Array<{ id: string; file: string }>;
}

const BOOK_METADATA: Record<
  string,
  { title: string; author: string }
> = {
  meditations: { title: "Meditations", author: "Marcus Aurelius" },
  AtomicHabits: { title: "Atomic Habits", author: "James Clear" },
};

export default function ScholarivmPage() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [books, setBooks] = useState<BookManifest[]>([]);
  const [feedAssignments, setFeedAssignments] = useState<Record<string, any>>(
    {}
  );
  const [puzzleResults, setPuzzleResults] = useState<
    Array<{ correct: boolean; type: string }>
  >([]);
  const [completedChapters, setCompletedChapters] = useState<
    Record<string, Set<string>>
  >({});
  const [activeTrack, setActiveTrack] = useState<TrackKey>("apprentice");

  useEffect(() => {
    const loadData = async () => {
      try {
        const memoriaRes = await fetch("/api/memoria/cards");
        if (memoriaRes.ok) {
          const memoriaData = await memoriaRes.json();
          setCards(memoriaData.cards || []);
        }

        const bookIds = ["meditations", "AtomicHabits"];
        const bookPromises = bookIds.map(async (id) => {
          const metadata = BOOK_METADATA[id] || { title: id, author: "Unknown" };
          try {
            const res = await fetch(`/api/books?book=${id}`);
            if (res.ok) {
              const data = await res.json();
              const chapters = Array.isArray(data.chapters) ? data.chapters : [];

              return {
                id,
                title: metadata.title,
                author: metadata.author,
                chapters: chapters.map((chapter: any, index: number) => ({
                  id:
                    chapter.id ||
                    `${id}-chapter-${chapter.chapter ?? index + 1}`,
                  file:
                    chapter.chapter_title ||
                    `Chapter ${chapter.chapter ?? index + 1}`,
                })),
              } as BookManifest;
            }
          } catch (error) {
            console.error(`Error loading book ${id}:`, error);
          }
          return null;
        });

        const loadedBooks = (await Promise.all(bookPromises)).filter(
          (b) => b !== null
        ) as BookManifest[];
        setBooks(loadedBooks);

        const completed: Record<string, Set<string>> = {};
        loadedBooks.forEach((book) => {
          if (!book || !book.chapters) return;
          const completedSet = new Set<string>();
          const progressPercent = Math.random() * 0.6;
          const chaptersToComplete = Math.floor(
            book.chapters.length * progressPercent
          );
          for (let i = 0; i < chaptersToComplete; i++) {
            completedSet.add(book.chapters[i].id);
          }
          completed[book.id] = completedSet;
        });
        setCompletedChapters(completed);

        const feedRes = await fetch("/api/feed/assignments");
        if (feedRes.ok) {
          const feedData = await feedRes.json();
          setFeedAssignments(feedData.assignments || {});
        }

        const sampleResults: Array<{ correct: boolean; type: string }> = [];
        for (let i = 0; i < 20; i++) {
          sampleResults.push({
            correct: Math.random() > 0.3,
            type: ["fallacy", "logic", "syllogism"][
              Math.floor(Math.random() * 3)
            ],
          });
        }
        setPuzzleResults(sampleResults);
      } catch (error) {
        console.error("Error loading scholarivm data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const bookProgressData: BookProgress[] = useMemo(
    () => calculateBookProgress(books, completedChapters),
    [books, completedChapters]
  );

  const memoryRetention = useMemo(
    () => calculateMemoryRetention(cards),
    [cards]
  );
  const learningVelocity = useMemo(
    () => calculateLearningVelocity(cards, 30),
    [cards]
  );
  const reasoningStats = useMemo(
    () => calculateReasoningStats(puzzleResults),
    [puzzleResults]
  );
  const streak = useMemo(
    () => calculateStreak(cards, feedAssignments),
    [cards, feedAssignments]
  );

  const masteryXP = useMemo(
    () =>
      calculateMasteryXP(
        cards,
        bookProgressData,
        reasoningStats.logicPuzzleAccuracy
      ),
    [cards, bookProgressData, reasoningStats.logicPuzzleAccuracy]
  );

  const getMasteryData = (xp: number, lastWeekXP: number = 0): MasteryData => {
    const { level, xpToNext } = calculateMasteryLevel(xp);
    const masteryPercent = Math.min((xp / 1000) * 100, 100);
    const growthSinceLastWeek =
      lastWeekXP > 0 ? ((xp - lastWeekXP) / lastWeekXP) * 100 : 0;

    return {
      level,
      xp,
      xpToNext,
      masteryPercent,
      growthSinceLastWeek,
    };
  };

  const masteryData = useMemo(
    () => ({
      knowledge: getMasteryData(
        masteryXP.knowledge,
        masteryXP.knowledge * 0.9
      ),
      memoria: getMasteryData(masteryXP.memoria, masteryXP.memoria * 0.9),
      ratio: getMasteryData(masteryXP.ratio, masteryXP.ratio * 0.9),
      ars: getMasteryData(masteryXP.ars, masteryXP.ars * 0.9),
    }),
    [masteryXP]
  );

  const totalChapters = useMemo(
    () =>
      bookProgressData.reduce(
        (sum, book) => sum + (book?.chaptersCompleted || 0),
        0
      ),
    [bookProgressData]
  );

  const trackProfiles: Record<TrackKey, TrackInfo> = useMemo(
    () => ({
      apprentice: {
        title: "Apprentice Track",
        mantra: "Lay the stones; repeat the forms.",
        cadence: "Short recitations · daily",
        focus: [
          `Retention at ${memoryRetention.toFixed(0)}%`,
          `${Math.round(masteryData.memoria.masteryPercent)}% memoria lattice`,
          `${masteryData.knowledge.xpToNext} XP to ascend`,
        ],
        signal: `${learningVelocity.toFixed(1)} items/day velocity`,
        target: `${Math.round(masteryData.knowledge.xp)} XP held`,
      },
      journeyman: {
        title: "Journeyman Track",
        mantra: "Sharpen ratio; test the lattice.",
        cadence: "Proof drills · alt-day",
        focus: [
          `${reasoningStats.logicPuzzleAccuracy.toFixed(0)}% logic accuracy`,
          `${Math.round(masteryData.ratio.masteryPercent)}% ratio mastery`,
          `${totalChapters} chapters illumined`,
        ],
        signal: `Trend ${masteryData.ratio.growthSinceLastWeek.toFixed(1)}%`,
        target: `${masteryData.ratio.xpToNext} XP to next gate`,
      },
      archon: {
        title: "Archon Track",
        mantra: "Compose. Debate. Engrave.",
        cadence: "Longform dialectic · weekly",
        focus: [
          `${Math.round(masteryData.ars.masteryPercent)}% craft poise`,
          `Streak ${streak} days unbroken`,
          "Dialects sealed until arena entry",
        ],
        signal: `Creative lift ${
          masteryData.ars.growthSinceLastWeek >= 0 ? "+" : ""
        }${masteryData.ars.growthSinceLastWeek.toFixed(1)}%`,
        target: "Unlock dialectic arena",
      },
    }),
    [
      masteryData.ars.growthSinceLastWeek,
      masteryData.ars.masteryPercent,
      masteryData.ars.xpToNext,
      masteryData.knowledge.masteryPercent,
      masteryData.knowledge.xp,
      masteryData.knowledge.xpToNext,
      masteryData.memoria.masteryPercent,
      masteryData.ratio.growthSinceLastWeek,
      masteryData.ratio.masteryPercent,
      masteryData.ratio.xpToNext,
      learningVelocity,
      memoryRetention,
      reasoningStats.logicPuzzleAccuracy,
      streak,
      totalChapters,
    ]
  );

  const pathwaySteps: PathwayStep[] = useMemo(() => {
    const trackDepth: Record<TrackKey, number> = {
      apprentice: 1,
      journeyman: 2,
      archon: 3,
    };
    const activeDepth = trackDepth[activeTrack];

    const baseSteps: Omit<PathwayStep, "status">[] = [
      {
        title: "Logic Foundations",
        description: "Proof drills, basic fallacies, clarity of form.",
      },
      {
        title: "Memory Systems",
        description: "Palaces and spaced repetitions woven daily.",
      },
      {
        title: "Rhetorical Forms",
        description: "Voice, cadence, and arrangement under pressure.",
      },
      {
        title: "Dialectic Arena (locked)",
        description: "Entry sealed until the Archon track ignites.",
      },
    ];

    return baseSteps.map((step, idx) => {
      let status: PathwayStep["status"] = "locked";
      if (idx < activeDepth) status = "complete";
      if (idx === activeDepth) status = "current";
      if (step.title.startsWith("Dialectic")) status = "locked";

      return { ...step, status };
    });
  }, [activeTrack]);

  const challengeSections: ChallengeSection[] = useMemo(
    () => [
      {
        id: "daily",
        title: "Daily Rites",
        items: [
          {
            id: `rite-${activeTrack}-recall`,
            label:
              activeTrack === "apprentice"
                ? "Recite 3 axioms from memoria"
                : "Rehearse 5 theorem recalls",
            xp: 35,
          },
          {
            id: `rite-${activeTrack}-logic`,
            label:
              activeTrack === "archon"
                ? "Draft a miniature proof for the arena"
                : "Solve a logic shard before dusk",
            xp: 45,
          },
          {
            id: `rite-${activeTrack}-breath`,
            label: "5-minute breath to clear the lattice",
            xp: 20,
          },
        ],
      },
      {
        id: "weekly",
        title: "Weekly Trials",
        items: [
          {
            id: `trial-${activeTrack}-analysis`,
            label:
              activeTrack === "apprentice"
                ? "Outline one chapter in etched notes"
                : "Compose a rhetorical analysis of this week’s reading",
            xp: 120,
          },
          {
            id: `trial-${activeTrack}-dialectic`,
            label:
              activeTrack === "archon"
                ? "Host a dialectic exchange with counter-points"
                : "Simulate a debate round in notes",
            xp: 140,
          },
        ],
      },
    ],
    [activeTrack]
  );

  const disciplineCards = useMemo(
    () => [
      {
        id: "knowledge",
        name: "Knowledge",
        data: masteryData.knowledge,
        track: "apprentice" as TrackKey,
      },
      {
        id: "memoria",
        name: "Memoria",
        data: masteryData.memoria,
        track: "apprentice" as TrackKey,
      },
      {
        id: "ratio",
        name: "Ratio",
        data: masteryData.ratio,
        track: "journeyman" as TrackKey,
      },
      {
        id: "ars",
        name: "Ars",
        data: masteryData.ars,
        track: "archon" as TrackKey,
      },
    ],
    [masteryData]
  );

  const backgroundSrc = getBackgroundForPage("scholarivm");

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BackgroundArt
          src={backgroundSrc}
          opacity={0.12}
          blur={0.4}
          position="center"
        />
        <TopNavBar />
        <div className="relative z-10">
          <PageWrapper>
            <SectionWrapper className="items-center text-center">
              <PageSubtitle>Ratio / Study</PageSubtitle>
              <DisplayTitle>SCHOLARIVM</DisplayTitle>
              <BodyText className="max-w-2xl mx-auto">
                Engraving SCHOLARIVM... Fog is gathering in the temple.
              </BodyText>
            </SectionWrapper>
          </PageWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundArt
        src={backgroundSrc}
        opacity={0.12}
        blur={0.4}
        position="center"
      />
      <TopNavBar />
      <div className="relative z-10">
        <ScholarivmShell>
          <PageWrapper>
            <SectionWrapper className="space-y-8">
              <PageSubtitle>Ratio / Study</PageSubtitle>
              <DisplayTitle>SCHOLARIVM</DisplayTitle>
              <BodyText className="max-w-3xl">
                Monochrome temple for your learning tracks, breathing with wide spacing
                and deliberate pacing.
              </BodyText>
              <TempleHero
                streak={streak}
                memoryRetention={memoryRetention}
                learningVelocity={learningVelocity}
                chaptersCompleted={totalChapters}
              />
            </SectionWrapper>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SectionWrapper>
                <SectionTitle>Track Selector</SectionTitle>
                <BodyText>
                  Choose your current rite: Apprentice, Journeyman, or Archon.
                </BodyText>
                <TrackSelector
                  tracks={trackProfiles}
                  activeTrack={activeTrack}
                  onChange={setActiveTrack}
                />
              </SectionWrapper>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <SectionWrapper>
                <SectionTitle>Discipline Cards</SectionTitle>
                <BodyText>
                  Glass-etched panels tracking Knowledge, Memoria, Ratio, and Ars.
                </BodyText>
                <div className="discipline-grid">
                  {disciplineCards.map((card, idx) => (
                    <DisciplineCard
                      key={card.id}
                      name={card.name}
                      data={card.data}
                      delay={0.1 * idx}
                      onOpen={() => setActiveTrack(card.track)}
                    />
                  ))}
                </div>
              </SectionWrapper>
            </motion.div>

            <SectionWrapper>
              <SectionTitle>Pathway</SectionTitle>
              <ScholarPathway steps={pathwaySteps} />
            </SectionWrapper>

            <SectionWrapper>
              <SectionTitle>Challenges</SectionTitle>
              <ScholarChallenges sections={challengeSections} />
            </SectionWrapper>
          </PageWrapper>
        </ScholarivmShell>
      </div>
    </div>
  );
}
