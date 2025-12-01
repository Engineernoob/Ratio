"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TopNavBar } from "@/components/core/TopNavBar";
import { MemoriaReviewCard } from "@/components/memoria/MemoriaReviewCard";
import { MemoriaMetricsPanel } from "@/components/memoria/MemoriaMetricsPanel";
import { MemoriaSigil } from "@/components/memoria/MemoriaSigil";
import { PageWrapper, SectionWrapper } from "@/app/components/ui/layout";
import {
  BodyText,
  DisplayTitle,
  MicroText,
  PageSubtitle,
  SectionTitle,
} from "@/app/components/ui/typography";
import type { MemoriaConcept } from "@/lib/memoria";
import "@/styles/memoria.css";
import "./memoria.css";

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function parseDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function formatDateLabel(date: Date | null) {
  if (!date) return "Unknown";
  return shortDate.format(date);
}

function calculateConfidence(concept: MemoriaConcept) {
  const easeScore = Math.max(0, Math.min(1, (concept.ease_factor - 1) / 1.5));
  const reviewBoost = Math.min(concept.review_count, 8) * 0.03;
  const base = 58 + easeScore * 32 + reviewBoost * 100;
  return Math.min(99, Math.max(35, Math.round(base)));
}

function getLastReviewedDate(concept: MemoriaConcept) {
  const next = parseDate(concept.next_review);
  if (!next) return parseDate(concept.date_added);

  const last = new Date(next);
  last.setDate(last.getDate() - Math.max(concept.interval_days, 0));
  if (Number.isNaN(last.getTime())) {
    return parseDate(concept.date_added);
  }
  return last;
}

function getDueLabel(concept: MemoriaConcept, today: Date) {
  const next = parseDate(concept.next_review);
  if (!next) return "Scheduled";

  const startOfToday = new Date(today);
  const startOfNext = new Date(next);
  startOfToday.setHours(0, 0, 0, 0);
  startOfNext.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (startOfNext.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "Due today";
  if (diffDays === 1) return "Due in 1 day";
  return `Due in ${diffDays} days`;
}

function computeMetrics(
  concepts: MemoriaConcept[],
  dueToday: MemoriaConcept[],
  today: Date
) {
  const masteredCount = concepts.filter(
    (concept) => concept.review_count >= 5 || concept.interval_days >= 14
  ).length;

  const weakest = [...concepts]
    .sort((a, b) => a.ease_factor - b.ease_factor)
    .slice(0, 3);

  const strongest = [...concepts]
    .sort(
      (a, b) =>
        b.review_count - a.review_count ||
        b.ease_factor - a.ease_factor ||
        a.title.localeCompare(b.title)
    )
    .slice(0, 3);

  const reviewedDates = new Set<string>();
  const todayKey = today.toISOString().split("T")[0];

  concepts.forEach((concept) => {
    const lastReviewed = getLastReviewedDate(concept);
    if (lastReviewed) {
      reviewedDates.add(lastReviewed.toISOString().split("T")[0]);
    }
  });

  if (dueToday.length > 0) {
    reviewedDates.add(todayKey);
  }

  let streak = 0;
  const cursor = new Date(today);
  while (reviewedDates.has(cursor.toISOString().split("T")[0])) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    streak: Math.max(streak, dueToday.length > 0 ? 1 : 0),
    masteredCount,
    weakest,
    strongest,
  };
}

export default function MemoriaPage() {
  const [concepts, setConcepts] = useState<MemoriaConcept[]>([]);
  const [dueToday, setDueToday] = useState<MemoriaConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [today] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });

  useEffect(() => {
    const loadMemoria = async () => {
      try {
        const res = await fetch("/api/memoria", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load memoria");
        }
        const data = await res.json();
        setConcepts(data.allConcepts || []);
        setDueToday(data.dueReviews || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load your recall deck right now.");
      } finally {
        setLoading(false);
      }
    };

    loadMemoria();
  }, []);

  const upcoming = useMemo(() => {
    const limit = new Date(today);
    limit.setDate(limit.getDate() + 3);

    return concepts
      .filter((concept) => {
        const next = parseDate(concept.next_review);
        if (!next) return false;
        return next > today && next <= limit;
      })
      .sort((a, b) => {
        const aDate = parseDate(a.next_review)?.getTime() || 0;
        const bDate = parseDate(b.next_review)?.getTime() || 0;
        return aDate - bDate;
      });
  }, [concepts, today]);

  const metrics = useMemo(
    () => computeMetrics(concepts, dueToday, today),
    [concepts, dueToday, today]
  );

  const totalCards = concepts.length;
  const upcomingCount = upcoming.length;
  const nextDueLabel =
    upcoming.length > 0
      ? formatDateLabel(parseDate(upcoming[0].next_review) || null)
      : "Scheduled";
  const dueTodayVisible = dueToday.slice(0, 6);
  const dueTodayRemaining = Math.max(0, dueToday.length - dueTodayVisible.length);

  const renderHero = () => (
    <section className="memoria-hero">
      <div className="memoria-hero__image">
        <Image
          src="/artwork/classical/memoria-hero.jpg"
          alt="Memory Temple engraving"
          fill
          priority
          sizes="100vw"
          className="memoria-hero__img"
        />
        <div className="memoria-hero__grain" />
        <div className="memoria-hero__vignette" />
        <div className="memoria-particles memoria-particles--slow" />
        <div className="memoria-particles memoria-particles--mid" />
        <div className="memoria-particles memoria-particles--fast" />
      </div>
      <div className="memoria-hero__content">
        <div className="memoria-hero__stack">
          <PageSubtitle className="memoria-hero__overline">Ratio / Memory Temple</PageSubtitle>
          <DisplayTitle className="memoria-hero__title">MEMORIA</DisplayTitle>
          <BodyText className="memoria-hero__subtitle">
            Daily Ritual of Knowledge Reinforcement
          </BodyText>
          <div className="memoria-hero__glow" aria-hidden />
        </div>
      </div>
    </section>
  );

  const renderCard = (concept: MemoriaConcept, variant: "full" | "compact") => {
    const confidence = calculateConfidence(concept);
    const lastReviewedLabel = formatDateLabel(getLastReviewedDate(concept));
    const dueLabel = getDueLabel(concept, today);

    return (
      <MemoriaReviewCard
        key={concept.id}
        concept={concept}
        confidence={confidence}
        lastReviewedLabel={lastReviewedLabel}
        dueLabel={dueLabel}
        variant={variant}
      />
    );
  };

  if (loading) {
    return (
      <div className="memoria-body relative min-h-screen">
        <TopNavBar />
        {renderHero()}
        <div className="relative z-10 memoria-content">
          <PageWrapper>
            <SectionWrapper className="items-center text-center">
              <BodyText className="max-w-2xl mx-auto">Sharpening your monochrome archive...</BodyText>
            </SectionWrapper>
          </PageWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="memoria-body relative min-h-screen">
      <TopNavBar />
      {renderHero()}
      <div className="memoria-fade" />
      <div className="relative z-10 memoria-page memoria-content">
        <PageWrapper>
          <SectionWrapper className="memoria-quickbar">
            <div>
              <MicroText>Deck status</MicroText>
              <div className="memoria-quickbar__title">Ready today</div>
            </div>
            <div className="memoria-quickbar__metrics">
              <div className="memoria-chip">
                <span className="memoria-chip__dot" />
                <span className="memoria-chip__label">
                  {dueToday.length} due
                </span>
              </div>
              <div className="memoria-chip subtle">
                <span className="memoria-chip__dot" />
                <span className="memoria-chip__label">{totalCards} total cards</span>
              </div>
              <div className="memoria-chip subtle">
                <span className="memoria-chip__dot" />
                <span className="memoria-chip__label">Next: {nextDueLabel}</span>
              </div>
            </div>
          </SectionWrapper>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4 }}
          >
            <SectionWrapper className="memoria-panel">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <MicroText>Daily Recall</MicroText>
                  <SectionTitle>Due Today</SectionTitle>
                </div>
                <div className="memoria-chip">
                  <span className="memoria-chip__dot" />
                  <span className="memoria-chip__label">
                    {dueToday.length} card{dueToday.length === 1 ? "" : "s"} ready
                  </span>
                </div>
              </div>

              {error ? (
                <div className="memoria-empty">
                  <h3>Unable to load deck</h3>
                  <p>{error}</p>
                </div>
              ) : dueToday.length === 0 ? (
                <div className="memoria-empty">
                  <h3>All Caught Up.</h3>
                  <p>
                    Your mind is sharper than the blade of a Spartan. Return tomorrow.
                  </p>
                  <MemoriaSigil />
                </div>
              ) : (
                <>
                  <div className="memoria-list memoria-list--capped">
                    {dueTodayVisible.map((concept) => renderCard(concept, "full"))}
                  </div>
                  {dueTodayRemaining > 0 && (
                    <div className="memoria-remaining">
                      <MicroText>{dueTodayRemaining} more card{dueTodayRemaining === 1 ? "" : "s"} in queue</MicroText>
                    </div>
                  )}
                </>
              )}
            </SectionWrapper>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <SectionWrapper className="memoria-panel">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <MicroText>Next Rehearsal</MicroText>
                  <SectionTitle>Upcoming Reviews</SectionTitle>
                </div>
                <MicroText>Next 3 days of your queue</MicroText>
              </div>

              {upcoming.length === 0 ? (
                <div className="memoria-empty">
                  <p>No reviews scheduled for the next three days.</p>
                </div>
              ) : (
                <div className="memoria-upcoming-strip">
                  {upcoming.map((concept) => renderCard(concept, "compact"))}
                </div>
              )}
            </SectionWrapper>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <SectionWrapper className="memoria-panel memoria-ledger">
              <div className="memoria-ledger__grid">
                <div className="memoria-ledger__card">
                  <MicroText>Daily Ritual</MicroText>
                  <div className="memoria-ledger__value">{metrics.streak} day streak</div>
                  <div className="memoria-ledger__hint">Keep cadence steady; next due {nextDueLabel}.</div>
                </div>
                <div className="memoria-ledger__card">
                  <MicroText>Queue</MicroText>
                  <div className="memoria-ledger__value">
                    {dueToday.length} due · {upcomingCount} upcoming
                  </div>
                  <div className="memoria-ledger__hint">Prioritize weakest first.</div>
                </div>
                <div className="memoria-ledger__card">
                  <MicroText>Mastery</MicroText>
                  <div className="memoria-ledger__value">{metrics.masteredCount} mastered</div>
                  <div className="memoria-ledger__hint">Strengthen anchors daily.</div>
                </div>
              </div>

              <div className="memoria-ledger__metrics">
                <MemoriaMetricsPanel
                  streak={metrics.streak}
                  masteredCount={metrics.masteredCount}
                  weakest={metrics.weakest}
                  strongest={metrics.strongest}
                />
              </div>
            </SectionWrapper>
          </motion.div>
        </PageWrapper>
      </div>
    </div>
  );
}
