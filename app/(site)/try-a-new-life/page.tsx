import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";
import { buildStaticCategorySchemas } from "@/lib/seo/categorySchema";

/** SPA route for the "try-a-new-life" category page (generated from the Category
 *  taxonomy). Renders the single-page app with that section active. */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("try-a-new-life");
}

export default function Page() {
  // "life" altCategoryPage is also the content for /try-a-new-life
  const { itemList, breadcrumb } = buildStaticCategorySchemas("life", "/try-a-new-life", "Try a New Life");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemList }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <SiteApp initialPage="try-a-new-life" />
    </>
  );
}