import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedJournalPosts, type JournalPost } from "@/lib/journal";
import { getSiteSettings } from "@/lib/siteSettings";
import { JournalPage } from "@/components/site/pages/JournalPage";
import { postToGridCard, journalCategorySlug } from "@/lib/site/journalMapping";
import { Overlays } from "@/components/site/overlays/Overlays";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { QuizModal } from "@/components/site/overlays/QuizModal";
import { buildBreadcrumbSchema, schemaScript } from "@/lib/seo/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";

type Params = Promise<{ slug: string }>;

async function postsForCategory(slug: string): Promise<JournalPost[]> {
  const posts = await getPublishedJournalPosts();
  return posts.filter((p) => p.category && journalCategorySlug(p.category) === slug);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const matches = await postsForCategory(slug);
  if (matches.length === 0) return {};
  const label = matches[0].category ?? "";
  return {
    title: `${label} — Journal`,
    description: `Every OutQuest Journal article filed under ${label}.`,
  };
}

export default async function JournalCategoryRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const [matches, settings] = await Promise.all([postsForCategory(slug), getSiteSettings()]);
  if (matches.length === 0) notFound();

  const categoryLabel = matches[0].category ?? "";
  const grid = matches.map(postToGridCard);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Journal", url: `${SITE_URL}/journal` },
    { name: categoryLabel },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScript(breadcrumbSchema) }}
      />

      <Overlays />
      <Nav nav={settings.nav} />
      <MobileMenu nav={settings.nav} />
      <JournalPage
        featured={null}
        grid={grid}
        hero={{
          label: "The Journal",
          heading: categoryLabel,
          subtitle: `Every article filed under "${categoryLabel}."`,
        }}
        breadcrumbCurrent={categoryLabel}
      />
      <SiteEnd footer={settings.footer} />
      <QuizModal quiz={settings.quiz} />
    </>
  );
}
