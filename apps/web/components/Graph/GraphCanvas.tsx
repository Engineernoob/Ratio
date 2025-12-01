"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import type { GraphNode, GraphEdge, GraphTheme } from "@/lib/graph/types";
import { GraphNodeComponent } from "./GraphNode";
import { GraphEdgeComponent } from "./GraphEdge";

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick: (node: GraphNode) => void;
  theme?: GraphTheme;
  width?: number;
  height?: number;
}

export function GraphCanvas({
  nodes,
  edges,
  onNodeClick,
  theme = "AUREA",
  width = 1200,
  height = 800,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<
    Map<string, { x: number; y: number; vx: number; vy: number }>
  >(new Map());

  // Initialize positions
  useEffect(() => {
    if (nodes.length === 0) return;

    const positions = new Map<
      string,
      { x: number; y: number; vx: number; vy: number }
    >();
    nodes.forEach((node, index) => {
      // Start nodes in a circle
      const angle = (index / nodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      positions.set(node.id, {
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      });
    });
    setNodePositions(positions);
  }, [nodes.length, width, height]);

  // Force simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    let animationId: number;
    let shouldRun = true;

    const simulate = () => {
      if (!shouldRun) return;

      setNodePositions((prevPositions) => {
        if (prevPositions.size === 0) return prevPositions;

        const newPositions = new Map(prevPositions);
        const alpha = 0.1; // Cooling factor
        const chargeStrength = -300;
        const linkDistance = 100;
        const centerX = width / 2;
        const centerY = height / 2;

        // Apply forces
        nodes.forEach((node) => {
          const pos = newPositions.get(node.id);
          if (!pos) return;

          let fx = 0;
          let fy = 0;

          // Center force
          fx += (centerX - pos.x) * 0.01;
          fy += (centerY - pos.y) * 0.01;

          // Charge force (repulsion) - optimized with spatial indexing for large graphs
          // For small graphs (< 100 nodes), O(n²) is acceptable
          if (nodes.length < 100) {
            nodes.forEach((other) => {
              if (other.id === node.id) return;
              const otherPos = newPositions.get(other.id);
              if (!otherPos) return;

              const dx = pos.x - otherPos.x;
              const dy = pos.y - otherPos.y;
              const distanceSq = dx * dx + dy * dy;
              if (distanceSq < 0.01) return; // Skip if too close
              const distance = Math.sqrt(distanceSq);
              const force = chargeStrength / distanceSq;
              fx += (dx / distance) * force;
              fy += (dy / distance) * force;
            });
          } else {
            // For large graphs, use Barnes-Hut approximation or limit interactions
            // Simple optimization: only check nearby nodes
            const maxDistance = 200;
            nodes.forEach((other) => {
              if (other.id === node.id) return;
              const otherPos = newPositions.get(other.id);
              if (!otherPos) return;

              const dx = pos.x - otherPos.x;
              const dy = pos.y - otherPos.y;
              const distanceSq = dx * dx + dy * dy;
              if (distanceSq > maxDistance * maxDistance) return; // Skip far nodes
              if (distanceSq < 0.01) return;
              const distance = Math.sqrt(distanceSq);
              const force = chargeStrength / distanceSq;
              fx += (dx / distance) * force;
              fy += (dy / distance) * force;
            });
          }

          // Link force (attraction)
          edges.forEach((edge) => {
            if (edge.source === node.id) {
              const targetPos = newPositions.get(edge.target);
              if (targetPos) {
                const dx = targetPos.x - pos.x;
                const dy = targetPos.y - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const targetDistance = linkDistance / (edge.strength || 0.5);
                const force =
                  (distance - targetDistance) * 0.1 * (edge.strength || 0.5);
                fx += (dx / distance) * force;
                fy += (dy / distance) * force;
              }
            } else if (edge.target === node.id) {
              const sourcePos = newPositions.get(edge.source);
              if (sourcePos) {
                const dx = sourcePos.x - pos.x;
                const dy = sourcePos.y - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const targetDistance = linkDistance / (edge.strength || 0.5);
                const force =
                  (distance - targetDistance) * 0.1 * (edge.strength || 0.5);
                fx += (dx / distance) * force;
                fy += (dy / distance) * force;
              }
            }
          });

          // Update velocity
          pos.vx = (pos.vx + fx * alpha) * 0.9; // Damping
          pos.vy = (pos.vy + fy * alpha) * 0.9;

          // Update position
          pos.x += pos.vx;
          pos.y += pos.vy;

          // Boundary constraints
          const nodeSize = 8 + node.weight * 12;
          pos.x = Math.max(nodeSize, Math.min(width - nodeSize, pos.x));
          pos.y = Math.max(nodeSize, Math.min(height - nodeSize, pos.y));
        });

        return newPositions;
      });

      animationId = requestAnimationFrame(simulate);
    };

    // Start simulation after a brief delay to ensure positions are initialized
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(simulate);
    }, 200);

    return () => {
      shouldRun = false;
      clearTimeout(timeoutId);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [nodes, edges, width, height]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      setSelectedNodeId(node.id);
      onNodeClick(node);
    },
    [onNodeClick]
  );

  const handleNodeHover = useCallback((hovered: boolean, nodeId: string) => {
    setHoveredNodeId(hovered ? nodeId : null);
  }, []);

  // Memoize edge positions calculation
  const edgePositionsMap = useMemo(() => {
    const map = new Map<
      string,
      { sourceX: number; sourceY: number; targetX: number; targetY: number }
    >();
    edges.forEach((edge) => {
      const sourcePos = nodePositions.get(edge.source);
      const targetPos = nodePositions.get(edge.target);
      map.set(edge.id, {
        sourceX: sourcePos?.x || width / 2,
        sourceY: sourcePos?.y || height / 2,
        targetX: targetPos?.x || width / 2,
        targetY: targetPos?.y || height / 2,
      });
    });
    return map;
  }, [edges, nodePositions, width, height]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ background: "transparent" }}
      >
        {/* Edges */}
        <g>
          {edges.map((edge) => {
            const pos = edgePositionsMap.get(edge.id);
            if (!pos) return null;
            const isHighlighted =
              hoveredNodeId === edge.source ||
              hoveredNodeId === edge.target ||
              selectedNodeId === edge.source ||
              selectedNodeId === edge.target;

            return (
              <GraphEdgeComponent
                key={edge.id}
                edge={edge}
                sourceX={pos.sourceX}
                sourceY={pos.sourceY}
                targetX={pos.targetX}
                targetY={pos.targetY}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;

            return (
              <GraphNodeComponent
                key={node.id}
                node={node}
                x={pos.x}
                y={pos.y}
                isSelected={selectedNodeId === node.id}
                isHovered={hoveredNodeId === node.id}
                onClick={() => handleNodeClick(node)}
                onHover={(hovered) => handleNodeHover(hovered, node.id)}
                theme={theme}
              />
            );
          })}
        </g>
      </svg>

      {/* Controls overlay */}
      <div
        className="absolute top-4 right-4 p-3 border rounded-sm"
        style={{
          borderColor: "rgba(215, 196, 158, 0.2)",
          background: "rgba(10, 10, 10, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="font-mono text-xs space-y-2">
          <div style={{ color: "rgba(215, 196, 158, 0.6)" }}>
            Nodes: {nodes.length}
          </div>
          <div style={{ color: "rgba(215, 196, 158, 0.6)" }}>
            Edges: {edges.length}
          </div>
          <div style={{ color: "rgba(215, 196, 158, 0.6)" }}>
            Theme: {theme}
          </div>
        </div>
      </div>
    </div>
  );
}
