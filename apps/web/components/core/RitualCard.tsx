"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RitualCardProps {
  className?: string;
  delay?: number;
}

export function RitualCard({ className, delay = 0.1 }: RitualCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-[#0e0e0e] border border-[#1a1a1a] p-6",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="font-serif text-lg font-semibold text-[#d4af37] mb-1">
          RITVAL - DAILY PRACTICE
        </h3>
        <p className="font-mono text-xs text-[#888888] uppercase tracking-wider">
          EXERCITIA
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs text-[#cccccc]">
        <div>
          <p className="mb-1">QVAESTIONES MATVTINAE</p>
          <p className="text-[#888888]">
            3 RESPONSA • REFLEXIO BREVIS
          </p>
        </div>

        <div>
          <p className="mb-1">PROBLEMA LOGICVM</p>
          <p className="text-[#888888]">
            SYLLOGISMI • 1 SERIE APERTA
          </p>
        </div>

        <div className="pt-4 border-t border-[#1a1a1a]">
          <button className="text-[#cccccc] hover:text-white transition-colors flex items-center gap-2">
            <span>•</span>
            <span>INITIARE RITVALE</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

