"use client";

import type { BookChapterRef } from "@/lib/books/types";

interface ChapterSidebarProps {
  chapters: BookChapterRef[];
  selectedChapterId: string | null;
  onSelectChapter: (chapter: BookChapterRef) => void;
  bookTitle: string;
  author?: string;
}

export function ChapterSidebar({
  chapters,
  selectedChapterId,
  onSelectChapter,
  bookTitle,
  author,
}: ChapterSidebarProps) {
  return (
    <div
      className="h-full w-64 border-r flex flex-col"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        borderColor: "rgba(200, 182, 141, 0.1)",
      }}
    >
      {/* Header */}
      <div
        className="p-6 border-b"
        style={{ borderColor: "rgba(200, 182, 141, 0.1)" }}
      >
        <h1 className="font-serif text-xl mb-2" style={{ color: "#C8B68D" }}>
          {bookTitle}
        </h1>
        {author && (
          <p
            className="font-mono text-xs opacity-60"
            style={{ color: "#C8B68D" }}
          >
            {author}
          </p>
        )}
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {chapters.map((chapter) => {
            const isSelected = chapter.id === selectedChapterId;
            return (
              <button
                key={chapter.id}
                onClick={() => onSelectChapter(chapter)}
                className="w-full text-left p-3 rounded transition-all"
                style={{
                  background: isSelected
                    ? "rgba(200, 182, 141, 0.15)"
                    : "transparent",
                  border: isSelected
                    ? "1px solid rgba(200, 182, 141, 0.3)"
                    : "1px solid transparent",
                  color: isSelected ? "#C8B68D" : "rgba(200, 182, 141, 0.6)",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background =
                      "rgba(200, 182, 141, 0.05)";
                    e.currentTarget.style.borderColor =
                      "rgba(200, 182, 141, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                <div className="font-serif text-sm leading-tight">
                  {chapter.title}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
