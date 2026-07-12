import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveCategoryTerms, getPublishedQuests } from "@/lib/quests";
import { getSiteSettings } from "@/lib/siteSettings";
import { SiteApp } from "@/components/site/SiteApp";
import { buildItemListSchema, buildBreadcrumbSchema, schemaScript } from "@/lib/seo/schema";
import { questCategorySlug, questPath } from "@/lib/site/questMapping";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";

type Params = Promise<{ category: string }>;

/** The active `category` taxonomy term for this slug, or null when it isn't one
 *  (so unknown root slugs 404 instead of rendering an empty SPA section). */
async function findCategory(slug: string) {
  const terms = await getActiveCategoryTerms();
  return terms.find((t) => t.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  const term = await findCategory(category);
  if (!term) return {};
  const settings = await getSiteSettings();
  const hero = settings.pages.categories[term.slug];
  return {
    title: hero?.title || term.name,
    description: hero?.sub || undefined,
  };
}

/**
 * Clean-URL category page: `/{categorySlug}` renders the single-page app with
 * that category section active. Any slug that isn't an active category term
 * 404s. (Categories that still have a dedicated static folder are served by it —
 * static routes take precedence over this dynamic one.)
 */
export default async function CategoryRoute({ params }: { params: Params }) {
  const { category } = await params;
  const [term, allQuests, settings] = await Promise.all([
    findCategory(category),
    getPublishedQuests(),
    getSiteSettings(),
  ]);
  if (!term) notFound();

  // Quests that belong to this category
  const categoryQuests = allQuests.filter((q) => questCategorySlug(q) === category);

  // Category display label (e.g. "work-abroad" → "Work Abroad")
  const categoryLabel = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Use CMS hero title if available, fallback to term name
  const hero = settings.pages.categories[term.slug];
  const listName = hero?.title || term.name;

  const itemListSchema = buildItemListSchema(
    listName,
    categoryQuests.map((q, i) => ({
      name: q.title,
      url: `${SITE_URL}${questPath(q)}`,
      position: i + 1,
    }))
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: categoryLabel },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScript(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScript(breadcrumbSchema) }}
      />
      <SiteApp initialPage={category} />
    </>
  );
}