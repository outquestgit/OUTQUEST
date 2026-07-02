import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/abroad` — renders the single-page app with the
 *  "abroad" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="abroad" />;
}
