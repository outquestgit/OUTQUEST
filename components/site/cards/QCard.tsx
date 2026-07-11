"use client";

import { getImageProps } from "next/image";
import { useRouter } from "next/navigation";
import { useMyQuests } from "@/components/site/state/MyQuestsProvider";
import { useOverlay } from "@/components/site/state/OverlayProvider";
import { AppLink } from "@/components/site/ui/AppLink";

/**
 * Front-end filter attributes a quest card carries (read by front.js's
 * `applyFilters`). Each is a single value matching a filter pill's `data-value`.
 * Optional — only the dimensions a quest maps to are emitted.
 */
export interface FrontFilters {
  direction?: string;
  level?: string;
  commitment?: string;
  outcome?: string;
  /** Category (activity/type) term slug — drives the "Explore by goals" reel filter. */
  category?: string;
  difficulty?: string;
  delivery?: string;
  budgetlevel?: string;
  duration?: string;
  location?: string;
}

/**
 * Full-size quest card. Two faithful variants from the source share this markup:
 * - the home "Popular Quests" grid (`save` button),
 * - the All Quests grid (`filters` data-attrs read by `toggleFilter`).
 */
export interface Quest {
  listing: string;
  gradient: string;
  art: string;
  badge: string;
  title: string;
  meta: string;
  /** Uploaded card/featured image URL — overrides the gradient+emoji when set. */
  image?: string | null;
  /** Canonical quest URL (`/{category}/{slug}`); falls back to `/quests/{slug}`. */
  href?: string;
  /** Admin "Featured" flag — shows a gold "Featured" badge (in place of the level). */
  featured?: boolean;
  /** Front filter datasets; when present the card also gets `data-id`. */
  filters?: FrontFilters;
}

export function QCard({ quest, save = false }: { quest: Quest; save?: boolean }) {
  const router = useRouter();
  const { isSaved, toggle } = useMyQuests();
  const { showToast } = useOverlay();
  const saved = isSaved(quest.listing);
  const f = quest.filters;
  const href = quest.href ?? `/quests/${quest.listing}`;

  // Resolve optimised src via /_next/image (serves AVIF/WebP via Accept header).
  // QCard is full-bleed with aspect-ratio 2/3 — use fill behaviour dimensions.
  const imgSrc = quest.image
    ? getImageProps({ src: quest.image, width: 400, height: 600, quality: 80, alt: "" }).props.src
    : undefined;

  const bg = imgSrc
    ? { backgroundImage: `url(${imgSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: quest.gradient };

  return (
    <div
      className="qcard"
      data-id={f ? quest.listing : undefined}
      data-direction={f?.direction}
      data-level={f?.level}
      data-commitment={f?.commitment}
      data-outcome={f?.outcome}
      data-category={f?.category}
      data-difficulty={f?.difficulty}
      data-delivery={f?.delivery}
      data-budgetlevel={f?.budgetlevel}
      data-duration={f?.duration}
      data-location={f?.location}
      style={bg}
    >
      {/* Full-card link: a plain click soft-navigates, while right/⌘/middle-click
          open the quest in a new tab. Sits under the save button (z-index:5). */}
      <AppLink
        className="qcard-link"
        href={href}
        onActivate={() => router.push(href)}
        aria-label={quest.title}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />
      {save && (
        <button
          className={saved ? "qcard-save-btn saved" : "qcard-save-btn"}
          data-id={quest.listing}
          onClick={(e) => {
            e.stopPropagation();
            if (toggle(quest.listing)) showToast("🔖 Saved to My Quests");
          }}
        >
          {saved ? "✅" : "🔖"}
        </button>
      )}
      <div className="qcard-art">{quest.image ? "" : quest.art}</div>
      <div className="qcard-ov"></div>
      {quest.featured ? (
        <div className="qcard-badge qcard-badge-featured">★ Featured</div>
      ) : quest.badge ? (
        <div className="qcard-badge">{quest.badge}</div>
      ) : null}
      <div className="qcard-info">
        <h3>{quest.title}</h3>
        <div className="qcard-meta">{quest.meta}</div>
      </div>
    </div>
  );
}