const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";
const ORG_NAME = "OutQuest";
const LOGO_URL = "https://occcfjeqfzvyypcfqnwq.supabase.co/storage/v1/object/public/quests/01e6d09c-7b0d-4cf0-9752-1b2f78be6ef0.png";

// ─── Shared org reference ────────────────────────────────────────────────────

export const orgRef = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: ORG_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: LOGO_URL },
} as const;

// ─── Homepage: WebSite + Organization ────────────────────────────────────────

export function buildHomepageSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: ORG_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        // SearchAction removed — /deals?q= is not a verified search endpoint.
      },
      orgRef,
    ],
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  /** Absolute URL. Omit for the last (current) item — Google ignores it anyway. */
  url?: string;
}

/**
 * Builds a BreadcrumbList schema from an ordered array of crumbs.
 *
 * Usage:
 *   buildBreadcrumbSchema([
 *     { name: "Home",   url: "https://www.joinoutquest.com/" },
 *     { name: "Quests", url: "https://www.joinoutquest.com/quests" },
 *     { name: "Japan Ski Season" },   // current page — no url
 *   ])
 */
export function buildBreadcrumbSchema(crumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.url ? { item: crumb.url } : {}),
    })),
  };
}

// ─── Deal pages: Product + Offer ─────────────────────────────────────────────

interface DealSchemaInput {
  name: string;
  description?: string | null;
  image?: string | null;
  slug: string;
  price?: number | null;
  currency?: string;
  available?: boolean;
}

export function buildDealSchema(deal: DealSchemaInput) {
  const url = `${SITE_URL}/deals/${deal.slug}`;

  // Always include Offer so Product schema qualifies for Google rich results
  // (requires offers, review, or aggregateRating). Only add price + priceCurrency
  // when a real value exists — omitting them avoids the fake price:0 problem.
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    url,
    availability:
      deal.available !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
  };
  if (deal.price != null) {
    offers.price = deal.price;
    offers.priceCurrency = deal.currency ?? "USD";
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.name,
    ...(deal.description && { description: deal.description }),
    ...(deal.image && { image: { "@type": "ImageObject", url: deal.image } }),
    url,
    brand: { "@id": `${SITE_URL}/#organization` },
    offers,
  };
}

// ─── Journal posts: Article ───────────────────────────────────────────────────

interface ArticleSchemaInput {
  headline: string;
  description?: string | null;
  image?: string | null;
  slug: string;
  datePublished?: string | null;
  dateModified?: string | null;
}

export function buildArticleSchema(post: ArticleSchemaInput) {
  const url = `${SITE_URL}/journal/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.headline,
    ...(post.description && { description: post.description }),
    url,
    ...(post.image && { image: { "@type": "ImageObject", url: post.image } }),
    ...(post.datePublished && { datePublished: post.datePublished }),
    ...(post.dateModified && { dateModified: post.dateModified }),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

// ─── Quest pages: Course ──────────────────────────────────────────────────────

/**
 * Valid Schema.org CourseInstance courseMode values.
 * https://schema.org/courseMode
 */
type CourseMode = "Online" | "Onsite" | "Blended";

/**
 * Map a quest's `delivery` taxonomy term slug to a Schema.org courseMode.
 * Returns undefined when the slug is unrecognised or absent — courseMode is
 * then omitted from the schema rather than defaulting to a potentially wrong value.
 */
function deliveryToCourseMode(deliverySlug?: string | null): CourseMode | undefined {
  if (!deliverySlug) return undefined;
  // A quest can carry multiple delivery slugs (space-joined by questToFilters).
  // Check for each Schema.org value by scanning the joined string.
  const s = deliverySlug.toLowerCase();
  if (s.includes("online")) return "Online";
  if (s.includes("onsite") || s.includes("in-person") || s.includes("inperson")) return "Onsite";
  if (s.includes("hybrid") || s.includes("blended")) return "Blended";
  return undefined;
}

interface CourseSchemaInput {
  name: string;
  description?: string | null;
  /** Canonical public URL for this quest (e.g. /work-abroad/japan-ski-season). */
  canonicalUrl: string;
  image?: string | null;
  /**
   * The quest's `delivery` term slug(s) — space-joined when multiple.
   * Used to set courseMode dynamically. Omit to leave courseMode out of the schema.
   */
  deliverySlug?: string | null;
}

export function buildCourseSchema(quest: CourseSchemaInput) {
  const url = quest.canonicalUrl.startsWith("http")
    ? quest.canonicalUrl
    : `${SITE_URL}${quest.canonicalUrl}`;

  const courseMode = deliveryToCourseMode(quest.deliverySlug);

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: quest.name,
    ...(quest.description && { description: quest.description }),
    url,
    ...(quest.image && { image: { "@type": "ImageObject", url: quest.image } }),
    provider: { "@id": `${SITE_URL}/#organization` },
    hasCourseInstance: {
      "@type": "CourseInstance",
      ...(courseMode && { courseMode }),
      url,
    },
  };
}

// ─── FAQ page: FAQPage ────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// ─── Category listing pages: ItemList ────────────────────────────────────────

interface ItemListEntry {
  name: string;
  url: string;
  position: number;
}

/**
 * Builds an ItemList schema for category/listing pages.
 *
 * Usage:
 *   buildItemListSchema("Work Abroad", [
 *     { name: "Work a ski season in Japan", url: "https://www.joinoutquest.com/work-abroad/japan-ski-season", position: 1 },
 *   ])
 */
export function buildItemListSchema(name: string, items: ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function schemaScript(data: object) {
  return JSON.stringify(data);
}