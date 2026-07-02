import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for the "try-a-new-life" category page (generated from the Category
 *  taxonomy). Renders the single-page app with that section active. */
export default function Page() {
  return <SiteApp initialPage="try-a-new-life" />;
}
