import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/contact` — renders the single-page app with the
 *  "contact" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="contact" />;
}
