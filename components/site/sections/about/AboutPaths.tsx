"use client";

import { showPage } from "@/lib/site/runtime";
import type { AboutConfig } from "@/lib/site/data/about";

/** About "Pick your path" — clickable path cards routing to their pages. */
export function AboutPaths({ paths }: { paths: AboutConfig["paths"] }) {
  return (
    <section className="about-paths-section">
      <div className="about-paths-header">
        <h2 className="serif-h" style={{ color: "var(--text)", marginBottom: "8px" }}>
          {paths.heading}
        </h2>
        <p style={{ color: "var(--text2)", fontSize: "15px" }}>{paths.subtitle}</p>
      </div>
      <div className="about-paths-grid">
        {paths.cards.map((c) => (
          <div className="about-path-card" key={c.page} onClick={() => showPage(c.page)}>
            <div>
              <div className="about-path-emoji">{c.emoji}</div>
              <div className="about-path-tag">{c.tag}</div>
              <h3 className="about-path-title">{c.title}</h3>
              <p className="about-path-desc">{c.desc}</p>
            </div>
            <div className="about-path-cta">Explore quests</div>
          </div>
        ))}
      </div>
    </section>
  );
}
