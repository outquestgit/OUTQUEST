"use client";

import dynamic from "next/dynamic";
import type { GlobalCopy } from "@/lib/site/data/siteConfig";
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

export function OverlaysClient({
  copy,
  catalog,
}: {
  copy: GlobalCopy;
  catalog: Record<string, QuestMeta>;
}) {
  return (
    <>
      <LazyLeadModal copy={copy} />
      <LazyShareSheet />
      <LazyToast />
      <LazyMyQuestsDrawer copy={copy} catalog={catalog} />
    </>
  );
}