import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "./supabase/public";
import type {
  Industry,
  BusinessModel,
  ListingWithRelations,
  CmsPage,
  FaqItem,
} from "./types";

// Revalidation tags — admin mutations call revalidateTag(...) to refresh these.
export const TAGS = {
  industries: "industries",
  businessModels: "business-models",
  listings: "listings",
  pages: "pages",
  faq: "faq",
} as const;

const HOUR = 3600;

/** Build a public URL for an image stored in the `listings` Storage bucket. */
export function publicImageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/listings/${storagePath}`;
}

const LISTING_SELECT = `
  *,
  industry:industries(slug,name),
  business_model:business_models(slug,name),
  images:listing_images(*),
  product_categories:listing_product_categories(product_categories(slug,name))
`;

// RLS guarantees only public-visibility rows are returned to the anon client,
// so we don't repeat visibility filters here (defence in depth still applies
// where it costs nothing).

export const getIndustries = unstable_cache(
  async (): Promise<Industry[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("industries")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Industry[];
  },
  ["industries"],
  { revalidate: HOUR, tags: [TAGS.industries] }
);

export const getIndustryBySlug = unstable_cache(
  async (slug: string): Promise<Industry | null> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("industries")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return (data as Industry) ?? null;
  },
  ["industry-by-slug"],
  { revalidate: HOUR, tags: [TAGS.industries] }
);

export const getBusinessModelsForIndustry = unstable_cache(
  async (industryId: string): Promise<BusinessModel[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("business_models")
      .select("*")
      .eq("industry_id", industryId)
      .order("sort_order", { ascending: true });
    return (data ?? []) as BusinessModel[];
  },
  ["business-models-for-industry"],
  { revalidate: HOUR, tags: [TAGS.businessModels] }
);

export const getBusinessModel = unstable_cache(
  async (
    industrySlug: string,
    modelSlug: string
  ): Promise<(BusinessModel & { industry: Industry }) | null> => {
    const sb = createSupabasePublicClient();
    const { data: industry } = await sb
      .from("industries")
      .select("*")
      .eq("slug", industrySlug)
      .maybeSingle();
    if (!industry) return null;
    const { data: model } = await sb
      .from("business_models")
      .select("*")
      .eq("industry_id", (industry as Industry).id)
      .eq("slug", modelSlug)
      .maybeSingle();
    if (!model) return null;
    return {
      ...(model as BusinessModel),
      industry: industry as Industry,
    };
  },
  ["business-model"],
  { revalidate: HOUR, tags: [TAGS.businessModels, TAGS.industries] }
);

type RawListing = Omit<ListingWithRelations, "product_categories"> & {
  product_categories: { product_categories: { slug: string; name: string } }[];
};

function normalizeListing(row: RawListing): ListingWithRelations {
  return {
    ...row,
    product_categories: (row.product_categories ?? []).map(
      (j) => j.product_categories
    ),
  };
}

export const getListingsForModel = unstable_cache(
  async (
    businessModelId: string
  ): Promise<ListingWithRelations[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("listings")
      .select(LISTING_SELECT)
      .eq("business_model_id", businessModelId)
      .order("featured", { ascending: false })
      .order("company_name", { ascending: true });
    return ((data ?? []) as RawListing[]).map(normalizeListing);
  },
  ["listings-for-model"],
  { revalidate: HOUR, tags: [TAGS.listings] }
);

export const getListingBySlug = unstable_cache(
  async (slug: string): Promise<ListingWithRelations | null> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("listings")
      .select(LISTING_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    return data ? normalizeListing(data as RawListing) : null;
  },
  ["listing-by-slug"],
  { revalidate: HOUR, tags: [TAGS.listings] }
);

export const getPageBySlug = unstable_cache(
  async (slug: string): Promise<CmsPage | null> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return (data as CmsPage) ?? null;
  },
  ["page-by-slug"],
  { revalidate: HOUR, tags: [TAGS.pages] }
);

export const getFaqForPage = unstable_cache(
  async (pageId: string): Promise<FaqItem[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("faq_items")
      .select("*")
      .eq("page_id", pageId)
      .order("sort_order", { ascending: true });
    return (data ?? []) as FaqItem[];
  },
  ["faq-for-page"],
  { revalidate: HOUR, tags: [TAGS.faq] }
);
