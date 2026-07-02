"use client";

import { LegalPageView } from "./LegalPageView";
import { DEFAULT_TERMS, type LegalPageConfig } from "@/lib/site/data/legal";

/** Terms of Service page — content from CMS (`terms`), defaulting to the original. */
export function TosPage({ terms = DEFAULT_TERMS }: { terms?: LegalPageConfig }) {
  return <LegalPageView pageId="tos" current="Terms of Service" config={terms} />;
}
