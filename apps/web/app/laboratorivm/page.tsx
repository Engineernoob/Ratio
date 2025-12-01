"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TopNavBar } from "@/components/core/TopNavBar";
import { DialecticaCard } from "@/components/lab/DialecticaCard";
import { LogicaCard } from "@/components/lab/LogicaCard";
import { MicroLessonCard, MicroLesson } from "@/components/lab/MicroLessonCard";
import { Workspace } from "@/components/lab/Workspace";
import { Continuum } from "@/components/lab/Continuum";
import { ProgressWidget } from "@/components/home";
import {
  PageWrapper,
  RightSidebarWrapper,
  SectionWrapper,
} from "@/app/components/ui/layout";
import {
  BodyText,
  DisplayTitle,
  PageSubtitle,
  SectionTitle,
} from "@/app/components/ui/typography";
import dialecticaData from "@/data/lab/dialectica.json";
import problemataData from "@/data/lab/problemata.json";
import moduliData from "@/data/lab/moduli.json";
import "@/styles/lab.css";
import "./laboratorivm.css";

interface DialecticaData {
  dailyQuestion: string;
  counterarguments: string[];
  clarityTests: string[];
}

interface ProblemataData {
  today: {
    id: string;
    prompt: string;
    solution?: string;
    explanation?: string[];
    category?: string;
    difficulty?: string;
  };
  variants: Array<{
    id: string;
    prompt: string;
    category?: string;
    difficulty?: string;
  }>;
}

interface ModuliData {
  lessons: MicroLesson[];
}

export default function LaboratorivmPage() {
  const [selectedLesson, setSelectedLesson] = useState<MicroLesson | null>(
    null
  );
  const [showCounterargument, setShowCounterargument] = useState(false);
  const [showClarityTest, setShowClarityTest] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(0);

  // Status metrics (would be loaded from localStorage or API)
  const [lectioComplete, setLectioComplete] = useState(45);
  const [ritvaliaFacta, setRitvaliaFacta] = useState(60);
  const [memoriaRevisio, setMemoriaRevisio] = useState(75);

  // Load status from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lab-status");
    if (saved) {
      try {
        const status = JSON.parse(saved);
        setLectioComplete(status.lectioComplete || 45);
        setRitvaliaFacta(status.ritvaliaFacta || 60);
        setMemoriaRevisio(status.memoriaRevisio || 75);
      } catch (e) {
        console.error("Error loading status:", e);
      }
    }
  }, []);

  const handleCounterargument = () => {
    setShowCounterargument(true);
    // In a real implementation, this would generate or show a counterargument
    setTimeout(() => setShowCounterargument(false), 3000);
  };

  const handleClarityTest = () => {
    setShowClarityTest(true);
    // In a real implementation, this would show clarity test questions
    setTimeout(() => setShowClarityTest(false), 3000);
  };

  const handleGenerateVariant = () => {
    if (problemataData && problemataData.variants.length > 0) {
      const nextVariant = (currentVariant + 1) % problemataData.variants.length;
      setCurrentVariant(nextVariant);
    }
  };

  const handleLessonComplete = () => {
    if (selectedLesson) {
      // Update progress
      const newLectio = Math.min(100, lectioComplete + 5);
      setLectioComplete(newLectio);
      setSelectedLesson(null);

      // Save to localStorage
      localStorage.setItem(
        "lab-status",
        JSON.stringify({
          lectioComplete: newLectio,
          ritvaliaFacta,
          memoriaRevisio,
        })
      );
    }
  };

  const handleAddToMemoria = () => {
    // Add lesson to memoria system
    const newMemoria = Math.min(100, memoriaRevisio + 3);
    setMemoriaRevisio(newMemoria);

    // Save to localStorage
    localStorage.setItem(
      "lab-status",
      JSON.stringify({
        lectioComplete,
        ritvaliaFacta,
        memoriaRevisio: newMemoria,
      })
    );
  };

  const continuumItems = [
    { id: "dialectica", label: "Dialectic" },
    { id: "logica", label: "Logic Problemata" },
    { id: "moduli", label: "Micro-Lessons" },
  ];

  const currentPuzzle =
    currentVariant === 0
      ? problemataData.today
      : problemataData.variants[currentVariant - 1] || problemataData.today;

  const progressItems = [
    { label: "Lectio Completa", value: lectioComplete, max: 100 },
    { label: "Ritvalia Facta", value: ritvaliaFacta, max: 100 },
    { label: "Memoria Revisio", value: memoriaRevisio, max: 100 },
  ];

  const renderHero = () => (
    <section className="lab-hero">
      <div className="lab-hero__image">
        <Image
          src="/artwork/classical/roman_ritual.png"
          alt="Monochrome ritual relief"
          fill
          priority
          sizes="100vw"
          className="lab-hero__img"
        />
        <div className="lab-hero__grain" />
        <div className="lab-hero__vignette" />
      </div>
      <div className="lab-hero__content">
        <div className="lab-hero__stack">
          <PageSubtitle className="lab-hero__overline">Ratio / Workshop</PageSubtitle>
          <DisplayTitle className="lab-hero__title">LABORATORIVM</DisplayTitle>
          <BodyText className="lab-hero__subtitle">
            Practice ground for logic and rhetoric—lighter monochrome air, clear framing, and space
            to iterate.
          </BodyText>
        </div>
      </div>
    </section>
  );

  return (
    <div className="lab-body relative min-h-screen">
      <TopNavBar />
      {renderHero()}
      <div className="relative z-10 lab-content">
        <PageWrapper>
          <SectionWrapper className="lab-quickgrid">
            <div className="lab-quickcard">
              <span className="lab-quickcard__label">Lectio</span>
              <span className="lab-quickcard__value">{lectioComplete}%</span>
              <span className="lab-quickcard__hint">Text drills sealed</span>
            </div>
            <div className="lab-quickcard">
              <span className="lab-quickcard__label">Rituales</span>
              <span className="lab-quickcard__value">{ritvaliaFacta}%</span>
              <span className="lab-quickcard__hint">Completed rites</span>
            </div>
            <div className="lab-quickcard">
              <span className="lab-quickcard__label">Memoria</span>
              <span className="lab-quickcard__value">{memoriaRevisio}%</span>
              <span className="lab-quickcard__hint">Retention lattice</span>
            </div>
          </SectionWrapper>

          <SectionWrapper>
            <SectionTitle>Continuum</SectionTitle>
            <Continuum items={continuumItems} />
          </SectionWrapper>

          <SectionWrapper className="lab-streams">
            <div className="lab-streams__head">
              <SectionTitle>Practice Streams</SectionTitle>
              <BodyText className="lab-streams__hint">
                Daily dialectic and logic drills, framed with room to breathe.
              </BodyText>
            </div>
            <div className="lab-streams__grid">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="lab-streams__card"
              >
                <div className="lab-streams__meta">
                  <span className="lab-streams__pill">Dialectic</span>
                  <span className="lab-streams__mini">Socratic drills</span>
                </div>
                <DialecticaCard
                  dailyQuestion={dialecticaData.dailyQuestion}
                  onCounterargument={handleCounterargument}
                  onClarityTest={handleClarityTest}
                />
              </motion.div>

              {currentPuzzle && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="lab-streams__card"
                >
                  <div className="lab-streams__meta">
                    <span className="lab-streams__pill">Logic Problemata</span>
                    <span className="lab-streams__mini">Variants & solutions</span>
                  </div>
                  <LogicaCard
                    puzzle={currentPuzzle}
                    onRevealSolution={() => {}}
                    onExplain={() => {}}
                    onGenerateVariant={handleGenerateVariant}
                  />
                </motion.div>
              )}
            </div>
          </SectionWrapper>

          <SectionWrapper className="lab-moduli">
            <div className="lab-moduli__head">
              <SectionTitle>Modvli</SectionTitle>
              <BodyText className="lab-moduli__hint">
                Scroll the micro-lessons and track the lattice at a glance.
              </BodyText>
            </div>
            <div className="lab-moduli__layout">
              <div className="lab-moduli__list">
                {moduliData.lessons.map((lesson, index) => (
                  <MicroLessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onClick={() => setSelectedLesson(lesson)}
                    index={index}
                  />
                ))}
              </div>
              <div className="lab-moduli__sidebar">
                <ProgressWidget items={progressItems} />
              </div>
            </div>
          </SectionWrapper>
        </PageWrapper>
      </div>

      {showCounterargument && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-[#111] border border-white/20"
        >
          <p className="font-mono text-xs text-white">Counterargument generated</p>
        </motion.div>
      )}

      {showClarityTest && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-[#111] border border-white/20"
        >
          <p className="font-mono text-xs text-white">Clarity test ready</p>
        </motion.div>
      )}

      <Workspace
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
        onComplete={handleLessonComplete}
        onAddToMemoria={handleAddToMemoria}
      />
    </div>
  );
}
