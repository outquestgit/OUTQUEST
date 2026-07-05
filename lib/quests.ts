import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "./supabase/public";
import { createSupabaseServerClient } from "./supabase/server";
import type { Visibility } from "./types";

/** Cache tag — admin mutations call `revalidateTag(QUESTS_TAG, { expire: 0 })` for immediate refresh. */
export const QUESTS_TAG = "quests";

export type TaxonomyKind =
  | "category"
  | "country"
  | "budget"
  | "duration"
  | "difficulty"
  | "delivery"
  | "life_direction"
  | "outcome_goal"
  | "journal_category";

export interface TaxonomyTerm {
  id: string;
  kind: TaxonomyKind;
  slug: string;
  name: string;
  active: boolean;
  sort_order: number;
  generates_page_prefix: string | null;
}

export interface Quest {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  level: string | null;
  timeline_label: string | null;
  difficulty_label: string | null;
  budget_label: string | null;
  monthly_budget: string | null;
  best_time: string | null;
  location_label: string | null;
  duration: string | null;
  card_icon: string | null;
  card_color: string | null;
  card_gradient: string | null;
  card_image_path: string | null;
  featured_image_path: string | null;
  slides: string[];
  arts: string[];
  content: QuestContent;
  seo_title: string | null;
  meta_description: string | null;
  h1: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  visibility: Visibility;
  featured: boolean;
  hide_frontend: boolean;
  display_order: number;
  updated_at: string;
}

/** The JSONB content blocks of the quest detail page. */
export interface QuestContent {
  /** Short intro paragraph shown under the hero (editor "Short Intro"). */
  intro?: string;
  /** "Day in the life" opening paragraph. */
  immersive?: string;
  /** Rich-text "What this quest looks like" overview (HTML). */
  overview?: string;
  /** Rich-text "Why Do This" value proposition (HTML). */
  why?: string;
  /** Optional intro line above the Unlocks cards. */
  unlocksIntro?: string;
  unlocks?: { i: string; t: string; p: string }[];
  path?: { t: string; p: string }[];
  embark?: { t: string; p: string }[];
  /** Gear/deal "Prep Cards" strip. */
  prep?: { i: string; t: string; btn: string; bg: string; dealPage: string }[];
  faq?: { q: string; a: string }[];
  /** "Better with a companion" share CTA. */
  companion?: { heading: string; body: string; button: string; show: boolean };
  /** Uploaded gallery image URLs. */
  gallery?: string[];
  /** Manually-picked "Similar OutQuests" (quest slugs), shown at the bottom of
   *  the quest page. Empty/absent → the section is hidden. */
  similar?: string[];
  included?: string[];
  requirements?: string[];
}

/** A quest plus the taxonomy terms it's tagged with (for list columns / editor). */
export interface QuestWithTerms extends Quest {
  terms: Pick<TaxonomyTerm, "id" | "kind" | "slug" | "name">[];
}

type RawTermJoin = { taxonomy_terms: Pick<TaxonomyTerm, "id" | "kind" | "slug" | "name"> | null };
type RawQuest = Omit<QuestWithTerms, "terms"> & { quest_terms: RawTermJoin[] };

function normalize(row: RawQuest): QuestWithTerms {
  const { quest_terms, ...quest } = row;
  return {
    ...quest,
    terms: (quest_terms ?? []).map((j) => j.taxonomy_terms).filter(Boolean) as QuestWithTerms["terms"],
  };
}

const QUEST_SELECT = `*, quest_terms ( taxonomy_terms ( id, kind, slug, name ) )`;

// ── Admin reads (uncached, RLS-as-admin → includes drafts/hidden) ───────────

export async function adminListQuests(): Promise<QuestWithTerms[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("quests")
    .select(QUEST_SELECT)
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });
  return ((data ?? []) as RawQuest[]).map(normalize);
}

export async function adminGetQuest(id: string): Promise<QuestWithTerms | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("quests").select(QUEST_SELECT).eq("id", id).maybeSingle();
  return data ? normalize(data as RawQuest) : null;
}

/** All taxonomy terms (incl. inactive) grouped by kind — drives the editor pickers. */
export async function adminListTaxonomy(): Promise<Record<TaxonomyKind, TaxonomyTerm[]>> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("taxonomy_terms")
    .select("*")
    .order("kind", { ascending: true })
    .order("sort_order", { ascending: true });
  const grouped = {} as Record<TaxonomyKind, TaxonomyTerm[]>;
  for (const t of (data ?? []) as TaxonomyTerm[]) {
    (grouped[t.kind] ??= []).push(t);
  }
  return grouped;
}

// ── Public reads (cached, anon RLS → only publicly-visible quests) ──────────

export const getPublishedQuests = unstable_cache(
  async (): Promise<QuestWithTerms[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("quests")
      .select(QUEST_SELECT)
      .order("display_order", { ascending: true });
    return ((data ?? []) as RawQuest[]).map(normalize);
  },
  ["published-quests"],
  { revalidate: 3600, tags: [QUESTS_TAG] }
);

export const getQuestBySlug = unstable_cache(
  async (slug: string): Promise<QuestWithTerms | null> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb.from("quests").select(QUEST_SELECT).eq("slug", slug).maybeSingle();
    return data ? normalize(data as RawQuest) : null;
  },
  ["quest-by-slug"],
  { revalidate: 3600, tags: [QUESTS_TAG] }
);

/**
 * Active terms (ordered) for the taxonomy-backed front filter groups — Life
 * Direction, Outcome Goal, Effort (difficulty), Delivery, Duration, Budget and
 * Location (country) — grouped by kind. Drives the public filter pills so admin
 * taxonomy edits (add/rename/delete) show up on the /quests + category pages.
 * Tagged `QUESTS_TAG`, which the taxonomy CRUD routes already revalidate.
 */
export const getActiveFilterTerms = unstable_cache(
  async (): Promise<Record<string, TaxonomyTerm[]>> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("taxonomy_terms")
      .select("*")
      .in("kind", ["life_direction", "outcome_goal", "difficulty", "delivery", "duration", "budget", "country"])
      .eq("active", true)
      .order("sort_order", { ascending: true });
    const grouped: Record<string, TaxonomyTerm[]> = {};
    for (const t of (data ?? []) as TaxonomyTerm[]) (grouped[t.kind] ??= []).push(t);
    return grouped;
  },
  ["filter-terms"],
  { revalidate: 3600, tags: [QUESTS_TAG] }
);

/** Active `category` taxonomy terms (ordered) — each generates a public category
 *  page on the front site. */
export const getActiveCategoryTerms = unstable_cache(
  async (): Promise<TaxonomyTerm[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("taxonomy_terms")
      .select("*")
      .eq("kind", "category")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return (data ?? []) as TaxonomyTerm[];
  },
  ["category-terms"],
  { revalidate: 3600, tags: [QUESTS_TAG] }
);
