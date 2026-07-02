/**
 * Full homepage CMS model + defaults. Every front section reads its copy (and,
 * where the content is static rather than DB-driven, its cards) from here, so an
 * admin can edit each section. Defaults reproduce the current home page exactly
 * — the card arrays are the same objects used by `HomePage` today — so the page
 * is byte-identical until an admin saves an override.
 *
 * Journal + Popular Programs only expose title/subtitle/button: their cards are
 * dynamic (published quests / journal posts).
 */
import {
  whyCells,
  personas,
  proofCards,
  destinationReel,
  goalsReel,
  type WhyCell,
  type Persona,
  type ProofCard,
  type ReelCard,
} from "./home";
import { DEFAULT_HOME_HERO, type HomeHero } from "../chromeConfig";

export type { WhyCell, Persona, ProofCard, ReelCard };

export interface HomeWhy {
  heading: string;
  cells: WhyCell[];
}
export interface HomeWhoUsesUs {
  title: string;
  subtitle: string;
  personas: Persona[];
}
export interface HomePopularPrograms {
  label: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
}
export interface HomeSocialProof {
  title: string;
  subtitle: string;
  cards: ProofCard[];
  /** When true, the testimonial/social-proof section is hidden on the homepage. */
  hide?: boolean;
}
/** A selectable card in the interactive "Compare paths" section (mirrors the
 *  front runtime's `sqComparePaths` shape so it can drive the live grid). */
export interface ComparePathCard {
  id: string;
  icon: string;
  tag: string;
  name: string;
  mini: string;
  score: string;
  cost: string;
  time: string;
  income: string;
  risk: string;
  difficulty: string;
  bestFor: string;
  firstStep: string;
  note: string;
}

export interface HomeComparePaths {
  kicker: string;
  title: string;
  copy: string;
  clearLabel: string;
  quizLabel: string;
  cards: ComparePathCard[];
}
export interface HomeReelSection {
  title: string;
  buttonLabel: string;
  cards: ReelCard[];
}
export interface HomeJournalSection {
  title: string;
  buttonLabel: string;
}

export interface HomepageConfig {
  hero: HomeHero;
  why: HomeWhy;
  whoUsesUs: HomeWhoUsesUs;
  popularPrograms: HomePopularPrograms;
  socialProof: HomeSocialProof;
  comparePaths: HomeComparePaths;
  destination: HomeReelSection;
  goals: HomeReelSection;
  journal: HomeJournalSection;
}

export const DEFAULT_HOMEPAGE: HomepageConfig = {
  hero: DEFAULT_HOME_HERO,
  why: { heading: "Stop researching. Start doing.", cells: whyCells },
  whoUsesUs: {
    title: "Who Uses Us",
    subtitle: "Real people. Real journeys. Different chapters.",
    personas,
  },
  popularPrograms: {
    label: "Popular Programs",
    title: "Popular Programs",
    subtitle:
      "Placements, certifications, and experiences you can actually join — curated to each quest.",
    buttonLabel: "Browse all quests",
  },
  socialProof: {
    title: "Real quests. Real chapters.",
    subtitle: "People who stopped waiting and actually went. Here's what happened.",
    cards: proofCards,
  },
  comparePaths: {
    kicker: "Compare paths",
    title: "Pick up to 3 routes.",
    copy: "See the trade-offs before choosing a quest: cost, time, risk, income potential, lifestyle fit, and what the first step looks like.",
    clearLabel: "Clear comparison",
    quizLabel: "Find a better fit",
    cards: [
      { id: "work-abroad", icon: "🏕️", tag: "Work + Travel", name: "Work Abroad", mini: "Earn while exploring a new country.", score: "High adventure", cost: "$800–$3,000 setup", time: "1–6 months", income: "$$", risk: "Medium", difficulty: "Moderate", bestFor: "Adventure + income", firstStep: "Pick a country and check visa/season timing.", note: "Best when the goal is a real-life reset, not a desk-job substitute." },
      { id: "bootcamp", icon: "💻", tag: "Career Reset", name: "Career Bootcamp", mini: "Build a marketable skill with a clearer job outcome.", score: "Most structured", cost: "$500–$8,000", time: "8–24 weeks", income: "$$$", risk: "Medium-low", difficulty: "Hard", bestFor: "Stable pivot", firstStep: "Choose one skill track and audit beginner lessons.", note: "Best when the priority is employability, structure, and a practical portfolio." },
      { id: "gap-year", icon: "🌍", tag: "Life Reset", name: "Gap Year", mini: "Create breathing room without drifting aimlessly.", score: "Most spacious", cost: "$2,000–$10,000", time: "3–12 months", income: "$", risk: "Medium-high", difficulty: "Easy to start", bestFor: "Clarity + exploration", firstStep: "Set a runway, theme, and return date.", note: "Best when there is enough runway and the goal is clarity, not immediate income." },
      { id: "business", icon: "🚀", tag: "High Upside", name: "Start a Business", mini: "Test a small offer before building a whole company.", score: "Highest upside", cost: "$100–$2,000 test", time: "30–90 day validation", income: "$$$$", risk: "High", difficulty: "Hard", bestFor: "Self-starters", firstStep: "Pick one painful problem and sell a tiny version.", note: "Best when uncertainty is tolerable and the first milestone is revenue, not branding." },
      { id: "freelance", icon: "🧰", tag: "Independence", name: "Freelance", mini: "Turn one skill into paid client work.", score: "Fastest cash path", cost: "$50–$500", time: "2–8 weeks", income: "$$$", risk: "Medium", difficulty: "Moderate-hard", bestFor: "Fast income + flexibility", firstStep: "Package one service and pitch 20 leads.", note: "Best when there is already a sellable skill or the person can learn fast." },
      { id: "relocate", icon: "🏠", tag: "Fresh Start", name: "Move Abroad", mini: "Build a new life chapter in a different city.", score: "Big lifestyle shift", cost: "$2,500–$12,000", time: "1–6 months planning", income: "Depends", risk: "Medium-high", difficulty: "Moderate", bestFor: "Lifestyle change", firstStep: "Shortlist cities by visa, cost, safety, and work setup.", note: "Best when the goal is environment change and the practical setup is planned first." },
    ],
  },
  destination: { title: "Explore by Destination", buttonLabel: "All quests", cards: destinationReel },
  goals: { title: "Explore by Goals", buttonLabel: "All quests", cards: goalsReel },
  journal: { title: "The Journal", buttonLabel: "All posts" },
};
