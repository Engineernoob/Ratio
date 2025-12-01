"use client";

import { motion } from "framer-motion";

export interface MicroLesson {
  id: string;
  title: string;
  steps: Array<{
    label: string;
    prompt: string;
  }>;
  estTime: string;
}

interface MicroLessonCardProps {
  lesson: MicroLesson;
  onClick: () => void;
  index: number;
}

export function MicroLessonCard({
  lesson,
  onClick,
  index,
}: MicroLessonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="lab-card p-6 rounded-sm cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className="font-serif text-lg mb-2 text-white">{lesson.title}</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs text-[#b7b7b7]">
          {lesson.steps.length} steps
        </span>
        <span className="font-mono text-xs text-[#b7b7b7]">·</span>
        <span className="font-mono text-xs text-[#b7b7b7]">
          {lesson.estTime}
        </span>
      </div>
      <div className="pt-3 border-t border-white/10">
        <span className="font-mono text-xs text-white/60">
          Click to begin →
        </span>
      </div>
    </motion.div>
  );
}
