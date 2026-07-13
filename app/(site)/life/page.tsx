import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";
import { buildStaticCategorySchemas } from "@/lib/seo/categorySchema";

/** SPA route for `/life` — renders the single-page app with the
 *  "life" section active (keeps the clean URL; section toggled on load). */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("life");
}

export default function Page() {
  // "life" is the altCategoryPages id that powers /life
  const { itemList, breadcrumb } = buildStaticCategorySchemas("life", "/life", "Try a New Life");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemList }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <SiteApp initialPage="life" />
    </>
  );
}