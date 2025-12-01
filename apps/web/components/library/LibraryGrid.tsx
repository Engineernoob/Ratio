"use client";

import { BookCard } from "./BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  category?: string;
  tags?: string[];
  spineTexture?: string;
  readingProgress?: number;
  pdfPath?: string;
}

interface LibraryGridProps {
  books: Book[];
}

export function LibraryGrid({ books }: LibraryGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-mono text-sm text-[#888888]">
          No books found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 justify-items-center">
      {books.map((book, index) => (
        <BookCard key={book.id} book={book} index={index} />
      ))}
    </div>
  );
}
