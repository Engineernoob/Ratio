"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChapterReader } from "@/components/bibliotheca/ChapterReader";
import { SealedScrollModal } from "@/components/bibliotheca/SealedScrollModal";
import type { BookData } from "@/components/bibliotheca/Bookshelf";

// Book coordinates and metadata
const BOOK_COORDINATES: BookData[] = [
  {
    id: "atomic_habits",
    title: "Atomic Habits",
    pdf: "/pdfs/atomic_habits.pdf",
    x: 360,
    y: 165,
    width: 40,
    height: 108,
  },
  {
    id: "thinking_fast_and_slow",
    title: "Thinking, Fast and Slow",
    pdf: "/pdfs/thinking_fast_and_slow.pdf",
    x: 405,
    y: 165,
    width: 38,
    height: 108,
  },
  {
    id: "book_top_left_1",
    x: 120,
    y: 55,
    width: 32,
    height: 100,
  },
  {
    id: "book_top_center_1",
    x: 390,
    y: 55,
    width: 28,
    height: 100,
  },
  {
    id: "book_top_right_1",
    x: 650,
    y: 55,
    width: 35,
    height: 100,
  },
  {
    id: "book_row3_left_1",
    x: 135,
    y: 285,
    width: 33,
    height: 112,
  },
  {
    id: "book_row3_center_1",
    x: 390,
    y: 285,
    width: 30,
    height: 112,
  },
  {
    id: "book_row3_right_1",
    x: 650,
    y: 285,
    width: 34,
    height: 112,
  },
];

// Mock chapters data
const getChaptersForBook = (bookId: string) => {
  const chapterMap: Record<
    string,
    Array<{ id: string; title: string; page: number }>
  > = {
    atomic_habits: [
      { id: "ch1", title: "The Surprising Power of Atomic Habits", page: 1 },
      { id: "ch2", title: "How Your Habits Shape Your Identity", page: 20 },
      {
        id: "ch3",
        title: "How to Build Better Habits in 4 Simple Steps",
        page: 40,
      },
    ],
    thinking_fast_and_slow: [
      { id: "ch1", title: "The Characters of the Story", page: 1 },
      { id: "ch2", title: "Attention and Effort", page: 30 },
      { id: "ch3", title: "The Lazy Controller", page: 60 },
    ],
  };
  return chapterMap[bookId] || [];
};

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.bookId as string;
  const [showSealedModal, setShowSealedModal] = useState(false);

  const book = BOOK_COORDINATES.find((b) => b.id === bookId);
  const chapters = getChaptersForBook(bookId);

  useEffect(() => {
    if (!book) {
      router.push("/bibliotheca");
      return;
    }

    // Show sealed modal if no PDF (with a small delay for animation)
    if (!book.pdf) {
      const timer = setTimeout(() => {
        setShowSealedModal(true);
      }, 800); // Wait for zoom animation
      return () => clearTimeout(timer);
    }
  }, [book, router]);

  const handleClose = () => {
    router.push("/bibliotheca");
  };

  if (!book) {
    return null;
  }

  return (
    <>
      <ChapterReader
        bookId={book.id}
        bookTitle={book.title || book.id}
        pdfPath={book.pdf}
        chapters={chapters}
        onClose={handleClose}
      />
      <SealedScrollModal
        isOpen={showSealedModal}
        onClose={handleClose}
        bookTitle={book.title}
      />
    </>
  );
}
