import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedJournalPosts } from "@/lib/journal";
import { getSiteSettings } from "@/lib/siteSettings";
import { JournalPage } from "@/components/site/pages/JournalPage";
import { postToFeatured, postToGridCard } from "@/lib/site/journalMapping";
import { Overlays } from "@/components/site/overlays/Overlays";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { QuizModal } from "@/components/site/overlays/QuizModal";
import { staticPageMetadata } from "@/lib/site/staticMeta";

/** SPA route for `/journal` — renders the single-page app with the
 *  "journal" section active (keeps the clean URL; section toggled on load). */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("journal");
}

export default async function Page() {
  const [posts, settings] = await Promise.all([getPublishedJournalPosts(), getSiteSettings()]);
  const featured = posts.find((post) => post.featured);
  if (!featured) notFound();

  return (
    <>
      <Overlays />
      <Nav nav={settings.nav} />
      <MobileMenu nav={settings.nav} />
      <JournalPage
        featured={postToFeatured(featured)}
        grid={posts.filter((post) => post.slug !== featured.slug).map(postToGridCard)}
        hero={settings.pages.journal}
      />
      <SiteEnd footer={settings.footer} />
      <QuizModal />
    </>
  );
}
