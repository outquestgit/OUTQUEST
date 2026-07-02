import type { CategoryPageData } from "./categoryPages";

/**
 * The three "goal"-style category pages (Move Abroad / Try a New Life / Level
 * Up). Same `<CategoryPage>` layout but with `altCategoryFilterGroups` and
 * cards that emit the full resolved dataset (difficulty/direction/level/…).
 * `abroad` hard-codes a count of 3 in the source despite showing four cards.
 */
export const altCategoryPages: CategoryPageData[] = [
  {
    id: "abroad",
    current: "Move Abroad",
    label: "Move Abroad",
    title: "Move Abroad 🌍",
    sub: "Pack a bag and change your life. Whether it's Bangkok, Lisbon, or Medellín — we'll walk you through every step from visa to apartment to co-working space.",
    count: 3,
    quests: [
      { data: { difficulty: "easy", budget: "lean", duration: "long", location: "asia", direction: "abroad", level: "starter", commitment: "fullsend", delivery: "inperson" }, listing: "bangkok", gradient: "linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)", art: "🏙️", badge: "Starter Quest", title: "Move to Bangkok", meta: "Long-term · Thailand" },
      { data: { difficulty: "moderate", budget: "comfortable", duration: "long", location: "europe", direction: "abroad", level: "boss", commitment: "fullsend", delivery: "inperson" }, listing: "lisbon", gradient: "linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)", art: "🏛️", badge: "Boss Quest", title: "Move to Lisbon", meta: "Long-term · Portugal" },
      { data: { difficulty: "moderate", budget: "comfortable", duration: "long", location: "latam", direction: "abroad", level: "epic", commitment: "fullsend", delivery: "inperson" }, listing: "medellin", gradient: "linear-gradient(170deg,#0A2A10,#1A6A2A,#50C070)", art: "🌺", badge: "Epic Quest", title: "Move to Medellín", meta: "Long-term · Colombia" },
      { data: { difficulty: "easy", budget: "lean", duration: "ongoing", location: "remote", direction: "abroad", level: "starter", commitment: "dip", delivery: "remotefriendly" }, listing: "housesit", gradient: "linear-gradient(170deg,#0A2A10,#1A6A2A,#60C060)", art: "🏠", badge: "Starter Quest", title: "Full-time house sitting", meta: "Ongoing · Worldwide" },
    ],
  },
  {
    id: "life",
    current: "Try a New Life",
    label: "Try a New Life",
    title: "Try a New Life",
    sub: "Immerse yourself in a completely different life for a few weeks or months. Seasonal jobs, lifestyle experiments, and experiences that rewrite who you think you are.",
    quests: [
      { data: { difficulty: "hard", budget: "comfortable", duration: "medium", location: "asia", direction: "newlife", level: "epic", commitment: "seasonal", delivery: "inperson" }, listing: "japan", gradient: "linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)", art: "🏔️", badge: "Epic Quest", title: "Work a ski season in Japan", meta: "3–5 months · Hokkaido" },
      { data: { difficulty: "moderate", budget: "lean", duration: "medium", location: "asia", direction: "newlife", level: "boss", commitment: "seasonal", delivery: "inperson" }, listing: "bali", gradient: "linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)", art: "🏄", badge: "Boss Quest", title: "Live as a surf instructor in Bali", meta: "1–6 months · Bali" },
      { data: { difficulty: "moderate", budget: "comfortable", duration: "short", location: "europe", direction: "newlife", level: "epic", commitment: "dip", delivery: "inperson" }, listing: "france", gradient: "linear-gradient(170deg,#2A0A1A,#7A1A3A,#E050A0)", art: "🍷", badge: "Epic Quest", title: "Grape harvest in France", meta: "6–8 weeks · Bordeaux" },
      { data: { difficulty: "hard", budget: "comfortable", duration: "medium", location: "europe", direction: "newlife", level: "legendary", commitment: "fullsend", delivery: "inperson" }, listing: "moto", gradient: "linear-gradient(170deg,#0A1A3A,#1A3A8A,#50A0FF)", art: "🏍️", badge: "Legendary", title: "Travel Europe by motorcycle", meta: "2–4 months · Europe" },
    ],
  },
  {
    id: "upgrade",
    current: "Level Up",
    label: "Level Up",
    title: "Level Up ⚡",
    sub: "New income streams. New skills. A sharper, more capable version of you. These quests are about building the life you want — not just visiting it.",
    quests: [
      { data: { difficulty: "hard", budget: "lean", duration: "medium", location: "remote", direction: "upgrade", level: "boss", commitment: "seasonal", delivery: "online" }, listing: "freelance", gradient: "linear-gradient(170deg,#1A0A3A,#4A1A8A,#A060F0)", art: "💻", badge: "Boss Quest", title: "Go freelance in 90 days", meta: "12 weeks · Remote" },
      { data: { difficulty: "moderate", budget: "lean", duration: "short", location: "remote", direction: "upgrade", level: "starter", commitment: "dip", delivery: "online" }, listing: "income", gradient: "linear-gradient(170deg,#0A2A1A,#1A6A3A,#50C080)", art: "📈", badge: "Starter Quest", title: "Build your first income stream", meta: "8 weeks · Anywhere" },
      { data: { difficulty: "hard", budget: "comfortable", duration: "long", location: "remote", direction: "upgrade", level: "epic", commitment: "fullsend", delivery: "remotefriendly" }, listing: "remote", gradient: "linear-gradient(170deg,#2A1A0A,#7A4A0A,#D08020)", art: "🌍", badge: "Epic Quest", title: "Become location independent", meta: "16 weeks · Remote" },
    ],
  },
];
