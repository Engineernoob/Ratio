"use client";

import { motion } from "framer-motion";

interface BookSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BookSearch({
  value,
  onChange,
  placeholder = "Search by title, author, or tag...",
}: BookSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 max-w-2xl mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/20 font-mono text-sm text-white placeholder-[#b7b7b7] focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
        />
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url('/images/textures/texture_bayer.png')",
              backgroundSize: "256px 256px",
              backgroundRepeat: "repeat",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
