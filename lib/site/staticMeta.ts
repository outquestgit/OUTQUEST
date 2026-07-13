import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/siteSettings";
import { buildMetadata } from "@/lib/seo";

/**
 * SEO for the static SPA routes (home, about, faq, …). These pages have no
 * per-item DB record, so before this they all inherited the root layout's single
 * site-wide description — every page showed the *same* meta description in
 * search results. Here each route derives a distinct title + description from the
 * admin-editable page content already stored in Settings (hero copy), falling
 * back to the site-wide default. Nothing is hardcoded in the page components.
 */

export type StaticPageKey =
  | "homepage"
  | "about"
  | "faq"
  | "contact"
  | "partner"
  | "privacy"
  | "terms"
  | "quests"
  | "journal"
  | "abroad"
  | "upgrade"
  | "life"
  | "move-abroad"
  | "level-up"
  | "try-a-new-life";

/** Route path for each key (used as the canonical URL in buildMetadata). */
const PATHS: Record<StaticPageKey, string> = {
  homepage: "/",
  about: "/about",
  faq: "/faq",
  contact: "/contact",
  partner: "/partner",
  privacy: "/privacy",
  terms: "/tos",
  quests: "/quests",
  journal: "/journal",
  abroad: "/abroad",
  upgrade: "/upgrade",
  life: "/life",
  "move-abroad": "/move-abroad",
  "level-up": "/level-up",
  "try-a-new-life": "/try-a-new-life",
};

/**
 * Static fallbacks for the taxonomy-driven landing pages, used only when the
 * admin hasn't set a category hero. Distinct copy per page so search results
 * never repeat, and admins can still override via Settings → Pages → Categories.
 */
const LANDING_FALLBACKS: Record<string, { title: string; description: string }> = {
  abroad: {
    title: "Work & Live Abroad",
    description:
      "Paid, seasonal and experience-led ways to work somewhere new. Pick a quest and we'll hand you the map.",
  },
  upgrade: {
    title: "Level Up Your Skills",
    description:
      "Certifications, courses and side hustles that move your career and income forward — without going back to school.",
  },
  life: {
    title: "Try a New Life",
    description:
      "Relocate, reset and reinvent. Real paths for people ready to swap the main quest for a side quest.",
  },
  "move-abroad": {
    title: "Move Abroad",
    description:
      "Choose a country, understand the setup, and make the move — visas, housing and the practical steps mapped out.",
  },
  "level-up": {
    title: "Level Up",
    description:
      "Grow your income and skills with programs, certifications and opportunities built for the unconventional.",
  },
  "try-a-new-life": {
    title: "Try a New Life",
    description:
      "Explore bold, life-changing paths — from working abroad to going freelance. Find the quest that fits.",
  },
};

const clean = (s?: string | null) => s?.replace(/\s*\n\s*/g, " ").trim() || undefined;

/**
 * Build metadata for a static SPA route from the admin-managed Settings. Read
 * once per request; falls back gracefully if settings can't be loaded.
 *
 * Priority: CMS SEO panel (page_seo[key]) → hero copy → site-wide defaults.
 * The CMS SEO panel (Task 3) writes to site_settings.page_seo; if the admin
 * has filled it in those values win. Otherwise hero copy is used as a
 * meaningful fallback so every page always has distinct meta tags.
 */
export async function staticPageMetadata(key: StaticPageKey): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const path = PATHS[key];
  const siteName = settings?.general.siteName?.trim() || "OutQuest";

  // Check CMS SEO panel first (page_seo[key]) — admin-set values always win.
  const pageSeo = settings?.page_seo?.[key] ?? {};

  let heroTitle: string;
  let heroDescription: string | undefined;

  switch (key) {
    case "homepage":
      heroTitle = siteName;
      heroDescription = clean(settings?.homepage.hero.tagline);
      break;
    case "about":
      heroTitle = "About";
      heroDescription = clean(settings?.pages.about.hero.sub);
      break;
    case "faq":
      heroTitle = "FAQ";
      heroDescription = clean(settings?.pages.faq.hero.sub);
      break;
    case "contact":
      heroTitle = clean(settings?.pages.contact.hero.heading) || "Contact";
      heroDescription = clean(settings?.pages.contact.hero.sub);
      break;
    case "partner":
      heroTitle = "Partner With Us";
      heroDescription = clean(settings?.pages.partner.hero.sub);
      break;
    case "privacy":
      heroTitle = clean(settings?.pages.privacy.hero.heading) || "Privacy Policy";
      heroDescription = clean(settings?.pages.privacy.hero.sub);
      break;
    case "terms":
      heroTitle = clean(settings?.pages.terms.hero.heading) || "Terms of Service";
      heroDescription = clean(settings?.pages.terms.hero.sub);
      break;
    case "quests":
      heroTitle = clean(settings?.pages.quests.heading) || "All Quests";
      heroDescription = clean(settings?.pages.quests.subtitle);
      break;
    case "journal":
      heroTitle = clean(settings?.pages.journal.heading) || "The Journal";
      heroDescription = clean(settings?.pages.journal.subtitle);
      break;
    default: {
      // Taxonomy landing pages — prefer the admin category hero, else fallback.
      const cat = settings?.pages.categories?.[key];
      const fb = LANDING_FALLBACKS[key] ?? { title: siteName, description: undefined as string | undefined };
      heroTitle = clean(cat?.title) || fb.title;
      heroDescription = clean(cat?.sub) || fb.description;
    }
  }

  // Merge: page_seo fields override hero copy, which itself overrides site defaults.
  return buildMetadata(
    pageSeo,
    {
      title: clean(pageSeo.seo_title) || heroTitle,
      description: clean(pageSeo.meta_description) || heroDescription,
      path,
      canonical: pageSeo.canonical_url || undefined,
      noindex: pageSeo.noindex,
    },
    settings?.seo
  );
}