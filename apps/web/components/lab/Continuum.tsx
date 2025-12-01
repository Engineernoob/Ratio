"use client";

import { motion } from "framer-motion";

interface ContinuumProps {
  items: Array<{
    id: string;
    label: string;
  }>;
  activeId?: string;
  onItemClick?: (id: string) => void;
}

export function Continuum({ items, activeId, onItemClick }: ContinuumProps) {
  return (
    <div className="continuum">
      <div className="continuum__rail" />
      <div className="continuum__pills">
        {items.map((item, index) => {
          const isActive = activeId ? activeId === item.id : index === 0;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`continuum__pill ${isActive ? "is-active" : ""}`}
            >
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="continuum-glow"
                  className="continuum__glow"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
