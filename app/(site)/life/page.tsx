import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/life` — renders the single-page app with the
 *  "life" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="life" />;
}
