"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookMeta } from "./BookSpine";
import { useState, useEffect } from "react";

interface ReaderChaptersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookMeta;
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
}

export function ReaderChaptersDrawer({
  isOpen,
  onClose,
  book,
  currentChapterIndex,
  onChapterSelect,
}: ReaderChaptersDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "-100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed ${
              isMobile
                ? "bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl"
                : "left-0 top-0 bottom-0 w-[320px]"
            } z-50 bg-[#0d0d0d] border-r border-white/5 overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dithered texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.02]"
              style={{
                backgroundImage: "url('/images/textures/texture_bayer.png')",
                backgroundSize: "256px 256px",
                backgroundRepeat: "repeat",
              }}
            />

            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-[#e8e8e8]">Chapters</h3>
                <button
                  onClick={onClose}
                  className="font-mono text-lg text-[#e8e8e8] hover:bg-white/5 px-3 py-2 transition-colors rounded"
                >
                  ×
                </button>
              </div>

              {book.chapters && book.chapters.length > 0 ? (
                <div className="space-y-1">
                  {book.chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => onChapterSelect(index)}
                      className={`w-full text-left px-4 py-3 font-serif text-sm transition-all duration-200 rounded ${
                        index === currentChapterIndex
                          ? "bg-white/10 text-[#e8e8e8] border-l-2 border-[#e8e8e8]"
                          : "text-[#888] hover:bg-white/5 hover:text-[#e8e8e8]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#888] min-w-[2ch]">
                          {index + 1}
                        </span>
                        <span>{chapter.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-sm text-[#888] text-center py-8">
                  No chapters available
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
