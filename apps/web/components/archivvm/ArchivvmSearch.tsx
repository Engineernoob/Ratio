"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface ArchivvmSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ArchivvmSearch({ value, onChange }: ArchivvmSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative"
      animate={{
        scale: isFocused ? 1.01 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="relative flex items-center"
        style={{
          border: `1px solid ${
            isFocused ? "rgba(200, 182, 141, 0.4)" : "rgba(200, 182, 141, 0.1)"
          }`,
          background: "rgba(10, 10, 10, 0.8)",
          borderRadius: "4px",
        }}
      >
        <Search
          className="absolute left-3"
          size={18}
          style={{ color: "rgba(200, 182, 141, 0.5)" }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search the vault..."
          className="w-full pl-10 pr-4 py-3 bg-transparent font-mono text-sm outline-none"
          style={{
            color: "#FFFFFF",
          }}
        />
      </div>
    </motion.div>
  );
}
