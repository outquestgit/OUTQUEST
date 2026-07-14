"use client";

import { getImageProps } from "next/image";
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <h2 className="serif-h home-section-title">{reel.title}</h2>
        <button className="btn-orange" style={{ fontSize: "13px", padding: "9px 18px" }} onClick={() => showPage("quests")}>
          {reel.buttonLabel}
        </button>
      </div>
      <div className="dest-reel-grid">
        {reel.cards.map((card, i) => {
          // Resolve optimised src per card (AVIF/WebP via /_next/image Accept header).
          // Reel cards are full-bleed; use a square-ish hint that fits the CSS grid track.
          const imgSrc = card.image
            ? getImageProps({ src: card.image, width: 400, height: 300, quality: 65, alt: "" }).props.src
            : undefined;

          return (
            <div className="dest-reel-card" key={`${card.title}-${i}`} onClick={() => reelClick(card.action)}>
              <div
                className="dest-reel-img"
                style={
                  imgSrc
                    ? { backgroundImage: `url(${imgSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: card.gradient }
                }
              >
                {!imgSrc && <span>{card.emoji}</span>}
                <div className="dest-reel-ov"></div>
                <div className="dest-reel-label">
                  <div className="dest-reel-tag">{card.tag}</div>
                  <div className="dest-reel-title">{card.title}</div>
                  <div className="dest-reel-count">{card.count}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}