"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMeta } from "./BookSpine";
import { ReaderSettings } from "./ReaderModal";

interface ReaderContentProps {
  book: BookMeta;
  chapterIndex: number;
  settings: ReaderSettings;
  onNextChapter: () => void;
  onPrevChapter: () => void;
  onChapterChange: (index: number) => void;
  onScrollProgress?: (progress: number) => void;
  onPageInfo?: (currentPage: number, totalPages: number) => void;
  onHeaderVisibility?: (visible: boolean) => void;
}

interface ChapterContent {
  chapter?: number;
  chapter_title?: string;
  title?: string;
  content?: string;
  text?: string;
  summary?: string;
  micro_lessons?: Array<any>;
  index?: number;
}

export function ReaderContent({
  book,
  chapterIndex,
  settings,
  onNextChapter,
  onPrevChapter,
  onChapterChange,
  onScrollProgress,
  onPageInfo,
  onHeaderVisibility,
}: ReaderContentProps) {
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentChapter = book.chapters?.[chapterIndex];

  // Load chapter
  useEffect(() => {
    if (!currentChapter) {
      setChapterContent(null);
      setLoading(false);
      return;
    }

    const loadChapter = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/books/${book.id}?action=chapter&file=${currentChapter.file}`
        );
        if (res.ok) {
          const data = await res.json();
          const content = data.chapter || data;
          // Ensure content has required fields
          if (!content.index && chapterIndex !== undefined) {
            content.index = chapterIndex;
          }
          if (!content.chapter && chapterIndex !== undefined) {
            content.chapter = chapterIndex + 1;
          }
          if (!content.title && content.chapter_title) {
            content.title = content.chapter_title;
          }
          setChapterContent(content);

          // Preload next and previous chapters
          if (book.chapters && chapterIndex < book.chapters.length - 1) {
            fetch(
              `/api/books/${book.id}?action=chapter&file=${
                book.chapters[chapterIndex + 1].file
              }`
            ).catch(() => {});
          }
          if (book.chapters && chapterIndex > 0) {
            fetch(
              `/api/books/${book.id}?action=chapter&file=${
                book.chapters[chapterIndex - 1].file
              }`
            ).catch(() => {});
          }
        }
      } catch (error) {
        console.error("Error loading chapter:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
    setCurrentPage(0);
    setShowEpilogue(false);
  }, [currentChapter, book.id, chapterIndex]);

  // Handle scroll progress tracking and header visibility
  useEffect(() => {
    if (settings.readingMode !== "scroll" || !scrollContainerRef.current) {
      return;
    }

    let lastScrollY = 0;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Calculate progress
      if (onScrollProgress) {
        if (scrollHeight > clientHeight) {
          const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
          onScrollProgress(Math.min(100, Math.max(0, progress)));
        } else {
          onScrollProgress(100);
        }
      }

      // Handle header visibility (fade out on scroll down, fade in on scroll up)
      if (onHeaderVisibility) {
        const isScrollingDown = scrollTop > lastScrollY;
        const isNearTop = scrollTop < 10;
        onHeaderVisibility(!isScrollingDown || isNearTop);
        lastScrollY = scrollTop;
      }
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [
    settings.readingMode,
    chapterContent,
    onScrollProgress,
    onHeaderVisibility,
  ]);

  // Paginate content for page mode
  useEffect(() => {
    if (
      !chapterContent ||
      settings.readingMode === "scroll" ||
      !currentChapter
    ) {
      setPages([]);
      return;
    }

    const text =
      chapterContent.content ||
      chapterContent.text ||
      chapterContent.summary ||
      "";

    if (!text) {
      setPages([]);
      return;
    }

    // Estimate characters per page based on column width and font size
    const charsPerPageMap = {
      narrow: 1200,
      normal: 2000,
      wide: 2800,
    };
    const baseChars = charsPerPageMap[settings.columnWidth];
    const charsPerPage = Math.floor(baseChars * (settings.fontSize / 18));

    // Handle HTML content - split by paragraph tags
    const isHTML = text.includes("<p>") || text.includes("</p>");
    let paragraphs: string[] = [];

    if (isHTML) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = text;
      const textContent = tempDiv.textContent || "";
      paragraphs = textContent.split(/\n\n+/).filter((p) => p.trim());
    } else {
      paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
    }

    const paginated: string[] = [];
    let currentPage = "";

    paragraphs.forEach((para) => {
      const paraLength = para.length;
      const currentLength = currentPage.length;

      if (currentLength + paraLength > charsPerPage && currentPage) {
        paginated.push(currentPage.trim());
        currentPage = para;
      } else {
        currentPage += (currentPage ? "\n\n" : "") + para;
      }
    });

    if (currentPage.trim()) {
      paginated.push(currentPage.trim());
    }

    setPages(paginated.length > 0 ? paginated : [text]);
    setCurrentPage(0);
  }, [chapterContent, settings, currentChapter]);

  // Notify parent of page info changes
  useEffect(() => {
    if (onPageInfo && settings.readingMode === "page") {
      onPageInfo(currentPage, pages.length);
    }
  }, [currentPage, pages.length, settings.readingMode, onPageInfo]);

  const handleNext = () => {
    if (settings.readingMode === "page") {
      if (currentPage < pages.length - 1) {
        setCurrentPage(currentPage + 1);
        setShowEpilogue(false);
      } else {
        if (book.chapters && chapterIndex < book.chapters.length - 1) {
          onNextChapter();
          setShowEpilogue(false);
        } else {
          setShowEpilogue(true);
        }
      }
    }
  };

  const handlePrev = () => {
    if (settings.readingMode === "page") {
      if (showEpilogue) {
        setShowEpilogue(false);
        return;
      }
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        if (book.chapters && chapterIndex > 0) {
          onPrevChapter();
        }
      }
    }
  };

  // Theme styles
  const themeStyles = {
    monochrome: {
      background: "#0d0d0d",
      text: "#e8e8e8",
      dimText: "#888",
    },
    sepia: {
      background: "#F1E6D0",
      text: "#4B3B2F",
      dimText: "#6B5B4F",
    },
    oled: {
      background: "#000000",
      text: "#FFFFFF",
      dimText: "#888",
    },
    solarized: {
      background: "#002B36",
      text: "#93A1A1",
      dimText: "#657B83",
    },
  };

  const theme = themeStyles[settings.theme];

  // Font family
  const fontFamilies = {
    serif:
      '"Crimson Text", "Literata", "EB Garamond", "Cormorant Garamond", serif',
    "sans-serif":
      '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  };

  // Column width (max 680-740px)
  const columnWidths = {
    narrow: "max-w-[680px]",
    normal: "max-w-[720px]",
    wide: "max-w-[740px]",
  };

  const renderContent = () => {
    // Handle end of book (epilogue screen)
    if (showEpilogue && settings.readingMode === "page") {
      return (
        <div className="flex items-center justify-center min-h-full px-6 py-12">
          <div
            className={`${columnWidths[settings.columnWidth]} text-left`}
            style={{
              color: theme.text,
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
              fontFamily: fontFamilies[settings.fontFamily],
            }}
          >
            <h2
              className="font-serif text-3xl mb-6"
              style={{ color: theme.text, marginBottom: "1.15em" }}
            >
              Fin
            </h2>
            <p className="opacity-70" style={{ color: theme.text }}>
              You have reached the end of this book.
            </p>
          </div>
        </div>
      );
    }

    // Handle no content
    if (!chapterContent) {
      return (
        <div className="flex items-center justify-center min-h-full px-6 py-12">
          <div
            className={`${columnWidths[settings.columnWidth]} text-left`}
            style={{
              color: theme.dimText,
            }}
          >
            <p className="font-mono text-sm opacity-50">
              No content available for this chapter.
            </p>
          </div>
        </div>
      );
    }

    let rawText =
      chapterContent.content ||
      chapterContent.text ||
      chapterContent.summary ||
      "";

    if (!rawText) {
      return (
        <div className="flex items-center justify-center min-h-full px-6 py-12">
          <div
            className={`${columnWidths[settings.columnWidth]} text-left`}
            style={{
              color: theme.dimText,
            }}
          >
            <p className="font-mono text-sm opacity-50">
              This chapter is empty.
            </p>
          </div>
        </div>
      );
    }

    // Convert plain text to HTML if needed
    const isHTML =
      rawText.includes("<") &&
      (rawText.includes("</") || rawText.includes("/>"));
    let text = rawText;

    if (!isHTML && rawText) {
      text = rawText
        .split(/\n\n+/)
        .filter((p) => p.trim())
        .map(
          (p) =>
            `<p style="margin-bottom: 1.15em">${p
              .trim()
              .replace(/\n/g, " ")}</p>`
        )
        .join("");
    }

    const contentStyle = {
      color: theme.text,
      fontSize: `${settings.fontSize}px`,
      lineHeight: settings.lineHeight,
      wordSpacing: "0.2px",
      letterSpacing: "0.1px",
      fontFamily: fontFamilies[settings.fontFamily],
    };

    if (settings.readingMode === "scroll") {
      return (
        <div
          ref={scrollContainerRef}
          className="h-full overflow-y-auto"
          style={{ backgroundColor: theme.background }}
        >
          <div
            className={`${
              columnWidths[settings.columnWidth]
            } mx-auto px-6 md:px-10 py-12 md:py-16`}
            style={contentStyle}
          >
            {currentChapter && (
              <h1
                className="text-3xl md:text-4xl mb-8 md:mb-12 font-bold"
                style={{ color: theme.text, marginBottom: "1.5em" }}
              >
                {currentChapter.title}
              </h1>
            )}
            <div
              className="prose prose-invert max-w-none"
              style={{
                color: theme.text,
              }}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
        </div>
      );
    }

    // Pagination mode
    const currentPageContent = pages[currentPage] || text;
    const isShortContent = currentPageContent.length < 500;

    return (
      <div
        className={`flex px-6 md:px-10 py-12 md:py-16 ${
          isShortContent ? "items-center justify-center min-h-full" : ""
        }`}
      >
        <div
          className={`${columnWidths[settings.columnWidth]} ${
            isShortContent ? "" : "text-left"
          }`}
          style={contentStyle}
        >
          <div
            className="prose prose-invert max-w-none"
            style={{
              color: theme.text,
            }}
            dangerouslySetInnerHTML={{ __html: currentPageContent }}
          />
          {pages.length > 1 && (
            <p
              className="font-mono text-xs mt-8 opacity-50 text-center"
              style={{ color: theme.dimText }}
            >
              {currentPage + 1} / {pages.length}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full h-full overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Click zones for navigation (page mode only) */}
      {settings.readingMode === "page" && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
            aria-label="Previous page"
          />
          <button
            onClick={handleNext}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
            aria-label="Next page"
          />
        </>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="w-full h-full transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p
              className="font-mono text-sm opacity-50"
              style={{ color: theme.dimText }}
            >
              Loading...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={chapterIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
