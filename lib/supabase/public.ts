import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous, cookie-free Supabase client for cached public reads.
 *
 * Because it never calls `cookies()`/`headers()`, it is safe to use inside
 * `unstable_cache`. It runs as the `anon` role, so RLS only returns
 * publicly-visible rows.
 */
export function createSupabasePublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
