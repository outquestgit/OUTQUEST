"use client";

import { useEffect, useState } from "react";

/** One-shot flash messages keyed by the `?flash=` param the auth callback sets. */
const MESSAGES: Record<string, string> = {
  "email-changed": "✓ Signed in successfully — your login email was updated. Welcome back!",
};

/**
 * Shows a one-time success banner after a redirect that carries a `?flash=` param
 * (e.g. the admin lands back on Settings after confirming an email change). The
 * param is stripped from the URL immediately so a refresh doesn't re-show it.
 */
export function AdminFlash() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flash = params.get("flash");
    if (!flash || !MESSAGES[flash]) return;

    // Mount-only: the flash comes from the redirect URL, which is client-only —
    // reading it in a useState initializer would cause an SSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMsg(MESSAGES[flash]);
    // Strip `flash` (keep any other params like `p=settings`) so it's shown once.
    params.delete("flash");
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash
    );
    const t = window.setTimeout(() => setMsg(null), 6000);
    return () => window.clearTimeout(t);
  }, []);

  if (!msg) return null;
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#1a6b39",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
        boxShadow: "0 8px 28px rgba(0,0,0,.22)",
      }}
    >
      {msg}
      <button
        type="button"
        onClick={() => setMsg(null)}
        aria-label="Dismiss"
        style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}
