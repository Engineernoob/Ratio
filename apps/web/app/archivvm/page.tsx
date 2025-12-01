"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TopNavBar } from "@/components/core/TopNavBar";
import { ArchivvmSearch } from "@/components/archivvm/ArchivvmSearch";
import { ArchivvmFilters } from "@/components/archivvm/ArchivvmFilters";
import { ArchivvmGrid } from "@/components/archivvm/ArchivvmGrid";
import { ArchivvmModal } from "@/components/archivvm/ArchivvmModal";
import { ArchivvmEmptyState } from "@/components/archivvm/ArchivvmEmptyState";
import { ToastContainer } from "@/components/core/Toast";
import { useToast } from "@/hooks/useToast";
import { PageWrapper, SectionWrapper } from "@/app/components/ui/layout";
import {
  BodyText,
  DisplayTitle,
  PageSubtitle,
  SectionTitle,
  MicroText,
} from "@/app/components/ui/typography";
import type { ArchivvmItem } from "@/lib/archivvm/types";
import {
  fuzzySearch,
  filterItems,
  getUniqueValues,
} from "@/lib/archivvm/search";
import "./archivvm.css";

export default function ArchivvmPage() {
  const [items, setItems] = useState<ArchivvmItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedBook, setSelectedBook] = useState<string | undefined>();
  const [selectedChapter, setSelectedChapter] = useState<string | undefined>();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [selectedItem, setSelectedItem] = useState<ArchivvmItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, removeToast } = useToast();

  // Load items
  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetch("/api/archivvm/items");
        if (response.ok) {
          const data = await response.json();
          setItems(data.items || []);
        }
      } catch (error) {
        console.error("Error loading Archivvm items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Get unique values for filters
  const uniqueValues = useMemo(() => getUniqueValues(items), [items]);

  // Filter and search items
  const filteredItems = useMemo(() => {
    let result = items;

    // Apply filters
    result = filterItems(result, {
      bookId: selectedBook,
      chapterId: selectedChapter,
      type: selectedType,
      tag: selectedTag,
    });

    // Apply search
    if (searchQuery.trim()) {
      result = fuzzySearch(result, searchQuery);
    }

    // Sort by creation date (newest first)
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  }, [
    items,
    searchQuery,
    selectedBook,
    selectedChapter,
    selectedType,
    selectedTag,
  ]);

  // Pagination
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = useMemo(
    () =>
      filteredItems.slice(
        currentPage * pageSize,
        currentPage * pageSize + pageSize
      ),
    [filteredItems, currentPage]
  );

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedBook, selectedChapter, selectedType, selectedTag]);

  const handleItemClick = (item: ArchivvmItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const totals = {
    books: uniqueValues.books.length,
    tags: uniqueValues.tags.length,
    items: items.length,
  };

  const renderHero = () => (
    <section className="archiv-hero">
      <div className="archiv-hero__image">
        <Image
          src="/artwork/classical/ARCHIVVM.png"
          alt="Monochrome archive relief"
          fill
          priority
          sizes="100vw"
          className="archiv-hero__img"
        />
        <div className="archiv-hero__grain" />
        <div className="archiv-hero__vignette" />
        <div className="archiv-particles archiv-particles--slow" />
        <div className="archiv-particles archiv-particles--mid" />
        <div className="archiv-particles archiv-particles--fast" />
      </div>
      <div className="archiv-hero__content">
        <div className="archiv-hero__stack">
          <PageSubtitle className="archiv-hero__overline">
            Ratio / Archive
          </PageSubtitle>
          <DisplayTitle className="archiv-hero__title">ARCHIVVM</DisplayTitle>
          <BodyText className="archiv-hero__subtitle">
            Monochrome vault of fragments—search, filter, and open the engraved
            record.
          </BodyText>
          <div className="archiv-hero__glow" aria-hidden />
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="archiv-body relative min-h-screen">
        <TopNavBar />
        {renderHero()}
        <div className="relative z-10 archiv-content">
          <PageWrapper>
            <SectionWrapper className="items-center text-center">
              <BodyText className="max-w-2xl mx-auto">
                Gathering knowledge fragments...
              </BodyText>
            </SectionWrapper>
          </PageWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="archiv-body relative min-h-screen">
      <TopNavBar />
      {renderHero()}
      <div className="archiv-fade" />
      <div className="relative z-10 archiv-content">
        <PageWrapper>
          <SectionWrapper className="archiv-quickbar">
            <div>
              <MicroText>Vault status</MicroText>
              <div className="archiv-quickbar__title">Collected fragments</div>
            </div>
            <div className="archiv-quickbar__metrics">
              <div className="archiv-chip">
                <span className="archiv-chip__dot" />
                <span className="archiv-chip__label">
                  {filteredItems.length} visible
                </span>
              </div>
              <div className="archiv-chip subtle">
                <span className="archiv-chip__dot" />
                <span className="archiv-chip__label">{totals.items} total</span>
              </div>
              <div className="archiv-chip subtle">
                <span className="archiv-chip__dot" />
                <span className="archiv-chip__label">
                  {totals.books} books · {totals.tags} tags
                </span>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper className="archiv-panel">
            <div className="archiv-panel__head">
              <SectionTitle>Filter & Search</SectionTitle>
              <MicroText>Surface the right fragment from the vault.</MicroText>
            </div>
            <div className="archiv-panel__grid">
              <div className="archiv-panel__filters">
                <ArchivvmSearch value={searchQuery} onChange={setSearchQuery} />
                <ArchivvmFilters
                  books={uniqueValues.books}
                  chapters={uniqueValues.chapters}
                  types={uniqueValues.types}
                  tags={uniqueValues.tags}
                  selectedBook={selectedBook}
                  selectedChapter={selectedChapter}
                  selectedType={selectedType}
                  selectedTag={selectedTag}
                  onBookChange={setSelectedBook}
                  onChapterChange={setSelectedChapter}
                  onTypeChange={setSelectedType}
                  onTagChange={setSelectedTag}
                />
                <BodyText className="archiv-panel__count">
                  Showing {pageItems.length} of {filteredItems.length} (total{" "}
                  {items.length})
                </BodyText>
                <div className="archiv-panel__pager">
                  <button
                    className="archiv-pill"
                    onClick={() => setPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    Prev
                  </button>
                  <MicroText>
                    Page {currentPage + 1} / {totalPages}
                  </MicroText>
                  <button
                    className="archiv-pill"
                    onClick={() =>
                      setPage(Math.min(totalPages - 1, currentPage + 1))
                    }
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.05,
                }}
                className="archiv-panel__results"
              >
                {filteredItems.length > 0 ? (
                  <ArchivvmGrid
                    items={pageItems}
                    onItemClick={handleItemClick}
                  />
                ) : (
                  <ArchivvmEmptyState />
                )}
              </motion.div>
            </div>
          </SectionWrapper>
        </PageWrapper>
      </div>

      <ArchivvmModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
