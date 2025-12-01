/**
 * Quick Supabase Test
 * Run this in browser console to quickly test Supabase
 */

import { supabase, isSupabaseConfigured } from "./client";

/**
 * Quick test - can be run from browser console
 */
export async function quickTest() {
  console.log("🔍 Testing Supabase connection...\n");

  // Test 1: Configuration
  console.log("1. Configuration check:");
  const configured = isSupabaseConfigured();
  console.log(configured ? "   ✅ Configured" : "   ❌ Not configured");
  if (!configured) {
    console.log("   ⚠️  Check your .env.local file");
    return;
  }

  // Test 2: Connection
  console.log("\n2. Connection test:");
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(0);
    if (error) {
      console.log("   ❌ Connection failed:", error.message);
    } else {
      console.log("   ✅ Connected to Supabase");
    }
  } catch (error) {
    console.log("   ❌ Connection error:", error);
    return;
  }

  // Test 3: Storage
  console.log("\n3. Storage test:");
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log("   ❌ Storage access failed:", error.message);
    } else {
      const buckets = data?.map((b) => b.name) || [];
      const required = [
        "books",
        "notes",
        "highlights",
        "maps",
        "puzzles",
        "userdata",
      ];
      const missing = required.filter((b) => !buckets.includes(b));

      if (missing.length > 0) {
        console.log("   ⚠️  Missing buckets:", missing.join(", "));
      } else {
        console.log("   ✅ All buckets exist");
      }
    }
  } catch (error) {
    console.log("   ❌ Storage error:", error);
  }

  // Test 4: Auth
  console.log("\n4. Auth test:");
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      console.log("   ✅ Authenticated as:", session.user.email);
    } else {
      console.log("   ℹ️  Not authenticated (this is OK)");
    }
  } catch (error) {
    console.log("   ❌ Auth error:", error);
  }

  console.log("\n✨ Test complete!");
}

// Make it available globally for console testing
if (typeof window !== "undefined") {
  (window as any).testSupabase = quickTest;
}
