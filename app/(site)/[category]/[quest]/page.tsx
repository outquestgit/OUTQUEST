import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getQuestBySlug, getPublishedQuests } from "@/lib/quests";
import { getDealsForQuest } from "@/lib/deals";
import { getSiteSettings } from "@/lib/siteSettings";
import { buildMetadata } from "@/lib/seo";
import { questToListing, questCategorySlug } from "@/lib/site/questMapping";
import FrontBoot from "@/app/(site)/FrontBoot";
import { Overlays } from "@/components/site/overlays/Overlays";
import { QuizModal } from "@/components/site/overlays/QuizModal";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { QuestListing } from "@/components/site/pages/QuestListing";
import { buildCourseSchema, buildBreadcrumbSchema, schemaScript } from "@/lib/seo/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";

type Params = Promise<{ category: string; quest: string }>;

/** Per-quest metadata; canonical path is the quest's own category + slug. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, quest } = await params;
  const [q, settings] = await Promise.all([getQuestBySlug(quest), getSiteSettings()]);
  if (!q) return {};
  const cat = questCategorySlug(q) ?? category;
  return buildMetadata(
    q,
    {
      title: q.title,
      description: q.tagline ?? undefined,
      path: `/${cat}/${q.slug}`,
      canonical: q.canonical_url,
      image: q.featured_image_path || q.card_image_path,
    },
    settings.seo
  );
}

/**
 * Server-rendered single quest under its category: `/{category}/{questSlug}`.
 * A quest is canonical under its first category; requests under any other slug
 * 301-redirect there. Uncategorized quests live at `/quests/{slug}` instead.
 */
export default async function QuestInCategoryRoute({ params }: { params: Params }) {
  const { category, quest } = await params;
  const [q, all, settings] = await Promise.all([
    getQuestBySlug(quest),
    getPublishedQuests(),
    getSiteSettings(),
  ]);
  if (!q) notFound();

  const canonical = questCategorySlug(q);
  if (!canonical) redirect(`/quests/${q.slug}`);
  if (category !== canonical) redirect(`/${canonical}/${q.slug}`);

  const deals = await getDealsForQuest(q.id);
  const data = questToListing(q, all, deals);

  // Capitalise first letter of category for display (e.g. "work-abroad" → "Work Abroad")
  const categoryLabel = canonical
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Canonical URL uses the actual route path, not the legacy /quests/{slug} pattern.
  const canonicalPath = `/${canonical}/${q.slug}`;
  // delivery term slugs are space-joined when multiple (same shape as questToFilters).
  const deliverySlug = q.terms
    .filter((t) => t.kind === "delivery")
    .map((t) => t.slug)
    .join(" ") || null;

  const courseSchema = buildCourseSchema({
    name: q.title,
    description: q.meta_description ?? q.tagline,
    canonicalUrl: `${SITE_URL}${canonicalPath}`,
    image: q.featured_image_path ?? q.card_image_path,
    deliverySlug,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home",        url: `${SITE_URL}/` },
    { name: categoryLabel, url: `${SITE_URL}/${canonical}` },
    { name: q.title },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaScript(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaScript(breadcrumbSchema) }} />

      <Overlays />
      <Nav nav={settings.nav} />
      <MobileMenu nav={settings.nav} />

      <QuestListing data={data} />

      <SiteEnd footer={settings.footer} />
      <QuizModal />
      <FrontBoot />
    </>
  );
}