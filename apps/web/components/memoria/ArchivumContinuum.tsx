"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArchivumStats, Concept } from "@/lib/memoriaData";

interface ArchivumContinuumProps {
  stats: ArchivumStats;
  strongestConcepts: Concept[];
  weakestConcepts: Concept[];
  onExport: () => void;
}

export function ArchivumContinuum({
  stats,
  strongestConcepts,
  weakestConcepts,
  onExport,
}: ArchivumContinuumProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className={cn(
        "rounded-lg p-6",
        "bg-[rgba(0,0,0,0.6)]",
        "border border-[rgba(42,42,42,0.15)]",
        "backdrop-blur-sm"
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-gold">
          ARCHIVVM CONTINVVUM
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Stats */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-gold mb-3">
            TOTAL KNOVVLEDGE STORED
          </h3>
          <div className="space-y-2 font-mono text-xs text-gold leading-relaxed">
            <p>
              b7 {stats.persistentCards} persistent cards across {stats.sources}{" "}
              sources.
            </p>
            <p>b7 {stats.dialecticEntries} dialectic entries canonized.</p>
            <p className="mt-4">STATE: {stats.state}</p>
          </div>
        </div>

        {/* Middle Column - Strongest Concepts */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-gold mb-3">
            STRONGEST CONCEPTS
          </h3>
          <div className="space-y-1">
            {strongestConcepts.map((concept, index) => (
              <p key={index} className="font-mono text-xs text-gold">
                b7 {concept.title}
              </p>
            ))}
          </div>
        </div>

        {/* Right Column - Weakest Concepts */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-gold mb-3">
            WEAKEST CONCEPTS
          </h3>
          <div className="space-y-1">
            {weakestConcepts.map((concept, index) => (
              <p key={index} className="font-mono text-xs text-gold">
                b7 {concept.title}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end pt-4 border-t border-[rgba(215,196,158,0.2)]">
        <button
          onClick={onExport}
          className={cn(
            "px-4 py-2 rounded",
            "border border-gold",
            "text-gold font-mono text-xs uppercase tracking-wider",
            "bg-[rgba(0,0,0,0.3)]",
            "hover:bg-[rgba(215,196,158,0.1)]",
            "transition-all duration-200"
          )}
          style={{
            boxShadow: "0 0 10px rgba(215,196,158,0.2)",
          }}
        >
          EXPORT ALL NOTES
        </button>
      </div>
    </motion.div>
  );
}
