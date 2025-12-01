"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { ArgumentMap, ArgumentNode } from "@/lib/logic/types";
import { scoreClarity } from "@/lib/logic/mapping";
import { NodeEditor } from "./NodeEditor";

interface ArgumentMapCanvasProps {
  map: ArgumentMap;
  onMapChange: (map: ArgumentMap) => void;
}

export function ArgumentMapCanvas({
  map,
  onMapChange,
}: ArgumentMapCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<ArgumentNode | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  // Cancel connection on Escape key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConnectingFrom(null);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleNodeMouseDown = (e: React.MouseEvent, node: ArgumentNode) => {
    if (e.detail === 2) {
      // Double click to edit
      setSelectedNode(node);
      return;
    }

    // Ctrl/Cmd click to start connecting
    if (e.ctrlKey || e.metaKey) {
      setConnectingFrom(node.id);
      return;
    }

    // If connecting, complete the connection
    if (connectingFrom && connectingFrom !== node.id) {
      const newEdge = {
        from: connectingFrom,
        to: node.id,
        type: "support" as const,
      };
      const updatedEdges = [...map.edges, newEdge];
      const updatedMap = {
        ...map,
        edges: updatedEdges,
        clarityScore: scoreClarity({ ...map, edges: updatedEdges }),
      };
      onMapChange(updatedMap);
      setConnectingFrom(null);
      return;
    }

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingNode(node.id);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    const updatedNodes = map.nodes.map((node) =>
      node.id === draggingNode
        ? {
            ...node,
            x: Math.max(0, Math.min(800, newX)),
            y: Math.max(0, Math.min(600, newY)),
          }
        : node
    );

    onMapChange({ ...map, nodes: updatedNodes });
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  // Generate curved path for edge
  const getCurvedPath = (from: ArgumentNode, to: ArgumentNode): string => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const midX = from.x + dx / 2;
    const midY = from.y + dy / 2;

    // Create a curved path
    const controlX = midX + (dy > 0 ? 50 : -50);
    const controlY = midY - (dx > 0 ? 50 : -50);

    return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only add node if clicking on background (not on existing nodes)
    if (
      e.target === svgRef.current ||
      (e.target as SVGElement).tagName === "svg"
    ) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newNode: ArgumentNode = {
        id: `node-${Date.now()}`,
        type: "premise",
        text: "New node",
        x,
        y,
        connections: [],
      };

      const updatedNodes = [...map.nodes, newNode];
      const updatedMap = {
        ...map,
        nodes: updatedNodes,
        clarityScore: scoreClarity({ ...map, nodes: updatedNodes }),
      };
      onMapChange(updatedMap);
    }
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width="100%"
        height="600"
        className="border rounded-lg"
        style={{
          borderColor: "rgba(200, 182, 141, 0.3)",
          background: "rgba(10, 10, 10, 0.8)",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Draw edges */}
        {map.edges.map((edge, index) => {
          const fromNode = map.nodes.find((n) => n.id === edge.from);
          const toNode = map.nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <path
              key={index}
              d={getCurvedPath(fromNode, toNode)}
              fill="none"
              stroke={
                edge.type === "support"
                  ? "rgba(200, 182, 141, 0.4)"
                  : "rgba(200, 182, 141, 0.2)"
              }
              strokeWidth="2"
              markerEnd={
                edge.type === "support"
                  ? "url(#arrowhead-support)"
                  : "url(#arrowhead-attack)"
              }
            />
          );
        })}

        {/* Arrow markers */}
        <defs>
          <marker
            id="arrowhead-support"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="rgba(200, 182, 141, 0.4)" />
          </marker>
          <marker
            id="arrowhead-attack"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="rgba(200, 182, 141, 0.2)" />
          </marker>
        </defs>

        {/* Draw nodes */}
        {map.nodes.map((node) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.type === "conclusion" ? 30 : 25}
              fill={
                connectingFrom === node.id
                  ? "rgba(200, 182, 141, 0.3)"
                  : node.type === "conclusion"
                  ? "rgba(200, 182, 141, 0.2)"
                  : "rgba(200, 182, 141, 0.1)"
              }
              stroke={
                connectingFrom === node.id
                  ? "rgba(200, 182, 141, 0.6)"
                  : "rgba(200, 182, 141, 0.4)"
              }
              strokeWidth={connectingFrom === node.id ? "3" : "2"}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleNodeMouseDown(e, node);
              }}
              whileHover={{ r: node.type === "conclusion" ? 35 : 30 }}
              style={{ cursor: connectingFrom ? "crosshair" : "grab" }}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono text-xs pointer-events-none"
              style={{ fill: "#C8B68D" }}
            >
              {node.text.length > 15
                ? node.text.substring(0, 15) + "..."
                : node.text}
            </text>
          </g>
        ))}
      </svg>

      {/* Instructions */}
      <div
        className="absolute top-4 left-4 p-3 rounded"
        style={{
          background: "rgba(10, 10, 10, 0.8)",
          border: "1px solid rgba(200, 182, 141, 0.3)",
        }}
      >
        <p
          className="font-mono text-xs"
          style={{ color: "rgba(200, 182, 141, 0.7)" }}
        >
          Double-click node to edit
        </p>
        <p
          className="font-mono text-xs"
          style={{ color: "rgba(200, 182, 141, 0.7)" }}
        >
          Ctrl+Click to connect
        </p>
        <p
          className="font-mono text-xs"
          style={{ color: "rgba(200, 182, 141, 0.7)" }}
        >
          Click background to add node
        </p>
        {connectingFrom && (
          <p className="font-mono text-xs mt-2" style={{ color: "#C8B68D" }}>
            Connecting... (Press Esc to cancel)
          </p>
        )}
      </div>

      {/* Clarity Score */}
      {map.clarityScore !== undefined && (
        <div
          className="absolute top-4 right-4 p-3 rounded"
          style={{
            background: "rgba(10, 10, 10, 0.8)",
            border: "1px solid rgba(200, 182, 141, 0.3)",
          }}
        >
          <div
            className="font-mono text-xs opacity-60 mb-1"
            style={{ color: "#C8B68D" }}
          >
            Clarity Score
          </div>
          <div className="font-serif text-2xl" style={{ color: "#C8B68D" }}>
            {map.clarityScore}
          </div>
        </div>
      )}

      {/* Node Editor Modal */}
      {selectedNode && (
        <NodeEditor
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSave={(updatedNode) => {
            const updatedNodes = map.nodes.map((n) =>
              n.id === updatedNode.id ? updatedNode : n
            );
            onMapChange({ ...map, nodes: updatedNodes });
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
}
