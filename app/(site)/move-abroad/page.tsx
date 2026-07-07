import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";

/** SPA route for the "move-abroad" category page (generated from the Category
 *  taxonomy). Renders the single-page app with that section active. */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("move-abroad");
}

export default function Page() {
  return <SiteApp initialPage="move-abroad" />;
}
