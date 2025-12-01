"use client";

import { motion } from "framer-motion";

type ReasoningMode = "analyzer" | "syllogism" | "fallacy" | "mapping";

interface ModeSelectorProps {
  selectedMode: ReasoningMode;
  onModeChange: (mode: ReasoningMode) => void;
}

const modes: Array<{ id: ReasoningMode; label: string; description: string }> =
  [
    {
      id: "analyzer",
      label: "Argument Analyzer",
      description: "Parse and evaluate arguments",
    },
    {
      id: "syllogism",
      label: "Syllogism Workbench",
      description: "Build and test syllogisms",
    },
    {
      id: "fallacy",
      label: "Fallacy Trainer",
      description: "Identify logical fallacies",
    },
    {
      id: "mapping",
      label: "Argument Mapping",
      description: "Visualize argument structure",
    },
  ];

export function ModeSelector({
  selectedMode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {modes.map((mode, index) => (
        <motion.button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className="text-left p-6 rounded-lg"
          style={{
            background:
              selectedMode === mode.id
                ? "rgba(200, 182, 141, 0.15)"
                : "rgba(10, 10, 10, 0.7)",
            border: `1px solid ${
              selectedMode === mode.id
                ? "rgba(200, 182, 141, 0.4)"
                : "rgba(200, 182, 141, 0.2)"
            }`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="font-serif text-lg mb-2" style={{ color: "#C8B68D" }}>
            {mode.label}
          </h3>
          <p
            className="font-mono text-xs opacity-60"
            style={{ color: "#C8B68D" }}
          >
            {mode.description}
          </p>
        </motion.button>
      ))}
    </div>
  );
}
