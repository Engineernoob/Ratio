/**
 * Storage Restore Utilities
 * Handles restoring user data from cloud storage
 */

import { downloadJSON, downloadFile } from "./download";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  syncMemoriaCard,
  syncNote,
  syncHighlight,
  syncProgress,
} from "@/lib/supabase/sync";
import type { BackupManifest } from "./types";

/**
 * Restore memoria data
 */
export async function restoreMemoria(): Promise<{
  restored: number;
  error: Error | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { restored: 0, error: new Error("Not authenticated") };
  }

  try {
    const { data, error } = await downloadJSON("userdata", "memoria.json");

    if (error || !data) {
      return { restored: 0, error: error || new Error("No data found") };
    }

    let restored = 0;
    const memoriaArray = Array.isArray(data) ? data : [];

    for (const card of memoriaArray) {
      const result = await syncMemoriaCard({
        concept_id: card.concept_id,
        interval: card.interval,
        ease: card.ease,
        next_review: card.next_review,
      });

      if (!result.error) {
        restored++;
      }
    }

    return { restored, error: null };
  } catch (error) {
    return {
      restored: 0,
      error: error instanceof Error ? error : new Error("Restore failed"),
    };
  }
}

/**
 * Restore notes
 */
export async function restoreNotes(): Promise<{
  restored: number;
  error: Error | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { restored: 0, error: new Error("Not authenticated") };
  }

  try {
    const { data, error } = await downloadJSON("userdata", "notes.json");

    if (error || !data) {
      return { restored: 0, error: error || new Error("No data found") };
    }

    let restored = 0;
    const notesArray = Array.isArray(data) ? data : [];

    for (const note of notesArray) {
      const result = await syncNote({
        book_id: note.book_id,
        chapter: note.chapter,
        text: note.text,
      });

      if (!result.error) {
        restored++;
      }
    }

    return { restored, error: null };
  } catch (error) {
    return {
      restored: 0,
      error: error instanceof Error ? error : new Error("Restore failed"),
    };
  }
}

/**
 * Restore highlights
 */
export async function restoreHighlights(): Promise<{
  restored: number;
  error: Error | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { restored: 0, error: new Error("Not authenticated") };
  }

  try {
    const { data, error } = await downloadJSON("userdata", "highlights.json");

    if (error || !data) {
      return { restored: 0, error: error || new Error("No data found") };
    }

    let restored = 0;
    const highlightsArray = Array.isArray(data) ? data : [];

    for (const highlight of highlightsArray) {
      const result = await syncHighlight({
        book_id: highlight.book_id,
        chapter: highlight.chapter,
        text: highlight.text,
        color: highlight.color || "#ffff00",
      });

      if (!result.error) {
        restored++;
      }
    }

    return { restored, error: null };
  } catch (error) {
    return {
      restored: 0,
      error: error instanceof Error ? error : new Error("Restore failed"),
    };
  }
}

/**
 * Restore progress
 */
export async function restoreProgress(): Promise<{
  restored: number;
  error: Error | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { restored: 0, error: new Error("Not authenticated") };
  }

  try {
    const { data, error } = await downloadJSON("userdata", "progress.json");

    if (error || !data) {
      return { restored: 0, error: error || new Error("No data found") };
    }

    let restored = 0;
    const progressArray = Array.isArray(data) ? data : [];

    for (const progressItem of progressArray) {
      const result = await syncProgress({
        book_id: progressItem.book_id,
        chapter: progressItem.chapter,
        percentage: progressItem.percentage,
      });

      if (!result.error) {
        restored++;
      }
    }

    return { restored, error: null };
  } catch (error) {
    return {
      restored: 0,
      error: error instanceof Error ? error : new Error("Restore failed"),
    };
  }
}

/**
 * Restore all data
 */
export async function restoreAllData(): Promise<{
  results: {
    memoria: number;
    notes: number;
    highlights: number;
    progress: number;
  };
  error: Error | null;
}> {
  try {
    const [memoriaResult, notesResult, highlightsResult, progressResult] =
      await Promise.all([
        restoreMemoria(),
        restoreNotes(),
        restoreHighlights(),
        restoreProgress(),
      ]);

    return {
      results: {
        memoria: memoriaResult.restored,
        notes: notesResult.restored,
        highlights: highlightsResult.restored,
        progress: progressResult.restored,
      },
      error: null,
    };
  } catch (error) {
    return {
      results: {
        memoria: 0,
        notes: 0,
        highlights: 0,
        progress: 0,
      },
      error: error instanceof Error ? error : new Error("Restore failed"),
    };
  }
}

/**
 * Load backup manifest
 */
export async function loadBackupManifest(): Promise<{
  manifest: BackupManifest | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await downloadJSON(
      "userdata",
      "backup-manifest.json"
    );

    if (error || !data) {
      return { manifest: null, error: error || new Error("No manifest found") };
    }

    return { manifest: data as BackupManifest, error: null };
  } catch (error) {
    return {
      manifest: null,
      error:
        error instanceof Error ? error : new Error("Failed to load manifest"),
    };
  }
}
