"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { GraphEdge } from "@/lib/graph/types";

interface GraphEdgeProps {
  edge: GraphEdge;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isHighlighted: boolean;
}

const edgeTypeStyles: Record<string, { color: string; dashArray?: string }> = {
  contains: {
    color: "rgba(215, 196, 158, 0.4)",
  },
  references: {
    color: "rgba(100, 200, 255, 0.3)",
    dashArray: "5,5",
  },
  related: {
    color: "rgba(178, 155, 104, 0.3)",
    dashArray: "3,3",
  },
  derived: {
    color: "rgba(255, 150, 100, 0.3)",
    dashArray: "8,4",
  },
  similar: {
    color: "rgba(200, 100, 255, 0.2)",
    dashArray: "2,2",
  },
};

export const GraphEdgeComponent = memo(function GraphEdgeComponent({
  edge,
  sourceX,
  sourceY,
  targetX,
  targetY,
  isHighlighted,
}: GraphEdgeProps) {
  const style = edgeTypeStyles[edge.type] || edgeTypeStyles.related;
  const opacity = isHighlighted
    ? 0.8
    : style.color.match(/[\d.]+/)?.[0]
    ? parseFloat(style.color.match(/[\d.]+/)?.[0] || "0.3")
    : 0.3;

  return (
    <motion.line
      x1={sourceX}
      y1={sourceY}
      x2={targetX}
      y2={targetY}
      stroke={style.color}
      strokeWidth={isHighlighted ? 2 * edge.strength : edge.strength}
      strokeDasharray={style.dashArray}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: 1,
        opacity: isHighlighted ? opacity * 1.5 : opacity,
      }}
      transition={{
        pathLength: { duration: 0.5, ease: "easeOut" },
        opacity: { duration: 0.3 },
      }}
      style={{
        filter: isHighlighted ? `drop-shadow(0 0 2px ${style.color})` : "none",
      }}
    />
  );
});
