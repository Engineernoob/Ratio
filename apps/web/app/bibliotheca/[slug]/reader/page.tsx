"use client";

import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import type {
  BookManifest,
  BookChapterRef,
  ChapterContent,
} from "@/lib/books/types";
import type { Highlight } from "@/lib/notes/types";

// Lazy load heavy components
const AdvancedCodexReader = lazy(() =>
  import("@/components/Reader/AdvancedCodexReader").then((mod) => ({
    default: mod.AdvancedCodexReader,
  }))
);
const ScrollUnrollAnimation = lazy(() =>
  import("@/components/Reader/ScrollUnrollAnimation").then((mod) => ({
    default: mod.ScrollUnrollAnimation,
  }))
);

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [manifest, setManifest] = useState<BookManifest | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterContent | null>(
    null
  );
  const [selectedChapter, setSelectedChapter] = useState<BookChapterRef | null>(
    null
  );
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUnroll, setShowUnroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load book manifest
  useEffect(() => {
    if (!slug) {
      setError("No book slug provided");
      setLoading(false);
      return;
    }

    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/books/${slug}?action=manifest`);
        if (!res.ok) {
          throw new Error("Failed to load book manifest");
        }
        const response = await res.json();
        const manifestData = response.manifest || response;
        setManifest(manifestData);

        // Load first chapter by default
        if (manifestData.chapters && manifestData.chapters.length > 0) {
          const firstChapter = manifestData.chapters[0];
          setSelectedChapter(firstChapter);
          await loadChapter(slug, firstChapter.file);
        }
      } catch (err) {
        console.error("Error loading book:", err);
        setError(err instanceof Error ? err.message : "Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [slug]);

  // Load highlights
  useEffect(() => {
    if (!slug) return;

    const loadHighlights = async () => {
      try {
        const res = await fetch(`/api/notes/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setHighlights(data.highlights || []);
        }
      } catch (err) {
        console.error("Error loading highlights:", err);
      }
    };

    loadHighlights();
  }, [slug]);

  const loadChapter = async (bookId: string, fileName: string) => {
    try {
      const res = await fetch(
        `/api/books/${bookId}?action=chapter&file=${fileName}`
      );
      if (!res.ok) {
        throw new Error("Failed to load chapter");
      }
      const response = await res.json();
      const chapterData = response.chapter || response;
      setCurrentChapter(chapterData);
    } catch (err) {
      console.error("Error loading chapter:", err);
    }
  };

  const handleSelectChapter = async (chapter: BookChapterRef) => {
    setSelectedChapter(chapter);
    if (slug) {
      await loadChapter(slug, chapter.file);
    }
  };

  const handleHighlightCreated = async (highlight: {
    pageNumber: number;
    text: string;
    bounds: DOMRect;
    chapterId?: string;
  }) => {
    if (!slug) return;

    try {
      const res = await fetch(`/api/notes/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: slug,
          chapterId: highlight.chapterId || selectedChapter?.id,
          pageNumber: highlight.pageNumber,
          text: highlight.text,
          bounds: {
            x: highlight.bounds.x,
            y: highlight.bounds.y,
            width: highlight.bounds.width,
            height: highlight.bounds.height,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHighlights((prev) => [...prev, data.highlight]);
      }
    } catch (err) {
      console.error("Error saving highlight:", err);
    }
  };

  const handleNoteCreated = async (note: {
    chapterId?: string;
    selectionId?: string;
    text: string;
  }) => {
    if (!slug) return;

    try {
      const res = await fetch(`/api/notes/${slug}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: slug,
          chapterId: note.chapterId || selectedChapter?.id,
          selectionId: note.selectionId,
          text: note.text,
        }),
      });

      if (res.ok) {
        // Refresh highlights to get updated notes
        const highlightsRes = await fetch(`/api/notes/${slug}`);
        if (highlightsRes.ok) {
          const data = await highlightsRes.json();
          setHighlights(data.highlights || []);
        }
      }
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleUnrollComplete = () => {
    setShowUnroll(false);
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "#0A0A0A", color: "#C8B68D" }}
      >
        <div className="text-center">
          <div className="font-serif text-xl mb-4">Loading...</div>
          <div className="font-mono text-sm opacity-60">
            Preparing the codex
          </div>
        </div>
      </div>
    );
  }

  if (error || !manifest) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "#0A0A0A", color: "#C8B68D" }}
      >
        <div className="text-center">
          <div className="font-serif text-xl mb-4">Error</div>
          <div className="font-mono text-sm opacity-60">
            {error || "Book not found"}
          </div>
          <button
            onClick={() => router.push("/bibliotheca")}
            className="mt-6 px-6 py-2 border rounded font-mono text-sm transition-colors"
            style={{
              borderColor: "rgba(200, 182, 141, 0.3)",
              color: "#C8B68D",
              background: "rgba(49, 42, 29, 0.5)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C8B68D";
              e.currentTarget.style.background = "rgba(200, 182, 141, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(200, 182, 141, 0.3)";
              e.currentTarget.style.background = "rgba(49, 42, 29, 0.5)";
            }}
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      <Suspense
        fallback={
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ background: "#0A0A0A", color: "#C8B68D" }}
          >
            <div className="text-center">
              <div className="font-serif text-xl mb-4">Loading...</div>
              <div className="font-mono text-sm opacity-60">
                Preparing the codex
              </div>
            </div>
          </div>
        }
      >
        {showUnroll && (
          <ScrollUnrollAnimation
            bookTitle={manifest.title}
            onComplete={handleUnrollComplete}
          />
        )}
        {!showUnroll && (
          <AdvancedCodexReader
            bookId={slug}
            manifest={manifest}
            currentChapter={currentChapter}
            selectedChapter={selectedChapter}
            onSelectChapter={handleSelectChapter}
            highlights={highlights}
            onHighlightCreated={handleHighlightCreated}
            onNoteCreated={handleNoteCreated}
          />
        )}
      </Suspense>
    </div>
  );
}
