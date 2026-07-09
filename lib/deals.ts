import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "./supabase/public";
import { createSupabaseServerClient } from "./supabase/server";

/** Cache tag — admin mutations call `revalidateTag(DEALS_TAG, { expire: 0 })` for immediate refresh. */
export const DEALS_TAG = "deals";

/** A deal's category — drives its grouping into quest-page tiers + marketplace. */
export type DealCategory = "programs" | "setup" | "tools";

/** One field in a deal's lead-capture form (action_type = "leadform"). */
export type LeadFormFieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "dropdown"
  | "radio"
  | "checkbox";

export interface LeadFormField {
  label: string;
  type: LeadFormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

/** One Step-1 field in a deal's booking form (action_type = "booking"). */
export type BookingFormFieldType =
  | "short_text"
  | "long_text"
  | "dropdown"
  | "date"
  | "number"
  | "radio";

export interface BookingFormField {
  label: string;
  type: BookingFormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface Deal {
  id: string;
  slug: string;
  title: string;
  category: DealCategory | null;
  badge: string | null;
  partner_name: string | null;
  short_desc: string | null;
  hero_icon: string | null;
  hero_bg: string | null;
  card_icon: string | null;
  card_color: string | null;
  card_image_path: string | null;
  featured_image_path: string | null;
  offer_label: string | null;
  offer_price: string | null;
  price_from: number | null;
  billing_unit: string | null;
  outcome_text: string | null;
  cta_label: string | null;
  action_type: string | null;
  book_url: string | null;
  affiliate_url: string | null;
  lead_form_fields: LeadFormField[];
  // Booking action type (action_type = "booking")
  pay_type: string | null;
  total_price: number | null;
  deposit_amount: number | null;
  refund_policy: string | null;
  booking_fields: BookingFormField[];
  what_is: string | null;
  who_for: string | null;
  why_useful: string | null;
  requirements: string[];
  checklist: string[];
  cta_heading: string | null;
  cta_subtext: string | null;
  /** Final CTA button text; falls back to `cta_label` when empty. */
  cta_button_label: string | null;
  verified: boolean;
  featured: boolean;
  seo_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
  visibility: string;
  display_order: number;
  updated_at: string;
}

/** A deal plus the slugs of the quests it's connected to (for the admin list). */
export interface DealWithQuests extends Deal {
  questSlugs: string[];
}

type RawDeal = Deal & { deal_quests?: { quests: { slug: string } | null }[] };

function normalize(row: RawDeal): DealWithQuests {
  const { deal_quests, ...deal } = row;
  return {
    ...deal,
    requirements: Array.isArray(deal.requirements) ? deal.requirements : [],
    checklist: Array.isArray(deal.checklist) ? deal.checklist : [],
    lead_form_fields: Array.isArray(deal.lead_form_fields) ? deal.lead_form_fields : [],
    booking_fields: Array.isArray(deal.booking_fields) ? deal.booking_fields : [],
    questSlugs: (deal_quests ?? []).map((j) => j.quests?.slug).filter(Boolean) as string[],
  };
}

const DEAL_SELECT = `*, deal_quests ( quests ( slug ) )`;

// ── Admin reads (uncached, RLS-as-admin → includes drafts) ──────────────────

export async function adminListDeals(): Promise<DealWithQuests[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("deals")
    .select(DEAL_SELECT)
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });
  return ((data ?? []) as RawDeal[]).map(normalize);
}

export async function adminGetDeal(id: string): Promise<DealWithQuests | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("deals").select(DEAL_SELECT).eq("id", id).maybeSingle();
  return data ? normalize(data as RawDeal) : null;
}

// ── Public reads (cached) ───────────────────────────────────────────────────

export const getPublishedDeals = unstable_cache(
  async (): Promise<DealWithQuests[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("deals")
      .select(DEAL_SELECT)
      .order("display_order", { ascending: true });
    return ((data ?? []) as RawDeal[]).map(normalize);
  },
  ["published-deals"],
  { revalidate: 3600, tags: [DEALS_TAG] }
);

export const getDealBySlug = unstable_cache(
  async (slug: string): Promise<DealWithQuests | null> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb.from("deals").select(DEAL_SELECT).eq("slug", slug).maybeSingle();
    return data ? normalize(data as RawDeal) : null;
  },
  ["deal-by-slug"],
  { revalidate: 3600, tags: [DEALS_TAG] }
);

/**
 * Deals connected to a quest (the admin "Connected Quests" link), used to build
 * the quest page's Programs / Get-Set-Up / Tools sections. Cached per quest id.
 */
export const getDealsForQuest = unstable_cache(
  async (questId: string): Promise<Deal[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("deal_quests")
      .select(`deals ( ${DEAL_SELECT} )`)
      .eq("quest_id", questId);
    const deals = ((data ?? []) as unknown as { deals: RawDeal | null }[])
      .map((r) => r.deals)
      .filter(Boolean) as RawDeal[];
    return deals.map(normalize).sort((a, b) => a.display_order - b.display_order);
  },
  ["deals-for-quest"],
  { revalidate: 3600, tags: [DEALS_TAG] }
);