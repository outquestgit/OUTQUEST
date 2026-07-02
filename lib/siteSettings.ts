import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "./supabase/public";
import { createSupabaseServerClient } from "./supabase/server";
import {
  DEFAULT_FOOTER,
  DEFAULT_NAV,
  DEFAULT_CTA,
  DEFAULT_DISPLAY,
  DEFAULT_NAV_STYLE,
  DEFAULT_NEWSLETTER,
  DEFAULT_FOOTER_STYLE,
  DEFAULT_HOME_HERO,
} from "./site/chromeConfig";
import type { FooterConfig, NavConfig, SiteSettings, HomeHero } from "./site/chromeConfig";
import { DEFAULT_HOMEPAGE } from "./site/data/homepage";
import type {
  HomepageConfig,
  HomeWhy,
  HomeWhoUsesUs,
  HomeSocialProof,
  HomeReelSection,
} from "./site/data/homepage";
import { DEFAULT_PAGES } from "./site/data/pages";
import type { PagesConfig, PageHero, AboutConfig, CategoryHero } from "./site/data/pages";
import type { PartnerConfig } from "./site/data/partner";
import type { FaqPageConfig } from "./site/data/faq";
import { legalSectionsToBody, type LegalPageConfig, type LegalSectionItem } from "./site/data/legal";
import type { ContactConfig } from "./site/data/contact";
import { DEFAULT_QUIZ } from "./site/data/quiz";
import type {
  QuizConfig,
  QuizIntro,
  QuizBuilderQuestion,
  QuizBuilderOption,
  QuizFilterKind,
  QuizSettings,
} from "./site/data/quiz";
import { DEFAULT_SEO_DEFAULTS } from "./site/data/seoDefaults";
import type { SeoDefaults } from "./site/data/seoDefaults";
import { DEFAULT_SITE_CONFIG } from "./site/data/siteConfig";
import type { SiteConfig } from "./site/data/siteConfig";

/** Cache tag — admin saves call `revalidateTag(SITE_SETTINGS_TAG, { expire: 0 })` for immediate refresh. */
export const SITE_SETTINGS_TAG = "site-settings";

// Re-export the client-safe config (types + defaults) so server callers have a
// single import site; client components import from `lib/site/chromeConfig`.
export {
  DEFAULT_FOOTER,
  DEFAULT_NAV,
  DEFAULT_CTA,
  DEFAULT_DISPLAY,
  DEFAULT_NAV_STYLE,
  DEFAULT_NEWSLETTER,
  DEFAULT_FOOTER_STYLE,
  DEFAULT_HOME_HERO,
} from "./site/chromeConfig";
export { DEFAULT_HOMEPAGE } from "./site/data/homepage";
export { DEFAULT_PAGES, DEFAULT_QUESTS_PAGE, DEFAULT_JOURNAL_PAGE } from "./site/data/pages";
export { DEFAULT_ABOUT } from "./site/data/about";
export { DEFAULT_PARTNER } from "./site/data/partner";
export type { PartnerConfig } from "./site/data/partner";
export { DEFAULT_FAQ } from "./site/data/faq";
export type { FaqPageConfig } from "./site/data/faq";
export { DEFAULT_PRIVACY, DEFAULT_TERMS } from "./site/data/legal";
export type { LegalPageConfig } from "./site/data/legal";
export { DEFAULT_CONTACT } from "./site/data/contact";
export type { ContactConfig } from "./site/data/contact";
export { DEFAULT_QUIZ } from "./site/data/quiz";
export type {
  QuizConfig,
  QuizIntro,
  QuizBuilderQuestion,
  QuizBuilderOption,
  QuizSettings,
} from "./site/data/quiz";
export { DEFAULT_SEO_DEFAULTS } from "./site/data/seoDefaults";
export type { SeoDefaults } from "./site/data/seoDefaults";
export { DEFAULT_SITE_CONFIG } from "./site/data/siteConfig";
export type { SiteConfig, SiteGeneral, GlobalCopy } from "./site/data/siteConfig";
export type { PagesConfig, PageHero, QuestsPageConfig, JournalPageConfig, AboutConfig, CategoryHero } from "./site/data/pages";
export type {
  HomepageConfig,
  HomeWhy,
  HomeWhoUsesUs,
  HomePopularPrograms,
  HomeSocialProof,
  HomeComparePaths,
  ComparePathCard,
  HomeReelSection,
  HomeJournalSection,
  Persona,
  ProofCard,
  ReelCard,
  WhyCell,
} from "./site/data/homepage";
export type {
  NavChild,
  NavLinkItem,
  NavBrand,
  NavCta,
  NavDisplay,
  NavStyle,
  NavConfig,
  FooterLinkItem,
  FooterColumnItem,
  FooterNewsletter,
  FooterStyle,
  FooterConfig,
  HomeHero,
  HeroPill,
  HeroCard,
  SiteSettings,
} from "./site/chromeConfig";

type Row = {
  nav: unknown;
  footer: unknown;
  homepage: unknown;
  pages: unknown;
  quiz: unknown;
  seo: unknown;
  settings: unknown;
};

/** Merge stored public site config (General + Global Copy) over the built-ins. */
function normalizeSiteConfig(row: Row | null): {
  general: SiteConfig["general"];
  globalCopy: SiteConfig["globalCopy"];
} {
  const s = (row?.settings ?? {}) as Partial<SiteConfig>;
  const g = (s.general ?? {}) as Partial<SiteConfig["general"]>;
  const c = (s.globalCopy ?? {}) as Partial<SiteConfig["globalCopy"]>;
  const D = DEFAULT_SITE_CONFIG;
  return {
    general: {
      siteName: txt(g.siteName, D.general.siteName),
      siteUrl: txt(g.siteUrl, D.general.siteUrl),
      timezone: txt(g.timezone, D.general.timezone),
    },
    globalCopy: {
      questModalHeading: txt(c.questModalHeading, D.globalCopy.questModalHeading),
      questModalSubtext: txt(c.questModalSubtext, D.globalCopy.questModalSubtext),
      mqEmptyHeading: txt(c.mqEmptyHeading, D.globalCopy.mqEmptyHeading),
      mqEmptyBody: txt(c.mqEmptyBody, D.globalCopy.mqEmptyBody),
      mqEmptyCta: txt(c.mqEmptyCta, D.globalCopy.mqEmptyCta),
      mqFooter: txt(c.mqFooter, D.globalCopy.mqFooter),
      compareHeading: txt(c.compareHeading, D.globalCopy.compareHeading),
      compareSubtext: txt(c.compareSubtext, D.globalCopy.compareSubtext),
    },
  };
}

/** Merge stored site-wide SEO defaults over the built-ins. */
function normalizeSeo(row: Row | null): SeoDefaults {
  const s = (row?.seo ?? {}) as Partial<SeoDefaults>;
  return {
    titlePattern: typeof s.titlePattern === "string" ? s.titlePattern : DEFAULT_SEO_DEFAULTS.titlePattern,
    metaDescription:
      typeof s.metaDescription === "string" && s.metaDescription.trim() !== ""
        ? s.metaDescription
        : DEFAULT_SEO_DEFAULTS.metaDescription,
    defaultOgImage: typeof s.defaultOgImage === "string" ? s.defaultOgImage : DEFAULT_SEO_DEFAULTS.defaultOgImage,
    noindex: typeof s.noindex === "boolean" ? s.noindex : DEFAULT_SEO_DEFAULTS.noindex,
  };
}

/** Use a non-empty saved string, else the default. */
const txt = (v: unknown, def = ""): string => (typeof v === "string" && v.trim() !== "" ? v : def);
const flag = (v: unknown, def: boolean): boolean => (typeof v === "boolean" ? v : def);

/**
 * Merge a stored quiz blob (the Quiz Builder's model) over the defaults. The
 * intro/questions/settings are admin-defined, so a saved array is used as-is
 * (sanitized); only a missing section falls back to the seed defaults.
 */
function normalizeQuiz(row: Row | null): QuizConfig {
  const q = (row?.quiz ?? {}) as Partial<QuizConfig>;
  const D = DEFAULT_QUIZ;
  const intro = (q.intro ?? {}) as Partial<QuizIntro>;
  const st = (q.settings ?? {}) as Partial<QuizSettings>;

  const opt = (o: Partial<QuizBuilderOption>): QuizBuilderOption => {
    // Single taxonomy filter (kind + term); migrate legacy categorySlug/budgetSlug
    // so quizzes saved before the change still filter correctly on the front.
    const rawKind = txt(o?.filterKind);
    let filterKind: QuizFilterKind =
      rawKind === "category" || rawKind === "budget" || rawKind === "duration" ? rawKind : "";
    let filterSlug = filterKind ? txt(o?.filterSlug) : "";
    if (!filterSlug && txt(o?.categorySlug)) {
      filterKind = "category";
      filterSlug = txt(o?.categorySlug);
    } else if (!filterSlug && txt(o?.budgetSlug)) {
      filterKind = "budget";
      filterSlug = txt(o?.budgetSlug);
    }
    if (!filterSlug) filterKind = "";
    return {
      icon: txt(o?.icon),
      label: txt(o?.label),
      subtext: txt(o?.subtext),
      filterKind,
      filterSlug,
    };
  };
  const questions: QuizBuilderQuestion[] = Array.isArray(q.questions)
    ? (q.questions as Partial<QuizBuilderQuestion>[])
        .map((qq) => ({
          text: txt(qq?.text),
          show: flag(qq?.show, true),
          options: (Array.isArray(qq?.options) ? qq!.options : []).map(opt),
        }))
        .filter((qq) => qq.text || qq.options.length)
    : D.questions;

  return {
    intro: {
      show: flag(intro.show, D.intro.show),
      headline: txt(intro.headline, D.intro.headline),
      subline: txt(intro.subline, D.intro.subline),
      startCta: txt(intro.startCta, D.intro.startCta),
      slug: txt(intro.slug, D.intro.slug),
    },
    questions,
    settings: {
      status: st.status === "draft" ? "draft" : "published",
      showOnHomepage: st.showOnHomepage !== false,
      showOnQuests: st.showOnQuests !== false,
      progression: st.progression === "all" || st.progression === "snap" ? st.progression : "one",
      resultsDisplay: st.resultsDisplay === "top" || st.resultsDisplay === "all" ? st.resultsDisplay : "top3",
    },
  };
}

/** Merge stored page configs over defaults (Quests + Journal page heroes). */
function normalizePages(row: Row | null): PagesConfig {
  const p = (row?.pages ?? {}) as Partial<PagesConfig>;
  const hero = (saved: Partial<PageHero> | undefined, def: PageHero): PageHero => ({
    label: saved?.label ?? def.label,
    heading: saved?.heading ?? def.heading,
    subtitle: saved?.subtitle ?? def.subtitle,
  });
  return {
    quests: hero(p.quests, DEFAULT_PAGES.quests),
    journal: hero(p.journal, DEFAULT_PAGES.journal),
    about: normalizeAbout(p.about),
    partner: normalizePartner(p.partner),
    faq: normalizeFaq(p.faq),
    privacy: normalizeLegal(p.privacy, DEFAULT_PAGES.privacy),
    terms: normalizeLegal(p.terms, DEFAULT_PAGES.terms),
    contact: normalizeContact(p.contact),
    categories: normalizeCategoryHeroes(p.categories),
  };
}

/** Pass through the stored per-category hero overrides (keyed by slug). */
function normalizeCategoryHeroes(saved: unknown): Record<string, CategoryHero> {
  if (!saved || typeof saved !== "object") return {};
  const out: Record<string, CategoryHero> = {};
  for (const [slug, v] of Object.entries(saved as Record<string, unknown>)) {
    const h = (v ?? {}) as Partial<CategoryHero>;
    out[slug] = { label: h.label ?? "", title: h.title ?? "", sub: h.sub ?? "" };
  }
  return out;
}

/** Deep-merge a stored Contact config over the defaults. */
function normalizeContact(saved: unknown): ContactConfig {
  const c = (saved ?? {}) as Partial<ContactConfig>;
  const D = DEFAULT_PAGES.contact;
  return {
    hero: { ...D.hero, ...(c.hero ?? {}) },
    cards: arr(c.cards, D.cards),
    form: { ...D.form, ...(c.form ?? {}) },
  };
}

/** Deep-merge a stored legal-page config over its defaults. The legal editor is
 *  now a single rich-HTML `body` box; configs saved under the old structured
 *  shape (`intro` + `sections[]`) are migrated into `body` here so they still
 *  render and load into the editor without loss. */
function normalizeLegal(saved: unknown, D: LegalPageConfig): LegalPageConfig {
  const l = (saved ?? {}) as Partial<LegalPageConfig> & {
    intro?: string;
    sections?: LegalSectionItem[];
  };
  const savedBody = typeof l.body === "string" ? l.body.trim() : "";
  let body = savedBody;
  if (!body && Array.isArray(l.sections) && l.sections.length) {
    body = legalSectionsToBody(l.intro, l.sections);
  }
  if (!body) body = D.body;
  return {
    hero: { ...D.hero, ...(l.hero ?? {}) },
    body,
    contact: { ...D.contact, ...(l.contact ?? {}) },
  };
}

/** Deep-merge a stored FAQ config over the defaults. */
function normalizeFaq(saved: unknown): FaqPageConfig {
  const f = (saved ?? {}) as Partial<FaqPageConfig>;
  const D = DEFAULT_PAGES.faq;
  return {
    hero: { ...D.hero, ...(f.hero ?? {}) },
    categories: arr(f.categories, D.categories),
    stillBox: { ...D.stillBox, ...(f.stillBox ?? {}) },
  };
}

/** Deep-merge a stored Partner config over the section defaults. */
function normalizePartner(saved: unknown): PartnerConfig {
  const a = (saved ?? {}) as Partial<PartnerConfig>;
  const D = DEFAULT_PAGES.partner;
  return {
    hero: { ...D.hero, ...(a.hero ?? {}) },
    whatWeDo: { ...D.whatWeDo, ...(a.whatWeDo ?? {}), pills: arr(a.whatWeDo?.pills, D.whatWeDo.pills) },
    partnerWith: { ...D.partnerWith, ...(a.partnerWith ?? {}), cards: arr(a.partnerWith?.cards, D.partnerWith.cards) },
    quote: { ...D.quote, ...(a.quote ?? {}) },
    why: { ...D.why, ...(a.why ?? {}), cards: arr(a.why?.cards, D.why.cards) },
    faq: { ...D.faq, ...(a.faq ?? {}), items: arr(a.faq?.items, D.faq.items) },
    form: { ...D.form, ...(a.form ?? {}), offerings: arr(a.form?.offerings, D.form.offerings) },
  };
}

/** Deep-merge a stored About config over the section defaults. */
function normalizeAbout(saved: unknown): AboutConfig {
  const a = (saved ?? {}) as Partial<AboutConfig>;
  const D = DEFAULT_PAGES.about;
  return {
    hero: { ...D.hero, ...(a.hero ?? {}), polaroids: arr(a.hero?.polaroids, D.hero.polaroids) },
    whatWeDo: {
      ...D.whatWeDo,
      ...(a.whatWeDo ?? {}),
      paragraphs: arr(a.whatWeDo?.paragraphs, D.whatWeDo.paragraphs),
      polaroids: arr(a.whatWeDo?.polaroids, D.whatWeDo.polaroids),
    },
    paths: { ...D.paths, ...(a.paths ?? {}), cards: arr(a.paths?.cards, D.paths.cards) },
    who: { ...D.who, ...(a.who ?? {}), cards: arr(a.who?.cards, D.who.cards) },
    map: {
      ...D.map,
      ...(a.map ?? {}),
      cards: arr(a.map?.cards, D.map.cards),
      dots: arr(a.map?.dots, D.map.dots),
    },
    howItWorks: { ...D.howItWorks, ...(a.howItWorks ?? {}), steps: arr(a.howItWorks?.steps, D.howItWorks.steps) },
    why: { ...D.why, ...(a.why ?? {}), items: arr(a.why?.items, D.why.items) },
    cta: { ...D.cta, ...(a.cta ?? {}) },
  };
}

const arr = <T,>(v: unknown, def: T[]): T[] => (Array.isArray(v) ? (v as T[]) : def);

/** Merge a stored (possibly partial) homepage blob over the section defaults, so
 *  any missing section/field falls back to the current home page content. */
function normalizeHomepage(row: Row | null): HomepageConfig {
  const hp = (row?.homepage ?? {}) as Partial<HomepageConfig>;
  const D = DEFAULT_HOMEPAGE;
  const hero = (hp.hero ?? {}) as Partial<HomeHero>;
  const why = (hp.why ?? {}) as Partial<HomeWhy>;
  const wus = (hp.whoUsesUs ?? {}) as Partial<HomeWhoUsesUs>;
  const proof = (hp.socialProof ?? {}) as Partial<HomeSocialProof>;
  const dest = (hp.destination ?? {}) as Partial<HomeReelSection>;
  const goals = (hp.goals ?? {}) as Partial<HomeReelSection>;
  const cmp = (hp.comparePaths ?? {}) as Partial<HomepageConfig["comparePaths"]>;
  return {
    hero: {
      ...D.hero,
      ...hero,
      pills: arr(hero.pills, D.hero.pills),
      cards1: arr(hero.cards1, D.hero.cards1),
      cards2: arr(hero.cards2, D.hero.cards2),
    },
    why: { ...D.why, ...why, cells: arr(why.cells, D.why.cells) },
    whoUsesUs: { ...D.whoUsesUs, ...wus, personas: arr(wus.personas, D.whoUsesUs.personas) },
    popularPrograms: { ...D.popularPrograms, ...(hp.popularPrograms ?? {}) },
    socialProof: { ...D.socialProof, ...proof, cards: arr(proof.cards, D.socialProof.cards) },
    comparePaths: { ...D.comparePaths, ...cmp, cards: arr(cmp.cards, D.comparePaths.cards) },
    destination: { ...D.destination, ...dest, cards: arr(dest.cards, D.destination.cards) },
    goals: { ...D.goals, ...goals, cards: arr(goals.cards, D.goals.cards) },
    journal: { ...D.journal, ...(hp.journal ?? {}) },
  };
}

/** Merge a stored (possibly partial / empty `{}`) row over the defaults. */
function normalize(row: Row | null): SiteSettings {
  const navRow = row?.nav as NavConfig | null;
  const navLinks = navRow?.links;
  const footer = (row?.footer as Partial<FooterConfig> | null) ?? null;
  // Keep saved branding even if no links were customized (links fall to default).
  const nav: NavConfig =
    Array.isArray(navLinks) && navLinks.length ? { links: navLinks } : { ...DEFAULT_NAV };
  if (navRow?.brand) nav.brand = navRow.brand;
  // Merge saved toggles/colours over the built-in defaults so a partial or
  // missing row still yields a complete, safe config.
  nav.cta = { ...DEFAULT_CTA, ...navRow?.cta };
  nav.display = { ...DEFAULT_DISPLAY, ...navRow?.display };
  nav.style = { ...DEFAULT_NAV_STYLE, ...navRow?.style };
  return {
    nav,
    footer: {
      wordmark1: footer?.wordmark1 ?? DEFAULT_FOOTER.wordmark1,
      wordmark2: footer?.wordmark2 ?? DEFAULT_FOOTER.wordmark2,
      tagline: footer?.tagline ?? DEFAULT_FOOTER.tagline,
      socials: Array.isArray(footer?.socials) ? footer!.socials : DEFAULT_FOOTER.socials,
      socialUrls: Array.isArray(footer?.socialUrls) ? footer!.socialUrls : [],
      logoUrl: footer?.logoUrl ?? "",
      columns: Array.isArray(footer?.columns) ? footer!.columns : DEFAULT_FOOTER.columns,
      copyright: footer?.copyright ?? DEFAULT_FOOTER.copyright,
      bottomTagline: footer?.bottomTagline ?? DEFAULT_FOOTER.bottomTagline,
      showSocialBottom: footer?.showSocialBottom ?? false,
      newsletter: { ...DEFAULT_NEWSLETTER, ...footer?.newsletter },
      style: { ...DEFAULT_FOOTER_STYLE, ...footer?.style },
    },
    homepage: normalizeHomepage(row),
    pages: normalizePages(row),
    quiz: normalizeQuiz(row),
    seo: normalizeSeo(row),
    ...normalizeSiteConfig(row),
  };
}

// Optional columns (quiz, seo) may not exist yet if their migration hasn't run.
// Try the fullest select, then progressively drop optional columns so the rest
// of the settings keep working and the missing sections resolve to defaults.
const COLS_FULL = "nav, footer, homepage, pages, quiz, seo, settings";
const COLS_NO_SETTINGS = "nav, footer, homepage, pages, quiz, seo";
const COLS_NO_SEO = "nav, footer, homepage, pages, quiz";
const COLS_LEGACY = "nav, footer, homepage, pages";

type SettingsReader = {
  from: (t: string) => {
    select: (cols: string) => {
      eq: (c: string, v: number) => { maybeSingle: () => Promise<{ data: unknown; error: unknown }> };
    };
  };
};

async function readSettingsRow(sb: SettingsReader): Promise<Row | null> {
  for (const cols of [COLS_FULL, COLS_NO_SETTINGS, COLS_NO_SEO, COLS_LEGACY]) {
    const res = await sb.from("site_settings").select(cols).eq("id", 1).maybeSingle();
    if (!res.error) return (res.data as Row | null) ?? null;
  }
  return null;
}

/** Public (cached) read — used by the front site chrome. */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const sb = createSupabasePublicClient() as unknown as SettingsReader;
    return normalize(await readSettingsRow(sb));
  },
  ["site-settings"],
  // Admin saves invalidate via `revalidateTag(SITE_SETTINGS_TAG)` for an instant
  // refresh; this short fallback bounds staleness to ~60s if that ever misses
  // (e.g. a direct DB edit), instead of the previous up-to-an-hour delay.
  { revalidate: 60, tags: [SITE_SETTINGS_TAG] }
);

/** Admin (uncached) read — used to populate the editor. */
export async function adminGetSiteSettings(): Promise<SiteSettings> {
  const sb = (await createSupabaseServerClient()) as unknown as SettingsReader;
  return normalize(await readSettingsRow(sb));
}
