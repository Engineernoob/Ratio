/**
 * Storage Integration Utilities
 * Easy-to-use functions for integrating cloud storage into existing systems
 */

import {
  syncMemoriaCard,
  syncNote,
  syncHighlight,
  syncProgress,
  syncPuzzleResult,
} from "@/lib/supabase/sync";
import { uploadJSON, uploadFile } from "./upload";
import { backupMemoria } from "./backup";

/**
 * Hook for Memoria integration
 * Call this after creating/updating a memoria card
 */
export async function syncMemoriaAfterUpdate(card: {
  concept_id: string;
  interval: number;
  ease: number;
  next_review: string;
}): Promise<void> {
  try {
    await syncMemoriaCard(card);
    // Also backup to userdata bucket periodically
    // (in production, use a debounce/throttle)
  } catch (error) {
    console.error("Error syncing memoria:", error);
  }
}

/**
 * Hook for Reader integration
 * Call this after creating a note
 */
export async function syncNoteAfterCreate(note: {
  book_id: string;
  chapter: string;
  text: string;
}): Promise<string | null> {
  try {
    const { id } = await syncNote(note);
    return id;
  } catch (error) {
    console.error("Error syncing note:", error);
    return null;
  }
}

/**
 * Hook for Reader integration
 * Call this after creating a highlight
 */
export async function syncHighlightAfterCreate(highlight: {
  book_id: string;
  chapter: string;
  text: string;
  color: string;
}): Promise<string | null> {
  try {
    const { id } = await syncHighlight(highlight);
    return id;
  } catch (error) {
    console.error("Error syncing highlight:", error);
    return null;
  }
}

/**
 * Hook for Reader/Bibliotheca integration
 * Call this after updating reading progress
 */
export async function syncProgressAfterUpdate(progress: {
  book_id: string;
  chapter: string;
  percentage: number;
}): Promise<void> {
  try {
    await syncProgress(progress);
  } catch (error) {
    console.error("Error syncing progress:", error);
  }
}

/**
 * Hook for Laboratorivm integration
 * Call this after completing a puzzle
 */
export async function syncPuzzleAfterComplete(result: {
  puzzle_id: string;
  score: number;
  attempts: number;
}): Promise<void> {
  try {
    await syncPuzzleResult(result);
  } catch (error) {
    console.error("Error syncing puzzle result:", error);
  }
}

/**
 * Hook for Bibliotheca integration
 * Call this after processing a book
 */
export async function syncBookAfterProcessing(
  bookId: string,
  chapters: any[]
): Promise<void> {
  try {
    // Upload processed chapters to storage
    await uploadJSON("books", `${bookId}/chapters.json`, chapters);
  } catch (error) {
    console.error("Error syncing book chapters:", error);
  }
}

/**
 * Periodic backup trigger
 * Call this on app start or periodically
 */
export async function triggerPeriodicBackup(): Promise<void> {
  try {
    // Only backup if last backup was more than 24 hours ago
    const lastBackup = localStorage.getItem("last_backup_time");
    const now = Date.now();

    if (!lastBackup || now - parseInt(lastBackup) > 24 * 60 * 60 * 1000) {
      await backupMemoria();
      localStorage.setItem("last_backup_time", now.toString());
    }
  } catch (error) {
    console.error("Error in periodic backup:", error);
  }
}
