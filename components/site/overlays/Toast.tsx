"use client";

import { useOverlay } from "@/components/site/state/OverlayProvider";

/**
 * Transient toast, ported from front.js `mqToast`. Driven by OverlayProvider's
 * `toast` state (auto-clears after 2.2s there). Keeps `id="mq-toast"` + the
 * `show` class so `front.css` animates it identically.
 */
export function Toast() {
  const { toast } = useOverlay();
  return (
    <div id="mq-toast" className={toast ? "show" : ""}>
      {toast}
    </div>
  );
}
