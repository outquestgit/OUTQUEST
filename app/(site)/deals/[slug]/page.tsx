import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDealBySlug } from "@/lib/deals";
import { getSiteSettings } from "@/lib/siteSettings";
import { buildMetadata } from "@/lib/seo";
import FrontBoot from "@/app/(site)/FrontBoot";
import { Overlays } from "@/components/site/overlays/Overlays";
import { QuizModal } from "@/components/site/overlays/QuizModal";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { DealDetail } from "@/components/site/pages/DealDetail";
import { buildDealSchema, buildBreadcrumbSchema, schemaScript } from "@/lib/seo/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [deal, settings] = await Promise.all([getDealBySlug(slug), getSiteSettings()]);
  if (!deal) return {};
  return buildMetadata(
    deal,
    {
      title: deal.title,
      description: deal.short_desc ?? undefined,
      path: `/deals/${deal.slug}`,
      image: deal.featured_image_path || deal.card_image_path,
      canonical: deal.canonical_url,
      noindex: deal.noindex,
    },
    settings.seo
  );
}

export default async function DealDetailRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const [deal, settings] = await Promise.all([getDealBySlug(slug), getSiteSettings()]);
  if (!deal) notFound();

  const dealSchema = buildDealSchema({
    name: deal.title,
    description: deal.short_desc,
    image: deal.featured_image_path ?? deal.card_image_path,
    slug: deal.slug,
    price: null,
    available: !deal.noindex,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home",     url: `${SITE_URL}/` },
    { name: "Programs", url: `${SITE_URL}/quests` },
    { name: deal.title },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaScript(dealSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaScript(breadcrumbSchema) }} />

      <Overlays />
      <Nav nav={settings.nav} />
      <MobileMenu nav={settings.nav} />

      <div className="quest-detail-route">
        <DealDetail deal={deal} />
      </div>

      <SiteEnd footer={settings.footer} />
      <QuizModal />
      <FrontBoot />
    </>
  );
}
