import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";
import { buildHomepageSchema, schemaScript } from "@/lib/seo/schema";

/**
 * ISR: cache the full rendered HTML at Vercel's CDN edge for 1 hour.
 * Visitors get a pre-built static response with zero serverless cold-start
 * latency. Matches the 1hr revalidate already set on all Supabase data fetches
 * in lib/quests.ts, lib/deals.ts, lib/journal.ts and lib/siteSettings.ts.
 * The page auto-regenerates in the background when the TTL expires.
 */
export const revalidate = 3600;

export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("homepage");
}

/** Home — the front single-page app (home section active by default). */
export default function HomeRoute() {
  const schema = buildHomepageSchema();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScript(schema) }}
      />
      <SiteApp />
    </>
  );
}
