import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/about` — renders the single-page app with the
 *  "about" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="about" />;
}
