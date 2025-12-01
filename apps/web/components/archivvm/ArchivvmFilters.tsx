"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ArchivvmFiltersProps {
  books: string[];
  chapters: string[];
  types: string[];
  tags: string[];
  selectedBook?: string;
  selectedChapter?: string;
  selectedType?: string;
  selectedTag?: string;
  onBookChange: (book?: string) => void;
  onChapterChange: (chapter?: string) => void;
  onTypeChange: (type?: string) => void;
  onTagChange: (tag?: string) => void;
}

export function ArchivvmFilters({
  books,
  chapters,
  types,
  tags,
  selectedBook,
  selectedChapter,
  selectedType,
  selectedTag,
  onBookChange,
  onChapterChange,
  onTypeChange,
  onTagChange,
}: ArchivvmFiltersProps) {
  const hasFilters =
    selectedBook || selectedChapter || selectedType || selectedTag;

  const clearAll = () => {
    onBookChange(undefined);
    onChapterChange(undefined);
    onTypeChange(undefined);
    onTagChange(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm" style={{ color: "#C8B68D" }}>
          Filters
        </h3>
        {hasFilters && (
          <motion.button
            onClick={clearAll}
            className="flex items-center gap-1 font-mono text-xs opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "#FFFFFF" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={14} />
            Clear
          </motion.button>
        )}
      </div>

      {/* Book Filter */}
      {books.length > 0 && (
        <div>
          <label
            className="block font-mono text-xs mb-2 opacity-60"
            style={{ color: "#FFFFFF" }}
          >
            Book
          </label>
          <select
            value={selectedBook || ""}
            onChange={(e) => onBookChange(e.target.value || undefined)}
            className="w-full px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#FFFFFF",
              borderColor: "rgba(255, 255, 255)",
              background: "rgba(10, 10, 10, 0.5)",
            }}
          >
            <option value="">All Books</option>
            {books.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Chapter Filter */}
      {chapters.length > 0 && (
        <div>
          <label
            className="block font-mono text-xs mb-2 opacity-60"
            style={{ color: "#000000" }}
          >
            Chapter
          </label>
          <select
            value={selectedChapter || ""}
            onChange={(e) => onChapterChange(e.target.value || undefined)}
            className="w-full px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#FFFFFF",
              borderColor: "rgba(255, 255, 255)",
              background: "rgba(10, 10, 10, 0.5)",
            }}
          >
            <option value="">All Chapters</option>
            {chapters.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Type Filter */}
      {types.length > 0 && (
        <div>
          <label
            className="block font-mono text-xs mb-2 opacity-60"
            style={{ color: "#FFFFFF" }}
          >
            Type
          </label>
          <select
            value={selectedType || ""}
            onChange={(e) => onTypeChange(e.target.value || undefined)}
            className="w-full px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#FFFFFF",
              borderColor: "rgba(255, 255, 255)",
              background: "rgba(10, 10, 10, 0.5)",
            }}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div>
          <label
            className="block font-mono text-xs mb-2 opacity-60"
            style={{ color: "#FFFFFF" }}
          >
            Tag
          </label>
          <select
            value={selectedTag || ""}
            onChange={(e) => onTagChange(e.target.value || undefined)}
            className="w-full px-3 py-2 bg-transparent border font-mono text-xs outline-none"
            style={{
              color: "#C8B68D",
              borderColor: "rgba(255, 255, 255)",
              background: "rgba(10, 10, 10, 0.5)",
            }}
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
