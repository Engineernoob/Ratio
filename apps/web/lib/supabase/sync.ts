/**
 * Supabase Sync Utilities
 * Handles syncing data to/from Supabase with offline support
 */

import { supabase, isSupabaseConfigured } from "./client";
import { getCurrentUser } from "./auth";
import {
  queueOfflineAction,
  isOnline,
  storeOfflineData,
  getOfflineDataByKey,
  processOfflineQueue,
} from "./offline";
import type { Database } from "./types";

type TableName = keyof Database["public"]["Tables"];

/**
 * Sync memoria card
 */
export async function syncMemoriaCard(card: {
  concept_id: string;
  interval: number;
  ease: number;
  next_review: string;
}): Promise<{ error: Error | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  if (!isSupabaseConfigured()) {
    // Store offline
    storeOfflineData(`memoria-${card.concept_id}`, card);
    return { error: null };
  }

  if (!isOnline()) {
    queueOfflineAction({
      type: "sync_memoria",
      table: "memoria",
      action: "upsert",
      data: {
        user_id: user.id,
        ...card,
      },
    });
    return { error: null };
  }

  try {
    const { error } = await supabase.from("memoria").upsert(
      {
        user_id: user.id,
        concept_id: card.concept_id,
        interval: card.interval,
        ease: card.ease,
        next_review: card.next_review,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,concept_id",
      }
    );

    return { error: error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Sync note
 */
export async function syncNote(note: {
  book_id: string;
  chapter: string;
  text: string;
}): Promise<{ id: string | null; error: Error | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { id: null, error: new Error("Not authenticated") };
  }

  if (!isSupabaseConfigured()) {
    const id = `note-${Date.now()}`;
    storeOfflineData(id, note);
    return { id, error: null };
  }

  if (!isOnline()) {
    const id = `note-${Date.now()}`;
    queueOfflineAction({
      type: "sync_note",
      table: "notes",
      action: "insert",
      data: {
        id,
        user_id: user.id,
        ...note,
      },
    });
    return { id, error: null };
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        book_id: note.book_id,
        chapter: note.chapter,
        text: note.text,
      })
      .select()
      .single();

    return { id: data?.id || null, error: error || null };
  } catch (error) {
    return {
      id: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Sync highlight
 */
export async function syncHighlight(highlight: {
  book_id: string;
  chapter: string;
  text: string;
  color: string;
}): Promise<{ id: string | null; error: Error | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { id: null, error: new Error("Not authenticated") };
  }

  if (!isSupabaseConfigured()) {
    const id = `highlight-${Date.now()}`;
    storeOfflineData(id, highlight);
    return { id, error: null };
  }

  if (!isOnline()) {
    const id = `highlight-${Date.now()}`;
    queueOfflineAction({
      type: "sync_highlight",
      table: "highlights",
      action: "insert",
      data: {
        id,
        user_id: user.id,
        ...highlight,
      },
    });
    return { id, error: null };
  }

  try {
    const { data, error } = await supabase
      .from("highlights")
      .insert({
        user_id: user.id,
        book_id: highlight.book_id,
        chapter: highlight.chapter,
        text: highlight.text,
        color: highlight.color,
      })
      .select()
      .single();

    return { id: data?.id || null, error: error || null };
  } catch (error) {
    return {
      id: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Sync progress
 */
export async function syncProgress(progress: {
  book_id: string;
  chapter: string;
  percentage: number;
}): Promise<{ error: Error | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  if (!isSupabaseConfigured()) {
    storeOfflineData(
      `progress-${progress.book_id}-${progress.chapter}`,
      progress
    );
    return { error: null };
  }

  if (!isOnline()) {
    queueOfflineAction({
      type: "sync_progress",
      table: "progress",
      action: "upsert",
      data: {
        user_id: user.id,
        ...progress,
      },
    });
    return { error: null };
  }

  try {
    const { error } = await supabase.from("progress").upsert(
      {
        user_id: user.id,
        book_id: progress.book_id,
        chapter: progress.chapter,
        percentage: progress.percentage,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,book_id,chapter",
      }
    );

    return { error: error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Sync puzzle result
 */
export async function syncPuzzleResult(result: {
  puzzle_id: string;
  score: number;
  attempts: number;
}): Promise<{ error: Error | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  if (!isSupabaseConfigured()) {
    storeOfflineData(`puzzle-${result.puzzle_id}`, result);
    return { error: null };
  }

  if (!isOnline()) {
    queueOfflineAction({
      type: "sync_puzzle",
      table: "puzzle_results",
      action: "upsert",
      data: {
        user_id: user.id,
        ...result,
      },
    });
    return { error: null };
  }

  try {
    const { error } = await supabase.from("puzzle_results").upsert(
      {
        user_id: user.id,
        puzzle_id: result.puzzle_id,
        score: result.score,
        attempts: result.attempts,
      },
      {
        onConflict: "user_id,puzzle_id",
      }
    );

    return { error: error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Load user data from Supabase
 */
export async function loadUserData(): Promise<{
  memoria: any[];
  notes: any[];
  highlights: any[];
  progress: any[];
  error: Error | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      memoria: [],
      notes: [],
      highlights: [],
      progress: [],
      error: new Error("Not authenticated"),
    };
  }

  if (!isSupabaseConfigured() || !isOnline()) {
    // Return offline data
    return {
      memoria: [],
      notes: [],
      highlights: [],
      progress: [],
      error: null,
    };
  }

  try {
    const [memoriaRes, notesRes, highlightsRes, progressRes] =
      await Promise.all([
        supabase.from("memoria").select("*").eq("user_id", user.id),
        supabase.from("notes").select("*").eq("user_id", user.id),
        supabase.from("highlights").select("*").eq("user_id", user.id),
        supabase.from("progress").select("*").eq("user_id", user.id),
      ]);

    return {
      memoria: memoriaRes.data || [],
      notes: notesRes.data || [],
      highlights: highlightsRes.data || [],
      progress: progressRes.data || [],
      error: null,
    };
  } catch (error) {
    return {
      memoria: [],
      notes: [],
      highlights: [],
      progress: [],
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Process offline queue
 */
export async function syncOfflineQueue(): Promise<number> {
  return processOfflineQueue(async (action) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    switch (action.type) {
      case "sync_memoria":
        await syncMemoriaCard(action.data);
        break;
      case "sync_note":
        await syncNote(action.data);
        break;
      case "sync_highlight":
        await syncHighlight(action.data);
        break;
      case "sync_progress":
        await syncProgress(action.data);
        break;
      case "sync_puzzle":
        await syncPuzzleResult(action.data);
        break;
      default:
        console.warn(`Unknown sync action type: ${action.type}`);
    }
  });
}
