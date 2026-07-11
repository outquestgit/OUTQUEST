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
import { buildCourseSchema, schemaScript } from "@/lib/seo/schema";

type Params = Promise<{ slug: string }>;

/** Fully-dynamic per-quest metadata from the admin-controlled SEO fields. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [quest, settings] = await Promise.all([getQuestBySlug(slug), getSiteSettings()]);
  if (!quest) return {};
  return buildMetadata(
    quest,
    {
      title: quest.title,
      description: quest.tagline ?? undefined,
      path: `/quests/${quest.slug}`,
      canonical: quest.canonical_url,
      image: quest.featured_image_path || quest.card_image_path,
    },
    settings.seo
  );
}

/**
 * Server-rendered single-quest detail — the crawlable, SEO-canonical surface.
 * Renders from the database into the SPA listing page's exact markup/classes
 * (via <QuestListing>), wrapped in the full site chrome so it matches the app.
 */
export default async function QuestDetailRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const [quest, all, settings] = await Promise.all([
    getQuestBySlug(slug),
    getPublishedQuests(),
    getSiteSettings(),
  ]);
  if (!quest) notFound();

  // Categorized quests are canonical under `/{category}/{slug}` — redirect there
  // so the old flat URL keeps working. Uncategorized quests render here.
  const cat = questCategorySlug(quest);
  if (cat) redirect(`/${cat}/${slug}`);

  const deals = await getDealsForQuest(quest.id);
  const data = questToListing(quest, all, deals);

  const schema = buildCourseSchema({
    name: quest.title,
    description: quest.meta_description ?? quest.tagline,  // tagline as fallback
    slug: quest.slug,
    image: quest.featured_image_path ?? quest.card_image_path,  // featured first, fallback to card
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScript(schema) }}
      />

      {/* Full site chrome so the standalone route matches the SPA shell. The
          runtime's showPage() deep-links back into the app via /?p=… here. */}
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
