"use client";
import { useEffect } from "react";

/**
 * Initialises Microsoft Clarity after mount, using a dynamic import so the
 * @microsoft/clarity package is NOT bundled into the main JS chunk. Previously
 * it was a static top-level import, which included ~25 KiB in the bundle and
 * executed synchronously on page load. Now it's excluded entirely until after
 * hydration, when it's fetched as a separate async chunk.
 */
export function ClarityProvider() {
  useEffect(() => {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const isAdmin = window.location.pathname.startsWith("/admin");
    if (isLocal || isAdmin) return;

    import("@microsoft/clarity").then((mod) => {
      mod.default.init("xjt81c9trl");
    });
  }, []);
  return null;
}
