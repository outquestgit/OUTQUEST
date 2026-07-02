import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/upgrade` — renders the single-page app with the
 *  "upgrade" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="upgrade" />;
}
