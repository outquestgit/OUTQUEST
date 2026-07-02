/**
 * Shared formatting helpers for the admin list tables, lifted verbatim from the
 * logic that `app/admin/page.tsx` used to build row HTML strings. The list page
 * components now render rows as JSX using these, so the pill classes / labels /
 * dates stay identical to before.
 */
import type { QuestWithTerms, TaxonomyKind } from "@/lib/quests";

/** Visibility values that count as publicly visible (→ "Published" pill). */
export const PUBLIC_VIS = new Set(["published", "featured", "coming_soon"]);

export const QUEST_ICON_FALLBACK = "🌍";
export const DEAL_ICON_FALLBACK = "🎯";

export const DEAL_CAT_LABEL: Record<string, string> = {
  programs: "Programs",
  setup: "Get Set Up",
  tools: "Tools & Essentials",
};

export const DEAL_ACTION_LABEL: Record<string, string> = {
  direct: "Direct Link",
  booking: "Book",
  affiliate: "Affiliate",
  leadform: "Lead Gen",
};

export const LEAD_PILL: Record<string, { cls: string; label: string }> = {
  new: { cls: "pill-new", label: "New" },
  contacted: { cls: "pill-contacted", label: "Contacted" },
  qualified: { cls: "pill-contacted", label: "Qualified" },
  closed: { cls: "pill-closed", label: "Closed" },
};

/** Country slug → region label (Connected-Quests filter in the deal editor). */
export const COUNTRY_REGION: Record<string, string> = {
  indonesia: "Asia",
  japan: "Asia",
  nepal: "Asia",
  thailand: "Asia",
  morocco: "Middle East & Africa",
  portugal: "Europe",
};

/** Comma-joined names of a quest's terms of one kind, or "—" when none. */
export function termsOf(q: QuestWithTerms, kind: TaxonomyKind): string {
  const names = q.terms.filter((t) => t.kind === kind).map((t) => t.name);
  return names.length ? names.join(", ") : "—";
}

/** Compact lead timestamp (e.g. "Apr 21, 07:55"), matching the reference. */
export function leadDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
