import { ProgCard } from "../cards/ProgCard";
import type { HomepageConfig } from "@/lib/site/data/homepage";
import type { Program } from "@/lib/site/questMapping";

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
        <a className="btn-orange" href="/quests" style={{ fontSize: "13px", padding: "9px 18px" }}>
          {popularPrograms.buttonLabel}
        </a>
      </div>
      <div className="programs-grid">
        {programs.map((p) => (
          <ProgCard program={p} key={p.listing} />
        ))}
      </div>
    </section>
  );
}
