"use client";

import { motion } from "framer-motion";
import { EngravedHeader } from "@/components/core/EngravedHeader";
import { StreakFlame } from "./StreakFlame";

const dailyQuotes = [
  "Sapientia est scientia cum virtute coniuncta.",
  "Non scholae sed vitae discimus.",
  "Veritas vos liberabit.",
  "Cogito, ergo sum.",
  "Scientia potentia est.",
  "Ars longa, vita brevis.",
  "Docendo discimus.",
  "Nulla dies sine linea.",
];

interface ScholarHeaderProps {
  streak: number;
  quote?: string;
}

export function ScholarHeader({ streak, quote }: ScholarHeaderProps) {
  const selectedQuote =
    quote || dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-center mb-16 relative"
    >
      {/* Halo glow behind title */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(215, 196, 158, 0.2) 0%, transparent 70%)",
          filter: "blur(30px)",
          transform: "scale(1.3)",
          top: "-20%",
        }}
      />

      <div className="relative z-10">
        <EngravedHeader level={1} delay={0.2}>
          SCHOLARIVM
        </EngravedHeader>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif text-xl md:text-2xl mt-6 mb-8 italic"
          style={{
            color: "rgba(215, 196, 158, 0.8)",
            textShadow:
              "1px 1px 2px rgba(0,0,0,0.8), 0 0 15px rgba(215, 196, 158, 0.3)",
          }}
        >
          "{selectedQuote}"
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-4"
        >
          <StreakFlame streak={streak} />
          <div className="font-mono text-sm uppercase tracking-wider">
            <span style={{ color: "rgba(215, 196, 158, 0.6)" }}>STREAK: </span>
            <span style={{ color: "#d7c49e" }}>{streak} DAYS</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
