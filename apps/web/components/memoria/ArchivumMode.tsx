"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { MemoryCard } from "@/lib/memoria/types";

interface ArchivumModeProps {
  cards: MemoryCard[];
}

export function ArchivumMode({ cards }: ArchivumModeProps) {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<MemoryCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    book: "",
    chapter: "",
    tag: "",
    difficulty: "",
    dueDate: "",
  });
  const [sortBy, setSortBy] = useState<
    "nextReview" | "interval" | "ease" | "createdAt"
  >("nextReview");

  // Get unique values for filters
  const uniqueValues = useMemo(() => {
    const books = new Set<string>();
    const chapters = new Set<string>();
    const tags = new Set<string>();

    cards.forEach((card) => {
      if (card.sourceId) books.add(card.sourceId);
      if (card.sourceMetadata?.chapterId) {
        chapters.add(card.sourceMetadata.chapterId as string);
      }
      if (card.tags) {
        card.tags.forEach((tag) => tags.add(tag));
      }
    });

    return {
      books: Array.from(books).sort(),
      chapters: Array.from(chapters).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [cards]);

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let result = [...cards];

    // Apply filters
    if (filters.book) {
      result = result.filter((c) => c.sourceId === filters.book);
    }
    if (filters.chapter) {
      result = result.filter(
        (c) => c.sourceMetadata?.chapterId === filters.chapter
      );
    }
    if (filters.tag) {
      result = result.filter((c) => c.tags?.includes(filters.tag));
    }
    if (filters.difficulty) {
      const easeThresholds: Record<string, [number, number]> = {
        easy: [2.2, 2.5],
        medium: [1.7, 2.2],
        hard: [1.3, 1.7],
      };
      const [min, max] = easeThresholds[filters.difficulty] || [0, 2.5];
      result = result.filter((c) => c.ease >= min && c.ease < max);
    }
    if (filters.dueDate) {
      const today = new Date().toISOString().split("T")[0];
      if (filters.dueDate === "overdue") {
        result = result.filter((c) => c.due < today);
      } else if (filters.dueDate === "today") {
        result = result.filter((c) => c.due === today);
      } else if (filters.dueDate === "upcoming") {
        result = result.filter((c) => c.due > today);
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "nextReview":
          return a.due.localeCompare(b.due);
        case "interval":
          return b.interval - a.interval;
        case "ease":
          return b.ease - a.ease;
        case "createdAt":
          return b.createdAt.localeCompare(a.createdAt);
        default:
          return 0;
      }
    });

    return result;
  }, [cards, filters, sortBy]);

  const handleCardClick = (card: MemoryCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleJumpToReader = () => {
    if (selectedCard?.sourceId && selectedCard?.sourceMetadata?.page) {
      router.push(
        `/reader?book=${selectedCard.sourceId}&page=${selectedCard.sourceMetadata.page}`
      );
      setIsModalOpen(false);
    }
  };

  const getDifficultyLabel = (ease: number) => {
    if (ease >= 2.2) return "Easy";
    if (ease >= 1.7) return "Medium";
    return "Hard";
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div
        className="p-6 rounded-lg"
        style={{
          border: "1px solid rgba(200, 182, 141, 0.2)",
          background: "rgba(10, 10, 10, 0.6)",
        }}
      >
        <h3 className="font-serif text-lg mb-4" style={{ color: "#C8B68D" }}>
          Filters & Sort
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select
            value={filters.book}
            onChange={(e) => setFilters({ ...filters, book: e.target.value })}
            className="px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#C8B68D",
              borderColor: "rgba(200, 182, 141, 0.2)",
            }}
          >
            <option value="">All Books</option>
            {uniqueValues.books.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>

          <select
            value={filters.chapter}
            onChange={(e) =>
              setFilters({ ...filters, chapter: e.target.value })
            }
            className="px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#C8B68D",
              borderColor: "rgba(200, 182, 141, 0.2)",
            }}
          >
            <option value="">All Chapters</option>
            {uniqueValues.chapters.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>

          <select
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            className="px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#C8B68D",
              borderColor: "rgba(200, 182, 141, 0.2)",
            }}
          >
            <option value="">All Tags</option>
            {uniqueValues.tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
            className="px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#C8B68D",
              borderColor: "rgba(200, 182, 141, 0.2)",
            }}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={filters.dueDate}
            onChange={(e) =>
              setFilters({ ...filters, dueDate: e.target.value })
            }
            className="px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#C8B68D",
              borderColor: "rgba(200, 182, 141, 0.2)",
            }}
          >
            <option value="">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "nextReview"
                  | "interval"
                  | "ease"
                  | "createdAt"
              )
            }
            className="px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#C8B68D",
              borderColor: "rgba(200, 182, 141, 0.2)",
            }}
          >
            <option value="nextReview">Sort by Due Date</option>
            <option value="interval">Sort by Interval</option>
            <option value="ease">Sort by Ease</option>
            <option value="createdAt">Sort by Created</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              onClick={() => handleCardClick(card)}
              className="cursor-pointer"
            >
              <div
                className="p-4 rounded-lg h-full"
                style={{
                  border: "1px solid rgba(200, 182, 141, 0.2)",
                  background: "rgba(10, 10, 10, 0.6)",
                }}
              >
                <h4
                  className="font-serif text-sm mb-2 line-clamp-2"
                  style={{ color: "#C8B68D" }}
                >
                  {card.title}
                </h4>
                <p
                  className="font-mono text-xs opacity-60 mb-3 line-clamp-2"
                  style={{ color: "#C8B68D" }}
                >
                  {card.question || card.content}
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className="font-mono text-xs px-2 py-1"
                    style={{
                      color: "rgba(200, 182, 141, 0.7)",
                      background: "rgba(200, 182, 141, 0.1)",
                      borderRadius: "4px",
                    }}
                  >
                    {getDifficultyLabel(card.ease)}
                  </span>
                  <span
                    className="font-mono text-xs opacity-50"
                    style={{ color: "#C8B68D" }}
                  >
                    Due: {new Date(card.due).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCard && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0, 0, 0, 0.85)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                style={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(200, 182, 141, 0.2)",
                  borderRadius: "8px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 space-y-6">
                  <h2
                    className="font-serif text-2xl"
                    style={{ color: "#C8B68D" }}
                  >
                    {selectedCard.title}
                  </h2>
                  {selectedCard.question && (
                    <div>
                      <h3
                        className="font-serif text-sm mb-2"
                        style={{ color: "#e8e8e8" }}
                      >
                        Question
                      </h3>
                      <p
                        className="font-mono text-sm"
                        style={{ color: "rgba(232, 232, 232, 0.8)" }}
                      >
                        {selectedCard.question}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3
                      className="font-serif text-sm mb-2"
                      style={{ color: "#FFFFFF" }}
                    >
                      Answer
                    </h3>
                    <p
                      className="font-mono text-sm"
                      style={{ color: "rgba(232, 232, 232, 0.8)" }}
                    >
                      {selectedCard.answer || selectedCard.content}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {(() => {
                      const pageRef =
                        selectedCard?.sourceMetadata?.page as
                          | string
                          | number
                          | undefined;
                      return pageRef ? (
                        <motion.button
                          onClick={handleJumpToReader}
                          className="px-4 py-2 font-mono text-xs"
                          style={{
                            color: "#f5f5f5",
                            border: "1px solid rgba(255, 255, 255, 0.25)",
                            background: "rgba(255, 255, 255, 0.06)",
                            borderRadius: "4px",
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Jump to Reader
                        </motion.button>
                      ) : null;
                    })()}
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 font-mono text-xs"
                      style={{
                        color: "#f5f5f5",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        background: "rgba(255, 255, 255, 0.06)",
                        borderRadius: "4px",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
