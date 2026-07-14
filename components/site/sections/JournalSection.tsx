"use client";

import { SectionHeader } from "../ui/SectionHeader";
import { JournalCard } from "../cards/JournalCard";
import { showPage } from "@/lib/site/runtime";
import type { HomepageConfig } from "@/lib/site/data/homepage";
import type { JournalCard as JournalCardData } from "@/lib/site/data/home";

/** Home "Journal" strip — header + a grid of dynamic published-post cards. */
export function JournalSection({
  journal,
  posts,
}: {
  journal: HomepageConfig["journal"];
  posts: JournalCardData[];
}) {
  return (
    <section className="sec" style={{ background: "var(--bg)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0, flexWrap: "wrap", gap: "12px" }}>
        <h2 className="serif-h home-section-title">{journal.title}</h2>
        <button className="btn-orange" style={{ fontSize: "13px", padding: "9px 18px" }} onClick={() => showPage("journal")}>
          {journal.buttonLabel}
        </button>
      </div>
      <div className="jgrid" style={{ marginTop: "32px" }}>
        {posts.map((card) => (
          <JournalCard card={card} key={card.post} />
        ))}
      </div>
    </section>
  );
}
