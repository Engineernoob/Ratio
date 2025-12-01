"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TopNavBar } from "@/components/core/TopNavBar";
import { LogicHero } from "@/components/logic/LogicHero";
import {
  LogicToolGrid,
  type LogicToolCard,
} from "@/components/logic/LogicToolGrid";
import { LogosConsole } from "@/components/logic/LogosConsole";
import { AnalyzerPane } from "@/components/logic/AnalyzerPane";
import { SyllogismWorkbenchBoard } from "@/components/logic/SyllogismWorkbenchBoard";
import { FallacyQuiz } from "@/components/logic/FallacyQuiz";
import { ArgumentTree } from "@/components/logic/ArgumentTree";
import { LogicCopilot } from "@/components/logic/LogicCopilot";
import {
  parseArgument,
  extractLogicalForm,
  findMissingPremises,
  detectFallacies,
  evaluateValidity,
  buildArgumentMap,
} from "@/lib/logic";
import type {
  Argument,
  ArgumentMap,
  Fallacy,
  Premise,
} from "@/lib/logic/types";
import { PageWrapper, SectionWrapper } from "@/app/components/ui/layout";
import {
  BodyText,
  DisplayTitle,
  PageSubtitle,
  SectionTitle,
} from "@/app/components/ui/typography";
import { BackgroundArt } from "@/components/ui/BackgroundArt";
import { getBackgroundForPage } from "@/lib/backgrounds";
import "@/styles/logic.css";

type ReasoningMode = "analyzer" | "syllogism" | "fallacy" | "mapping";

const toolCards: LogicToolCard[] = [
  {
    id: "analyzer",
    name: "Argument Analyzer",
    description: "Validity pulse, structure detection, symbolic form.",
    icon: <span className="logic-icon">◎</span>,
  },
  {
    id: "syllogism",
    name: "Syllogism Workbench",
    description: "Assemble premises via drag-and-drop components.",
    icon: <span className="logic-icon">↯</span>,
  },
  {
    id: "fallacy",
    name: "Fallacy Trainer",
    description: "Interactive drills to spot flawed reasoning.",
    icon: <span className="logic-icon">⚑</span>,
  },
  {
    id: "mapping",
    name: "Argument Mapping",
    description: "Generate a monochrome argument tree.",
    icon: <span className="logic-icon">☰</span>,
  },
];

export default function ArsRationisPage() {
  const [mode, setMode] = useState<ReasoningMode>("analyzer");
  const [argumentText, setArgumentText] = useState(
    "Premise 1: All patterned signals imply intent.\nPremise 2: This transmission is patterned.\nTherefore: This transmission implies intent."
  );
  const [parsedArgument, setParsedArgument] = useState<Argument | null>(null);
  const [fallacies, setFallacies] = useState<Fallacy[]>([]);
  const [allFallacies, setAllFallacies] = useState<Fallacy[]>([]);
  const [validityResult, setValidityResult] = useState<boolean | null>(null);
  const [argumentMap, setArgumentMap] = useState<ArgumentMap | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<
    "idle" | "running" | "valid" | "invalid"
  >("idle");

  const backgroundSrc = getBackgroundForPage("arsRationis");

  useEffect(() => {
    const loadFallacies = async () => {
      try {
        const response = await fetch("/api/logic/fallacies");
        if (response.ok) {
          const data = await response.json();
          setAllFallacies(data.fallacies || []);
        }
      } catch (error) {
        console.error("Error loading fallacies:", error);
      }
    };

    loadFallacies();
  }, []);

  useEffect(() => {
    if (argumentText && allFallacies.length && !parsedArgument) {
      handleAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFallacies]);

  const logicalForm = useMemo(
    () => (parsedArgument ? extractLogicalForm(parsedArgument) : ""),
    [parsedArgument]
  );

  const missingPremises = useMemo(
    () => (parsedArgument ? findMissingPremises(parsedArgument) : []),
    [parsedArgument]
  );

  const handleAnalyze = () => {
    if (!argumentText.trim()) {
      setParsedArgument(null);
      setFallacies([]);
      setArgumentMap(null);
      setValidityResult(null);
      setAnalysisStatus("idle");
      return;
    }

    setAnalysisStatus("running");
    const argument = parseArgument(argumentText);
    const validity = evaluateValidity(argument);
    const detectedFallacies = detectFallacies(argumentText, allFallacies);
    const map = buildArgumentMap(argument);

    setParsedArgument(argument);
    setFallacies(detectedFallacies);
    setArgumentMap(map);
    setValidityResult(validity === "valid");

    setTimeout(() => {
      setAnalysisStatus(validity === "valid" ? "valid" : "invalid");
    }, 150);
  };

  useEffect(() => {
    if (mode === "mapping" && argumentText.trim()) {
      handleAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleValidityCheck = (premises: Premise[], conclusion: string) => {
    const argument: Argument = {
      premises,
      conclusion: { text: conclusion },
    };

    const validity = evaluateValidity(argument);
    setValidityResult(validity === "valid");
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundArt
        src={backgroundSrc}
        opacity={0.14}
        blur={0.4}
        position="center"
      />
      <TopNavBar />
      <div className="relative z-10">
        <PageWrapper>
          <SectionWrapper className="space-y-8">
            <PageSubtitle>Ratio / Logic Forge</PageSubtitle>
            <DisplayTitle>ARS RATIONIS</DisplayTitle>
            <BodyText className="max-w-3xl">
              Analyze, map, and test reasoning in a monochrome console.
            </BodyText>
            <LogicHero />
          </SectionWrapper>

          <SectionWrapper>
            <SectionTitle>Tools & Workbench</SectionTitle>
            <div className="logic-grid">
              <LogicToolGrid
                tools={toolCards}
                active={mode}
                onSelect={(id) => setMode(id as ReasoningMode)}
              />

              <motion.div
                key={mode}
                className="logic-surface"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {mode === "analyzer" && (
                  <div className="logic-workspace">
                    <LogosConsole
                      value={argumentText}
                      onChange={setArgumentText}
                      onAnalyze={handleAnalyze}
                      modeLabel="Logos Console"
                      status={analysisStatus}
                      size="expanded"
                    />
                    <AnalyzerPane
                      argument={parsedArgument}
                      fallacies={fallacies}
                      missingPremises={missingPremises}
                      logicalForm={logicalForm}
                      validity={validityResult}
                      argumentMap={argumentMap}
                    />
                  </div>
                )}

                {mode === "syllogism" && (
                  <div className="logic-workspace vertical">
                    <SyllogismWorkbenchBoard
                      onValidityCheck={handleValidityCheck}
                    />
                    <div className="logic-feedback">
                      {validityResult === null && (
                        <span className="logic-reading faint">
                          Assemble terms to test validity.
                        </span>
                      )}
                      {validityResult === true && (
                        <span className="logic-reading success">
                          Valid — silver glow applied.
                        </span>
                      )}
                      {validityResult === false && (
                        <span className="logic-reading warn">
                          Invalid — reinforce your middle term.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {mode === "fallacy" && (
                  <div className="logic-workspace vertical">
                    <FallacyQuiz fallacies={allFallacies} />
                  </div>
                )}

                {mode === "mapping" && (
                  <div className="logic-workspace vertical">
                    <LogosConsole
                      value={argumentText}
                      onChange={setArgumentText}
                      onAnalyze={handleAnalyze}
                      modeLabel="Logos Console"
                      status={analysisStatus}
                      size="compact"
                      hint="Press Cmd+Enter to regenerate map"
                    />
                    <ArgumentTree map={argumentMap} />
                    {!argumentMap && (
                      <motion.button
                        className="logic-ghost-button"
                        onClick={() => setMode("analyzer")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Generate from Analyzer
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </SectionWrapper>
        </PageWrapper>
      </div>
      <LogicCopilot
        argumentText={argumentText}
        missingPremises={missingPremises}
        fallacies={fallacies}
      />
    </div>
  );
}
