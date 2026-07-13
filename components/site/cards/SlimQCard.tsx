"use client";

import { getImageProps } from "next/image";
import { useRouter } from "next/navigation";
import { showListing } from "@/lib/site/runtime";
import { AppLink } from "@/components/site/ui/AppLink";

/**
 * Compact quest card used in the category-page grids. `data` holds the card's
 * `data-*` filter attributes verbatim — some pages emit a short set the runtime
 * normalises (`best`/`commitment`/`budget`/`format`), others emit the full
 * resolved set (`difficulty`/`direction`/`level`/…) — so it's kept generic.
 */
export interface SlimQuest {
  data: Record<string, string>;
  listing: string;
  gradient: string;
  art: string;
  badge: string;
  title: string;
  meta: string;
  /** Uploaded card/featured image URL — overrides the gradient + emoji art when set. */
  image?: string | null;
  /** Admin "Featured" flag — shows a gold "Featured" badge (in place of the level). */
  featured?: boolean;
  /** Canonical quest URL (`/{category}/{slug}`). When set, the card navigates to
   *  the server-rendered detail page (full DB data) — like the All Quests grid —
   *  instead of the SPA's in-memory `showListing`, which only knows front.js's
   *  static seed quests and would render fallback data for DB quests. */
  href?: string;
}

export function SlimQCard({ quest }: { quest: SlimQuest }) {
  const router = useRouter();
  const dataAttrs = Object.fromEntries(
    Object.entries(quest.data).map(([k, v]) => [`data-${k}`, v])
  );
  const href = quest.href;

  // Resolve optimised src via /_next/image (serves AVIF/WebP via Accept header).
  // SlimQCard is full-bleed with aspect-ratio 2/3 — same dimensions as QCard.
  const imgSrc = quest.image
    ? getImageProps({ src: quest.image, width: 400, height: 600, quality: 80, alt: "" }).props.src
    : undefined;

  const bg = imgSrc
    ? { backgroundImage: `url(${imgSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: quest.gradient };

  return (
    <div
      className="slim-qcard"
      {...dataAttrs}
      // Static sample pages have no real route → keep the SPA `showListing`.
      onClick={href ? undefined : () => showListing(quest.listing)}
      style={bg}
    >
      {/* Full-card link: a plain click soft-navigates to the DB-rendered detail
          page, while right/⌘/middle-click open it in a new tab. */}
      {href && (
        <AppLink
          className="slim-qcard-link"
          href={href}
          onActivate={() => router.push(href)}
          aria-label={quest.title}
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        />
      )}
      <div className="slim-qcard-art">{quest.image ? "" : quest.art}</div>
      <div className="slim-qcard-ov"></div>
      {quest.featured ? (
        <div className="slim-qcard-badge slim-qcard-badge-featured">★ Featured</div>
      ) : quest.badge ? (
        <div className="slim-qcard-badge">{quest.badge}</div>
      ) : null}
      <div className="slim-qcard-info">
        <h3>{quest.title}</h3>
        <div className="slim-qcard-meta">{quest.meta}</div>
      </div>
    </div>
  );
}