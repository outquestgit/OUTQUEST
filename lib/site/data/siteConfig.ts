/**
 * Public site config edited from the admin "Settings" page (General + Global
 * Copy). Stored in `site_settings.settings` and read by the front site, so it
 * must contain only non-secret, publicly-displayable values. Private settings
 * (email alerts, session timeout) live in `admin_config` — see lib/adminConfig.
 */

/** General settings — site identity. */
export interface SiteGeneral {
  siteName: string;
  siteUrl: string;
  timezone: string;
}

/** Editable copy for the front-end modals / drawers (applied by front.js). */
export interface GlobalCopy {
  /** Quest lead-capture modal — fallback heading/subtext when a quest has none. */
  questModalHeading: string;
  questModalSubtext: string;
  /** "My Quests" drawer empty state. */
  mqEmptyHeading: string;
  mqEmptyBody: string;
  mqEmptyCta: string;
  mqFooter: string;
  /** Compare Paths modal. */
  compareHeading: string;
  compareSubtext: string;
}

export interface SiteConfig {
  general: SiteGeneral;
  globalCopy: GlobalCopy;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  general: {
    siteName: "OutQuest",
    siteUrl: "https://joinoutquest.com",
    timezone: "Asia/Kuala_Lumpur",
  },
  globalCopy: {
    questModalHeading: "Start your quest",
    questModalSubtext:
      "Tell us a bit about yourself and we'll send you everything you need.",
    mqEmptyHeading: "No quests saved yet",
    mqEmptyBody:
      "Hit the bookmark icon on any quest to save it here. Track what you're exploring, committed to, or already done.",
    mqEmptyCta: "Browse quests",
    mqFooter: "Saved on this browser — drop your email on any quest to keep them.",
    compareHeading: "Compare your paths",
    compareSubtext:
      "See cost, time, income, risk, difficulty, and first step side by side.",
  },
};
