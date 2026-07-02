/**
 * CMS model + defaults for the simpler standalone pages (Quests / Explore and
 * Journal). Each exposes only its editable hero banner (eyebrow label, heading,
 * subcopy) — the rest of those pages is dynamic (filters, the quest grid, the DB
 * journal posts). Defaults reproduce the current pages exactly, so they're
 * unchanged until an admin saves.
 */
import { DEFAULT_ABOUT, type AboutConfig } from "./about";
import { DEFAULT_PARTNER, type PartnerConfig } from "./partner";
import { DEFAULT_FAQ, type FaqPageConfig } from "./faq";
import { DEFAULT_PRIVACY, DEFAULT_TERMS, type LegalPageConfig } from "./legal";
import { DEFAULT_CONTACT, type ContactConfig } from "./contact";

export type { AboutConfig } from "./about";
export type { PartnerConfig } from "./partner";
export type { FaqPageConfig } from "./faq";
export type { LegalPageConfig } from "./legal";
export type { ContactConfig } from "./contact";

/** A centered page hero banner (eyebrow label + H1 + sub). */
export interface PageHero {
  label: string;
  heading: string;
  subtitle: string;
}

// Named aliases kept for readability at call sites.
export type QuestsPageConfig = PageHero;
export type JournalPageConfig = PageHero;

/** Editable hero for a taxonomy-generated category page (keyed by category slug). */
export interface CategoryHero {
  label: string;
  title: string;
  sub: string;
}

export interface PagesConfig {
  quests: PageHero;
  journal: PageHero;
  about: AboutConfig;
  partner: PartnerConfig;
  faq: FaqPageConfig;
  privacy: LegalPageConfig;
  terms: LegalPageConfig;
  contact: ContactConfig;
  /** Per-category-page hero overrides, keyed by the Category taxonomy slug.
   *  Pages themselves are generated from the Category taxonomy at render time. */
  categories: Record<string, CategoryHero>;
}

export const DEFAULT_QUESTS_PAGE: PageHero = {
  label: "All quests",
  heading: "Every OutQuest",
  subtitle: "From the slopes of Japan to the streets of Bangkok. Pick your quest and we'll hand you the map.",
};

export const DEFAULT_JOURNAL_PAGE: PageHero = {
  label: "The Journal",
  heading: "Stories from the field",
  subtitle:
    "Real accounts from people who made the jump. What actually happened, what they'd do differently, and what it felt like.",
};

export const DEFAULT_PAGES: PagesConfig = {
  quests: DEFAULT_QUESTS_PAGE,
  journal: DEFAULT_JOURNAL_PAGE,
  about: DEFAULT_ABOUT,
  partner: DEFAULT_PARTNER,
  faq: DEFAULT_FAQ,
  privacy: DEFAULT_PRIVACY,
  terms: DEFAULT_TERMS,
  contact: DEFAULT_CONTACT,
  categories: {},
};
