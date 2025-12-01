"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { BookProgress } from "@/lib/scholarivm/utils";

interface BookProgressListProps {
  books: BookProgress[];
  delay?: number;
}

export function BookProgressList({ books, delay = 0 }: BookProgressListProps) {
  const [animatedBooks, setAnimatedBooks] = useState<BookProgress[]>([]);

  useEffect(() => {
    // Animate progress bars
    const duration = 1200;
    const startTime = Date.now();
    const startBooks = books.map((b) => ({ ...b, progressPercent: 0 }));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedBooks(
        books.map((book, i) => ({
          ...book,
          progressPercent:
            startBooks[i].progressPercent +
            (book.progressPercent - startBooks[i].progressPercent) * easeOut,
        }))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedBooks(books);
      }
    };

    animate();
  }, [books]);

  if (animatedBooks.length === 0) {
    setAnimatedBooks(books.map((b) => ({ ...b, progressPercent: 0 })));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative p-6 border rounded-sm"
      style={{
        borderColor: "rgba(215, 196, 158, 0.2)",
        background: "rgba(10, 10, 10, 0.6)",
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Marble texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 rounded-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23marble)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10">
        <h3
          className="font-serif text-sm uppercase tracking-wider mb-4 engraved-text"
          style={{ color: "#d7c49e" }}
        >
          Book Progress
        </h3>

        <div className="space-y-4">
          {animatedBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delay + i * 0.1 }}
            >
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <div
                      className="font-serif text-sm uppercase tracking-wide"
                      style={{ color: "rgba(215, 196, 158, 0.9)" }}
                    >
                      {book.title}
                    </div>
                    <div
                      className="font-mono text-xs"
                      style={{ color: "rgba(215, 196, 158, 0.5)" }}
                    >
                      {book.author}
                    </div>
                  </div>
                  <div
                    className="font-serif text-lg font-bold"
                    style={{ color: "#d7c49e" }}
                  >
                    {Math.round(book.progressPercent)}%
                  </div>
                </div>
                <div
                  className="h-2 rounded-sm overflow-hidden"
                  style={{
                    background: "rgba(215, 196, 158, 0.1)",
                    border: "1px solid rgba(215, 196, 158, 0.2)",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${book.progressPercent}%` }}
                    transition={{
                      duration: 1,
                      delay: delay + i * 0.1 + 0.3,
                      ease: "easeOut",
                    }}
                    className="h-full"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(215, 196, 158, 0.6), rgba(215, 196, 158, 0.8))",
                      boxShadow: "0 0 10px rgba(215, 196, 158, 0.3)",
                    }}
                  />
                </div>
                <div
                  className="font-mono text-xs mt-1"
                  style={{ color: "rgba(215, 196, 158, 0.4)" }}
                >
                  {book.chaptersCompleted} / {book.chaptersTotal} chapters
                </div>
              </div>
            </motion.div>
          ))}

          {books.length === 0 && (
            <div
              className="text-center py-8 font-mono text-sm"
              style={{ color: "rgba(215, 196, 158, 0.4)" }}
            >
              No books in progress
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
