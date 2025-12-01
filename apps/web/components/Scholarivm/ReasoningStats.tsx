"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReasoningStats as ReasoningStatsType } from "@/lib/scholarivm/utils";

interface ReasoningStatsProps {
  stats: ReasoningStatsType;
  delay?: number;
}

export function ReasoningStats({ stats, delay = 0 }: ReasoningStatsProps) {
  const [animatedStats, setAnimatedStats] = useState({
    fallacyAccuracy: 0,
    logicPuzzleAccuracy: 0,
    syllogismMastery: 0,
  });

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        fallacyAccuracy: stats.fallacyAccuracy * easeOut,
        logicPuzzleAccuracy: stats.logicPuzzleAccuracy * easeOut,
        syllogismMastery: stats.syllogismMastery * easeOut,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedStats(stats);
      }
    };

    animate();
  }, [stats]);

  const StatBar = ({
    label,
    valueKey,
    index,
  }: {
    label: string;
    valueKey: keyof typeof animatedStats;
    index: number;
  }) => {
    const value = animatedStats[valueKey];
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay + index * 0.1 }}
        className="mb-4"
      >
        <div className="flex justify-between items-center mb-2">
          <span
            className="font-mono text-xs uppercase"
            style={{ color: "rgba(215, 196, 158, 0.6)" }}
          >
            {label}
          </span>
          <span
            className="font-serif text-lg font-bold"
            style={{ color: "#d7c49e" }}
          >
            {Math.round(value)}%
          </span>
        </div>
        <div
          className="h-2 rounded-sm overflow-hidden"
          style={{
            background: "rgba(215, 196, 158, 0.1)",
            border: "1px solid rgba(215, 196, 158, 0.2)",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${value}%`,
            }}
            transition={{
              duration: 1,
              delay: delay + index * 0.1 + 0.3,
              ease: "easeOut",
            }}
            className="h-full"
            style={{
              background:
                "linear-gradient(to right, rgba(215, 196, 158, 0.6), rgba(215, 196, 158, 0.8))",
              boxShadow: "0 0 10px rgba(215, 196, 158, 0.3)",
            }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative p-6 border rounded-sm"
      style={{
        borderColor: "rgba(215, 196, 158, 0.2)",
        background: "rgba(10, 10, 10, 0.6)",
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Marble texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 rounded-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23marble)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10">
        <h3
          className="font-serif text-sm uppercase tracking-wider mb-6 engraved-text"
          style={{ color: "#d7c49e" }}
        >
          Reasoning Stats
        </h3>

        <StatBar
          label="Fallacy Accuracy"
          valueKey="fallacyAccuracy"
          index={0}
        />
        <StatBar
          label="Logic Puzzle Accuracy"
          valueKey="logicPuzzleAccuracy"
          index={1}
        />
        <StatBar
          label="Syllogism Mastery"
          valueKey="syllogismMastery"
          index={2}
        />
      </div>
    </motion.div>
  );
}
