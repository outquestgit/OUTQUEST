"use client";

import { Button } from "../../ui/Button";
import { showPage } from "@/lib/site/runtime";
import type { AboutConfig } from "@/lib/site/data/about";

/** About soft CTA — heading/subtitle + action button. */
export function AboutCta({ cta }: { cta: AboutConfig["cta"] }) {
  return (
    <section className="about-cta-section">
      <div className="about-cta-left">
        <h2 className="serif-h" style={{ color: "#fff", marginBottom: "14px" }}>
          {cta.heading}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "380px", lineHeight: 1.7 }}>
          {cta.subtitle}
        </p>
      </div>
      <div className="about-cta-right">
        <Button style={{ fontSize: "16px", padding: "18px 40px", borderRadius: "14px" }} onClick={() => showPage("quests")}>
          {cta.ctaLabel}
        </Button>
        <div style={{ marginTop: "16px", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>{cta.footnote}</div>
      </div>
    </section>
  );
}
