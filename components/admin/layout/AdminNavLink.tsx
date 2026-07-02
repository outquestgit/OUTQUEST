"use client";

import type { ReactNode } from "react";
import { nav } from "@/lib/admin/runtime";

/**
 * A sidebar nav item rendered as a real link to `/admin?p=<page>`, so it can be
 * opened in a new tab (right-click / ⌘/Ctrl-click / middle-click) — `AdminBoot`
 * reads `?p=` on load and shows that section. A plain left click soft-navigates
 * the admin SPA via the runtime `nav()` (no full reload).
 *
 * `data-nav-page` lets `admin.js`'s `nav()` set the active state: React's
 * `onClick` emits no `onclick` attribute for its original detection to read.
 */
export function AdminNavLink({
  page,
  className = "nav-item",
  id,
  children,
}: {
  page: string;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      id={id}
      href={`/admin?p=${page}`}
      data-nav-page={page}
      onClick={(e) => {
        // Let the browser handle new-tab/window intents; soft-nav a plain click.
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
          return;
        e.preventDefault();
        nav(page);
      }}
    >
      {children}
    </a>
  );
}
