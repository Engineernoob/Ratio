"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ReaderShell } from "@/components/Reader/ReaderShell";
import { ToastContainer } from "@/components/core/Toast";
import { useToast } from "@/hooks/useToast";
import type { BookManifest, ChapterContent, BookChapterRef } from "@/lib/books/types";
import type { Highlight } from "@/lib/notes/types";

export default function ReaderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get("book");
  const chapterParam = searchParams.get("chapter");

  const [manifest, setManifest] = useState<BookManifest | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterContent | null>(
    null
  );
  const [selectedChapter, setSelectedChapter] = useState<BookChapterRef | null>(
    null
  );
  const [notes, setNotes] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const codexReaderRef = useRef<{ jumpToPage: (page: number) => void } | null>(
    null
  );
  const { toasts, showToast, removeToast } = useToast();

  // Load book manifest
  useEffect(() => {
    if (!bookId) {
      router.push("/bibliotheca");
      return;
    }

    const loadManifest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/${bookId}?action=manifest`);

        if (!response.ok) {
          throw new Error("Book not found");
        }

        const data = await response.json();
        setManifest(data.manifest);

        // Load chapter from URL parameter or first chapter by default
        if (data.manifest.chapters.length > 0) {
          let targetChapter: BookChapterRef = data.manifest.chapters[0];

          // Check if chapter parameter is provided
          if (chapterParam) {
            const foundChapter = data.manifest.chapters.find(
              (ch: BookChapterRef) =>
                ch.file === chapterParam || ch.id === chapterParam
            );
            if (foundChapter) {
              targetChapter = foundChapter;
            }
          }

          setSelectedChapter(targetChapter);
          await loadChapter(targetChapter.file);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book");
        console.error("Error loading manifest:", err);
      } finally {
        setLoading(false);
      }
    };

    loadManifest();
  }, [bookId, router, chapterParam]);

  // Load notes
  useEffect(() => {
    if (!bookId) return;

    const loadNotes = async () => {
      try {
        const response = await fetch(`/api/notes/${bookId}`);
        if (response.ok) {
          const data = await response.json();
          setNotes(data.highlights || []);
        }
      } catch (err) {
        console.error("Error loading notes:", err);
      }
    };

    loadNotes();
  }, [bookId]);

  // Listen for toast events
  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { message, type } = event.detail;
      showToast(message, type || "info");
    };

    window.addEventListener("showToast", handleShowToast as EventListener);
    return () => {
      window.removeEventListener("showToast", handleShowToast as EventListener);
    };
  }, [showToast]);

  // Load chapter content
  const loadChapter = async (fileName: string) => {
    if (!bookId) return;

    try {
      const response = await fetch(
        `/api/books/${bookId}?action=chapter&file=${encodeURIComponent(
          fileName
        )}`
      );

      if (!response.ok) {
        throw new Error("Chapter not found");
      }

      const data = await response.json();
      setCurrentChapter(data.chapter);
    } catch (err) {
      console.error("Error loading chapter:", err);
      setError("Failed to load chapter");
    }
  };

  // Handle chapter selection
  const handleSelectChapter = async (chapter: BookChapterRef) => {
    setSelectedChapter(chapter);
    await loadChapter(chapter.file);
  };

  // Handle note selection - jump to page and highlight
  const handleSelectNote = async (note: Highlight) => {
    // Find the chapter that contains this note's page
    if (note.chapterId) {
      const chapter = manifest?.chapters.find((ch) => ch.id === note.chapterId);
      if (chapter) {
        setSelectedChapter(chapter);
        await loadChapter(chapter.file);
      }
    }

    // Jump to the page (this will be handled by CodexReader)
    // We'll need to pass a ref or callback to CodexReader
    setTimeout(() => {
      // Trigger page jump via CodexReader
      // This will be implemented by adding a method to CodexReader
      const event = new CustomEvent("jumpToPage", {
        detail: { page: note.pageNumber, highlightId: note.id },
      });
      window.dispatchEvent(event);
    }, 300);
  };

  // Handle highlight created - refresh notes
  const handleHighlightCreated = () => {
    if (!bookId) return;

    const loadNotes = async () => {
      try {
        const response = await fetch(`/api/notes/${bookId}`);
        if (response.ok) {
          const data = await response.json();
          setNotes(data.highlights || []);
        }
      } catch (err) {
        console.error("Error loading notes:", err);
      }
    };

    loadNotes();
  };

  if (!bookId) {
    return null;
  }

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "#0A0A0A", color: "#C8B68D" }}
      >
        <div className="text-center">
          <div className="font-serif text-xl mb-4">Loading...</div>
          <div className="font-mono text-sm opacity-60">
            Opening the scroll...
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
    <>
      <ReaderShell
        bookTitle={manifest.title}
        author={manifest.author}
        chapters={manifest.chapters}
        currentChapter={currentChapter}
        selectedChapter={selectedChapter}
        onSelectChapter={handleSelectChapter}
        manifest={manifest}
        pdfPath={manifest.pdf}
        notes={notes}
        onSelectNote={handleSelectNote}
        onHighlightCreated={handleHighlightCreated}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
