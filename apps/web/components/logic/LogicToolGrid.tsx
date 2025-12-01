"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface LogicToolCard {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
}

interface LogicToolGridProps {
  tools: LogicToolCard[];
  active: string;
  onSelect: (id: string) => void;
}

export function LogicToolGrid({
  tools,
  active,
  onSelect,
}: LogicToolGridProps) {
  return (
    <div className="logic-tool-grid">
      {tools.map((tool) => (
        <motion.button
          key={tool.id}
          className={`logic-tool-card ${active === tool.id ? "is-active" : ""}`}
          onClick={() => onSelect(tool.id)}
          whileHover={{ rotateX: -6, rotateY: 6, scale: 1.02 }}
          whileTap={{ scale: 0.98, rotateX: 0, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <div className="logic-tool-card__border" />
          <div className="logic-tool-card__shine" />
          <div className="logic-tool-card__content">
            <div className="logic-tool-card__icon">{tool.icon}</div>
            <div>
              <div className="logic-tool-card__title">{tool.name}</div>
              <div className="logic-tool-card__description">
                {tool.description}
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
