"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileCard } from "@/components/mobile/MobileCard";
import { BottomSheet } from "@/components/mobile/BottomSheet";
import { BottomNav } from "@/components/mobile/BottomNav";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { useTheme } from "@/context/ThemeContext";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Mobile-optimized Oikos page example
 *
 * Features:
 * - Single-column stacked cards
 * - LECTIO/RITUAL/MEMORIA as accordions
 * - Feed items as MobileCard
 * - Micro-tests in BottomSheet
 */
export function MobileOikosExample() {
  const { currentTheme } = useTheme();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showMicroTest, setShowMicroTest] = useState(false);

  const accordions = [
    { id: "lectio", title: "LECTIO", content: "Reading assignments..." },
    { id: "ritual", title: "RITUAL", content: "Daily rituals..." },
    { id: "memoria", title: "MEMORIA", content: "Memory reviews..." },
  ];

  const feedItems = [
    {
      id: 1,
      type: "LECTIO",
      title: "CONTINVA VIRTUS VT HABITUS",
      description: "Reread the central argument on virtue...",
      time: "12 MIN",
    },
    {
      id: 2,
      type: "RITVAL",
      title: "EXERCITIVM QVAESTIO MATVTINA",
      description: "Answer in three short lines...",
      time: "5 MIN",
    },
  ];

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: currentTheme.background }}
    >
      <MobileHeader title="OIKOS" subtitle="Daily Study Chamber" />

      <div className="px-4 pt-4 space-y-4 pb-24">
        {/* Accordions */}
        {accordions.map((accordion) => (
          <MobileCard
            key={accordion.id}
            variant="elevated"
            onClick={() =>
              setOpenAccordion(
                openAccordion === accordion.id ? null : accordion.id
              )
            }
          >
            <div className="flex items-center justify-between">
              <h3
                className="font-serif text-lg"
                style={{ color: currentTheme.accent }}
              >
                {accordion.title}
              </h3>
              {openAccordion === accordion.id ? (
                <ChevronUp size={20} style={{ color: currentTheme.accent }} />
              ) : (
                <ChevronDown size={20} style={{ color: currentTheme.accent }} />
              )}
            </div>
            <AnimatePresence>
              {openAccordion === accordion.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <p
                    className="font-mono text-sm"
                    style={{ color: `${currentTheme.accent}99` }}
                  >
                    {accordion.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </MobileCard>
        ))}

        {/* Feed Items as MobileCard */}
        <div className="space-y-4 mt-6">
          <h2
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: `${currentTheme.accent}99` }}
          >
            SCROLLVS HODIERNVS
          </h2>
          {feedItems.map((item) => (
            <MobileCard
              key={item.id}
              variant="default"
              onClick={() => setShowMicroTest(true)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-xs px-2 py-1 rounded"
                    style={{
                      background: `${currentTheme.accent}20`,
                      color: currentTheme.accent,
                    }}
                  >
                    {item.type}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: `${currentTheme.accent}99` }}
                  >
                    {item.time}
                  </span>
                </div>
                <h3
                  className="font-serif text-base"
                  style={{ color: currentTheme.accent }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-mono text-sm"
                  style={{ color: `${currentTheme.accent}99` }}
                >
                  {item.description}
                </p>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Micro-test BottomSheet */}
      <BottomSheet
        isOpen={showMicroTest}
        onClose={() => setShowMicroTest(false)}
        title="Micro Test"
        snapPoints={[60, 90]}
      >
        <div className="p-4 space-y-4">
          <p
            className="font-mono text-sm"
            style={{ color: `${currentTheme.accent}99` }}
          >
            Test content goes here...
          </p>
        </div>
      </BottomSheet>

      <BottomNav />
    </div>
  );
}
