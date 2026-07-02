import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/faq` — renders the single-page app with the
 *  "faq" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="faq" />;
}
