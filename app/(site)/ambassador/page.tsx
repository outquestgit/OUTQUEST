import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";

export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("ambassador");
}

export default function Page() {
  return <SiteApp initialPage="ambassador" />;
}
