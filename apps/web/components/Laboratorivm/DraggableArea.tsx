"use client";

import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import type { DraggableOrderPuzzle } from "@/lib/puzzles/types";

interface DraggableAreaProps {
  puzzle: DraggableOrderPuzzle;
  onOrderChange: (order: number[]) => void;
  currentOrder: number[];
}

export function DraggableArea({
  puzzle,
  onOrderChange,
  currentOrder,
}: DraggableAreaProps) {
  const [items, setItems] = useState(() => {
    if (currentOrder.length > 0) {
      return currentOrder.map((index) => puzzle.items[index]);
    }
    // Initialize with original order
    return [...puzzle.items];
  });

  const handleReorder = (newItems: string[]) => {
    setItems(newItems);
    const newOrder = newItems.map((item) => puzzle.items.indexOf(item));
    onOrderChange(newOrder);
  };

  // Update items when puzzle changes
  useEffect(() => {
    if (currentOrder.length === 0) {
      setItems([...puzzle.items]);
    }
  }, [puzzle.id]);

  return (
    <div className="space-y-4">
      <p
        className="font-mono text-sm opacity-60 mb-4"
        style={{ color: "#C8B68D" }}
      >
        Drag items to reorder them:
      </p>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-2"
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item}
            value={item}
            className="cursor-grab active:cursor-grabbing"
            whileDrag={{ scale: 1.05, zIndex: 10 }}
          >
            <motion.div
              className="p-4 rounded-lg"
              style={{
                background: "rgba(200, 182, 141, 0.1)",
                border: "1px solid rgba(200, 182, 141, 0.3)",
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center font-mono text-xs rounded"
                  style={{
                    background: "rgba(200, 182, 141, 0.2)",
                    color: "#C8B68D",
                  }}
                >
                  {index + 1}
                </div>
                <span
                  className="font-mono text-sm flex-1"
                  style={{ color: "#C8B68D" }}
                >
                  {item}
                </span>
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
