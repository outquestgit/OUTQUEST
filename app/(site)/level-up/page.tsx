import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";

/** SPA route for the "level-up" category page (generated from the Category
 *  taxonomy). Renders the single-page app with that section active. */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("level-up");
}

export default function Page() {
  return <SiteApp initialPage="level-up" />;
}
