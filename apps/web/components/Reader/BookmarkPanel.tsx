"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Bookmark, BookmarkCheck } from "lucide-react";
import type { BookChapterRef } from "@/lib/books/types";

interface Bookmark {
  id: string;
  bookId: string;
  chapterId?: string;
  pageNumber: number;
  note?: string;
  timestamp: string;
}

interface BookmarkPanelProps {
  bookId: string;
  chapters: BookChapterRef[];
  onClose: () => void;
}

export function BookmarkPanel({
  bookId,
  chapters,
  onClose,
}: BookmarkPanelProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [bookId]);

  const loadBookmarks = async () => {
    try {
      const res = await fetch(`/api/bookmarks/${bookId}`);
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (
    chapterId?: string,
    pageNumber?: number
  ) => {
    try {
      const existing = bookmarks.find(
        (b) => b.chapterId === chapterId && b.pageNumber === (pageNumber || 1)
      );

      if (existing) {
        // Remove bookmark
        const res = await fetch(`/api/bookmarks/${bookId}?id=${existing.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setBookmarks(bookmarks.filter((b) => b.id !== existing.id));
        }
      } else {
        // Add bookmark
        const res = await fetch(`/api/bookmarks/${bookId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapterId,
            pageNumber: pageNumber || 1,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarks([...bookmarks, data.bookmark]);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const getChapterTitle = (chapterId?: string): string => {
    if (!chapterId) return "Unknown Chapter";
    const chapter = chapters.find((ch) => ch.id === chapterId);
    return chapter?.title || chapterId;
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-80 h-full border-l overflow-y-auto"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        borderColor: "rgba(200, 182, 141, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl" style={{ color: "#C8B68D" }}>
            Bookmarks
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded transition-colors"
            style={{
              color: "#C8B68D",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(200, 182, 141, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div
              className="font-mono text-sm opacity-60"
              style={{ color: "#C8B68D" }}
            >
              Loading...
            </div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <Bookmark
              size={32}
              className="opacity-20 mb-2"
              style={{ color: "#C8B68D" }}
            />
            <div
              className="font-mono text-xs opacity-40 text-center"
              style={{ color: "#C8B68D" }}
            >
              No bookmarks yet.
              <br />
              Add bookmarks to save your place.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded border"
                style={{
                  background: "rgba(200, 182, 141, 0.05)",
                  borderColor: "rgba(200, 182, 141, 0.1)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div
                      className="font-serif text-sm mb-1"
                      style={{ color: "#C8B68D" }}
                    >
                      {getChapterTitle(bookmark.chapterId)}
                    </div>
                    <div
                      className="font-mono text-xs opacity-60"
                      style={{ color: "#C8B68D" }}
                    >
                      Page {bookmark.pageNumber}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleToggleBookmark(
                        bookmark.chapterId,
                        bookmark.pageNumber
                      )
                    }
                    className="p-1"
                    style={{ color: "#C8B68D" }}
                  >
                    <BookmarkCheck size={18} />
                  </button>
                </div>
                {bookmark.note && (
                  <div
                    className="font-mono text-xs mt-2 opacity-70"
                    style={{ color: "#C8B68D" }}
                  >
                    {bookmark.note}
                  </div>
                )}
                <div
                  className="font-mono text-xs mt-2 opacity-40"
                  style={{ color: "#C8B68D" }}
                >
                  {formatTimestamp(bookmark.timestamp)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
