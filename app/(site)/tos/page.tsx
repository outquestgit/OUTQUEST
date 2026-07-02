import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/tos` — renders the single-page app with the
 *  "tos" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="tos" />;
}
