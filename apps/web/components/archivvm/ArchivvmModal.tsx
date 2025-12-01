"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Brain, FileText, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ArchivvmItem } from "@/lib/archivvm/types";

interface ArchivvmModalProps {
  item: ArchivvmItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArchivvmModal({ item, isOpen, onClose }: ArchivvmModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleJumpToPage = () => {
    if (item?.bookId && item?.page) {
      router.push(`/reader?book=${item.bookId}&page=${item.page}`);
      onClose();
    }
  };

  const handleAddToMemoria = async () => {
    if (!item) return;

    try {
      const response = await fetch("/api/memoria/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: item.bookId,
          chapterId: item.chapterId,
          page: item.page || 1,
          text: item.text || item.summary || item.content || "",
          createdAt: item.createdAt,
        }),
      });

      if (response.ok) {
        window.dispatchEvent(
          new CustomEvent("showToast", {
            detail: { message: "Added to Memoria", type: "success" },
          })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("showToast", {
            detail: { message: "Failed to add to Memoria", type: "error" },
          })
        );
      }
    } catch (error) {
      console.error("Error adding to Memoria:", error);
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: "Failed to add to Memoria", type: "error" },
        })
      );
    }
  };

  const handleSummarize = () => {
    // Placeholder for future AI summarization
    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: { message: "Summarization coming soon", type: "info" },
      })
    );
  };

  const handleLinkItems = () => {
    // Placeholder for future linking feature
    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: { message: "Linking feature coming soon", type: "info" },
      })
    );
  };

  if (!item) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="sticky top-0 flex items-center justify-between p-6 border-b"
                style={{
                  background: "rgba(10, 10, 10, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <h2
                    className="font-serif text-2xl mb-2"
                    style={{ color: "#f5f5f5" }}
                  >
                    {item.title || item.summary || "Untitled"}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="font-mono text-xs px-2 py-1"
                      style={{
                        color: "rgba(235, 235, 235, 0.8)",
                        background: "rgba(255, 255, 255, 0.06)",
                        borderRadius: "4px",
                      }}
                    >
                      {item.type}
                    </span>
                    {item.bookId && (
                      <span
                        className="font-mono text-xs opacity-60"
                        style={{ color: "#e6e6e6" }}
                      >
                        {item.bookId}
                        {item.chapterId && ` • ${item.chapterId}`}
                        {item.page && ` • p.${item.page}`}
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="ml-4 p-2 hover:opacity-70 transition-opacity"
                  style={{ color: "#f5f5f5" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Text Content */}
                {(item.text || item.content || item.summary) && (
                  <div>
                    <h3
                      className="font-serif text-sm mb-3"
                      style={{ color: "#f2f2f2" }}
                    >
                      Content
                    </h3>
                    <p
                      className="font-mono text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: "rgba(232, 232, 232, 0.85)" }}
                    >
                      {item.text || item.content || item.summary}
                    </p>
                  </div>
                )}

                {/* Question/Answer (for Memoria items) */}
                {item.question && item.answer && (
                  <div className="space-y-4">
                    <div>
                      <h3
                        className="font-serif text-sm mb-2"
                        style={{ color: "#f2f2f2" }}
                      >
                        Question
                      </h3>
                      <p
                        className="font-mono text-sm leading-relaxed"
                        style={{ color: "rgba(232, 232, 232, 0.85)" }}
                      >
                        {item.question}
                      </p>
                    </div>
                    <div>
                      <h3
                        className="font-serif text-sm mb-2"
                        style={{ color: "#f2f2f2" }}
                      >
                        Answer
                      </h3>
                      <p
                        className="font-mono text-sm leading-relaxed"
                        style={{ color: "rgba(232, 232, 232, 0.85)" }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="font-mono text-xs opacity-50"
                      style={{ color: "#FFFFFF" }}
                    >
                      Created: {formatDate(item.createdAt)}
                    </div>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-s px-2 py-1"
                          style={{
                            color: "#f0f0f0",
                            background: "rgba(255, 255, 255, 0.08)",
                            borderRadius: "4px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div
                className="sticky bottom-0 p-6 border-t flex flex-wrap gap-3"
                style={{
                  background: "rgba(10, 10, 10, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                {item.page && (
                  <motion.button
                    onClick={handleJumpToPage}
                    className="flex items-center gap-2 px-4 py-2 font-mono text-xs"
                    style={{
                      color: "#f5f5f5",
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                      background: "rgba(255, 255, 255, 0.06)",
                      borderRadius: "4px",
                    }}
                    whileHover={{
                      scale: 1.05,
                      background: "rgba(255, 255, 255, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen size={16} color="#f5f5f5" />
                    Jump to Page
                  </motion.button>
                )}

                <motion.button
                  onClick={handleAddToMemoria}
                  className="flex items-center gap-2 px-4 py-2 font-mono text-xs"
                  style={{
                    color: "#f5f5f5",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    background: "rgba(255, 255, 255, 0.06)",
                    borderRadius: "4px",
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Brain size={16} color="#f5f5f5" />
                  Add to Memoria
                </motion.button>

                <motion.button
                  onClick={handleSummarize}
                  className="flex items-center gap-2 px-4 py-2 font-mono text-xs"
                  style={{
                    color: "#f5f5f5",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    background: "rgba(255, 255, 255, 0.06)",
                    borderRadius: "4px",
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText size={16} color="#f5f5f5" />
                  Summarize
                </motion.button>

                <motion.button
                  onClick={handleLinkItems}
                  className="flex items-center gap-2 px-4 py-2 font-mono text-xs"
                  style={{
                    color: "#f5f5f5",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    background: "rgba(255, 255, 255, 0.06)",
                    borderRadius: "4px",
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link2 size={16} color="#f5f5f5" />
                  Link Items
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
