"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMeta } from "./BookSpine";

interface ReaderProps {
  book: BookMeta | null;
  onClose: () => void;
}

interface Chapter {
  id: string;
  title: string;
  file: string;
}

interface ChapterContent {
  chapter?: string;
  chapter_title?: string;
  content?: string;
  text?: string;
  summary?: string;
  micro_lessons?: Array<{
    title?: string;
    core_idea?: string;
    micro_test_q?: string;
    micro_test_a?: string;
  }>;
}

export function Reader({ book, onClose }: ReaderProps) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book && book.chapters.length > 0) {
      setSelectedChapter(book.chapters[0]);
    }
  }, [book]);

  useEffect(() => {
    if (selectedChapter && book) {
      loadChapter(book.id, selectedChapter.file);
    }
  }, [selectedChapter, book]);

  const loadChapter = async (bookId: string, fileName: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/books/${bookId}?action=chapter&file=${fileName}`
      );
      if (res.ok) {
        const data = await res.json();
        setChapterContent(data.chapter || data);
      }
    } catch (error) {
      console.error("Error loading chapter:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!book) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full h-full bg-[#0f0f0f] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-white/10 p-6 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-white mb-1">
                {book.title}
              </h2>
              <p className="font-mono text-sm text-[#b7b7b7]">{book.author}</p>
            </div>
            <button
              onClick={onClose}
              className="font-mono text-sm text-white border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors"
            >
              CLOSE
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar - Chapter List */}
            <div className="w-64 border-r border-white/10 overflow-y-auto bg-[#111]">
              <div className="p-4">
                <p className="font-mono text-xs text-[#b7b7b7] mb-4">
                  CHAPTERS
                </p>
                <div className="space-y-1">
                  {book.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapter(chapter)}
                      className={`w-full text-left px-3 py-2 font-serif text-sm transition-colors ${
                        selectedChapter?.id === chapter.id
                          ? "bg-white/10 text-white border-l-2 border-white"
                          : "text-[#b7b7b7] hover:bg-white/5"
                      }`}
                    >
                      {chapter.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reading Viewport */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              {loading ? (
                <div className="text-center py-20">
                  <p className="font-mono text-sm text-[#b7b7b7]">
                    Loading chapter...
                  </p>
                </div>
              ) : chapterContent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedChapter && (
                    <h3 className="font-serif text-3xl mb-6 text-white">
                      {selectedChapter.title}
                    </h3>
                  )}
                  <div className="font-serif text-base leading-relaxed text-white max-w-3xl space-y-6">
                    {chapterContent.summary && (
                      <div className="mb-8">
                        <p className="text-lg leading-relaxed">
                          {chapterContent.summary}
                        </p>
                      </div>
                    )}
                    {chapterContent.micro_lessons &&
                      Array.isArray(chapterContent.micro_lessons) &&
                      chapterContent.micro_lessons.length > 0 && (
                        <div className="space-y-6 pt-6 border-t border-white/10">
                          <p className="font-mono text-xs text-[#b7b7b7] mb-4">
                            MICRO-LESSONS
                          </p>
                          {chapterContent.micro_lessons.map(
                            (lesson: any, idx: number) => (
                              <div
                                key={idx}
                                className="border-l-2 border-white/20 pl-4 space-y-3"
                              >
                                {lesson.title && (
                                  <h4 className="font-serif text-lg text-white">
                                    {lesson.title}
                                  </h4>
                                )}
                                {lesson.core_idea && (
                                  <p className="text-[#b7b7b7] leading-relaxed">
                                    {lesson.core_idea}
                                  </p>
                                )}
                                {lesson.micro_test_q && (
                                  <div className="mt-3 space-y-2">
                                    <p className="font-mono text-xs text-white">
                                      Q: {lesson.micro_test_q}
                                    </p>
                                    {lesson.micro_test_a && (
                                      <p className="font-mono text-xs text-[#b7b7b7] pl-4">
                                        A: {lesson.micro_test_a}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    {!chapterContent.summary &&
                      !chapterContent.micro_lessons &&
                      !chapterContent.content &&
                      !chapterContent.text && (
                        <p className="text-[#b7b7b7]">No content available.</p>
                      )}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-20">
                  <p className="font-mono text-sm text-[#b7b7b7]">
                    Select a chapter to begin reading
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dithered texture overlay */}
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: "url('/images/textures/texture_bayer.png')",
              backgroundSize: "256px 256px",
              backgroundRepeat: "repeat",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
