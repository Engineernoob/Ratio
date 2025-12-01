"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { GraphNode } from "@/lib/graph/types";

interface GraphNodeProps {
  node: GraphNode;
  x: number;
  y: number;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  theme?: "AUREA" | "SYNAPSE" | "GLACIES" | "CLASSICAL";
}

const nodeTypeColors: Record<
  string,
  { fill: string; stroke: string; glow: string }
> = {
  book: {
    fill: "rgba(215, 196, 158, 0.3)",
    stroke: "rgba(215, 196, 158, 0.8)",
    glow: "rgba(215, 196, 158, 0.5)",
  },
  chapter: {
    fill: "rgba(178, 155, 104, 0.2)",
    stroke: "rgba(178, 155, 104, 0.6)",
    glow: "rgba(178, 155, 104, 0.4)",
  },
  memoria: {
    fill: "rgba(100, 200, 255, 0.2)",
    stroke: "rgba(100, 200, 255, 0.7)",
    glow: "rgba(100, 200, 255, 0.4)",
  },
  puzzle: {
    fill: "rgba(255, 150, 100, 0.2)",
    stroke: "rgba(255, 150, 100, 0.7)",
    glow: "rgba(255, 150, 100, 0.4)",
  },
  argument: {
    fill: "rgba(200, 100, 255, 0.2)",
    stroke: "rgba(200, 100, 255, 0.7)",
    glow: "rgba(200, 100, 255, 0.4)",
  },
  summary: {
    fill: "rgba(150, 255, 150, 0.2)",
    stroke: "rgba(150, 255, 150, 0.7)",
    glow: "rgba(150, 255, 150, 0.4)",
  },
  note: {
    fill: "rgba(255, 255, 150, 0.2)",
    stroke: "rgba(255, 255, 150, 0.7)",
    glow: "rgba(255, 255, 150, 0.4)",
  },
  highlight: {
    fill: "rgba(255, 200, 100, 0.2)",
    stroke: "rgba(255, 200, 100, 0.7)",
    glow: "rgba(255, 200, 100, 0.4)",
  },
};

export const GraphNodeComponent = memo(function GraphNodeComponent({
  node,
  x,
  y,
  isSelected,
  isHovered,
  onClick,
  onHover,
  theme = "AUREA",
}: GraphNodeProps) {
  const colors = nodeTypeColors[node.type] || nodeTypeColors.book;
  const size = 8 + node.weight * 12; // Size based on importance
  const glowSize = isHovered || isSelected ? size * 2.5 : size * 1.5;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Glow effect */}
      {(isHovered || isSelected) && (
        <motion.circle
          r={glowSize}
          fill={colors.glow}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ filter: "blur(8px)" }}
        />
      )}

      {/* Node circle */}
      <motion.circle
        r={size}
        fill={colors.fill}
        stroke={isSelected ? colors.stroke : colors.stroke}
        strokeWidth={isSelected ? 2.5 : 1.5}
        initial={{ scale: 0 }}
        animate={{
          scale: isHovered ? 1.2 : isSelected ? 1.1 : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{
          filter:
            isHovered || isSelected
              ? `drop-shadow(0 0 ${glowSize}px ${colors.glow})`
              : "none",
        }}
      />

      {/* Label */}
      {(isHovered || isSelected) && (
        <motion.text
          y={size + 15}
          textAnchor="middle"
          fill={colors.stroke}
          fontSize="10"
          fontFamily="monospace"
          initial={{ opacity: 0, y: size + 10 }}
          animate={{ opacity: 1, y: size + 15 }}
          style={{
            pointerEvents: "none",
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
          }}
        >
          {node.label.length > 20
            ? node.label.substring(0, 20) + "..."
            : node.label}
        </motion.text>
      )}

      {/* Type indicator */}
      <motion.text
        y={-size - 5}
        textAnchor="middle"
        fill={colors.stroke}
        fontSize="8"
        fontFamily="monospace"
        opacity={0.6}
        style={{ pointerEvents: "none" }}
      >
        {node.type.toUpperCase()}
      </motion.text>
    </g>
  );
});
