"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { TopNavBar } from "@/components/core/TopNavBar";
import { Bookshelf } from "@/components/bookshelf/Bookshelf";
import { BookSearch } from "@/components/bookshelf/BookSearch";
import { BookFilters } from "@/components/bookshelf/BookFilters";
import { ReaderModal } from "@/components/bookshelf/ReaderModal";
import { BookMeta } from "@/components/bookshelf/BookSpine";
import { PageWrapper, SectionWrapper } from "@/app/components/ui/layout";
import {
  BodyText,
  DisplayTitle,
  PageSubtitle,
  SectionTitle,
} from "@/app/components/ui/typography";
import "@/styles/bookshelf.css";
import "./bibliotheca.css";

export default function BibliothecaPage() {
  const [books, setBooks] = useState<BookMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookMeta | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/bookshelf");
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          book.category?.toLowerCase().includes(query)
      );
    }

    // Category/tag filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((book) => {
        return selectedFilters.some((filterId) => {
          return (
            book.tags?.includes(filterId) ||
            book.category?.toLowerCase() === filterId.toLowerCase()
          );
        });
      });
    }

    return filtered;
  }, [books, searchQuery, selectedFilters]);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

  const totalBooks = books.length;
  const activeReads = useMemo(
    () =>
      books.filter(
        (book) =>
          (book as any).status === "reading" ||
          book.tags?.some((t) => t.toLowerCase().includes("reading"))
      ).length,
    [books]
  );
  const categoriesCount = useMemo(
    () =>
      Array.from(
        new Set(
          books
            .map((b) => b.category)
            .filter(Boolean)
            .map((c) => c?.toLowerCase())
        )
      ).length,
    [books]
  );
  const featured = useMemo(() => filteredBooks.slice(0, 3), [filteredBooks]);

  const renderHero = () => (
    <section className="biblio-hero">
      <div className="biblio-hero__image">
        <Image
          src="/artwork/classical/acropolis_dither.png"
          alt="Classical library engraving"
          fill
          priority
          sizes="100vw"
          className="biblio-hero__img"
        />
        <div className="biblio-hero__grain" />
        <div className="biblio-hero__vignette" />
      </div>
      <div className="biblio-hero__content">
        <div className="biblio-hero__stack">
          <PageSubtitle className="biblio-hero__overline">Ratio / Library</PageSubtitle>
          <DisplayTitle className="biblio-hero__title">BIBLIOTHECA</DisplayTitle>
          <BodyText className="biblio-hero__subtitle">
            Quiet stacks, monochrome shelves, and texts ready to open. Search, filter, and settle
            into the archive.
          </BodyText>
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="biblio-body relative min-h-screen">
        <TopNavBar />
        {renderHero()}
        <div className="relative z-10 biblio-content">
          <PageWrapper>
            <SectionWrapper className="items-center text-center">
              <BodyText className="max-w-2xl mx-auto">Unfolding the archive...</BodyText>
            </SectionWrapper>
          </PageWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="biblio-body relative min-h-screen">
      <TopNavBar />
      {renderHero()}
      <div className="relative z-10 biblio-content">
        <PageWrapper>
          <SectionWrapper className="biblio-quickgrid">
            <div className="biblio-quickcard">
              <span className="biblio-quickcard__label">Volumes</span>
              <span className="biblio-quickcard__value">{totalBooks || "—"}</span>
              <span className="biblio-quickcard__hint">Cataloged entries</span>
            </div>
            <div className="biblio-quickcard">
              <span className="biblio-quickcard__label">Reading now</span>
              <span className="biblio-quickcard__value">{activeReads}</span>
              <span className="biblio-quickcard__hint">Tagged as in-progress</span>
            </div>
            <div className="biblio-quickcard">
              <span className="biblio-quickcard__label">Shelves</span>
              <span className="biblio-quickcard__value">{categoriesCount}</span>
              <span className="biblio-quickcard__hint">Distinct categories</span>
            </div>
          </SectionWrapper>

          <SectionWrapper>
            <SectionTitle>Explore</SectionTitle>
            <div className="space-y-6">
              <BookSearch value={searchQuery} onChange={setSearchQuery} />
              <BookFilters
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearFilters}
              />
            </div>
          </SectionWrapper>

          <SectionWrapper>
            <SectionTitle>Volumes</SectionTitle>
            {filteredBooks.length > 0 ? (
              <Bookshelf books={filteredBooks} onBookClick={setSelectedBook} />
            ) : (
              <div className="text-center py-12">
                <BodyText>No books found. Adjust your search or filters.</BodyText>
              </div>
            )}
          </SectionWrapper>

          <SectionWrapper className="biblio-featured">
            <div className="biblio-featured__head">
              <SectionTitle>Featured Picks</SectionTitle>
              <BodyText className="biblio-featured__hint">
                A few volumes surfaced from your current filters.
              </BodyText>
            </div>
            <div className="biblio-featured__grid">
              {featured.length > 0 ? (
                featured.map((book, idx) => (
                  <div
                    key={`${book.title || "book"}-${book.author || "author"}-${idx}`}
                    className="biblio-featured__card"
                  >
                    <div className="biblio-featured__title">{book.title}</div>
                    <div className="biblio-featured__author">{book.author}</div>
                    {book.category && (
                      <div className="biblio-featured__badge">{book.category}</div>
                    )}
                  </div>
                ))
              ) : (
                <BodyText className="opacity-70">Filter to surface a trio of texts.</BodyText>
              )}
            </div>
          </SectionWrapper>
        </PageWrapper>
      </div>

      <ReaderModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}
