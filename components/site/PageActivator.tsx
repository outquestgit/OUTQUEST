"use client";

import { useEffect } from "react";

/**
 * Re-asserts the active SPA section whenever this route (re)renders — most
 * importantly on an App Router Back/Forward that re-mounts `SiteApp` with a new
 * `initialPage`. Without it, such a re-render would reset the visible section to
 * the server-rendered default (home) and strand the visitor.
 *
 * It calls the runtime's `_activatePage` (a pure section swap, NO history push),
 * so it never adds duplicate Back-button entries. If the runtime hasn't loaded
 * yet (first paint), the pre-paint inline script + `FrontBoot` already activate
 * the initial section, so the no-op here is harmless.
 */
export function PageActivator({ initialPage }: { initialPage?: string }) {
  useEffect(() => {
    const id = initialPage || "home";
    const w = window as unknown as { _activatePage?: (id: string) => void };
    if (typeof w._activatePage === "function") w._activatePage(id);
  }, [initialPage]);
  return null;
}
