"use client";

import { motion } from "framer-motion";
import type { ArgumentMap, ArgumentNode } from "@/lib/logic/types";

interface ArgumentTreeProps {
  map: ArgumentMap | null;
}

export function ArgumentTree({ map }: ArgumentTreeProps) {
  if (!map) {
    return (
      <div className="argument-tree__empty">
        Analyze an argument first to generate the tree.
      </div>
    );
  }

  const root =
    map.nodes.find((node) => node.type === "conclusion") ?? map.nodes[0];

  const levels: ArgumentNode[][] = [];
  const visited = new Set<string>();
  const queue: Array<{ node: ArgumentNode; depth: number }> = [
    { node: root, depth: 0 },
  ];

  while (queue.length) {
    const { node, depth } = queue.shift()!;
    if (visited.has(node.id)) continue;
    visited.add(node.id);

    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(node);

    const children = map.edges
      .filter((edge) => edge.to === node.id)
      .map((edge) => map.nodes.find((n) => n.id === edge.from))
      .filter((child): child is ArgumentNode => Boolean(child));

    children.forEach((child) => queue.push({ node: child, depth: depth + 1 }));
  }

  const width = 960;
  const levelHeight = 140;
  const viewBoxHeight = Math.max(240, levels.length * levelHeight + 80);

  const positions: Record<string, { x: number; y: number }> = {};
  levels.forEach((levelNodes, depth) => {
    const gap = width / (levelNodes.length + 1);
    levelNodes.forEach((node, index) => {
      positions[node.id] = {
        x: (index + 1) * gap,
        y: depth * levelHeight + 60,
      };
    });
  });

  map.nodes.forEach((node, index) => {
    if (!positions[node.id]) {
      positions[node.id] = {
        x: ((index + 1) / (map.nodes.length + 1)) * width,
        y: levels.length * levelHeight + 60,
      };
    }
  });

  return (
    <div className="argument-tree">
      <svg
        width="100%"
        height={viewBoxHeight}
        viewBox={`0 0 ${width} ${viewBoxHeight}`}
      >
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
          </linearGradient>
        </defs>
        {map.edges.map((edge, idx) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const midX = (from.x + to.x) / 2;
          const control = `${midX},${to.y - 30}`;
          const path = `M${from.x},${from.y} Q ${control} ${to.x},${to.y}`;
          return (
            <path
              key={idx}
              d={path}
              fill="none"
              stroke="url(#edgeGradient)"
              strokeWidth="2"
              className="argument-tree__edge"
            />
          );
        })}

        {map.nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const isRoot = node.id === root.id;
          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isRoot ? 34 : 28}
                className={`argument-tree__node ${
                  isRoot ? "is-root" : ""
                }`.trim()}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="argument-tree__label"
              >
                {node.text.length > 30
                  ? `${node.text.slice(0, 28)}…`
                  : node.text}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
