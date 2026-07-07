import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";

export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("home");
}

/** Home — the front single-page app (home section active by default). */
export default function HomeRoute() {
  return <SiteApp />;
}
