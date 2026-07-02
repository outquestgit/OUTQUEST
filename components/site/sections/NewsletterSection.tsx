"use client";

import { useState } from "react";
import type { FooterNewsletter } from "@/lib/site/chromeConfig";
import { getRecaptchaToken } from "@/lib/recaptchaClient";

/**
 * Admin-managed newsletter sign-up strip (the `.nl-section` block) — React-owned
 * (ported from front.js `handleNewsletter`). Validates the email, fetches a
 * reCAPTCHA token, POSTs to /api/newsletter, and swaps the row for a success
 * message on 200. Renders nothing when turned off.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSection({ newsletter }: { newsletter: FooterNewsletter }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  // When set, the input shows this as a transient error placeholder + orange
  // border for 2.2s (mirrors front.js's `flash`).
  const [flash, setFlash] = useState<string | null>(null);

  if (!newsletter.show) return null;

  const doFlash = (msg: string) => {
    setEmail("");
    setFlash(msg);
    setTimeout(() => setFlash(null), 2200);
  };

  const submit = async () => {
    const val = email.trim();
    if (!EMAIL_RE.test(val)) {
      doFlash("Enter a valid email first ↑");
      return;
    }
    setSubmitting(true);
    try {
      const token = await getRecaptchaToken("newsletter");
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: val, recaptchaToken: token }),
      });
      if (res.ok) {
        setSuccess(true);
        return;
      }
      setSubmitting(false);
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      doFlash(d?.error || "Could not subscribe — try again.");
    } catch {
      setSubmitting(false);
      doFlash("Network error — try again.");
    }
  };

  return (
    <div className="nl-section">
      <span className="nl-eyebrow">{newsletter.eyebrow}</span>
      <h2 style={{ whiteSpace: "pre-line" }}>{newsletter.heading}</h2>
      <p className="nl-sub">{newsletter.subtext}</p>
      <div className="email-row">
        {success ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#1A1A0A",
              fontSize: "15px",
              fontWeight: 600,
              padding: "8px 0",
            }}
          >
            <span style={{ fontSize: "24px" }}>🎉</span> You&apos;ve been Quested in!
          </div>
        ) : (
          <>
            <input
              placeholder={flash || newsletter.emailPlaceholder}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={flash ? { borderColor: "var(--orange)" } : undefined}
            />
            <button className="email-btn" onClick={submit} disabled={submitting}>
              {submitting ? "…" : newsletter.buttonLabel}
            </button>
          </>
        )}
      </div>
      <p style={{ fontSize: "12px", color: "#9A9060", marginTop: "14px", marginBottom: 0 }}>
        {newsletter.disclaimer}
      </p>
    </div>
  );
}
