"use client";

import { BookSpine, BookMeta } from "./BookSpine";

interface ShelfRowProps {
  books: BookMeta[];
  onBookClick: (book: BookMeta) => void;
  rowIndex: number;
}

export function ShelfRow({ books, onBookClick, rowIndex }: ShelfRowProps) {
  return (
    <div className="flex gap-4 md:gap-6 justify-start items-end mb-8 overflow-x-auto scrollbar-hide">
      {books.map((book, index) => (
        <BookSpine
          key={book.id}
          book={book}
          onClick={() => onBookClick(book)}
          index={rowIndex * 10 + index}
        />
      ))}
    </div>
  );
}
