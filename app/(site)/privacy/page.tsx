import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/privacy` — renders the single-page app with the
 *  "privacy" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="privacy" />;
}
