"use client";

import { SectionHeader } from "../ui/SectionHeader";
import type { HomepageConfig } from "@/lib/site/data/homepage";
import type { ReelCard } from "@/lib/site/data/homepage";
import { showPage } from "@/lib/site/runtime";
import { dispatchQuestFilter } from "@/lib/site/questFilterBus";

/** Resolves a reel card's click into navigation + an optional preset filter. */
function reelClick(action: ReelCard["action"]) {
  if (action.type === "destination") {
    showPage("quests");
    dispatchQuestFilter("location", action.value); // Country
  } else if (action.type === "category") {
    showPage("quests");
    dispatchQuestFilter("category", action.value); // Category
  } else if (action.type === "outcome") {
    showPage("quests");
    dispatchQuestFilter("outcome", action.value); // Outcome Goal (legacy)
  } else showPage(action.value);
}

/**
 * A horizontal "reel" of image cards under a section header — shared by the
 * home page's "Explore by destination" and "Explore by goals" sections (and any
 * future reel). Only the data and the background differ.
 */
export function ReelSection({ reel, bg }: { reel: HomepageConfig["destination"]; bg: string }) {
  return (
    <section className="sec" style={{ background: bg }}>
      <SectionHeader title={reel.title} actionLabel={reel.buttonLabel} onAction={() => showPage("quests")} />
      <div className="dest-reel-grid">
        {reel.cards.map((card, i) => (
          <div className="dest-reel-card" key={`${card.title}-${i}`} onClick={() => reelClick(card.action)}>
            <div
              className="dest-reel-img"
              style={
                card.image
                  ? { backgroundImage: `url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: card.gradient }
              }
            >
              {!card.image && <span>{card.emoji}</span>}
              <div className="dest-reel-ov"></div>
              <div className="dest-reel-label">
                <div className="dest-reel-tag">{card.tag}</div>
                <div className="dest-reel-title">{card.title}</div>
                <div className="dest-reel-count">{card.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
