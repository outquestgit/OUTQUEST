"use client";

import { useState } from "react";

/**
 * Accordion FAQ row (`.faq-item`). React-owned (ported from front.js
 * `togglePartnerFaq`). Controlled when given `open`/`onToggle` (lets the parent
 * enforce page-wide single-open, as the runtime did); falls back to local state
 * otherwise.
 */
export function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open?: boolean;
  onToggle?: () => void;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = onToggle ? !!open : localOpen;
  const toggle = onToggle ?? (() => setLocalOpen((o) => !o));
  return (
    <div className={isOpen ? "faq-item open" : "faq-item"}>
      <div className="faq-q" onClick={toggle}>
        <span>{q}</span>
        <span className="faq-arrow">+</span>
      </div>
      <div className="faq-a">
        <div className="faq-a-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}
