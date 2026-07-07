"use client";

import { QCard, type Quest } from "../cards/QCard";
import { Button } from "../ui/Button";
import { showPage } from "@/lib/site/runtime";

/**
 * "Featured Quests" — a home-page showcase of the quests an admin has marked
 * `featured` in the Quest editor ("Feature on Homepage"). Reuses the reference
 * `.popular-section` quest-card styling; each card carries the Save button like
 * the original Popular Quests grid. Renders nothing when no quest is featured.
 */
export function FeaturedQuestsSection({ quests }: { quests: Quest[] }) {
  if (!quests.length) return null;
  return (
    <section className="popular-section featured-quests">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          // The heading is hidden globally (`.popular-section .serif-h`), so a
          // `space-between` row would leave the lone button on the left. Pin the
          // button to the right regardless of whether the heading renders.
          justifyContent: "flex-end",
          marginBottom: 0,
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 className="serif-h home-section-title">Featured Quests</h2>
        <Button style={{ fontSize: "13px", padding: "9px 18px" }} onClick={() => showPage("quests")}>
          All quests
        </Button>
      </div>
      <div className="pq-grid" style={{ marginTop: "32px" }}>
        {quests.map((q) => (
          <QCard quest={q} save key={q.listing} />
        ))}
      </div>
    </section>
  );
}
