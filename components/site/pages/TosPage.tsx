"use client";

import { LegalPageView } from "./LegalPageView";
import type { LegalPageConfig } from "@/lib/site/data/legal";

/** Terms of Service page — content from CMS (`terms`), defaulting to the original. */
export function TosPage({ terms }: { terms: LegalPageConfig }) {
  return <LegalPageView pageId="tos" current="Terms of Service" config={terms} />;
}
