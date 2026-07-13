"use client";

import dynamic from "next/dynamic";
import { Footer } from "./Footer";
import type { FooterConfig } from "@/lib/site/chromeConfig";
import { DEFAULT_FOOTER, DEFAULT_NEWSLETTER } from "@/lib/site/chromeConfig";

const NewsletterSection = dynamic(
  () => import("../sections/NewsletterSection").then((mod) => mod.NewsletterSection),
  {
    ssr: true,
    loading: () => null,
  }
);

/**
 * The `.global-site-end` block that closes every page in the source: the
 * admin-managed newsletter sign-up (hidden when turned off) followed by the
 * site footer. Rendered once after all pages.
 */
export function SiteEnd({ footer = DEFAULT_FOOTER }: { footer?: FooterConfig }) {
  const nl = { ...DEFAULT_NEWSLETTER, ...footer.newsletter };
  return (
    <div className="global-site-end">
      <NewsletterSection newsletter={nl} />
      <Footer footer={footer} />
    </div>
  );
}
