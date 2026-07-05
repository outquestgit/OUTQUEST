import type { QuestWithTerms } from "@/lib/quests";
import type { Deal } from "@/lib/deals";
import type { Quest as CardQuest, FrontFilters } from "@/components/site/cards/QCard";
import type { SlimQuest } from "@/components/site/cards/SlimQCard";

/**
 * Translates a DB quest (admin taxonomy) into the front site's filter vocabulary
 * and card shape. The two taxonomies were authored independently, so this map is
 * intentionally approximate (lossy) — aligned by the filter *labels* the user
 * sees, with regions/tiers collapsed where the front has fewer buckets. The front
 * filter UI is left unchanged; only the cards are made to speak its language.
 */

const firstSlug = (q: QuestWithTerms, kind: string) =>
  q.terms.find((t) => t.kind === kind)?.slug;

/** The display name of a quest's first term of a kind (e.g. its Budget or
 *  Timeline chip from the admin's "Quest Meta"), or undefined. Used as a stat
 *  fallback so selecting a chip shows on the detail page even when the optional
 *  free-text "display string" box is left blank. */
const firstName = (q: QuestWithTerms, kind: string) =>
  q.terms.find((t) => t.kind === kind)?.name;

/** A quest's canonical category slug — its first `category` term, or null. */
export function questCategorySlug(q: QuestWithTerms): string | null {
  return firstSlug(q, "category") ?? null;
}

/**
 * Canonical public path for a quest: `/{category}/{slug}` when it has a
 * category, else `/quests/{slug}` for uncategorized quests. Used everywhere a
 * quest is linked so the URL matches the dynamic `[category]/[quest]` route.
 */
export function questPath(q: QuestWithTerms): string {
  const cat = questCategorySlug(q);
  return cat ? `/${cat}/${q.slug}` : `/quests/${q.slug}`;
}

/**
 * Derive the front filter `data-*` values for a quest. Every taxonomy-backed
 * filter group is generated from the live terms (see buildQuestFilterGroups), so
 * the card carries the raw term slug for each dimension — pill value and card
 * value are the same slug, and admin term edits reflect in the filters. The
 * `direction` (Life Direction), `outcome` (Outcome Goal) and `location`
 * (Country) dims take the quest's first term of that kind.
 */
export function questToFilters(q: QuestWithTerms): FrontFilters {
  const f: FrontFilters = {};
  // Carry EVERY selected slug per dimension (space-joined), not just the first.
  // A quest can be tagged with several outcome goals / life directions / budgets
  // etc.; the grid filter matches when ANY of them is picked. Using only the
  // first slug made a card invisible to all its other selected values — so
  // clicking one of those pills returned an empty grid.
  const join = (kind: string) => {
    const slugs = q.terms.filter((t) => t.kind === kind).map((t) => t.slug);
    return slugs.length ? slugs.join(" ") : undefined;
  };
  const direction = join("life_direction");
  if (direction) f.direction = direction;
  const outcome = join("outcome_goal");
  if (outcome) f.outcome = outcome;
  const category = join("category");
  if (category) f.category = category;
  const difficulty = join("difficulty");
  if (difficulty) f.difficulty = difficulty;
  const budgetlevel = join("budget");
  if (budgetlevel) f.budgetlevel = budgetlevel;
  const duration = join("duration");
  if (duration) f.duration = duration;
  const delivery = join("delivery");
  if (delivery) f.delivery = delivery;
  const location = join("country");
  if (location) f.location = location;
  return f;
}

const FALLBACK_GRADIENT = "linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)";

/** Map a DB quest to the `QCard` shape (with front filter datasets). */
export function questToCard(q: QuestWithTerms): CardQuest {
  return {
    listing: q.slug,
    gradient: q.card_gradient || q.card_color || FALLBACK_GRADIENT,
    art: q.card_icon || "🌍",
    badge: q.level || "",
    title: q.title,
    meta: [q.duration, q.location_label].filter(Boolean).join(" · "),
    image: q.card_image_path || q.featured_image_path || null,
    href: questPath(q),
    featured: q.featured,
    filters: questToFilters(q),
  };
}

/** Map a DB quest to the compact `SlimQuest` card used in the category-page
 *  grids. Reuses `questToFilters` so the cards speak the category filter
 *  sidebar's vocabulary (the same `data-*` keys the runtime filters on). */
export function questToSlim(q: QuestWithTerms): SlimQuest {
  return {
    data: questToFilters(q) as Record<string, string>,
    listing: q.slug,
    gradient: q.card_gradient || q.card_color || FALLBACK_GRADIENT,
    art: q.card_icon || "🌍",
    badge: q.level || "",
    title: q.title,
    meta: [q.duration, q.location_label].filter(Boolean).join(" · "),
    // Uploaded card/featured image (same as the All Quests grid); falls back to
    // the gradient + emoji when none is set.
    image: q.card_image_path || q.featured_image_path || null,
    featured: q.featured,
    // Canonical server route so the card opens the fully DB-rendered detail page
    // (like the All Quests grid) instead of the SPA's `showListing`, which only
    // knows front.js's static seed quests and would otherwise show fallback data.
    href: questPath(q),
  };
}

/**
 * Card shape for the homepage "Popular Programs" section (the new reference's
 * `.prog-card`). It carries richer copy than the quest tile — a type/eyebrow
 * line, a description, and a few quick-fact tags — all derived from the DB quest.
 */
export interface Program {
  listing: string;
  gradient: string;
  art: string;
  /** Uploaded card/featured image; paints the banner over the gradient+art when set. */
  image?: string | null;
  type: string;
  title: string;
  meta: string;
  tags: string[];
  questLabel: string;
  /** Where the card navigates (a quest or a deal page). */
  href: string;
  /** Admin "Featured" flag — shows a gold "Featured" badge on the card banner. */
  featured?: boolean;
}

// Term kinds that form the eyebrow "type" line rather than the tag pills.
const TYPE_KINDS = new Set(["country", "category"]);

/** Map a DB quest into a `Program` card for the Popular Programs grid. */
export function questToProgram(q: QuestWithTerms): Program {
  const category = q.terms.find((t) => t.kind === "category")?.name;
  const typeBits = [category, q.location_label].filter(Boolean) as string[];
  const termTags = q.terms
    .filter((t) => !TYPE_KINDS.has(t.kind))
    .map((t) => t.name);
  const factTags = [q.duration, q.difficulty_label].filter(Boolean) as string[];
  const tags = (termTags.length ? termTags : factTags).slice(0, 3);
  return {
    listing: q.slug,
    gradient: q.card_gradient || q.card_color || FALLBACK_GRADIENT,
    art: q.card_icon || "🌍",
    image: q.card_image_path || q.featured_image_path || null,
    type: typeBits.join(" · ") || q.level || "Program",
    title: q.title,
    meta: q.tagline || [q.duration, q.location_label].filter(Boolean).join(" · "),
    tags,
    questLabel: q.title,
    href: questPath(q),
  };
}

/**
 * Map a DB deal into a `Program` card for the homepage "Popular Programs" grid.
 * Used for deals in the "programs" category (Programs & Experiences). Banner uses
 * the deal's image-less gradient + icon fallback; the card links to the deal page.
 */
export function dealToProgram(d: Deal): Program {
  const priceTag =
    d.price_from != null
      ? `From $${d.price_from}${d.billing_unit ? ` / ${d.billing_unit.replace(/^per_/, "")}` : ""}`
      : d.offer_label || "";
  const tags = [priceTag, d.outcome_text].filter(Boolean).slice(0, 3) as string[];
  return {
    listing: d.slug,
    gradient: d.hero_bg || d.card_color || FALLBACK_GRADIENT,
    art: d.card_icon || d.hero_icon || "🎯",
    // Same image the deal page hero uses (DealDetail: featured → card).
    image: d.featured_image_path || d.card_image_path || null,
    type: d.partner_name || "Programs & Experiences",
    title: d.title,
    meta: d.short_desc || d.outcome_text || "",
    tags,
    questLabel: d.cta_label || "View deal",
    href: `/deals/${d.slug}`,
    featured: d.featured,
  };
}

// ── Single quest detail (mirrors the SPA `showListing` data shape) ───────────

// Detail-page badge emoji per life_direction term slug; the label is the term
// name itself, so renaming/adding a Life Direction term reflects on the badge.
const DIR_EMOJI: Record<string, string> = {
  "career-reset": "🌍",
  "identity-reset": "✨",
  "purpose-reset": "⚡",
  "lifestyle-reset": "🔄",
};
const DIFF_BY_LEVEL: Record<string, string> = {
  "Starter Quest": "Beginner-friendly",
  "Epic Quest": "Moderate",
  "Boss Quest": "Challenging",
  Legendary: "Expert",
};
// One distinct emoji per Outcome Goal (no repeats).
const OUTCOME_EMOJI: Record<string, string> = {
 "learn-a-skill": "🧠",
  "gain-experience": "💼",
  "get-certified": "🏅",
  "switch-careers": "🔄",
  "earn-more": "💰",
  "become-financially-independent": "💸",
  "wellness": "🌿",
  "adventure": "🏕️",
  "work-remotely": "💻",
  "lifestyle-change": "✨",
};
const DEFAULT_ARTS = ["🌍", "✈️", "🗺️", "⚡"];
const PREP_TIERS = [
  { label: "Programs & Experiences", sub: "Structured programs, courses & placements", cls: "t1" },
  { label: "Get Set Up", sub: "Tools, services & essentials", cls: "t2" },
  { label: "Free Resources", sub: "Guides, checklists & free planning tools", cls: "t3" },
];
// Connected deals are grouped into these tiers by their category.
const DEAL_TIERS: { cat: string; label: string; sub: string; cls: string }[] = [
  { cat: "programs", label: "Programs & Experiences", sub: "Structured programs, courses & placements", cls: "t1" },
  { cat: "setup", label: "Get Set Up", sub: "Tools, services & essentials", cls: "t2" },
  { cat: "tools", label: "Tools & Essentials", sub: "Gear, guides & free resources", cls: "t3" },
];

/** A gallery photo: a real uploaded image, or a gradient + emoji fallback. */
export interface Photo {
  image: string | null;
  gradient: string;
  art: string;
}

export interface ListingData {
  slug: string;
  title: string;
  tagline: string;
  photos: Photo[];
  slides: string[];
  arts: string[];
  badges: { emoji: string; label: string }[];
  stats: { icon: string; label: string; val: string }[];
  outcomePills: string[];
  unlocks: { i: string; t: string; p: string }[];
  intro: string;
  immersive: string;
  overview: string;
  why: string;
  path: { t: string; p: string }[];
  embark: { t: string; p: string }[];
  prepTiers: {
    label: string;
    sub: string;
    cls: string;
    items: { i: string; bg: string; t: string; btn: string; dealPage: string; img?: string }[];
  }[];
  faq: { q: string; a: string }[];
  companion: { heading: string; body: string; button: string };
  similar: { slug: string; href: string; image: string | null; gradient: string; art: string; badge: string; title: string; meta: string }[];
}

const COMPANION_DEFAULT = {
  heading: "Better with a companion",
  body: "Half the people on this quest showed up solo. But if you've got someone who needs a nudge — send them this.",
  button: "Send this quest to a friend",
};

/** The "Similar OutQuests" surfaced on a quest page are the ones an admin
 *  manually picked (`content.similar`, quest slugs), rendered in that order.
 *  Slugs that don't resolve to a published quest (draft/hidden/deleted) are
 *  dropped; an empty list hides the section entirely. */
function pickSimilar(q: QuestWithTerms, others: QuestWithTerms[]) {
  const bySlug = new Map(others.map((o) => [o.slug, o]));
  return ((q.content ?? {}).similar ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((o): o is QuestWithTerms => !!o && o.slug !== q.slug)
    .map((o) => ({
      slug: o.slug,
      href: questPath(o),
      image: o.card_image_path || o.featured_image_path || null,
      gradient: o.card_gradient || o.card_color || FALLBACK_GRADIENT,
      art: o.card_icon || "🌍",
      badge: o.level || "Quest",
      title: o.title,
      meta: [o.duration, o.location_label].filter(Boolean).join(" · "),
    }));
}

/** Map a DB quest into the full single-quest detail shape (front.js parity).
 *  `deals` are the quest's connected deals — they drive the prep tiers, falling
 *  back to the manually-authored `content.prep` when there are none. */
export function questToListing(
  q: QuestWithTerms,
  others: QuestWithTerms[],
  deals: Deal[] = []
): ListingData {
  const c = q.content ?? {};
  const slides = q.slides?.length ? q.slides : [q.card_gradient || q.card_color || FALLBACK_GRADIENT];
  const arts = q.arts?.length ? q.arts : q.card_icon ? [q.card_icon, ...DEFAULT_ARTS] : DEFAULT_ARTS;

  // Gallery photos: real uploaded images (featured first, then the gallery) take
  // priority; otherwise fall back to the gradient slides + emoji art.
  const imageUrls = [q.featured_image_path, ...(c.gallery ?? [])].filter(Boolean) as string[];
  const photos: Photo[] = imageUrls.length
    ? imageUrls.map((image) => ({ image, gradient: "", art: "" }))
    : slides.map((gradient, i) => ({ image: null, gradient, art: arts[i] || arts[0] }));

  const badges = q.terms
    .filter((t) => t.kind === "life_direction")
    .map((t) => ({ emoji: DIR_EMOJI[t.slug] ?? "🧭", label: t.name }));

  const outcomePills = q.terms
    .filter((t) => t.kind === "outcome_goal")
    // Fall back to a generic goal emoji (like life-direction badges default to
    // 🧭) so admin-added/renamed outcome-goal terms — whose slugs aren't in the
    // hardcoded map — never render an emoji-less pill.
    .map((t) => `${OUTCOME_EMOJI[t.slug] ?? "🎯"} ${t.name}`.trim());

  // Prefer connected deals (grouped by category); else the manual prep cards.
  let prepTiers;
  if (deals.length) {
    prepTiers = DEAL_TIERS.map((tier) => ({
      label: tier.label,
      sub: tier.sub,
      cls: tier.cls,
      items: deals
        .filter((d) => (d.category ?? "tools") === tier.cat)
        .map((d) => ({
          i: d.hero_icon || d.card_icon || "✦",
          bg: d.hero_bg || d.card_color || FALLBACK_GRADIENT,
          img: d.featured_image_path || d.card_image_path || undefined,
          t: d.title,
          btn: d.cta_label || "View deal",
          dealPage: d.slug,
        })),
    })).filter((tier) => tier.items.length);
  } else {
    const prep = c.prep ?? [];
    const rows = [prep.slice(0, 3), prep.slice(3, 6), prep.slice(6, 9)];
    prepTiers = PREP_TIERS.map((tier, i) => ({ ...tier, items: rows[i] ?? [] })).filter(
      (tier) => tier.items.length
    );
  }

  return {
    slug: q.slug,
    title: q.title,
    tagline: q.tagline ?? "",
    photos,
    slides,
    arts,
    badges,
    stats: [
      // Each stat prefers the optional free-text "display string", then falls
      // back to the matching "Quest Meta" chip (taxonomy term) so a chip-only
      // quest still shows real values instead of the generic placeholder.
      { icon: "⏱️", label: "Timeline", val: q.duration || q.timeline_label || firstName(q, "duration") || "Varies" },
      { icon: "📊", label: "Effort", val: (q.level && DIFF_BY_LEVEL[q.level]) || q.difficulty_label || firstName(q, "difficulty") || "Moderate" },
      { icon: "💰", label: "Budget", val: q.monthly_budget || q.budget_label || firstName(q, "budget") || "Varies" },
      { icon: "📅", label: "Best time to go", val: q.best_time || "Year-round" },
    ],
    outcomePills,
    // Default a blank unlock icon to a sparkle so the card never renders an
    // empty icon slot (the editor's 🌍 is only a placeholder, not a saved value).
    unlocks: (c.unlocks ?? []).map((u) => ({ ...u, i: u.i || "✨" })),
    intro: c.intro ?? "",
    immersive: c.immersive ?? "",
    overview: c.overview ?? "",
    why: c.why ?? "",
    path: c.path ?? [],
    embark: c.embark ?? [],
    prepTiers,
    faq: c.faq ?? [],
    companion: c.companion
      ? { heading: c.companion.heading || COMPANION_DEFAULT.heading, body: c.companion.body || COMPANION_DEFAULT.body, button: c.companion.button || COMPANION_DEFAULT.button }
      : COMPANION_DEFAULT,
    similar: pickSimilar(q, others),
  };
}
