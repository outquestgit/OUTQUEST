"use client";

import Script from "next/script";

/**
 * Loads the original front-site runtime (`/front.js`) via next/script. It
 * defines the global handlers our components call through `lib/site/runtime.ts`.
 * `onReady` re-dispatches `DOMContentLoaded` (already fired by load time) so
 * front.js's DOMContentLoaded setup runs, and re-runs on client re-mounts.
 *
 * `initialPage` opens a specific SPA section on arrival — set by the `/[page]`
 * catch-all route so a clean URL like `/faq` shows that section (it also still
 * honours the `/?p=<pageId>` deep-link query).
 */
export default function FrontBoot({ initialPage, version }: { initialPage?: string; version?: string }) {
  // `version` (the file's mtime, from the server) busts the browser cache when
  // /front.js changes, so a stale cached runtime can't break the SPA.
  return (
    <Script
      id="front-runtime"
      src={version ? `/front.js?v=${version}` : "/front.js"}
      strategy="afterInteractive"
      onReady={() => {
        try {
          document.dispatchEvent(
            new Event("DOMContentLoaded", { bubbles: true, cancelable: true })
          );
          // Open the target SPA view on arrival: the `/[page]` route's
          // `initialPage`, or the `/?p=<pageId>` deep-link query.
          const p = initialPage || new URLSearchParams(window.location.search).get("p");
          const w = window as unknown as { showPage?: (id: string) => void };
          if (p && typeof w.showPage === "function") w.showPage(p);
        } catch {
          /* no-op */
        }
      }}
    />
  );
}
