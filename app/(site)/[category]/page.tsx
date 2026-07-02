import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveCategoryTerms } from "@/lib/quests";
import { getSiteSettings } from "@/lib/siteSettings";
import { SiteApp } from "@/components/site/SiteApp";

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
  const term = await findCategory(category);
  if (!term) notFound();
  return <SiteApp initialPage={category} />;
}
