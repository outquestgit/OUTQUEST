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
      <SectionHeader
        title={journal.title}
        actionLabel={journal.buttonLabel}
        marginBottom={0}
        onAction={() => showPage("journal")}
      />
      <div className="jgrid" style={{ marginTop: "32px" }}>
        {posts.map((card) => (
          <JournalCard card={card} key={card.post} />
        ))}
      </div>
    </section>
  );
}
