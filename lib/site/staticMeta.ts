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
  | "home"
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
  home: "/",
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
 */
export async function staticPageMetadata(key: StaticPageKey): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const path = PATHS[key];
  const siteName = settings?.general.siteName?.trim() || "OutQuest";

  let title: string;
  let description: string | undefined;

  switch (key) {
    case "home":
      title = siteName;
      description = clean(settings?.homepage.hero.tagline);
      break;
    case "about":
      title = "About";
      description = clean(settings?.pages.about.hero.sub);
      break;
    case "faq":
      title = "FAQ";
      description = clean(settings?.pages.faq.hero.sub);
      break;
    case "contact":
      title = clean(settings?.pages.contact.hero.heading) || "Contact";
      description = clean(settings?.pages.contact.hero.sub);
      break;
    case "partner":
      title = "Partner With Us";
      description = clean(settings?.pages.partner.hero.sub);
      break;
    case "privacy":
      title = clean(settings?.pages.privacy.hero.heading) || "Privacy Policy";
      description = clean(settings?.pages.privacy.hero.sub);
      break;
    case "terms":
      title = clean(settings?.pages.terms.hero.heading) || "Terms of Service";
      description = clean(settings?.pages.terms.hero.sub);
      break;
    case "quests":
      title = clean(settings?.pages.quests.heading) || "All Quests";
      description = clean(settings?.pages.quests.subtitle);
      break;
    case "journal":
      title = clean(settings?.pages.journal.heading) || "The Journal";
      description = clean(settings?.pages.journal.subtitle);
      break;
    default: {
      // Taxonomy landing pages — prefer the admin category hero, else fallback.
      const cat = settings?.pages.categories?.[key];
      const fb = LANDING_FALLBACKS[key] ?? { title: siteName, description: undefined as string | undefined };
      title = clean(cat?.title) || fb.title;
      description = clean(cat?.sub) || fb.description;
    }
  }

  return buildMetadata({}, { title, description, path }, settings?.seo);
}
