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

/**
 * Converts a Supabase image URL into an `image-set()` CSS value so the browser
 * can pick AVIF or WebP automatically — same optimisation pipeline as <Image />,
 * but compatible with CSS background-image layouts.
 */
function buildImageSet(src: string): string {
  const { props: avif } = getImageProps({
    src,
    width: 320,
    height: 128,
    quality: 80,
    alt: "",
  });

  // Next.js encodes the format in the `_next/image` URL via the `f` param.
  // We request AVIF first; the optimizer serves WebP if AVIF isn't supported.
  const avifUrl = avif.src.includes("?")
    ? avif.src + "&fm=avif"
    : avif.src;
  const webpUrl = avif.src.includes("?")
    ? avif.src + "&fm=webp"
    : avif.src;

  return `image-set(url("${avifUrl}") type("image/avif"), url("${webpUrl}") type("image/webp"), url("${src}") type("image/jpeg"))`;
}

export function GsqQCard({ card }: { card: GsqCard }) {
  return (
    <div className={`gsq-qcard ${card.cp}`} onClick={() => showPage(card.page)}>
      {card.image ? (
        <div
          className="gsq-qcard-media"
          role="img"
          aria-label={card.title}
          style={{
            backgroundImage: buildImageSet(card.image),
          }}
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