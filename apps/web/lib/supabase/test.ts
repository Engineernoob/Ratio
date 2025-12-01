/**
 * Supabase Connection Test
 * Run this to verify Supabase is configured and working
 */

import { supabase, isSupabaseConfigured } from "./client";
import { getCurrentUser, getSession } from "./auth";

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  results: {
    configured: boolean;
    connected: boolean;
    authenticated: boolean;
    database: boolean;
    storage: boolean;
  };
  errors: string[];
}> {
  const results = {
    configured: false,
    connected: false,
    authenticated: false,
    database: false,
    storage: false,
  };
  const errors: string[] = [];

  // Test 1: Configuration
  try {
    results.configured = isSupabaseConfigured();
    if (!results.configured) {
      errors.push("Supabase not configured - check environment variables");
    }
  } catch (error) {
    errors.push(`Configuration check failed: ${error}`);
  }

  if (!results.configured) {
    return { success: false, results, errors };
  }

  // Test 2: Connection
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(0);
    results.connected = !error;
    if (error) {
      errors.push(`Connection failed: ${error.message}`);
    }
  } catch (error) {
    errors.push(`Connection test failed: ${error}`);
    results.connected = false;
  }

  // Test 3: Authentication
  try {
    const session = await getSession();
    const user = await getCurrentUser();
    results.authenticated = !!session && !!user;
    if (!session && !user) {
      errors.push(
        "Not authenticated - this is OK if you haven't logged in yet"
      );
    }
  } catch (error) {
    errors.push(`Authentication check failed: ${error}`);
  }

  // Test 4: Database (test query)
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    results.database = !error || error.code === "PGRST116"; // PGRST116 = no rows, which is OK
    if (error && error.code !== "PGRST116") {
      errors.push(`Database query failed: ${error.message}`);
    }
  } catch (error) {
    errors.push(`Database test failed: ${error}`);
  }

  // Test 5: Storage (list buckets)
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      // If listing buckets fails, try to access a specific bucket instead
      const { error: testError } = await supabase.storage
        .from("userdata")
        .list("", { limit: 1 });

      if (testError) {
        errors.push(
          `Storage access failed: ${error.message}. Bucket test: ${testError.message}`
        );
        results.storage = false;
      } else {
        // Can access bucket even if can't list all buckets
        results.storage = true;
        errors.push(
          "Cannot list all buckets (may need admin access), but can access userdata bucket"
        );
      }
    } else if (data) {
      const requiredBuckets = [
        "books",
        "notes",
        "highlights",
        "maps",
        "puzzles",
        "userdata",
      ];
      const existingBuckets = data.map((b) => b.name);
      const missing = requiredBuckets.filter(
        (b) => !existingBuckets.includes(b)
      );
      if (missing.length > 0) {
        errors.push(`Missing buckets: ${missing.join(", ")}`);
        results.storage = false;
      } else {
        results.storage = true;
      }
    } else {
      results.storage = false;
      errors.push("Storage buckets list returned no data");
    }
  } catch (error) {
    errors.push(`Storage test failed: ${error}`);
    results.storage = false;
  }

  const success =
    results.configured &&
    results.connected &&
    results.database &&
    results.storage;

  return { success, results, errors };
}

/**
 * Test storage upload (small test file)
 */
export async function testStorageUpload(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "Not authenticated. Please sign in to test storage upload.",
    };
  }

  try {
    const testContent = JSON.stringify({
      test: true,
      timestamp: new Date().toISOString(),
    });
    const blob = new Blob([testContent], { type: "application/json" });
    // Use user ID in path to match RLS policy
    const userId = session.user.id;
    const testPath = `${userId}/test-${Date.now()}.json`;

    const { data, error } = await supabase.storage
      .from("userdata")
      .upload(testPath, blob, {
        contentType: "application/json",
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: `${error.message}. Make sure storage policies are set up correctly.`,
      };
    }

    // Clean up test file
    await supabase.storage.from("userdata").remove([testPath]);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
