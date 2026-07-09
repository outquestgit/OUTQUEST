import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJournalPostBySlug, getPublishedJournalPosts } from "@/lib/journal";
import { getSiteSettings } from "@/lib/siteSettings";
import { buildMetadata } from "@/lib/seo";
import { postToBlogData } from "@/lib/site/journalMapping";
import FrontBoot from "@/app/(site)/FrontBoot";
import { Overlays } from "@/components/site/overlays/Overlays";
import { QuizModal } from "@/components/site/overlays/QuizModal";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { JournalPostPage } from "@/components/site/pages/JournalPostPage";

type Params = Promise<{ slug: string }>;

/** Fully-dynamic per-post metadata from the admin-controlled SEO fields. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getJournalPostBySlug(slug), getSiteSettings()]);
  if (!post) return {};
  return buildMetadata(
    post,
    {
      title: post.title,
      description: post.excerpt ?? undefined,
      path: `/journal/${post.slug}`,
      canonical: post.canonical_url,
      image: post.featured_image_path,
      noindex: post.noindex,
      nofollow: post.nofollow,
      ogType: "article",
    },
    settings.seo
  );
}

/**
 * Server-rendered single journal post — the crawlable, SEO-canonical surface,
 * rendered from the database into the SPA blog reader's exact markup, wrapped in
 * the full site chrome so it matches the app.
 */
export default async function JournalPostRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const [post, all, settings] = await Promise.all([
    getJournalPostBySlug(slug),
    getPublishedJournalPosts(),
    getSiteSettings(),
  ]);
  if (!post) notFound();

  const data = postToBlogData(post, all);

  return (
    <>
      <Overlays />
      <Nav nav={settings.nav} />
      <MobileMenu nav={settings.nav} />

      <div className="quest-detail-route">
        <JournalPostPage post={data} />
      </div>

      <SiteEnd footer={settings.footer} />
      <QuizModal />
      <FrontBoot />
    </>
  );
}