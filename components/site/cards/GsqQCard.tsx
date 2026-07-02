"use client";

import { showPage } from "@/lib/site/runtime";

/** Small icon card used in the home hero's two auto-scrolling columns. */
export interface GsqCard {
  cp: string;
  page: string;
  icon: string;
  title: string;
  desc: string;
  /** Optional image URL — when set, a banner image replaces the emoji icon. */
  image?: string;
}

export function GsqQCard({ card }: { card: GsqCard }) {
  return (
    <div className={`gsq-qcard ${card.cp}`} onClick={() => showPage(card.page)}>
      {card.image ? (
        <div
          className="gsq-qcard-media"
          role="img"
          aria-label={card.title}
          style={{ backgroundImage: `url(${card.image})` }}
        />
      ) : (
        <span className="gsq-qcard-icon">{card.icon}</span>
      )}
      <div className="gsq-qcard-body">
        <div className="gsq-qcard-title">{card.title}</div>
        <div className="gsq-qcard-desc">{card.desc}</div>
      </div>
    </div>
  );
}
