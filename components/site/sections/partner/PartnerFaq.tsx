"use client";

import { useState } from "react";
import type { PartnerConfig } from "@/lib/site/data/partner";

/** Partner FAQ — accordion items. Page-wide single-open (ported from front.js
 *  togglePartnerFaq). */
export function PartnerFaq({ faq }: { faq: PartnerConfig["faq"] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="partner-faq">
      <div className="partner-faq-inner">
        <div className="pf-faq-header">
          <span className="pf-faq-emoji">{faq.emoji}</span>
          <div className="label" style={{ textAlign: "center" }}>
            {faq.label}
          </div>
          <h2>{faq.heading}</h2>
        </div>

        {faq.items.map((f, i) => (
          <div className={openIdx === i ? "faq-item open" : "faq-item"} key={i}>
            <div
              className="faq-q"
              onClick={() => setOpenIdx((cur) => (cur === i ? null : i))}
            >
              <span>{f.q}</span>
              <span className="faq-arrow">+</span>
            </div>
            <div className="faq-a">
              <div className="faq-a-inner">
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
