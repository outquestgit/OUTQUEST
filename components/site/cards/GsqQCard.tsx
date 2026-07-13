"use client";

import { getImageProps } from "next/image";
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
  // quality 65 matches ReelSection — saves ~15-20% transfer per card image
  // with no perceptible visual difference at the 400×300 card size.
  const imgSrc = card.image
    ? getImageProps({ src: card.image, width: 400, height: 300, quality: 65, alt: "" }).props.src
    : undefined;

  return (
    <div className={`gsq-qcard ${card.cp}`} onClick={() => showPage(card.page)}>
      {imgSrc ? (
        <div
          className="gsq-qcard-media"
          role="img"
          aria-label={card.title}
          style={{ backgroundImage: `url(${imgSrc})` }}
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
