"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { X, Check } from "lucide-react";

interface SwipeCardStackProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  onSwipeLeft?: (item: T) => void;
  onSwipeRight?: (item: T) => void;
  onTap?: (item: T) => void;
  leftActionLabel?: string;
  rightActionLabel?: string;
}

export function SwipeCardStack<T>({
  items,
  renderCard,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  leftActionLabel = "Forgot",
  rightActionLabel = "Easy",
}: SwipeCardStackProps<T>) {
  const { currentTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  const currentItem = items[currentIndex];

  if (!currentItem || currentIndex >= items.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="font-serif text-xl text-center"
          style={{ color: currentTheme.accent }}
        >
          All cards reviewed!
        </div>
      </div>
    );
  }

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0 || velocity > 0) {
        // Swipe right
        onSwipeRight?.(currentItem);
        setCurrentIndex((prev) => prev + 1);
        setIsRevealed(false);
      } else {
        // Swipe left
        onSwipeLeft?.(currentItem);
        setCurrentIndex((prev) => prev + 1);
        setIsRevealed(false);
      }
      x.set(0);
    } else {
      x.set(0);
    }
  };

  const handleTap = () => {
    if (onTap) {
      onTap(currentItem);
    } else {
      setIsRevealed(!isRevealed);
    }
  };

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Action Labels */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          animate={{
            opacity: x.get() < -50 ? 1 : 0.3,
            scale: x.get() < -50 ? 1.1 : 1,
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: `rgba(255, 68, 68, 0.2)`,
            border: `1px solid rgba(255, 68, 68, 0.4)`,
          }}
        >
          <X size={20} color="#FF4444" />
          <span className="font-mono text-sm text-white">
            {leftActionLabel}
          </span>
        </motion.div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <motion.div
          animate={{
            opacity: x.get() > 50 ? 1 : 0.3,
            scale: x.get() > 50 ? 1.1 : 1,
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: `rgba(0, 255, 136, 0.2)`,
            border: `1px solid rgba(0, 255, 136, 0.4)`,
          }}
        >
          <Check size={20} color="#00FF88" />
          <span className="font-mono text-sm text-white">
            {rightActionLabel}
          </span>
        </motion.div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-sm">
        {/* Background cards */}
        {items.slice(currentIndex + 1, currentIndex + 3).map((item, idx) => (
          <motion.div
            key={currentIndex + idx + 1}
            className="absolute inset-0 rounded-xl"
            style={{
              background: `rgba(${
                currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
              }, 0.8)`,
              border: `1px solid ${currentTheme.accent}33`,
              zIndex: 2 - idx,
              scale: 1 - (idx + 1) * 0.05,
              y: (idx + 1) * 8,
            }}
          >
            {renderCard(item, currentIndex + idx + 1)}
          </motion.div>
        ))}

        {/* Active card */}
        <motion.div
          ref={cardRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onTap={handleTap}
          style={{
            x,
            rotate,
            opacity,
            zIndex: 10,
            background: `rgba(${
              currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
            }, 0.95)`,
            border: `2px solid ${currentTheme.accent}40`,
            boxShadow: `0 8px 32px ${currentTheme.accent}20`,
          }}
          className="absolute inset-0 rounded-xl cursor-grab active:cursor-grabbing"
        >
          {renderCard(currentItem, currentIndex)}
        </motion.div>
      </div>
    </div>
  );
}
