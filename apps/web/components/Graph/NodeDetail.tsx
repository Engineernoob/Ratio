"use client";

import { motion } from "framer-motion";
import type { GraphNode, NodeDetail } from "@/lib/graph/types";

interface NodeDetailProps {
  detail: NodeDetail | null;
  onClose: () => void;
  onOpenInReader?: (node: GraphNode) => void;
  onAddToMemoria?: (node: GraphNode) => void;
  onAnalyzeInArs?: (node: GraphNode) => void;
}

export function NodeDetailComponent({
  detail,
  onClose,
  onOpenInReader,
  onAddToMemoria,
  onAnalyzeInArs,
}: NodeDetailProps) {
  if (!detail) return null;

  const { node, connections } = detail;

  const nodeTypeLabels: Record<string, string> = {
    book: "BOOK",
    chapter: "CHAPTER",
    memoria: "MEMORIA CARD",
    puzzle: "PUZZLE",
    argument: "ARGUMENT MAP",
    summary: "SUMMARY",
    note: "NOTE",
    highlight: "HIGHLIGHT",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className="absolute right-0 top-0 bottom-0 w-96 p-6 overflow-y-auto"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(215, 196, 158, 0.2)",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 font-mono text-xs uppercase"
        style={{ color: "rgba(215, 196, 158, 0.6)" }}
      >
        ✕ CLOSE
      </button>

      {/* Node type */}
      <div className="mb-4">
        <div
          className="font-mono text-xs uppercase mb-2"
          style={{ color: "rgba(215, 196, 158, 0.5)" }}
        >
          {nodeTypeLabels[node.type] || node.type.toUpperCase()}
        </div>
        <h2
          className="font-serif text-xl uppercase tracking-wide"
          style={{ color: "#d7c49e" }}
        >
          {node.label}
        </h2>
      </div>

      {/* Metadata */}
      {node.metadata && (
        <div className="mb-6 space-y-2">
          {node.metadata.author && (
            <div className="font-mono text-xs">
              <span style={{ color: "rgba(215, 196, 158, 0.5)" }}>
                Author:{" "}
              </span>
              <span style={{ color: "rgba(215, 196, 158, 0.8)" }}>
                {node.metadata.author}
              </span>
            </div>
          )}
          {node.metadata.ease && (
            <div className="font-mono text-xs">
              <span style={{ color: "rgba(215, 196, 158, 0.5)" }}>Ease: </span>
              <span style={{ color: "rgba(215, 196, 158, 0.8)" }}>
                {node.metadata.ease.toFixed(2)}
              </span>
            </div>
          )}
          {node.metadata.difficulty && (
            <div className="font-mono text-xs">
              <span style={{ color: "rgba(215, 196, 158, 0.5)" }}>
                Difficulty:{" "}
              </span>
              <span style={{ color: "rgba(215, 196, 158, 0.8)" }}>
                {node.metadata.difficulty}
              </span>
            </div>
          )}
          <div className="font-mono text-xs">
            <span style={{ color: "rgba(215, 196, 158, 0.5)" }}>
              Importance:{" "}
            </span>
            <span style={{ color: "rgba(215, 196, 158, 0.8)" }}>
              {(node.weight * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {/* Content preview */}
      {node.metadata?.content && (
        <div className="mb-6">
          <div
            className="font-mono text-xs uppercase mb-2"
            style={{ color: "rgba(215, 196, 158, 0.5)" }}
          >
            CONTENT
          </div>
          <p
            className="font-mono text-xs leading-relaxed"
            style={{ color: "rgba(232, 230, 225, 0.7)" }}
          >
            {node.metadata.content.substring(0, 200)}
            {node.metadata.content.length > 200 ? "..." : ""}
          </p>
        </div>
      )}

      {/* Connections */}
      <div className="mb-6">
        <div
          className="font-mono text-xs uppercase mb-3"
          style={{ color: "rgba(215, 196, 158, 0.5)" }}
        >
          CONNECTIONS
        </div>
        <div className="space-y-2">
          <div className="font-mono text-xs">
            <span style={{ color: "rgba(215, 196, 158, 0.5)" }}>
              Incoming: {connections.incoming.length}
            </span>
          </div>
          <div className="font-mono text-xs">
            <span style={{ color: "rgba(215, 196, 158, 0.5)" }}>
              Outgoing: {connections.outgoing.length}
            </span>
          </div>
          <div className="font-mono text-xs">
            <span style={{ color: "rgba(215, 196, 158, 0.5)" }}>
              Related: {connections.relatedNodes.length}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {node.metadata?.url && onOpenInReader && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenInReader(node)}
            className="w-full p-3 border text-left font-mono text-xs uppercase"
            style={{
              borderColor: "rgba(215, 196, 158, 0.3)",
              background: "rgba(215, 196, 158, 0.05)",
              color: "#d7c49e",
            }}
          >
            → Open in Reader
          </motion.button>
        )}

        {node.type === "memoria" && onAddToMemoria && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToMemoria(node)}
            className="w-full p-3 border text-left font-mono text-xs uppercase"
            style={{
              borderColor: "rgba(215, 196, 158, 0.3)",
              background: "rgba(215, 196, 158, 0.05)",
              color: "#d7c49e",
            }}
          >
            → Add to Memoria
          </motion.button>
        )}

        {(node.type === "argument" || node.type === "chapter") &&
          onAnalyzeInArs && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnalyzeInArs(node)}
              className="w-full p-3 border text-left font-mono text-xs uppercase"
              style={{
                borderColor: "rgba(215, 196, 158, 0.3)",
                background: "rgba(215, 196, 158, 0.05)",
                color: "#d7c49e",
              }}
            >
              → Analyze in Ars Rationis
            </motion.button>
          )}
      </div>
    </motion.div>
  );
}
