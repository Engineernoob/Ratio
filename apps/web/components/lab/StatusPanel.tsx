"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatusPanelProps {
  lectioComplete: number; // 0-100
  ritvaliaFacta: number; // 0-100
  memoriaRevisio: number; // 0-100
}

function StatusContent({
  lectioComplete,
  ritvaliaFacta,
  memoriaRevisio,
}: StatusPanelProps) {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs text-[#b7b7b7]">
            LECTIO COMPLETA
          </span>
          <span className="font-mono text-xs text-white">
            {lectioComplete}%
          </span>
        </div>
        <div className="h-[2px] w-full bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${lectioComplete}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs text-[#b7b7b7]">
            RITVALIA FACTA
          </span>
          <span className="font-mono text-xs text-white">{ritvaliaFacta}%</span>
        </div>
        <div className="h-[2px] w-full bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${ritvaliaFacta}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs text-[#b7b7b7]">
            MEMORIA REVISIO
          </span>
          <span className="font-mono text-xs text-white">
            {memoriaRevisio}%
          </span>
        </div>
        <div className="h-[2px] w-full bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${memoriaRevisio}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}

export function StatusPanel({
  lectioComplete,
  ritvaliaFacta,
  memoriaRevisio,
}: StatusPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Status Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-16 right-6 z-50 p-4 bg-[#111] border border-white/10 hidden md:block"
        style={{ minWidth: "240px" }}
      >
        <StatusContent
          lectioComplete={lectioComplete}
          ritvaliaFacta={ritvaliaFacta}
          memoriaRevisio={memoriaRevisio}
        />
      </motion.div>

      {/* Mobile Status Panel */}
      <div className="md:hidden fixed top-16 right-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-[#111] border border-white/10 font-mono text-xs text-white"
        >
          STATUS {mobileOpen ? "▲" : "▼"}
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 p-4 bg-[#111] border border-white/10"
              style={{ minWidth: "200px" }}
            >
              <StatusContent
                lectioComplete={lectioComplete}
                ritvaliaFacta={ritvaliaFacta}
                memoriaRevisio={memoriaRevisio}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
