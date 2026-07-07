import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";

/** SPA route for `/privacy` — renders the single-page app with the
 *  "privacy" section active (keeps the clean URL; section toggled on load). */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("privacy");
}

export default function Page() {
  return <SiteApp initialPage="privacy" />;
}
