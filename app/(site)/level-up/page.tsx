import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";
import { buildStaticCategorySchemas } from "@/lib/seo/categorySchema";

/** SPA route for the "level-up" category page (generated from the Category
 *  taxonomy). Renders the single-page app with that section active. */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("level-up");
}

export default function Page() {
  // "upgrade" is the altCategoryPages id that powers /level-up
  const { itemList, breadcrumb } = buildStaticCategorySchemas("upgrade", "/level-up", "Level Up");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemList }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <SiteApp initialPage="level-up" />
    </>
  );
}