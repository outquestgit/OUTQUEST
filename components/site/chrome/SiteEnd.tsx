"use client";

import { Footer } from "./Footer";
import { NewsletterSection } from "../sections/NewsletterSection";
import type { FooterConfig } from "@/lib/site/chromeConfig";
import { DEFAULT_FOOTER, DEFAULT_NEWSLETTER } from "@/lib/site/chromeConfig";

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
