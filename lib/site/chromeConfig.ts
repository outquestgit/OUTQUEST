/**
 * Client-safe types + defaults for the editable site chrome (top nav + footer).
 *
 * This module has NO server-only imports, so it can be pulled into client
 * components (`<Nav>`, `<Footer>`, …) and the admin bridges. The server-side
 * data fetchers live in `lib/siteSettings.ts`, which re-uses these types.
 */

// The full homepage CMS model lives in ./data/homepage (it references the
// section content types); imported type-only here to avoid a runtime cycle.
import { PageSeoData } from "../types";
import type { HomepageConfig } from "./data/homepage";
export type { HomepageConfig };

// ── Nav ─────────────────────────────────────────────────────────────────────
export interface NavChild {
  label: string;
  url: string;
}
export interface NavLinkItem {
  label: string;
  url: string;
  target?: "_self" | "_blank";
  /** When present + non-empty, this top-level item renders as a hover dropdown. */
  dropdown?: NavChild[];
}
/**
 * Optional custom branding for the top nav. Every field empty (the default) means
 * the public nav keeps rendering its built-in compass-glyph + "GetSetGo*" wordmark.
 */
export interface NavBrand {
  /** Uploaded logo image URL. When set, replaces the wordmark glyph in the nav. */
  logoUrl: string;
  /** Accessible alt text for the logo image. */
  logoAlt: string;
  /** Where clicking the logo routes. Empty / "/" keeps the default (home). */
  logoLink: string;
  /** Uploaded favicon URL (wired into the document <head> via root metadata). */
  faviconUrl: string;
}
/**
 * Right-side CTA button. Defaults reproduce the built-in "Find My Path" button,
 * which opens the quiz when no URL is set.
 */
export interface NavCta {
  label: string;
  /** When empty, the button keeps the built-in behaviour (opens the quiz). */
  url: string;
  style: "primary" | "ghost";
  show: boolean;
}
/** Nav behaviour toggles. */
export interface NavDisplay {
  /** `position: sticky` on scroll (default). When off, the nav scrolls away. */
  sticky: boolean;
  /** When off, the nav (and mobile menu) are not rendered at all. */
  showOnAllPages: boolean;
  /** Transparent nav bar at the top of the page; turns solid once scrolled. */
  transparentOnHero: boolean;
}
/** Nav colour overrides. Empty colour strings keep the stylesheet defaults. */
export interface NavStyle {
  bgColor: string;
  textColor: string;
  showBorder: boolean;
}
export interface NavConfig {
  links: NavLinkItem[];
  brand?: NavBrand;
  cta?: NavCta;
  display?: NavDisplay;
  style?: NavStyle;
}

// ── Footer ──────────────────────────────────────────────────────────────────
export interface FooterLinkItem {
  label: string;
  url: string;
}
export interface FooterColumnItem {
  label: string;
  links: FooterLinkItem[];
}
/** The newsletter strip rendered above the footer sitewide. */
export interface FooterNewsletter {
  show: boolean;
  eyebrow: string;
  heading: string;
  subtext: string;
  emailPlaceholder: string;
  buttonLabel: string;
  disclaimer: string;
}
/** Footer colour + layout overrides. Empty colours keep the stylesheet defaults. */
export interface FooterStyle {
  bgColor: string;
  textColor: string;
  layout: "4col" | "3col" | "2col" | "centered";
}
export interface FooterConfig {
  wordmark1: string;
  wordmark2: string;
  tagline: string;
  /** Social glyphs shown in the brand block. */
  socials: string[];
  /** Optional link target per social glyph (parallel to `socials`). */
  socialUrls?: string[];
  /** Optional uploaded image that replaces the text wordmark. */
  logoUrl?: string;
  columns: FooterColumnItem[];
  copyright: string;
  bottomTagline: string;
  /** Repeat the social icons in the bottom bar. */
  showSocialBottom?: boolean;
  newsletter?: FooterNewsletter;
  style?: FooterStyle;
}

/** A "Explore by goal" pill under the hero CTAs. `link` is an SPA page id,
 *  optionally with `?outcome=<value>` to pre-apply an outcome filter. */
export interface HeroPill {
  label: string;
  link: string;
}

/** A card in the hero's auto-scrolling right panel. `cp` is a palette class
 *  (cp1–cp9); `link` is the SPA page id the card opens. */
export interface HeroCard {
  cp: string;
  icon: string;
  title: string;
  desc: string;
  link: string;
  /** Optional uploaded image URL. When set, a banner image replaces the emoji
   *  icon at the top of the card. */
  image?: string;
}

/** Editable Hero block of the home page (admin Pages-CMS → Homepage → Hero). */
export interface HomeHero {
  /** First part of the H1, before the italic emphasis. */
  h1Main: string;
  /** The italic emphasis word(s) in the H1. */
  h1Em: string;
  /** Sub-headline below the H1. */
  tagline: string;
  /** Primary CTA button label (action stays "Find My Quest" → quiz). */
  primaryCtaLabel: string;
  /** Secondary CTA button label (action stays → Quests page). */
  secondaryCtaLabel: string;
  /** "Explore by goal" pills. */
  pills: HeroPill[];
  /** Right panel — column 1 cards (scrolls up). */
  cards1: HeroCard[];
  /** Right panel — column 2 cards (scrolls down). */
  cards2: HeroCard[];
}

export interface SiteSettings {
  nav: NavConfig;
  footer: FooterConfig;
  homepage: HomepageConfig;
  pages: import("./data/pages").PagesConfig;
  quiz: import("./data/quiz").QuizConfig;
  seo: import("./data/seoDefaults").SeoDefaults;
  /** General site identity (Settings → General). */
  general: import("./data/siteConfig").SiteGeneral;
  /** Front-end modal/drawer copy (Settings → Global Copy). */
  globalCopy: import("./data/siteConfig").GlobalCopy;
  page_seo?: Record<string, PageSeoData>;
}

/**
 * Defaults reproduce the site's pre-CMS nav + footer exactly, so the public site
 * is byte-identical until an admin edits it (and a safety net if the DB row or a
 * field is ever missing).
 */
/** Built-in CTA — "Find My Path" opening the quiz (empty URL = quiz). */
export const DEFAULT_CTA: NavCta = {
  label: "Find My Path",
  url: "",
  style: "primary",
  show: true,
};

/** Built-in display behaviour — sticky, visible everywhere, opaque bar. */
export const DEFAULT_DISPLAY: NavDisplay = {
  sticky: true,
  showOnAllPages: true,
  transparentOnHero: false,
};

/** Built-in nav style — stylesheet defaults (empty colours), border on. */
export const DEFAULT_NAV_STYLE: NavStyle = {
  bgColor: "",
  textColor: "",
  showBorder: true,
};

/** Empty branding — the public nav falls back to its built-in wordmark glyph. */
export const DEFAULT_BRAND: NavBrand = {
  logoUrl: "",
  logoAlt: "",
  logoLink: "",
  faviconUrl: "",
};

export const DEFAULT_NAV: NavConfig = {
  links: [
    {
      label: "Quests",
      url: "/quests",
      target: "_self",
      dropdown: [
        { label: "All Quests", url: "/quests" },
        { label: "Work Abroad", url: "/work-abroad" },
        { label: "Move Abroad", url: "/relocate-abroad" },
        { label: "Get Certified", url: "/earn-skill" },
        { label: "Start a Side Hustle", url: "/side-hustle" },
        { label: "Start a Business", url: "/start-business" },
        { label: "Level Up", url: "/level-income" },
      ],
    },
    {
      label: "Resources",
      url: "/journal",
      target: "_self",
      dropdown: [
        { label: "Journal", url: "/journal" },
        { label: "FAQ", url: "/faq" },
      ],
    },
    {
      label: "Company",
      url: "/about",
      target: "_self",
      dropdown: [
        { label: "About", url: "/about" },
        { label: "Partner With Us", url: "/partner" },
        { label: "Contact", url: "/contact" },
      ],
    },
  ],
};

/** Built-in newsletter strip — matches the original hardcoded markup. */
export const DEFAULT_NEWSLETTER: FooterNewsletter = {
  show: true,
  eyebrow: "The OutQuest Dispatch",
  heading: "New quests. New directions. No noise.",
  subtext:
    "Monthly drops — quest releases, real stories, and early access for people actually on the move.",
  emailPlaceholder: "Your email address",
  buttonLabel: "Subscribe",
  disclaimer: "No spam. Unsubscribe any time.",
};

/** Built-in footer style — stylesheet defaults (empty colours), 4-column grid. */
export const DEFAULT_FOOTER_STYLE: FooterStyle = {
  bgColor: "",
  textColor: "",
  layout: "4col",
};

export const DEFAULT_FOOTER: FooterConfig = {
  wordmark1: "Out",
  wordmark2: "Quest",
  tagline: "Short-term immersive experiences that help you explore a new direction.",
  socials: ["📷", "♪", "✕", "in", "S"],
  socialUrls: [],
  logoUrl: "",
  showSocialBottom: false,
  newsletter: DEFAULT_NEWSLETTER,
  style: DEFAULT_FOOTER_STYLE,
  columns: [
    {
      label: "Platform",
      links: [
        { label: "Explore Quests", url: "/quests" },
        { label: "Work Abroad", url: "/work-abroad" },
        { label: "Partner With Us", url: "/partner" },
      ],
    },
    {
      label: "Goals",
      links: [
        { label: "Move Abroad", url: "/relocate-abroad" },
        { label: "Get Certified", url: "/earn-skill" },
        { label: "Start a Business", url: "/start-business" },
      ],
    },
    {
      label: "More Goals",
      links: [
        { label: "Start a Side Hustle", url: "/side-hustle" },
        { label: "Level Up (Upskill)", url: "/level-income" },
        { label: "About", url: "/about" },
      ],
    },
    {
      label: "Legal",
      links: [
        { label: "Terms of Service", url: "/tos" },
        { label: "Privacy Policy", url: "/privacy" },
      ],
    },
  ],
  copyright: "© {year} OutQuest. All rights reserved.",
  bottomTagline: "Built for people who want more.",
};

/** Default Hero — the home page's pre-CMS values, so the front is byte-identical
 *  until an admin edits the Homepage → Hero form. */
export const DEFAULT_HOME_HERO: HomeHero = {
  h1Main: "Main quest got you stuck? Try a",
  h1Em: "side quest.",
  tagline: "Your GPS for programs, opportunities and paths for the unconventional.",
  primaryCtaLabel: "Find My Quest",
  secondaryCtaLabel: "Discover Quests",
  pills: [
    { label: "Work Abroad", link: "work-abroad" },
    { label: "Move Abroad", link: "relocate-abroad" },
    { label: "Get Certified", link: "earn-skill" },
    { label: "Start a Side Hustle", link: "side-hustle" },
    { label: "Start a Business", link: "start-business" },
    { label: "Level Up", link: "level-income" },
  ],
  cards1: [
    { cp: "cp1", icon: "✈️", title: "Work Abroad", desc: "Paid, seasonal, and experience-led ways to work somewhere new.", link: "work-abroad" },
    { cp: "cp3", icon: "🌍", title: "Move Abroad", desc: "Choose a country, understand the setup, and make the move.", link: "relocate-abroad" },
    { cp: "cp2", icon: "🎓", title: "Get Certified", desc: "Turn a learnable skill into paid work with training and proof.", link: "earn-skill" },
    { cp: "cp6", icon: "🌱", title: "Start a Side Hustle", desc: "Low-commitment income paths you can test before going all in.", link: "side-hustle" },
    { cp: "cp4", icon: "🏗️", title: "Start a Business", desc: "Pick a route, compare what it takes, start the smallest version.", link: "start-business" },
    { cp: "cp9", icon: "📈", title: "Level Up", desc: "Better skills, higher-value offers, and stronger career leverage.", link: "level-income" },
  ],
  cards2: [
    { cp: "cp4", icon: "🏗️", title: "Start a Business", desc: "Pick a route, compare what it takes, start the smallest version.", link: "start-business" },
    { cp: "cp9", icon: "📈", title: "Level Up", desc: "Better skills, higher-value offers, and stronger career leverage.", link: "level-income" },
    { cp: "cp1", icon: "✈️", title: "Work Abroad", desc: "Paid, seasonal, and experience-led ways to work somewhere new.", link: "work-abroad" },
    { cp: "cp3", icon: "🌍", title: "Move Abroad", desc: "Choose a country, understand the setup, and make the move.", link: "relocate-abroad" },
    { cp: "cp2", icon: "🎓", title: "Get Certified", desc: "Turn a learnable skill into paid work with training and proof.", link: "earn-skill" },
    { cp: "cp6", icon: "🌱", title: "Start a Side Hustle", desc: "Low-commitment income paths you can test before going all in.", link: "side-hustle" },
  ],
};

