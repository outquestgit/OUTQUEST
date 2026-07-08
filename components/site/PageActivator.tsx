"use client";

import { useEffect } from "react";

/**
 * The SPA page id encoded in the *live* URL — `?p=` deep-link wins, else the
 * first path segment ("/" → home). Mirrors front.js's `_pageIdFromUrl()`.
 *
 * Deliberately reads `window.location` rather than `usePathname()`: front.js
 * routes in-place with `history.pushState(history.state, '', path)`, which clones
 * Next's route tree onto the new entry. Next therefore still believes it is on
 * the old route, and `usePathname()` would report that stale value.
 */
function pageIdFromUrl(): string | null {
  try {
    const p = new URLSearchParams(window.location.search).get("p");
    if (p) return p;
    const seg = (window.location.pathname || "/").replace(/^\/+|\/+$/g, "").split("/")[0];
    return seg || "home";
  } catch {
    return null;
  }
}

/**
 * Re-asserts the active SPA section whenever this route (re)renders — most
 * importantly on an App Router Back/Forward that re-mounts `SiteApp`.
 *
 * The URL wins over `initialPage`. Restoring a history entry that front.js pushed
 * (e.g. `/journal`) hands Next the cloned tree of whichever route the visitor was
 * on when it was pushed (`/`), so `SiteApp` re-mounts with `initialPage` undefined.
 * Trusting that would reset the visitor to home even though the URL says
 * `/journal` — exactly what happened on Back out of a journal post. `initialPage`
 * survives only as the fallback when `window` is unreadable.
 *
 * It calls the runtime's `_activatePage` (a pure section swap, NO history push),
 * so it never adds duplicate Back-button entries. If the runtime hasn't loaded
 * yet (first paint), the pre-paint inline script + `FrontBoot` already activate
 * the initial section, so the no-op here is harmless.
 */
export function PageActivator({ initialPage }: { initialPage?: string }) {
  useEffect(() => {
    const id = pageIdFromUrl() || initialPage || "home";
    const w = window as unknown as { _activatePage?: (id: string) => void };
    if (typeof w._activatePage === "function") w._activatePage(id);
  }, [initialPage]);
  return null;
}
