"use client";

import { LegalPageView } from "./LegalPageView";
import type { LegalPageConfig } from "@/lib/site/data/legal";

/** Privacy Policy page — content from CMS (`privacy`), defaulting to the original. */
export function PrivacyPage({ privacy }: { privacy: LegalPageConfig }) {
  return <LegalPageView pageId="privacy" current="Privacy Policy" config={privacy} />;
}
