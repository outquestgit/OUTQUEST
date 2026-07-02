import { SiteApp } from "@/components/site/SiteApp";

/** SPA route for `/quests` — renders the single-page app with the
 *  "quests" section active (keeps the clean URL; section toggled on load). */
export default function Page() {
  return <SiteApp initialPage="quests" />;
}
