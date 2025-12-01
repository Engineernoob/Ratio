"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PlateHeader } from "@/components/core/PlateHeader";
import { BrutalistCard } from "@/components/BrutalistCard";
import { ContextPanel } from "@/components/core/ContextPanel";
import { Main } from "@/components/Main";
import { OrangeAction } from "@/components/core/OrangeAction";
import { DitherImage } from "@/components/core/DitherImage";
import { ClassicalImage } from "@/components/core/ClassicalImage";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BookSummary {
  title: string;
  author: string;
  year?: number;
  key_ideas: string[];
}

interface BookChapter {
  chapter: number;
  chapter_title: string;
  summary: string;
  micro_lessons?: MicroLesson[];
}

interface MicroLesson {
  title: string;
  core_idea: string;
  micro_test_q: string;
  micro_test_a: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const slug = params.slug as string;
  const [bookSummary, setBookSummary] = useState<BookSummary | null>(null);
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (slug) {
      fetchBookData();
    }
  }, [slug]);

  const fetchBookData = async () => {
    try {
      // Get book title from slug
      const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Fetch book summary
      const summaryResponse = await fetch(
        `/api/books?title=${encodeURIComponent(title)}`
      );
      const summaryData = await summaryResponse.json();
      if (summaryData.summary) {
        setBookSummary(summaryData.summary);
      }

      // Fetch chapters using the book slug
      const chaptersResponse = await fetch(`/api/books?book=${slug}`);
      if (chaptersResponse.ok) {
        const chaptersData = await chaptersResponse.json();
        if (chaptersData.chapters) {
          setChapters(chaptersData.chapters);
        }
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (lessonTitle: string) => {
    setRevealedAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonTitle)) {
        newSet.delete(lessonTitle);
      } else {
        newSet.add(lessonTitle);
      }
      return newSet;
    });
  };

  const sendToOikos = async (chapterNum: number) => {
    try {
      // For now, just show a message - actual assignment would require feed assignment API
      alert(`Chapter ${chapterNum} will be added to tomorrow's OIKOS feed`);
    } catch (error) {
      console.error("Error sending to OIKOS:", error);
    }
  };

  const getImageSrc = () => {
    return `/images/classical/${slug}.jpg`;
  };

  if (loading) {
    return (
      <>
        <Main>
          <BrutalistCard borderWidth="1.5" className="p-6">
            <div className="font-mono text-sm text-muted-foreground">
              Loading book...
            </div>
          </BrutalistCard>
        </Main>
        <ContextPanel title="Book Details">
          <div className="font-mono text-xs text-muted-foreground">
            Loading...
          </div>
        </ContextPanel>
      </>
    );
  }

  if (!bookSummary) {
    return (
      <>
        <Main>
          <BrutalistCard borderWidth="1.5" className="p-6">
            <div className="font-mono text-sm text-muted-foreground">
              Book not found.
            </div>
            <OrangeAction
              onClick={() => router.push("/bibliotheca")}
              className="mt-4"
            >
              Return to Library
            </OrangeAction>
          </BrutalistCard>
        </Main>
        <ContextPanel title="Error">
          <div className="font-mono text-xs text-muted-foreground">
            Book not found.
          </div>
        </ContextPanel>
      </>
    );
  }

  const totalMicroLessons = chapters.reduce(
    (acc, ch) => acc + (ch.micro_lessons?.length || 0),
    0
  );

  return (
    <>
      <Main>
        {/* Navigation Bar */}
        <div className="w-full border-b border-[rgba(255,255,255,0.08)] pb-3 mb-8">
          <div className="flex items-center justify-between font-mono text-xs text-[rgba(232,230,225,0.6)]">
            <div className="flex items-center gap-2">
              <Link
                href="/oikos"
                className="hover:text-[rgba(232,230,225,0.9)] transition-colors"
              >
                RATIO @ OIKOS
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/oikos"
                className={cn(
                  "transition-colors",
                  pathname === "/oikos" && "text-[#b29b68]"
                )}
              >
                OIKOS
              </Link>
              <Link
                href="/bibliotheca"
                className={cn(
                  "transition-colors",
                  pathname?.startsWith("/bibliotheca") && "text-[#b29b68]"
                )}
              >
                BIBLIOTHECA
              </Link>
              <Link
                href="/laboratorivm"
                className={cn(
                  "transition-colors",
                  pathname === "/laboratorivm" && "text-[#b29b68]"
                )}
              >
                LABORATORIVM
              </Link>
              <Link
                href="/memoria"
                className={cn(
                  "transition-colors",
                  pathname === "/memoria" && "text-[#b29b68]"
                )}
              >
                MEMORIA
              </Link>
              <Link
                href="/archivvm"
                className={cn(
                  "transition-colors",
                  pathname === "/archivvm" && "text-[#b29b68]"
                )}
              >
                ARCHIVVM
              </Link>
              <Link
                href="/scholarivm"
                className={cn(
                  "transition-colors",
                  pathname === "/scholarivm" && "text-[#b29b68]"
                )}
              >
                SCHOLARIUM
              </Link>
              <Link
                href="/ars-rationis"
                className={cn(
                  "transition-colors",
                  pathname === "/ars-rationis" && "text-[#b29b68]"
                )}
              >
                ARS RATIONIS
              </Link>
            </div>
          </div>
        </div>

        {/* Wide Dithered Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 relative"
        >
          <div className="relative w-full h-64 dither grain engraving-image overflow-hidden border border-border">
            <div className="absolute inset-0 bg-linear-to-br from-muted/30 to-background/80" />
            <ClassicalImage
              src={getImageSrc()}
              alt={bookSummary.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="font-serif text-5xl font-bold engraved engrave mb-4">
                  {bookSummary.title}
                </h1>
                <p className="font-mono text-sm text-muted-foreground">
                  by {bookSummary.author}
                  {bookSummary.year && (
                    <span className="ml-2">
                      {bookSummary.year > 0
                        ? bookSummary.year
                        : Math.abs(bookSummary.year) + " BCE"}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 flex gap-4"
        >
          <OrangeAction
            onClick={() => {
              // Scroll to micro-lessons section or show all lessons
              const memoriaSection = document.getElementById("memoria-section");
              if (memoriaSection) {
                memoriaSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Study Micro-Lessons
          </OrangeAction>
          {chapters.length > 0 && (
            <OrangeAction onClick={() => sendToOikos(1)}>
              Send Chapter 1 to OIKOS
            </OrangeAction>
          )}
          <OrangeAction onClick={() => router.push("/scholarivm")}>
            Open in Scholarivm
          </OrangeAction>
        </motion.div>

        {/* Summary Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <BrutalistCard borderWidth="1.5" className="p-6 mb-6 floating-panel">
            <div className="font-serif text-2xl mb-4 engraved engrave">
              LECTIO
            </div>
            <div className="font-mono text-sm space-y-4">
              <div>
                <div className="font-serif text-lg mb-3 engraved">
                  Key Ideas
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  {bookSummary.key_ideas?.map((idea, idx) => (
                    <li
                      key={`idea-${idx}-${idea.slice(0, 10)}`}
                      className="border-l border-border pl-3"
                    >
                      {idea}
                    </li>
                  )) || (
                    <li className="text-muted-foreground">
                      No key ideas available
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </BrutalistCard>
        </motion.div>

        {/* Chapters */}
        {chapters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="font-serif text-2xl mb-6 engraved engrave">
              CHAPTERS
            </div>
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={`chapter-${chapter.chapter}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <BrutalistCard borderWidth="1" className="p-6 floating-panel">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-serif text-lg engraved mb-1">
                          Chapter {chapter.chapter}: {chapter.chapter_title}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground mb-3">
                          {chapter.micro_lessons?.length || 0} micro-lessons
                        </div>
                      </div>
                      <OrangeAction
                        onClick={() => sendToOikos(chapter.chapter)}
                      >
                        Send to OIKOS
                      </OrangeAction>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground">
                      {chapter.summary}
                    </div>
                  </BrutalistCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Micro-Lessons Preview */}
        {totalMicroLessons > 0 && (
          <motion.div
            id="memoria-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <div className="font-serif text-2xl mb-6 engraved engrave">
              MEMORIA
            </div>
            <BrutalistCard borderWidth="1" className="p-6">
              <div className="font-mono text-sm">
                <div className="mb-4">
                  <span className="font-semibold">{totalMicroLessons}</span>{" "}
                  micro-lessons available across {chapters.length} chapters.
                </div>
                <OrangeAction
                  onClick={() => router.push(`/bibliotheca/${slug}/lessons`)}
                >
                  View All Micro-Lessons
                </OrangeAction>
              </div>
            </BrutalistCard>
          </motion.div>
        )}
      </Main>

      <ContextPanel title="Book Details">
        <BrutalistCard borderWidth="1" className="p-4 mb-4">
          <div className="font-serif text-sm mb-2 engraved">Volume</div>
          <div className="font-mono text-xs">
            <div className="font-semibold">{bookSummary.title}</div>
            <div className="text-muted-foreground mt-1">
              {bookSummary.author}
            </div>
          </div>
        </BrutalistCard>

        <BrutalistCard borderWidth="1" className="p-4 mb-4">
          <div className="font-serif text-sm mb-2 engraved">Structure</div>
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <div>{chapters.length} chapters</div>
            <div>{totalMicroLessons} micro-lessons</div>
            <div>{bookSummary.key_ideas.length} key ideas</div>
          </div>
        </BrutalistCard>

        <BrutalistCard borderWidth="1" className="p-4">
          <div className="font-serif text-sm mb-2 engraved">Actions</div>
          <div className="font-mono text-xs text-muted-foreground space-y-2">
            <div>• Study micro-lessons</div>
            <div>• Send chapters to OIKOS</div>
            <div>• Add to MEMORIA</div>
          </div>
        </BrutalistCard>
      </ContextPanel>
    </>
  );
}
