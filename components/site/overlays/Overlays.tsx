import dynamic from "next/dynamic";
import { getSiteSettings } from "@/lib/siteSettings";
import { getPublishedQuests } from "@/lib/quests";
import { questToCard } from "@/lib/site/questMapping";
import type { QuestMeta } from "@/lib/site/data/myQuestsNext";

const LazyLeadModal = dynamic(() => import("./LeadModal").then((mod) => mod.LeadModal), {
  ssr: true,
  loading: () => null,
});
const LazyShareSheet = dynamic(() => import("./ShareSheet").then((mod) => mod.ShareSheet), {
  ssr: true,
  loading: () => null,
});
const LazyToast = dynamic(() => import("./Toast").then((mod) => mod.Toast), {
  ssr: true,
  loading: () => null,
});
const LazyMyQuestsDrawer = dynamic(
  () => import("./MyQuestsDrawer").then((mod) => mod.MyQuestsDrawer),
  {
    ssr: true,
    loading: () => null,
  }
);

/**
 * The global overlays that sit at the top of the document in source order
 * (lead modal → share sheet → toast → My Quests drawer). The quiz overlay is
 * rendered separately at the end of the page, matching the original markup.
 *
 * Async so it can pull the admin-editable Global Copy (Settings → Global Copy):
 * the lead modal + My Quests drawer render their copy server-side, and the JSON
 * blob is exposed for `front.js` to apply to the runtime-built modals (quest
 * modal fallback + Compare Paths modal).
 */
export async function Overlays() {
  const [{ globalCopy }, quests] = await Promise.all([getSiteSettings(), getPublishedQuests()]);
  // slug → drawer metadata, replacing front.js's hardcoded MQ_META.
  const catalog: Record<string, QuestMeta> = {};
  for (const q of quests) {
    const card = questToCard(q);
    catalog[card.listing] = {
      title: card.title,
      meta: card.meta,
      art: card.art,
      gradient: card.gradient,
    };
  }
  return (
    <>
      <script
        id="global-copy-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(globalCopy).replace(/</g, "\\u003c") }}
      />
      <LazyLeadModal copy={globalCopy} />
      <LazyShareSheet />
      <LazyToast />
      <LazyMyQuestsDrawer copy={globalCopy} catalog={catalog} />
    </>
  );
}
