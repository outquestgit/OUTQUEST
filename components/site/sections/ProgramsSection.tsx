"use client";

import { ProgCard } from "../cards/ProgCard";
import { Button } from "../ui/Button";
import type { HomepageConfig } from "@/lib/site/data/homepage";
import type { Program } from "@/lib/site/questMapping";
import { showPage } from "@/lib/site/runtime";

/** "Popular programs" — copy header + a grid of dynamic published-quest cards. */
export function ProgramsSection({
  popularPrograms,
  programs,
}: {
  popularPrograms: HomepageConfig["popularPrograms"];
  programs: Program[];
}) {
  return (
    <section className="programs-section">
      <div className="programs-head">
        <div>
          <div className="label" style={{ marginBottom: "14px" }}>
            {popularPrograms.label}
          </div>
          <h2>{popularPrograms.title}</h2>
          <p className="programs-sub">{popularPrograms.subtitle}</p>
        </div>
        <Button style={{ fontSize: "13px", padding: "9px 18px" }} onClick={() => showPage("quests")}>
          {popularPrograms.buttonLabel}
        </Button>
      </div>
      <div className="programs-grid">
        {programs.map((p) => (
          <ProgCard program={p} key={p.listing} />
        ))}
      </div>
    </section>
  );
}
