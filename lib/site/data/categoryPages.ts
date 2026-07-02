import type { SlimQuest } from "@/components/site/cards/SlimQCard";

/**
 * Content for the six "directory"-style category pages. They share one layout
 * (`<CategoryPage>`) and the `categoryFilterGroups` sidebar; only this header
 * copy and the quest cards differ. Their cards emit the short dataset
 * (`best`/`commitment`/`budget`/`format`) the runtime normalises into filters.
 */
export interface CategoryPageData {
  id: string;
  /** Breadcrumb "current" label (sometimes shorter than `label`). */
  current: string;
  label: string;
  /** `<h1>` text including its trailing emoji where present. */
  title: string;
  sub: string;
  /** Literal "Showing all N quests" count from the source (some pages hard-code
   *  a number that differs from the card count). Defaults to the card count. */
  count?: number;
  quests: SlimQuest[];
}

export const categoryPages: CategoryPageData[] = [
  {
    id: "work-abroad",
    current: "Work Abroad",
    label: "Work Abroad",
    title: "Work Abroad ✈️",
    sub: "Find paid, seasonal, and experience-led ways to work somewhere new — without treating it like a random gap year.",
    quests: [
      { data: { best: "seasonal", commitment: "program", budget: "mid", format: "inperson" }, listing: "japan", gradient: "linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)", art: "🏔️", badge: "Seasonal", title: "Work a ski season in Japan", meta: "3–5 months · Hokkaido" },
      { data: { best: "outdoors", commitment: "program", budget: "lean", format: "inperson" }, listing: "bali", gradient: "linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)", art: "🏄", badge: "Skill + Work", title: "Live as a surf instructor in Bali", meta: "1–6 months · Bali" },
      { data: { best: "seasonal", commitment: "quick", budget: "mid", format: "inperson" }, listing: "france", gradient: "linear-gradient(170deg,#2A0A1A,#7A1A3A,#E050A0)", art: "🍷", badge: "Harvest", title: "Grape harvest in France", meta: "6–8 weeks · Bordeaux" },
      { data: { best: "flexible", commitment: "quick", budget: "lean", format: "hybrid" }, listing: "housesit", gradient: "linear-gradient(170deg,#0A2A10,#1A6A2A,#60C060)", art: "🏠", badge: "Exchange", title: "Full-time house sitting", meta: "Ongoing · Worldwide" },
    ],
  },
  {
    id: "relocate-abroad",
    current: "Move Abroad",
    label: "Move Abroad",
    title: "Move Abroad 🌍",
    sub: "Choose a country, understand the setup, and compare realistic relocation paths with visas, housing, budget, and community in mind.",
    quests: [
      { data: { best: "lowcost", commitment: "serious", budget: "lean", format: "hybrid" }, listing: "bangkok", gradient: "linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)", art: "🏙️", badge: "Starter", title: "Move to Bangkok", meta: "Long-term · Thailand" },
      { data: { best: "europe", commitment: "serious", budget: "high", format: "hybrid" }, listing: "lisbon", gradient: "linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)", art: "🏛️", badge: "Nomad Hub", title: "Move to Lisbon", meta: "Long-term · Portugal" },
      { data: { best: "lowcost", commitment: "serious", budget: "mid", format: "hybrid" }, listing: "medellin", gradient: "linear-gradient(170deg,#0A2A10,#1A6A2A,#60C060)", art: "🌺", badge: "Warm Base", title: "Move to Medellín", meta: "Long-term · Colombia" },
      { data: { best: "lowcost", commitment: "quick", budget: "lean", format: "hybrid" }, listing: "housesit", gradient: "linear-gradient(170deg,#0A2A10,#1A6A2A,#60C060)", art: "🏠", badge: "Low Cost", title: "House sit your way around the world", meta: "Ongoing · Worldwide" },
    ],
  },
  {
    id: "earn-skill",
    current: "Get Certified",
    label: "Get Certified",
    title: "Get Certified 💸",
    sub: "Turn a learnable skill into paid work. These paths focus on training, proof, portfolio, and first income — not vague motivation.",
    quests: [
      { data: { best: "digital", commitment: "program", budget: "lean", format: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#1A0A3A,#4A1A8A,#A060F0)", art: "💻", badge: "90-Day Path", title: "Go freelance in 90 days", meta: "12 weeks · Remote" },
      { data: { best: "hands-on", commitment: "program", budget: "mid", format: "inperson" }, listing: "bali", gradient: "linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)", art: "🏄", badge: "Certification", title: "Train as a surf instructor", meta: "1–6 months · Bali" },
      { data: { best: "hands-on", commitment: "program", budget: "mid", format: "inperson" }, listing: "japan", gradient: "linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)", art: "⛷️", badge: "Seasonal Skill", title: "Learn resort operations abroad", meta: "3–5 months · Japan" },
      { data: { best: "digital", commitment: "quick", budget: "lean", format: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#0A2A1A,#1A6A3A,#50C080)", art: "📈", badge: "Portfolio", title: "Build your first paid skill stack", meta: "8–12 weeks · Online" },
    ],
  },
  {
    id: "side-hustle",
    current: "Start a Side Hustle",
    label: "Start a Side Hustle",
    title: "Start a Side Hustle 🌱",
    sub: "Explore low-commitment income paths you can test before you quit anything, spend big, or go all in.",
    quests: [
      { data: { best: "service", commitment: "quick", budget: "lean", format: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#1A0A3A,#4A1A8A,#A060F0)", art: "💻", badge: "Service Hustle", title: "Freelance your existing skill", meta: "12 weeks · Remote" },
      { data: { best: "travel", commitment: "quick", budget: "lean", format: "hybrid" }, listing: "housesit", gradient: "linear-gradient(170deg,#0A2A10,#1A6A2A,#60C060)", art: "🏠", badge: "Travel Hack", title: "House sitting as a lifestyle side path", meta: "Ongoing · Worldwide" },
      { data: { best: "experience", commitment: "program", budget: "mid", format: "inperson" }, listing: "bali", gradient: "linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)", art: "🏄", badge: "Experience", title: "Teach surf on the side", meta: "1–6 months · Bali" },
      { data: { best: "service", commitment: "quick", budget: "lean", format: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#2A1A0A,#7A4A0A,#D08020)", art: "🎯", badge: "First Client", title: "Package one offer and pitch it", meta: "4–8 weeks · Online" },
    ],
  },
  {
    id: "start-business",
    current: "Start a Business",
    label: "Start a Business",
    title: "Start a Business",
    sub: "Choose a clear business route, compare what it takes, then start with the smallest version you can validate — no fantasy entrepreneurship, no vague advice.",
    quests: [
      { data: { best: "solo", commitment: "program", budget: "lean", format: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#1A0A3A,#4A1A8A,#A060F0)", art: "💻", badge: "Solo Business", title: "Start a freelance studio", meta: "12 weeks · Remote" },
      { data: { best: "base", commitment: "serious", budget: "lean", format: "hybrid" }, listing: "bangkok", gradient: "linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)", art: "🏙️", badge: "Local Base", title: "Explore a low-cost launch base", meta: "Long-term · Thailand" },
      { data: { best: "base", commitment: "serious", budget: "high", format: "hybrid" }, listing: "lisbon", gradient: "linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)", art: "🏛️", badge: "EU Base", title: "Build from a European nomad hub", meta: "Long-term · Portugal" },
      { data: { best: "solo", commitment: "quick", budget: "lean", format: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#2A2418,#6B4A23,#D09A42)", art: "📦", badge: "Productized", title: "Package a skill into an offer", meta: "8–12 weeks · Online" },
    ],
  },
  {
    id: "level-income",
    current: "Level Up",
    label: "Level Up (Upskill)",
    title: "Level Up (Upskill) 📈",
    sub: "For people who already have a path but want more earning power: better skills, higher-value offers, remote income, and stronger career leverage.",
    quests: [
      { data: { best: "rates", commitment: "program", budget: "lean", format: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#1A0A3A,#4A1A8A,#A060F0)", art: "💻", badge: "Raise Rates", title: "Go freelance in 90 days", meta: "12 weeks · Remote" },
      { data: { best: "costs", commitment: "serious", budget: "lean", format: "hybrid" }, listing: "bangkok", gradient: "linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)", art: "🏙️", badge: "Lower Costs", title: "Move somewhere your income stretches", meta: "Long-term · Thailand" },
      { data: { best: "network", commitment: "serious", budget: "high", format: "hybrid" }, listing: "lisbon", gradient: "linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)", art: "🏛️", badge: "Network", title: "Build from a global hub", meta: "Long-term · Portugal" },
      { data: { best: "rates", commitment: "quick", budget: "lean", format: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#2A0A3A,#6A1A8A,#C460E8)", art: "📈", badge: "New Offer", title: "Create a higher-value service offer", meta: "8–12 weeks · Online" },
    ],
  },
];
