"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Main } from "@/components/Main";
import { BrutalistCard } from "@/components/BrutalistCard";
import { OrangeAction } from "@/components/core/OrangeAction";
import { PlateHeader } from "@/components/core/PlateHeader";

interface IngestionSummary {
  slug: string;
  bookTitle: string;
  bookAuthor: string;
  category: string;
  chaptersProcessed: number;
  totalWords: number;
  startedAt: string;
  completedAt: string;
  status: string;
}

interface ChaptersManifest {
  chapterCount: number;
  titles: string[];
  estimatedReadingTime: number;
  difficultyScore: number;
}

interface ChapterPreview {
  chapter: number;
  chapter_title: string;
  previewText: string;
}

export default function IngestedPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [summary, setSummary] = useState<IngestionSummary | null>(null);
  const [chaptersManifest, setChaptersManifest] =
    useState<ChaptersManifest | null>(null);
  const [chapters, setChapters] = useState<ChapterPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadIngestionData();
    }
  }, [slug]);

  const loadIngestionData = async () => {
    try {
      // Load ingestion log
      const logResponse = await fetch(`/api/ingest/log?slug=${slug}`);
      if (logResponse.ok) {
        const logData = await logResponse.json();
        setSummary(logData);
      }

      // Load chapters manifest
      const manifestResponse = await fetch(`/api/ingest/chapters?slug=${slug}`);
      if (manifestResponse.ok) {
        const manifestData = await manifestResponse.json();
        setChaptersManifest(manifestData);
      }

      // Load chapter previews
      const chaptersResponse = await fetch(
        `/api/ingest/chapter-previews?slug=${slug}`
      );
      if (chaptersResponse.ok) {
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData);
      }
    } catch (error) {
      console.error("Error loading ingestion data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const seconds = Math.floor((endTime - startTime) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  if (loading) {
    return (
      <Main>
        <BrutalistCard borderWidth="1.5" className="p-6">
          <div className="font-mono text-sm text-muted-foreground">
            Loading ingestion summary...
          </div>
        </BrutalistCard>
      </Main>
    );
  }

  if (!summary) {
    return (
      <Main>
        <BrutalistCard borderWidth="1.5" className="p-6">
          <div className="font-mono text-sm text-muted-foreground">
            Ingestion data not found.
          </div>
          <OrangeAction
            onClick={() => router.push("/bibliotheca")}
            className="mt-4"
          >
            Return to Bibliotheca
          </OrangeAction>
        </BrutalistCard>
      </Main>
    );
  }

  return (
    <Main>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl mb-2 engraved engrave">
            Ingestion Complete
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            {summary.bookTitle} by {summary.bookAuthor}
          </p>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <BrutalistCard borderWidth="1.5" className="p-6 mb-6 floating-panel">
            <div className="font-serif text-2xl mb-4 engraved engrave">
              Summary
            </div>
            <div className="font-mono text-sm space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground mb-1">
                    Chapters Processed
                  </div>
                  <div className="font-semibold">
                    {summary.chaptersProcessed}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Total Words</div>
                  <div className="font-semibold">
                    {summary.totalWords.toLocaleString()}
                  </div>
                </div>
                {chaptersManifest && (
                  <>
                    <div>
                      <div className="text-muted-foreground mb-1">
                        Estimated Reading Time
                      </div>
                      <div className="font-semibold">
                        {chaptersManifest.estimatedReadingTime} minutes
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">
                        Difficulty Score
                      </div>
                      <div className="font-semibold">
                        {chaptersManifest.difficultyScore}/10
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="pt-3 border-t border-border">
                <div className="text-muted-foreground mb-1">
                  Ingestion Duration
                </div>
                <div className="font-semibold">
                  {formatDuration(summary.startedAt, summary.completedAt)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Completed: {formatDate(summary.completedAt)}
                </div>
              </div>
            </div>
          </BrutalistCard>
        </motion.div>

        {/* Chapter List */}
        {chaptersManifest && chaptersManifest.titles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="font-serif text-2xl mb-4 engraved engrave">
              Chapters ({chaptersManifest.chapterCount})
            </div>
            <div className="space-y-3">
              {chaptersManifest.titles.map((title, index) => {
                const chapter = chapters.find((ch) => ch.chapter === index + 1);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  >
                    <BrutalistCard
                      borderWidth="1"
                      className="p-4 floating-panel"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-serif text-lg mb-2 engraved">
                            Chapter {index + 1}: {title}
                          </div>
                          {chapter && chapter.previewText && (
                            <div className="font-mono text-xs text-muted-foreground line-clamp-2">
                              {chapter.previewText}
                            </div>
                          )}
                        </div>
                      </div>
                    </BrutalistCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Preview Text */}
        {chapters.length > 0 && chapters[0].previewText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            <div className="font-serif text-2xl mb-4 engraved engrave">
              Preview
            </div>
            <BrutalistCard borderWidth="1" className="p-6">
              <div className="font-mono text-sm text-muted-foreground leading-relaxed">
                {chapters[0].previewText}
              </div>
            </BrutalistCard>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex gap-4"
        >
          <OrangeAction
            onClick={() => router.push(`/reader?book=${slug}`)}
            className="flex-1"
          >
            Open Reader
          </OrangeAction>
          <OrangeAction
            onClick={() => router.push(`/bibliotheca/${slug}`)}
            className="flex-1"
          >
            View Book Details
          </OrangeAction>
          <OrangeAction
            onClick={() => router.push("/bibliotheca")}
            className="flex-1"
          >
            Return to Bibliotheca
          </OrangeAction>
        </motion.div>
      </motion.div>
    </Main>
  );
}
