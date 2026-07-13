"use client";

import { getImageProps } from "next/image";
import { GsqQCard } from "../cards/GsqQCard";
import { Button } from "../ui/Button";
import type { HomepageConfig } from "@/lib/site/data/homepage";
import { openQuiz, showPage } from "@/lib/site/runtime";
import { dispatchQuestFilter } from "@/lib/site/questFilterBus";

/** Resolves a hero goal-pill `link` (page id, optionally `?outcome=…`). */
function pillClick(link: string) {
  const i = link.indexOf("?outcome=");
  if (i >= 0) {
    showPage(link.slice(0, i));
    dispatchQuestFilter("outcome", link.slice(i + "?outcome=".length));
  } else {
    showPage(link);
  }
}

/** Home hero: headline, CTAs, "explore by goal" pills, and the two card columns. */
export function HeroSection({ hero }: { hero: HomepageConfig["hero"] }) {
  // Preload the first image from each card column — these are the largest
  // above-the-fold images and the primary LCP candidates. Generating the
  // optimised /_next/image URL here ensures the preload points to the same
  // AVIF/WebP asset the cards actually render, not the raw origin URL.
  const preload1 = hero.cards1[0]?.image
    ? getImageProps({ src: hero.cards1[0].image, width: 400, height: 300, quality: 65, alt: "" }).props.src
    : null;
  const preload2 = hero.cards2[0]?.image
    ? getImageProps({ src: hero.cards2[0].image, width: 400, height: 300, quality: 65, alt: "" }).props.src
    : null;

  return (
    <>
      {/* Hoist preload hints to <head> — Next.js App Router deduplicates and
          hoists <link> tags rendered from any component automatically. */}
      {preload1 && (
        <link rel="preload" as="image" href={preload1} fetchPriority="high" />
      )}
      {preload2 && (
        <link rel="preload" as="image" href={preload2} fetchPriority="high" />
      )}

      <section id="hero-home" className="gsq-hero gsg-latest-hero">
        <div className="gsq-hero-inner">
          <div className="gsq-hero-left">
            <h1>
              {hero.h1Main} <em>{hero.h1Em}</em>
            </h1>
            <p className="sub">{hero.tagline}</p>
            <div className="gsq-hero-btns">
              <Button variant="primary" onClick={() => openQuiz()}>
                {hero.primaryCtaLabel}
              </Button>
              <Button variant="secondary" onClick={() => showPage("quests")}>
                {hero.secondaryCtaLabel}
              </Button>
            </div>

            <div className="gsq-goal-wrap">
              <div className="gsq-goal-label">Explore by goal</div>
              <div className="gsq-goal-pills">
                {hero.pills.map((pill, i) => (
                  <button className="gsq-goal-pill" key={`${pill.label}-${i}`} onClick={() => pillClick(pill.link)}>
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="gsq-hero-right">
            <div className="gsq-card-col">
              {[...hero.cards1, ...hero.cards1].map((c, i) => (
                <GsqQCard card={{ cp: c.cp, page: c.link, icon: c.icon, title: c.title, desc: c.desc, image: c.image }} key={i} />
              ))}
            </div>
            <div className="gsq-card-col">
              {[...hero.cards2, ...hero.cards2].map((c, i) => (
                <GsqQCard card={{ cp: c.cp, page: c.link, icon: c.icon, title: c.title, desc: c.desc, image: c.image }} key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
