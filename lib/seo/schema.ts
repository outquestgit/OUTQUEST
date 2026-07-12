const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";
const ORG_NAME = "OutQuest";
const LOGO_URL = `${SITE_URL}/logo.png`;

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
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/deals?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
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
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.name,
    ...(deal.description && { description: deal.description }),
    ...(deal.image && { image: { "@type": "ImageObject", url: deal.image } }),
    url,
    brand: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      url,
      price: deal.price ?? 0,
      priceCurrency: deal.currency ?? "USD",
      availability: deal.available !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
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

interface CourseSchemaInput {
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
}

export function buildCourseSchema(quest: CourseSchemaInput) {
  const url = `${SITE_URL}/quests/${quest.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: quest.name,
    ...(quest.description && { description: quest.description }),
    url,
    ...(quest.image && { image: { "@type": "ImageObject", url: quest.image } }),
    provider: { "@id": `${SITE_URL}/#organization` },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online", url },
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

// ─── Utility ─────────────────────────────────────────────────────────────────

export function schemaScript(data: object) {
  return JSON.stringify(data);
}