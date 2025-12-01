"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { useMemoriaQueue } from "@/hooks/useMemoriaQueue";
import type { ChapterContent } from "@/lib/books/types";

interface ChapterRef {
  id: string;
  title: string;
  file: string;
  pageStart?: number;
  pageEnd?: number;
}

interface ChapterReaderProps {
  bookId: string;
  bookTitle: string;
  author?: string;
  pdfPath?: string;
  chapters: ChapterRef[];
  currentChapter: ChapterContent | null;
  selectedChapterId: string | null;
  onChapterSelect: (chapterId: string, fileName: string) => void;
  onClose?: () => void;
}

export function ChapterReader({
  bookId,
  bookTitle,
  author,
  pdfPath,
  chapters,
  currentChapter,
  selectedChapterId,
  onChapterSelect,
  onClose,
}: ChapterReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedText, setSelectedText] = useState("");
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [currentNote, setCurrentNote] = useState("");
  const [showChapterList, setShowChapterList] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const { createCard } = useMemoriaQueue();

  // Sync PDF page when chapter changes
  useEffect(() => {
    if (selectedChapterId && chapters.length > 0) {
      const chapter = chapters.find((ch) => ch.id === selectedChapterId);
      if (chapter?.pageStart) {
        setCurrentPage(chapter.pageStart);
      }
    }
  }, [selectedChapterId, chapters]);

  // Get current chapter's page range
  const currentChapterRef = chapters.find((ch) => ch.id === selectedChapterId);
  const minPage = currentChapterRef?.pageStart || 1;
  const maxPage = currentChapterRef?.pageEnd || Infinity;

  // Page flip sound
  const playPageFlipSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 200;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      const audio = new Audio("/sounds/page-flip.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(maxPage, prev + 1));
    playPageFlipSound();
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(minPage, prev - 1));
    playPageFlipSound();
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const handleSaveExcerpt = async () => {
    if (!selectedText.trim()) return;

    try {
      await createCard({
        title: `Excerpt from ${bookTitle}`,
        content: selectedText,
        question: `Recall the key points from this excerpt: "${selectedText.substring(
          0,
          50
        )}..."`,
        answer: selectedText,
        source: "bibliotheca",
        sourceId: bookId,
        sourceMetadata: {
          page: currentPage,
          bookTitle,
          chapter: currentChapter?.chapter_title,
        },
        tags: ["EXCERPT", "BIBLIOTHECA"],
      });

      window.getSelection()?.removeAllRanges();
      setSelectedText("");
    } catch (error) {
      console.error("Failed to save excerpt:", error);
    }
  };

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;
    setNotes((prev) => ({ ...prev, [currentPage]: currentNote }));
    setCurrentNote("");
  };

  const handleChapterClick = (chapter: ChapterRef) => {
    onChapterSelect(chapter.id, chapter.file);
    setShowChapterList(false);
    playPageFlipSound();
  };

  // Build PDF URL with page
  const pdfUrl = pdfPath ? `${pdfPath}#page=${currentPage}` : null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Sepia Textured Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/images/textures/parchment-dither.png')",
          backgroundSize: "512px 512px",
          backgroundRepeat: "repeat",
          mixBlendMode: "multiply",
        }}
      />

      {/* Main Content */}
      <div className="relative h-full flex">
        {/* Left Sidebar - Chapter List & Notes */}
        <motion.div
          className="w-80 border-r flex flex-col"
          style={{
            background:
              "linear-gradient(135deg, rgba(49, 42, 29, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)",
            borderColor: "#312A1D",
          }}
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="p-6 border-b" style={{ borderColor: "#312A1D" }}>
            <div className="flex items-center justify-between mb-2">
              <h2
                className="text-xl font-serif tracking-wider"
                style={{ color: "#C8B68D" }}
              >
                {bookTitle}
              </h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-[#C8B68D] hover:text-[#D4C5A0] transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {author && (
              <p
                className="text-sm font-mono mb-4"
                style={{ color: "#C8B68D", opacity: 0.7 }}
              >
                {author}
              </p>
            )}

            {/* Chapter List Toggle */}
            <button
              onClick={() => setShowChapterList(!showChapterList)}
              className="w-full flex items-center gap-2 px-4 py-2 rounded border text-sm font-mono transition-colors"
              style={{
                color: "#C8B68D",
                borderColor: "#312A1D",
                background: "rgba(49, 42, 29, 0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C8B68D";
                e.currentTarget.style.background = "rgba(200, 182, 141, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#312A1D";
                e.currentTarget.style.background = "rgba(49, 42, 29, 0.5)";
              }}
            >
              <BookOpen size={16} />
              Chapters ({chapters.length})
            </button>
          </div>

          {/* Chapter List */}
          <AnimatePresence>
            {showChapterList && (
              <motion.div
                className="flex-1 overflow-y-auto p-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterClick(chapter)}
                    className="w-full text-left px-4 py-3 mb-2 rounded border text-sm font-mono transition-colors"
                    style={{
                      color:
                        selectedChapterId === chapter.id
                          ? "#C8B68D"
                          : "#C8B68D",
                      opacity: selectedChapterId === chapter.id ? 1 : 0.7,
                      borderColor:
                        selectedChapterId === chapter.id
                          ? "#C8B68D"
                          : "#312A1D",
                      background:
                        selectedChapterId === chapter.id
                          ? "rgba(200, 182, 141, 0.1)"
                          : "rgba(49, 42, 29, 0.3)",
                    }}
                  >
                    <div className="font-serif text-xs mb-1">
                      {chapter.title}
                    </div>
                    {chapter.pageStart && (
                      <div className="text-xs opacity-60">
                        Page {chapter.pageStart}
                      </div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notes Section */}
          <div className="p-4 border-t" style={{ borderColor: "#312A1D" }}>
            <h3
              className="text-sm font-serif mb-3"
              style={{ color: "#C8B68D" }}
            >
              Notes (Page {currentPage})
            </h3>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full h-24 p-3 rounded border text-sm font-mono resize-none"
              style={{
                background: "rgba(10, 10, 10, 0.5)",
                borderColor: "#312A1D",
                color: "#C8B68D",
              }}
            />
            <button
              onClick={handleSaveNote}
              className="w-full mt-2 px-4 py-2 rounded border text-sm font-mono transition-colors"
              style={{
                color: "#C8B68D",
                borderColor: "#312A1D",
                background: "rgba(49, 42, 29, 0.5)",
              }}
            >
              Save Note
            </button>
            {notes[currentPage] && (
              <div
                className="mt-3 p-3 rounded border text-xs font-mono"
                style={{
                  background: "rgba(200, 182, 141, 0.05)",
                  borderColor: "#312A1D",
                  color: "#C8B68D",
                }}
              >
                {notes[currentPage]}
              </div>
            )}
          </div>
        </motion.div>

        {/* Center - PDF Viewer & Chapter Content */}
        <div className="flex-1 flex flex-col relative">
          {/* PDF Container */}
          {pdfUrl && (
            <div
              ref={pdfContainerRef}
              className="h-1/2 overflow-auto p-8 border-b"
              onMouseUp={handleTextSelection}
              style={{
                background: "rgba(10, 10, 10, 0.5)",
                borderColor: "#312A1D",
              }}
            >
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                style={{ minHeight: "400px" }}
                title={`${bookTitle} - Page ${currentPage}`}
              />
            </div>
          )}

          {/* Chapter Content Area */}
          <div
            className={`flex-1 overflow-auto p-8 ${pdfUrl ? "" : "h-full"}`}
            style={{ background: "rgba(10, 10, 10, 0.3)" }}
          >
            {currentChapter ? (
              <div className="max-w-4xl mx-auto">
                {/* Chapter Header */}
                <div
                  className="mb-8 pb-6 border-b"
                  style={{ borderColor: "#312A1D" }}
                >
                  <h1
                    className="text-3xl font-serif mb-4 tracking-wider"
                    style={{ color: "#C8B68D" }}
                  >
                    {currentChapter.chapter_title}
                  </h1>
                  <p
                    className="text-base font-mono leading-relaxed"
                    style={{ color: "#C8B68D", opacity: 0.8 }}
                  >
                    {currentChapter.summary}
                  </p>
                </div>

                {/* Micro Lessons */}
                {currentChapter.micro_lessons &&
                  currentChapter.micro_lessons.length > 0 && (
                    <div className="space-y-6">
                      <h2
                        className="text-xl font-serif mb-6 tracking-wide"
                        style={{ color: "#C8B68D" }}
                      >
                        Micro Lessons
                      </h2>
                      {currentChapter.micro_lessons.map((lesson, index) => (
                        <div
                          key={index}
                          className="p-6 rounded border mb-4"
                          style={{
                            background: "rgba(49, 42, 29, 0.3)",
                            borderColor: "#312A1D",
                          }}
                        >
                          <h3
                            className="text-lg font-serif mb-3"
                            style={{ color: "#C8B68D" }}
                          >
                            {lesson.title}
                          </h3>
                          <p
                            className="text-sm font-mono mb-4 leading-relaxed"
                            style={{ color: "#C8B68D", opacity: 0.8 }}
                          >
                            {lesson.core_idea}
                          </p>
                          <div
                            className="mt-4 pt-4 border-t"
                            style={{ borderColor: "#312A1D" }}
                          >
                            <p
                              className="text-xs font-mono mb-2"
                              style={{ color: "#C8B68D", opacity: 0.7 }}
                            >
                              <strong>Q:</strong> {lesson.micro_test_q}
                            </p>
                            <p
                              className="text-xs font-mono"
                              style={{ color: "#C8B68D", opacity: 0.6 }}
                            >
                              <strong>A:</strong> {lesson.micro_test_a}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p
                    className="text-xl font-serif mb-4"
                    style={{ color: "#C8B68D", opacity: 0.6 }}
                  >
                    Select a chapter to begin reading
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selection Toolbar */}
          <AnimatePresence>
            {selectedText && (
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded border z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  background: "rgba(49, 42, 29, 0.95)",
                  borderColor: "#312A1D",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                }}
              >
                <button
                  onClick={handleSaveExcerpt}
                  className="flex items-center gap-2 px-4 py-2 rounded border text-sm font-mono transition-colors"
                  style={{
                    color: "#C8B68D",
                    borderColor: "#312A1D",
                    background: "rgba(200, 182, 141, 0.1)",
                  }}
                >
                  <Save size={16} />
                  Save to Memory
                </button>
                <button
                  onClick={() => {
                    window.getSelection()?.removeAllRanges();
                    setSelectedText("");
                  }}
                  className="text-[#C8B68D] hover:text-[#D4C5A0] transition-colors"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Controls (only if PDF exists) */}
          {pdfUrl && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded border">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= minPage}
                className="p-2 rounded border transition-colors disabled:opacity-30"
                style={{
                  color: "#C8B68D",
                  borderColor: "#312A1D",
                  background: "rgba(49, 42, 29, 0.5)",
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <span
                className="text-sm font-mono px-4"
                style={{ color: "#C8B68D" }}
              >
                Page {currentPage}
                {currentChapterRef?.pageEnd &&
                  ` / ${currentChapterRef.pageEnd}`}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= maxPage}
                className="p-2 rounded border transition-colors disabled:opacity-30"
                style={{
                  color: "#C8B68D",
                  borderColor: "#312A1D",
                  background: "rgba(49, 42, 29, 0.5)",
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar - AI Summary (optional) */}
        <motion.div
          className="w-64 border-l p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(49, 42, 29, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)",
            borderColor: "#312A1D",
          }}
          initial={{ x: 256 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded border text-sm font-mono transition-colors"
            style={{
              color: "#C8B68D",
              borderColor: "#312A1D",
              background: "rgba(49, 42, 29, 0.5)",
            }}
          >
            <Sparkles size={16} />
            AI Summary
          </button>
        </motion.div>
      </div>
    </div>
  );
}
