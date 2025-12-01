"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopNavBar } from "@/components/core/TopNavBar";
import { useTheme } from "@/context/ThemeContext";
import { getAllThemes } from "@/lib/theme";
import { ThemePreviewCard } from "@/components/theme/ThemePreviewCard";
import { Background } from "@/app/components/ui/background";
import { PageWrapper, SectionWrapper } from "@/app/components/ui/layout";
import {
  BodyText,
  DisplayTitle,
  PageSubtitle,
  SectionTitle,
} from "@/app/components/ui/typography";

export default function AppearancePage() {
  const { currentTheme, setTheme } = useTheme();
  const themes = getAllThemes();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleThemeChange = (themeId: string) => {
    if (themeId === currentTheme.id) return;

    setIsTransitioning(true);
    setTheme(themeId as never);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <div className="relative min-h-screen">
      <Background />
      <TopNavBar />
      <div className="relative z-10">
        <PageWrapper>
          <motion.div
            className="items-center text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionWrapper className="items-center text-center">
              <PageSubtitle>Scholarivm / Appearance</PageSubtitle>
              <DisplayTitle>VARIAE AURAE</DisplayTitle>
              <BodyText>Choose your aura.</BodyText>
            </SectionWrapper>
          </motion.div>

          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                className="fixed inset-0 z-50 pointer-events-none"
                style={{
                  background: "var(--background)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          <SectionWrapper>
            <SectionTitle>Theme Library</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme, index) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <ThemePreviewCard
                    theme={theme}
                    isSelected={currentTheme.id === theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                  />
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper>
            <SectionTitle>Current Theme</SectionTitle>
            <motion.div
              className="max-w-2xl"
              style={{
                background: "rgba(10, 10, 10, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-6 space-y-4">
                <PageSubtitle>Active</PageSubtitle>
                <SectionTitle>{currentTheme.name}</SectionTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-500">
                      Accent Color
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ background: currentTheme.accent }}
                      />
                      <span className="font-mono text-xs text-neutral-300">
                        {currentTheme.accent}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-500">
                      Ambient Particles
                    </span>
                    <span className="font-mono text-xs text-neutral-300">
                      {currentTheme.ambientParticleType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-500">
                      Vignette Strength
                    </span>
                    <span className="font-mono text-xs text-neutral-300">
                      {currentTheme.vignetteStrength}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </SectionWrapper>
        </PageWrapper>
      </div>
    </div>
  );
}
