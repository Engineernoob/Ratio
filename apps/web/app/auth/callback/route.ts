import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

/**
 * Handle Supabase auth callback (for magic links)
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Redirect to home or specified next page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // If error or no code, redirect to auth page
  return NextResponse.redirect(
    new URL("/auth?error=auth_failed", requestUrl.origin)
  );
}
