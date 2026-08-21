/**
 * The "Find My Path" quiz — admin-editable model that mirrors the Quiz Builder
 * (`admin.js` `QB`): an intro screen and a list of questions whose answer options
 * each apply a **taxonomy filter** (activity/type = `category`, or `budget`). The
 * front quiz (`<QuizModal>` + `front.js`) renders from this config and shows the
 * top-3 matching Quests; the builder loads/saves it. Defaults below reproduce the
 * builder's seed questions so the quiz is populated until an admin saves.
 */

/** The taxonomy an answer option can filter the matched quests by. */
export type QuizFilterKind = "category" | "budget" | "duration" | "";

/** One answer option. Each answer applies a single taxonomy filter — a
 *  `filterKind` (Category / Budget / Duration) plus the chosen term `filterSlug`.
 *  The filters from all the answers a visitor picks are matched with AND. */
export interface QuizBuilderOption {
  icon: string;
  label: string;
  /** Optional supporting line shown under the answer label (`.quiz-opt-desc`). */
  subtext?: string;
  /** Which taxonomy this answer filters by; empty = no filter. */
  filterKind?: QuizFilterKind;
  /** The chosen term slug within `filterKind`. */
  filterSlug?: string;
  /** @deprecated Legacy two-filter fields (Category + Budget). Migrated to
   *  `filterKind` / `filterSlug` on read; no longer written. */
  categorySlug?: string;
  budgetSlug?: string;
}

/** Resolve an option's single taxonomy filter, migrating the legacy two-filter
 *  (`categorySlug` / `budgetSlug`) fields — Category wins if both legacy slugs
 *  are set. Shared by the front quiz (`<QuizOption>`) and result matching. */
export function resolveQuizOptionFilter(o: QuizBuilderOption): { kind: QuizFilterKind; slug: string } {
  if (o.filterKind && o.filterSlug) return { kind: o.filterKind, slug: o.filterSlug };
  if (o.categorySlug) return { kind: "category", slug: o.categorySlug };
  if (o.budgetSlug) return { kind: "budget", slug: o.budgetSlug };
  return { kind: "", slug: "" };
}

export interface QuizBuilderQuestion {
  text: string;
  /** Hidden questions are skipped on the front quiz. */
  show: boolean;
  options: QuizBuilderOption[];
}

export interface QuizIntro {
  show: boolean;
  headline: string;
  subline: string;
  startCta: string;
  slug: string;
}

export type QuizStatus = "draft" | "published";
export type QuizProgression = "one" | "all" | "snap";
export type QuizResultsDisplay = "top" | "top3" | "all";

export interface QuizSettings {
  /** Draft hides the live quiz (the CTA buttons no-op); published shows it. */
  status: QuizStatus;
  showOnHomepage: boolean;
  showOnQuests: boolean;
  progression: QuizProgression;
  resultsDisplay: QuizResultsDisplay;
}

export interface QuizConfig {
  intro: QuizIntro;
  questions: QuizBuilderQuestion[];
  settings: QuizSettings;
}

/** Default intro — matches the builder's seed (`qbInit`). */
export const DEFAULT_QUIZ_INTRO: QuizIntro = {
  show: true,
  headline: "Find Your Quest",
  subline: "Answer 4 quick questions to find your path.",
  startCta: "Begin",
  slug: "quiz",
};

/** Default questions — the builder's seed (`qbInit`), kept verbatim. */
export const DEFAULT_QUIZ_QUESTIONS: QuizBuilderQuestion[] = [
  {
    text: "What best describes where you are right now?",
    show: true,
    options: [
      { icon: "🔥", label: "Burnt out and need a reset" },
      { icon: "🚀", label: "Ready for a new challenge" },
      { icon: "🤔", label: "Searching for direction" },
      { icon: "💼", label: "Looking to pivot my career" },
    ],
  },
  {
    text: "How long do you see yourself away?",
    show: true,
    options: [
      { icon: "⚡", label: "A few weeks" },
      { icon: "🌙", label: "1–3 months" },
      { icon: "🌍", label: "6+ months" },
      { icon: "♾", label: "Indefinitely — open to staying" },
    ],
  },
  {
    text: "What matters most to you?",
    show: true,
    options: [
      { icon: "🌿", label: "Nature & slow living" },
      { icon: "🧠", label: "Learning & skills" },
      { icon: "🤝", label: "Community & belonging" },
      { icon: "⛰", label: "Physical challenge" },
    ],
  },
];

export const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  status: "published",
  showOnHomepage: true,
  showOnQuests: true,
  progression: "one",
  resultsDisplay: "top3",
};

export const DEFAULT_QUIZ: QuizConfig = {
  intro: DEFAULT_QUIZ_INTRO,
  questions: DEFAULT_QUIZ_QUESTIONS,
  settings: DEFAULT_QUIZ_SETTINGS,
};

export const QUIZ_PROGRESSIONS: QuizProgression[] = ["one", "all", "snap"];
export const QUIZ_RESULTS_DISPLAYS: QuizResultsDisplay[] = ["top", "top3", "all"];
