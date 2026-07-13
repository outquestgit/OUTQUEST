import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";
import { buildStaticCategorySchemas } from "@/lib/seo/categorySchema";

/** SPA route for the "move-abroad" category page (generated from the Category
 *  taxonomy). Renders the single-page app with that section active. */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("move-abroad");
}

export default function Page() {
  // "abroad" is the altCategoryPages id that powers /move-abroad
  const { itemList, breadcrumb } = buildStaticCategorySchemas("abroad", "/move-abroad", "Move Abroad");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemList }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <SiteApp initialPage="move-abroad" />
    </>
  );
}