"use client";

import { motion } from "framer-motion";
import { FogPanel } from "./core/FogPanel";
import { cn } from "@/lib/utils";

interface KnowledgeNodeProps {
  id: string;
  type: "idea" | "lesson" | "test" | "definition" | "quote" | "cluster";
  title: string;
  content?: string;
  x: number;
  y: number;
  onDrag?: (id: string, x: number, y: number) => void;
  className?: string;
}

const typeLabels = {
  idea: "Key Idea",
  lesson: "Micro-Lesson",
  test: "Micro-Test",
  definition: "Definition",
  quote: "Quote",
  cluster: "Concept Cluster",
};

export function KnowledgeNode({
  id,
  type,
  title,
  content,
  x,
  y,
  onDrag,
  className,
}: KnowledgeNodeProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (onDrag) {
          onDrag(id, x + info.offset.x, y + info.offset.y);
        }
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, x, y }}
      transition={{ duration: 0.4 }}
      className={cn("absolute cursor-move", className)}
      style={{ left: x, top: y }}
    >
      <FogPanel className="card-padding w-64 soft-float" hover={false}>
        <div className="font-mono text-[10px] text-muted-foreground mb-2 uppercase">
          {typeLabels[type]}
        </div>
        <div className="font-serif text-sm font-semibold engraved mb-2">
          {title}
        </div>
        {content && (
          <div className="font-mono text-xs text-muted-foreground line-clamp-3">
            {content}
          </div>
        )}
      </FogPanel>
    </motion.div>
  );
}

