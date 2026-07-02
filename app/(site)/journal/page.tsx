import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/journal` — renders the single-page app with the
 *  "journal" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="journal" />;
}
