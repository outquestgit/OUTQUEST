import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";

/** SPA route for `/upgrade` — renders the single-page app with the
 *  "upgrade" section active (keeps the clean URL; section toggled on load). */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("upgrade");
}

export default function Page() {
  return <SiteApp initialPage="upgrade" />;
}
