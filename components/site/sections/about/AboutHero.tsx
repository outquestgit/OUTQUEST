"use client";

import { Button } from "../../ui/Button";
import { multiline } from "../../ui/multiline";
import { showPage } from "@/lib/site/runtime";
import type { AboutConfig } from "@/lib/site/data/about";

/** About hero: floating polaroids + mosaic headline + CTA. */
export function AboutHero({ hero }: { hero: AboutConfig["hero"] }) {
  return (
    <section className="about-hero">
      <div className="amo-polaroid-wrap" aria-hidden="true">
        {hero.polaroids.map((p) => (
          <div className={`amo-pol ${p.cls}`} style={{ background: p.bg, color: p.color }} key={p.cls}>
            <span className="amo-role">{p.role}</span>
            <h4>
              {p.title[0]}
              <br />
              {p.title[1]}
            </h4>
          </div>
        ))}
      </div>

      <div className="about-hero-inner">
        <h1 className="about-mosaic-h1">{multiline(hero.h1)}</h1>
        <p className="about-hero-sub">{hero.sub}</p>
        <Button style={{ fontSize: "15px", padding: "14px 32px", marginTop: "8px" }} onClick={() => showPage("quests")}>
          {hero.ctaLabel}
        </Button>
      </div>
    </section>
  );
}
