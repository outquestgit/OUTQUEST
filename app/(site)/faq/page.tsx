import type { Metadata } from "next";
import { SiteApp } from "@/components/site/SiteApp";
import { staticPageMetadata } from "@/lib/site/staticMeta";
import { buildFaqPageSchema, schemaScript } from "@/lib/seo/schema";
import { faqCategories } from "@/lib/site/data/faq";

/** SPA route for `/faq` — renders the single-page app with the
 *  "faq" section active (keeps the clean URL; section toggled on load). */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("faq");
}

export default async function Page() {
  const schema = buildFaqPageSchema(
    faqCategories.flatMap((cat) => cat.items.map((item) => ({ question: item.q, answer: item.a })))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScript(schema) }}
      />
      <SiteApp initialPage="faq" />;
    </>

  )
}
