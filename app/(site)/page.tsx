import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";
import { buildHomepageSchema, schemaScript } from "@/lib/seo/schema";

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
