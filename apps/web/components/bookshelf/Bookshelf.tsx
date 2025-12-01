"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookSpine, BookMeta } from "./BookSpine";

interface BookshelfProps {
  books: BookMeta[];
  onBookClick: (book: BookMeta) => void;
}

export function Bookshelf({ books, onBookClick }: BookshelfProps) {
  const [sortBy, setSortBy] = useState<"title" | "author" | "category">("title");
  const [page, setPage] = useState(0);
  const pageSize = 9;

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    copy.sort((a, b) => {
      const aVal = (a[sortBy] || "").toString().toLowerCase();
      const bVal = (b[sortBy] || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    });
    return copy;
  }, [books, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageBooks = sortedBooks.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const handleSortChange = (value: "title" | "author" | "category") => {
    setSortBy(value);
    setPage(0);
  };

  const goPage = (next: number) => {
    const target = Math.min(Math.max(0, next), totalPages - 1);
    setPage(target);
  };

  return (
    <div className="w-full relative bookshelf-shell">
      <div className="bookshelf-controls">
        <div className="bookshelf-controls__left">
          <span className="bookshelf-label">Sort</span>
          <div className="bookshelf-pills">
            {(["title", "author", "category"] as const).map((key) => (
              <button
                key={key}
                className={`bookshelf-pill ${sortBy === key ? "is-active" : ""}`}
                onClick={() => handleSortChange(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="bookshelf-controls__right">
          <span className="bookshelf-count">
            Showing {pageBooks.length} of {books.length} volumes
          </span>
          <div className="bookshelf-pagination">
            <button
              className="bookshelf-pagebtn"
              onClick={() => goPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Prev
            </button>
            <span className="bookshelf-pagecount">
              {currentPage + 1}/{totalPages}
            </span>
            <button
              className="bookshelf-pagebtn"
              onClick={() => goPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <motion.div
        key={`${sortBy}-${currentPage}`}
        className="bookshelf-grid"
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence>
          {pageBooks.map((book, index) => {
            const progress = Math.min(
              100,
              Math.max(0, Math.round((book as any).progress ?? 0))
            );
            const tags = (book.tags || []).slice(0, 3);

            return (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="bookshelf-card"
              >
                <BookSpine book={book} onClick={() => onBookClick(book)} index={index} />
                <div className="bookshelf-card__meta">
                  <div className="bookshelf-card__title">{book.title}</div>
                  <div className="bookshelf-card__author">{book.author}</div>
                  <div className="bookshelf-card__badges">
                    {book.category && <span className="bookshelf-badge">{book.category}</span>}
                    {tags.map((tag) => (
                      <span key={tag} className="bookshelf-badge subtle">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="bookshelf-card__progress">
                    <div className="bookshelf-card__progress-bar">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <span className="bookshelf-card__progress-label">{progress}%</span>
                  </div>
                  <button className="bookshelf-card__cta" onClick={() => onBookClick(book)}>
                    Open
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
