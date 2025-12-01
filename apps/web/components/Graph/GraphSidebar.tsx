"use client";

import { motion } from "framer-motion";
import type { GraphTheme } from "@/lib/graph/types";

interface GraphSidebarProps {
  theme: GraphTheme;
  onThemeChange: (theme: GraphTheme) => void;
  nodeCount: number;
  edgeCount: number;
  selectedNodeType?: string;
}

export function GraphSidebar({
  theme,
  onThemeChange,
  nodeCount,
  edgeCount,
  selectedNodeType,
}: GraphSidebarProps) {
  const themes: GraphTheme[] = ["AUREA", "SYNAPSE", "GLACIES", "CLASSICAL"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute left-0 top-0 bottom-0 w-64 p-6 overflow-y-auto"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(215, 196, 158, 0.2)",
      }}
    >
      {/* Title */}
      <div className="mb-6">
        <h2
          className="font-serif text-lg uppercase tracking-wide mb-2"
          style={{ color: "#d7c49e" }}
        >
          Knowledge Graph
        </h2>
        <p
          className="font-mono text-xs"
          style={{ color: "rgba(215, 196, 158, 0.5)" }}
        >
          Visualize your learning network
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 space-y-3">
        <div>
          <div
            className="font-mono text-xs uppercase mb-1"
            style={{ color: "rgba(215, 196, 158, 0.5)" }}
          >
            Nodes
          </div>
          <div className="font-serif text-2xl" style={{ color: "#d7c49e" }}>
            {nodeCount}
          </div>
        </div>
        <div>
          <div
            className="font-mono text-xs uppercase mb-1"
            style={{ color: "rgba(215, 196, 158, 0.5)" }}
          >
            Connections
          </div>
          <div className="font-serif text-2xl" style={{ color: "#d7c49e" }}>
            {edgeCount}
          </div>
        </div>
      </div>

      {/* Theme selector */}
      <div className="mb-6">
        <div
          className="font-mono text-xs uppercase mb-3"
          style={{ color: "rgba(215, 196, 158, 0.5)" }}
        >
          Theme
        </div>
        <div className="space-y-2">
          {themes.map((t) => (
            <motion.button
              key={t}
              onClick={() => onThemeChange(t)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-2 border text-left font-mono text-xs ${
                theme === t
                  ? "border-[#d7c49e] bg-[rgba(215,196,158,0.1)]"
                  : "border-[rgba(215,196,158,0.2)]"
              }`}
              style={{
                color: theme === t ? "#d7c49e" : "rgba(215, 196, 158, 0.6)",
              }}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Node type legend */}
      <div>
        <div
          className="font-mono text-xs uppercase mb-3"
          style={{ color: "rgba(215, 196, 158, 0.5)" }}
        >
          Node Types
        </div>
        <div className="space-y-2">
          {[
            { type: "book", label: "Books", color: "rgba(215, 196, 158, 0.8)" },
            {
              type: "chapter",
              label: "Chapters",
              color: "rgba(178, 155, 104, 0.6)",
            },
            {
              type: "memoria",
              label: "Memoria",
              color: "rgba(100, 200, 255, 0.7)",
            },
            {
              type: "puzzle",
              label: "Puzzles",
              color: "rgba(255, 150, 100, 0.7)",
            },
            {
              type: "argument",
              label: "Arguments",
              color: "rgba(200, 100, 255, 0.7)",
            },
            {
              type: "summary",
              label: "Summaries",
              color: "rgba(150, 255, 150, 0.7)",
            },
          ].map(({ type, label, color }) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: color }}
              />
              <span
                className="font-mono text-xs"
                style={{ color: "rgba(215, 196, 158, 0.6)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected node info */}
      {selectedNodeType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-3 border rounded-sm"
          style={{
            borderColor: "rgba(215, 196, 158, 0.3)",
            background: "rgba(215, 196, 158, 0.05)",
          }}
        >
          <div
            className="font-mono text-xs uppercase mb-1"
            style={{ color: "rgba(215, 196, 158, 0.5)" }}
          >
            Selected
          </div>
          <div className="font-mono text-xs" style={{ color: "#d7c49e" }}>
            {selectedNodeType}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
