"use client";

import { motion } from "framer-motion";
import type { MemoriaStats as MemoriaStatsType } from "@/lib/scholarivm/utils";

interface MemoriaStatsProps {
  stats: MemoriaStatsType;
  delay?: number;
}

export function MemoriaStats({ stats, delay = 0 }: MemoriaStatsProps) {
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
          Memoria Stats
        </h3>

        {/* Active Cards */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span
              className="font-mono text-xs uppercase"
              style={{ color: "rgba(215, 196, 158, 0.6)" }}
            >
              Active Cards
            </span>
            <span
              className="font-serif text-2xl font-bold"
              style={{ color: "#d7c49e" }}
            >
              {stats.activeCards}
            </span>
          </div>
        </div>

        {/* Upcoming Reviews */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span
              className="font-mono text-xs uppercase"
              style={{ color: "rgba(215, 196, 158, 0.6)" }}
            >
              Upcoming Reviews
            </span>
            <span
              className="font-serif text-xl font-bold"
              style={{ color: "#d7c49e" }}
            >
              {stats.upcomingReviews}
            </span>
          </div>
        </div>

        {/* Hardest Cards */}
        <div className="mb-6">
          <div
            className="font-mono text-xs uppercase mb-3"
            style={{ color: "rgba(215, 196, 158, 0.6)" }}
          >
            Hardest Cards
          </div>
          <div className="space-y-2">
            {stats.hardestCards.slice(0, 3).map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: delay + i * 0.1 }}
                className="flex justify-between items-center"
              >
                <span
                  className="font-mono text-xs truncate flex-1"
                  style={{ color: "rgba(215, 196, 158, 0.7)" }}
                >
                  {card.title}
                </span>
                <span
                  className="font-mono text-xs ml-2"
                  style={{ color: "rgba(200, 100, 100, 0.8)" }}
                >
                  Ease: {card.ease.toFixed(2)}
                </span>
              </motion.div>
            ))}
            {stats.hardestCards.length === 0 && (
              <div
                className="font-mono text-xs"
                style={{ color: "rgba(215, 196, 158, 0.4)" }}
              >
                No cards yet
              </div>
            )}
          </div>
        </div>

        {/* Strongest Cards */}
        <div>
          <div
            className="font-mono text-xs uppercase mb-3"
            style={{ color: "rgba(215, 196, 158, 0.6)" }}
          >
            Strongest Cards
          </div>
          <div className="space-y-2">
            {stats.strongestCards.slice(0, 3).map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: delay + i * 0.1 + 0.3 }}
                className="flex justify-between items-center"
              >
                <span
                  className="font-mono text-xs truncate flex-1"
                  style={{ color: "rgba(215, 196, 158, 0.7)" }}
                >
                  {card.title}
                </span>
                <span
                  className="font-mono text-xs ml-2"
                  style={{ color: "rgba(215, 196, 158, 0.8)" }}
                >
                  Ease: {card.ease.toFixed(2)}
                </span>
              </motion.div>
            ))}
            {stats.strongestCards.length === 0 && (
              <div
                className="font-mono text-xs"
                style={{ color: "rgba(215, 196, 158, 0.4)" }}
              >
                No mastered cards yet
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
