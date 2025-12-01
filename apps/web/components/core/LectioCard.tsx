"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LectioCardProps {
  className?: string;
  delay?: number;
}

export function LectioCard({ className, delay = 0 }: LectioCardProps) {
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
          LECTIO - READING & STUDY
        </h3>
        <p className="font-mono text-xs text-[#888888] uppercase tracking-wider">
          MANVSCRIPTA
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs text-[#cccccc]">
        <div>
          <p className="mb-1">ETHICA NICOMACHEA, LIB. II</p>
          <p className="text-[#888888]">
            NEXT: CAPVT 5 • 18 MIN REMANENT
          </p>
        </div>

        <div>
          <p className="mb-1">DE ANIMA — COMMENTARIA</p>
          <p className="text-[#888888]">
            NOTAE: 6 MARGINES • 2 QVAESTIONES
          </p>
        </div>

        <div className="pt-4 border-t border-[#1a1a1a]">
          <button className="text-[#cccccc] hover:text-white transition-colors flex items-center gap-2">
            <span>•</span>
            <span>CONTINVA LECTIO</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

