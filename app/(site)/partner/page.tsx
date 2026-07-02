import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/partner` — renders the single-page app with the
 *  "partner" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="partner" />;
}
