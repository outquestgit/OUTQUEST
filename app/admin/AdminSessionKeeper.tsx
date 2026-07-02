"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Keeps the admin's Supabase auth session fresh in the browser.
 *
 * The admin shell otherwise mounts no browser Supabase client, so nothing renews
 * the access token while an editor sits idle. The token then expires and the next
 * save 401s until a full page reload (which re-refreshes via `proxy.ts`). Creating
 * the browser client here starts its built-in auto-refresh (a pre-expiry timer,
 * plus a refresh whenever the tab regains focus/visibility) and writes the renewed
 * tokens back to the shared auth cookies — so a save after idle already carries a
 * valid token. Pairs with `proxy.ts`, which refreshes on server requests; the
 * proxy comment's "in sync with the browser client" assumes this client exists.
 */
export function AdminSessionKeeper() {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    // Loading the session activates auto-refresh; refresh again on focus so a
    // token that lapsed while the tab was backgrounded is renewed before any save.
    const refresh = () => {
      if (document.visibilityState === "visible") void supabase.auth.getSession();
    };
    refresh();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return null;
}
