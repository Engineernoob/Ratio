/**
 * Supabase Authentication Utilities
 */

import { supabase, isSupabaseConfigured } from "./client";

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      error: new Error("Supabase not configured"),
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
        },
        error: null,
      };
    }

    return { user: null, error: new Error("No user returned") };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      error: new Error("Supabase not configured"),
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
        },
        error: null,
      };
    }

    return { user: null, error: new Error("No user returned") };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Sign in with magic link
 */
export async function signInWithMagicLink(
  email: string
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return {
      error: new Error("Supabase not configured"),
    };
  }

  try {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    return { error: error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    return { error: error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || "",
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: null }, error: null };
  }

  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || "",
      });
    } else {
      callback(null);
    }
  });
}
