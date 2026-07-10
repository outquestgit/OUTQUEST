import { SiteApp } from "@/components/site/SiteApp";
import { buildFaqPageSchema, schemaScript } from "@/lib/seo/schema";
import { staticPageMetadata } from "@/lib/site/staticMeta";
import { getSiteSettings } from "@/lib/siteSettings";
import type { Metadata } from "next";

/** SPA route for `/faq` — renders the single-page app with the
 *  "faq" section active (keeps the clean URL; section toggled on load). */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("faq");
}

export default async function Page() {
  const settings = await getSiteSettings();
  const faqItems = settings.pages.faq.categories.flatMap((cat) =>
    cat.items.map((item) => ({ question: item.q, answer: item.a }))
  );
  const schema = buildFaqPageSchema(faqItems);


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScript(schema) }}
      />
      <SiteApp initialPage="faq" />
    </>

  )
}
