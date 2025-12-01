"use client";

import { motion } from "framer-motion";

interface AnalyzerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AnalyzerInput({ value, onChange }: AnalyzerInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label
        className="block font-serif text-lg mb-3"
        style={{ color: "#C8B68D" }}
      >
        Enter Argument
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-48 px-4 py-3 bg-transparent border font-mono text-sm outline-none resize-none"
        style={{
          color: "#C8B68D",
          borderColor: "rgba(200, 182, 141, 0.3)",
          background: "rgba(10, 10, 10, 0.5)",
          borderRadius: "4px",
        }}
        placeholder="Enter your argument here, one premise per line. Use 'therefore' or 'thus' to indicate the conclusion..."
      />
    </motion.div>
  );
}
