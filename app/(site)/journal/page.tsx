import type { Metadata } from "next";
import { getPublishedJournalPosts } from "@/lib/journal";
import { getSiteSettings } from "@/lib/siteSettings";
import { JournalPage } from "@/components/site/pages/JournalPage";
import { postToFeatured, postToGridCard } from "@/lib/site/journalMapping";
import { Overlays } from "@/components/site/overlays/Overlays";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { QuizModal } from "@/components/site/overlays/QuizModal";
import { journalGrid } from "@/lib/site/data/journal";
import { DEFAULT_JOURNAL_PAGE } from "@/lib/site/data/pages";
import { staticPageMetadata } from "@/lib/site/staticMeta";

const FALLBACK_FEATURED = {
  post: "japan-ski",
  tag: "Seasonal Jobs",
  title: "4 months in a Japanese ski resort — the honest version",
  desc: "Powder days, staff dorms, instant friendships, and the best decision I made at 26. Here's what nobody tells you before you go.",
  gradient: "linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)",
  emoji: "🏔️",
  image: null,
} as const;

/** SPA route for `/journal` — renders the single-page app with the
 *  "journal" section active (keeps the clean URL; section toggled on load). */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("journal");
}

export default async function Page() {
  const [posts, settings] = await Promise.all([getPublishedJournalPosts(), getSiteSettings()]);
  const featured = posts.find((post) => post.featured);
  const featuredCard = featured ? postToFeatured(featured) : FALLBACK_FEATURED;
  const grid = posts.length
    ? posts.filter((post) => post.slug !== featured?.slug).map(postToGridCard)
    : journalGrid.map((card) => ({ ...card, href: `/journal/${card.post}` }));

  return (
    <>
      <Overlays />
      <Nav nav={settings.nav} />
      <MobileMenu nav={settings.nav} />
      <JournalPage
        featured={featuredCard}
        grid={grid}
        hero={settings.pages.journal ?? DEFAULT_JOURNAL_PAGE}
      />
      <SiteEnd footer={settings.footer} />
      <QuizModal />
    </>
  );
}
