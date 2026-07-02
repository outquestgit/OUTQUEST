"use client";

import { useEffect } from "react";

/**
 * Boots the original admin runtime (extracted verbatim to /public/admin.js).
 * Its initialisation runs on `DOMContentLoaded`, which has already fired by the
 * time this client effect runs, so we re-dispatch the event after load.
 */
export default function AdminBoot({ version }: { version?: string }) {
  useEffect(() => {
    if (document.getElementById("admin-runtime")) return;
    const script = document.createElement("script");
    script.id = "admin-runtime";
    // `version` (the file's mtime) busts the browser cache when /admin.js changes.
    script.src = version ? `/admin.js?v=${version}` : "/admin.js";
    script.onload = () => {
      try {
        document.dispatchEvent(
          new Event("DOMContentLoaded", { bubbles: true, cancelable: true })
        );
      } catch {
        /* no-op */
      }
      // Deep-linking to a section via `?p=` (sidebar "open in new tab", post-save
      // redirects) is handled inside admin.js's own boot — done there rather than
      // here so it never flashes the Dashboard first.
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
