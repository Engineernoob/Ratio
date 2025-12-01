"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TopNavBar } from "@/components/core/TopNavBar";
import { ToastContainer } from "@/components/core/Toast";
import { useToast } from "@/hooks/useToast";
import { MinimalRow } from "@/components/home";
import { PageWrapper, SectionWrapper } from "@/app/components/ui/layout";
import {
  BodyText,
  DisplayTitle,
  PageSubtitle,
  SectionTitle,
} from "@/app/components/ui/typography";
import "./oikos-hero.css";

interface FeedItem {
  id: string;
  type: string;
  title: string;
  content: string;
  micro_test_q?: string;
  micro_test_a?: string;
  source?: string;
  date_assigned?: string;
}

export default function OikosPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, showToast } = useToast();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const res = await fetch(`/api/feed?date=${today}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Feed request failed: ${res.status}`);
      }

      const data = await res.json();
      const feed = (data.feed || []) as FeedItem[];
      setFeedItems(feed);
    } catch (e) {
      console.error("Feed error:", e);
      showToast("Unable to load the daily feed. Showing offline defaults.", "error");
      setFeedItems([
        {
          id: "lectio-fallback",
          type: "book_summary",
          title: "Begin today's Lectio",
          content: "Open Bibliotheca to continue Meditations or pick a new text.",
          source: "offline",
          date_assigned: today,
        },
        {
          id: "ritual-fallback",
          type: "tiktok",
          title: "Daily Ritual",
          content: "Spend five minutes on a breathing exercise and reflection.",
          source: "offline",
          date_assigned: today,
        },
        {
          id: "memoria-fallback",
          type: "puzzle",
          title: "Memoria Review",
          content: "Revisit a challenging card in Memoria to keep the streak alive.",
          source: "offline",
          date_assigned: today,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress from feed items
  const lectioItems = feedItems.filter((i) =>
    ["book_micro", "book_summary"].includes(i.type)
  );
  const ritualItems = feedItems.filter((i) => i.type === "tiktok");
  const memoriaItems = feedItems.filter((i) => i.type === "puzzle");

  const progressItems = [
    {
      label: "Lectio",
      value: Math.min(lectioItems.length, 3),
      max: 3,
    },
    {
      label: "Rituales",
      value: Math.min(ritualItems.length, 2),
      max: 2,
    },
    {
      label: "Memoria",
      value: Math.min(memoriaItems.length, 5),
      max: 5,
    },
  ];

  // Get content for each row
  const lectioContent =
    lectioItems.length > 0
      ? lectioItems[0].content.length > 120
        ? `${lectioItems[0].content.slice(0, 120)}...`
        : lectioItems[0].content
      : "Continue your reading journey with today's selected texts.";

  const ritualContent =
    ritualItems.length > 0
      ? ritualItems[0].content.length > 120
        ? `${ritualItems[0].content.slice(0, 120)}...`
        : ritualItems[0].content
      : "Engage with today's practice and reflection exercises.";

  const memoriaContent =
    memoriaItems.length > 0
      ? memoriaItems[0].content.length > 120
        ? `${memoriaItems[0].content.slice(0, 120)}...`
        : memoriaItems[0].content
      : "Review and strengthen your knowledge retention.";

  const renderHero = () => (
    <section className="oikos-hero">
      <div className="oikos-hero__image">
        <Image
          src="/oikos-hero.jpg"
          alt="Classical engraving background for Oikos"
          fill
          priority
          sizes="100vw"
          className="oikos-hero__img"
        />
        <div className="oikos-hero__grain" />
        <div className="oikos-hero__vignette" />
        <div className="oikos-hero__dust" />
      </div>
      <div className="oikos-hero__content">
        <div className="oikos-hero__stack">
          <PageSubtitle className="oikos-hero__overline">Ratio / Home Frequency</PageSubtitle>
          <DisplayTitle className="oikos-hero__title">OIKOS</DisplayTitle>
          <BodyText className="oikos-hero__subtitle">
            Clean, monochrome ritual for your daily cadence. Return, read, and revise with space to
            breathe.
          </BodyText>
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="oikos-body relative min-h-screen">
        <TopNavBar />
        {renderHero()}
        <div className="relative z-10 oikos-content">
          <PageWrapper>
            <SectionWrapper className="items-center text-center">
              <BodyText className="max-w-2xl mx-auto">Preparing your daily feed...</BodyText>
            </SectionWrapper>
          </PageWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="oikos-body relative min-h-screen">
      <TopNavBar />
      {renderHero()}

      <div className="relative z-10 oikos-content">
        <PageWrapper>
          <SectionWrapper className="oikos-quickgrid">
            <div className="oikos-quickcard">
              <span className="oikos-quickcard__label">Streak</span>
              <span className="oikos-quickcard__value">12 days</span>
              <span className="oikos-quickcard__hint">Keep cadence steady.</span>
            </div>
            <div className="oikos-quickcard">
              <span className="oikos-quickcard__label">Focus</span>
              <span className="oikos-quickcard__value">Lectio · Meditations</span>
              <span className="oikos-quickcard__hint">Read before noon.</span>
            </div>
            <div className="oikos-quickcard">
              <span className="oikos-quickcard__label">Breath</span>
              <span className="oikos-quickcard__value">5 min box</span>
              <span className="oikos-quickcard__hint">Evening reset.</span>
            </div>
          </SectionWrapper>

          <SectionWrapper className="gap-0">
            <SectionTitle>Today</SectionTitle>
            <MinimalRow
              title="LECTIO"
              content={lectioContent}
              href="/bibliotheca"
              cta={lectioItems.length > 0 ? "Continue →" : "Begin →"}
              delay={0.1}
            />
            <MinimalRow
              title="RITUAL"
              content={ritualContent}
              href="/scholarivm"
              cta={ritualItems.length > 0 ? "Continue →" : "Begin →"}
              delay={0.2}
            />
            <MinimalRow
              title="MEMORIA"
              content={memoriaContent}
              href="/memoria"
              cta={memoriaItems.length > 0 ? "Continue →" : "Begin →"}
              delay={0.3}
            />
          </SectionWrapper>

          <SectionWrapper>
            <SectionTitle>Progress</SectionTitle>
            <div className="oikos-progressgrid">
              {progressItems.map((item) => {
                const pct = Math.round((item.value / item.max) * 100);
                return (
                  <div key={item.label} className="oikos-progresscard">
                    <div className="oikos-progresscard__head">
                      <span className="oikos-progresscard__label">{item.label}</span>
                      <span className="oikos-progresscard__value">
                        {item.value}/{item.max}
                      </span>
                    </div>
                    <div className="oikos-progresscard__bar">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionWrapper>

          <SectionWrapper className="oikos-footergrid">
            <div className="oikos-footerhead">
              <div>
                <PageSubtitle className="oikos-footerhead__overline">Closure</PageSubtitle>
                <DisplayTitle className="oikos-footerhead__title">Evening Seal</DisplayTitle>
              </div>
              <div className="oikos-footerhead__cta">
                <span className="oikos-pill">Reset cadence</span>
              </div>
            </div>
            <div className="oikos-footercards">
              <div className="oikos-footercard">
                <span className="oikos-footercard__label">Next Step</span>
                <span className="oikos-footercard__value">Draft one distilled insight.</span>
                <span className="oikos-footercard__hint">Archive to Archivvm after review.</span>
              </div>
              <div className="oikos-footercard">
                <span className="oikos-footercard__label">Recall Anchor</span>
                <span className="oikos-footercard__value">Memoria: “Stoic control / indifference.”</span>
                <span className="oikos-footercard__hint">Repeat thrice, eyes closed.</span>
              </div>
              <div className="oikos-footercard">
                <span className="oikos-footercard__label">Breath Rite</span>
                <span className="oikos-footercard__value">Box breath 5x cycles.</span>
                <span className="oikos-footercard__hint">Seal the session, release tension.</span>
              </div>
            </div>

            <div className="oikos-footerline">
              <span>Day opening</span>
              <span>Study block</span>
              <span>Ritual</span>
              <span>Seal</span>
            </div>
          </SectionWrapper>
        </PageWrapper>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
