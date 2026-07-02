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
  if (!canonical) redirect(`/quests/${q.slug}`); // uncategorized → flat URL
  if (category !== canonical) redirect(`/${canonical}/${q.slug}`); // enforce canonical

  const deals = await getDealsForQuest(q.id);
  const data = questToListing(q, all, deals);

  return (
    <>
      {/* Full site chrome so the standalone route matches the SPA shell. */}
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
