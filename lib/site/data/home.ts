import type { GsqCard } from "@/components/site/cards/GsqQCard";
import type { Quest } from "@/components/site/cards/QCard";

/** Home hero — left column "What are you here for?" pills. */
export interface GoalPill {
  label: string;
  /** Optional outcome filter applied before navigating. */
  outcome?: string;
  page: string;
}

export const heroGoalPills: GoalPill[] = [
  { label: "Work Abroad", page: "work-abroad" },
  { label: "Move Abroad", page: "relocate-abroad" },
  { label: "Get Certified", page: "earn-skill" },
  { label: "Start a Side Hustle", page: "side-hustle" },
  { label: "Start a Business", page: "start-business" },
  { label: "Level Up", page: "level-income" },
];

/** Hero right — the two auto-scrolling card columns (each list is rendered twice).
 *  Column 2 is the same six cards, rotated, exactly as in the reference. */
export const heroColumn1: GsqCard[] = [
  { cp: "cp1", page: "work-abroad", icon: "✈️", title: "Work Abroad", desc: "Paid, seasonal, and experience-led ways to work somewhere new." },
  { cp: "cp3", page: "relocate-abroad", icon: "🌍", title: "Move Abroad", desc: "Choose a country, understand the setup, and make the move." },
  { cp: "cp2", page: "earn-skill", icon: "🎓", title: "Get Certified", desc: "Turn a learnable skill into paid work with training and proof." },
  { cp: "cp6", page: "side-hustle", icon: "🌱", title: "Start a Side Hustle", desc: "Low-commitment income paths you can test before going all in." },
  { cp: "cp4", page: "start-business", icon: "🏗️", title: "Start a Business", desc: "Pick a route, compare what it takes, start the smallest version." },
  { cp: "cp9", page: "level-income", icon: "📈", title: "Level Up", desc: "Better skills, higher-value offers, and stronger career leverage." },
];

export const heroColumn2: GsqCard[] = [
  { cp: "cp4", page: "start-business", icon: "🏗️", title: "Start a Business", desc: "Pick a route, compare what it takes, start the smallest version." },
  { cp: "cp9", page: "level-income", icon: "📈", title: "Level Up", desc: "Better skills, higher-value offers, and stronger career leverage." },
  { cp: "cp1", page: "work-abroad", icon: "✈️", title: "Work Abroad", desc: "Paid, seasonal, and experience-led ways to work somewhere new." },
  { cp: "cp3", page: "relocate-abroad", icon: "🌍", title: "Move Abroad", desc: "Choose a country, understand the setup, and make the move." },
  { cp: "cp2", page: "earn-skill", icon: "🎓", title: "Get Certified", desc: "Turn a learnable skill into paid work with training and proof." },
  { cp: "cp6", page: "side-hustle", icon: "🌱", title: "Start a Side Hustle", desc: "Low-commitment income paths you can test before going all in." },
];

/** "Why OutQuest" three cells. */
export interface WhyCell {
  emoji: string;
  title: string;
  body: string;
}

export const whyCells: WhyCell[] = [
  { emoji: "🚪", title: "Unlock New Paths", body: "Explore life-changing opportunities you didn't know were possible — or this easy to start." },
  { emoji: "🗺️", title: "We Give You The Roadmap", body: "We hand you a clear overview of the side quest + everything you need to get started: the best programs, tools, resources, and step-by-step guidance." },
  { emoji: "🎯", title: "No hand-holding required", body: "Pick one quest or run three at once. Each one is self-contained — just follow the path and go at your own pace." },
];

/** "Who Uses Us" persona polaroids. */
export interface Persona {
  cls: string;
  key: string;
  emoji: string;
  name: string;
  role: string;
  pull: string;
  questsTitle: string;
  quests: string[];
}

export const personas: Persona[] = [
  {
    cls: "p1", key: "lisa", emoji: "🌍", name: "Lisa", role: "Digital Nomad", pull: "Pull to see her quests",
    questsTitle: "Lisa's quests",
    quests: ["✨ Learn yoga in Bali", "🏝️ Coworking retreats", "📚 TEFL Thailand", "🌍 Coliving experiences"],
  },
  {
    cls: "p2", key: "marcus", emoji: "💻", name: "Marcus", role: "Career Switcher", pull: "Pull to see his quests",
    questsTitle: "Marcus' quests",
    quests: ["🎨 UX design bootcamps", "📈 Freelance launch plans", "💼 Career-change routes", "🛠️ AI + no-code tools"],
  },
  {
    cls: "p3", key: "emma", emoji: "✈️", name: "Emma", role: "Fresh Graduate", pull: "Pull to see her quests",
    questsTitle: "Emma's quests",
    quests: ["🚀 Internships abroad", "✈️ Work + travel programs", "🎓 Bootcamps", "🏔️ Seasonal hospitality"],
  },
  {
    cls: "p4", key: "aisha", emoji: "🌿", name: "Aisha", role: "Burnt Out Professional", pull: "Pull to see her quests",
    questsTitle: "Aisha's quests",
    quests: ["🌿 Wellness retreats", "🏡 House sitting", "🧭 Sabbatical roadmap", "☕ Low-pressure side quests"],
  },
  {
    cls: "p5", key: "daniel", emoji: "🎥", name: "Daniel", role: "Creator", pull: "Pull to see his quests",
    questsTitle: "Daniel's quests",
    quests: ["📸 UGC programs", "🏕️ Creator residencies", "💰 Paid brand quests", "🧰 Freelance creator stack"],
  },
];

/** "Popular Quests" grid. */
export const popularQuests: Quest[] = [
  { listing: "japan", gradient: "linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)", art: "🏔️", badge: "Epic Quest", title: "Work a ski season in Japan", meta: "3–5 months · Hokkaido" },
  { listing: "bali", gradient: "linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)", art: "🏄", badge: "Boss Quest", title: "Live as a surf instructor in Bali", meta: "1–6 months · Bali" },
  { listing: "bangkok", gradient: "linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)", art: "🏙️", badge: "Starter Quest", title: "Move to Bangkok", meta: "Long-term · Thailand" },
  { listing: "france", gradient: "linear-gradient(170deg,#2A0A1A,#7A1A3A,#E050A0)", art: "🍷", badge: "Epic Quest", title: "Grape harvest in France", meta: "6–8 weeks · Bordeaux" },
  { listing: "moto", gradient: "linear-gradient(170deg,#0A1A3A,#1A3A8A,#50A0FF)", art: "🏍️", badge: "Legendary", title: "Travel Europe by motorcycle", meta: "2–4 months · Europe" },
  { listing: "housesit", gradient: "linear-gradient(170deg,#0A2A10,#1A6A2A,#60C060)", art: "🏠", badge: "Starter Quest", title: "Full-time house sitting", meta: "Ongoing · Worldwide" },
];

/** Social-proof testimonial cards. */
export interface ProofCard {
  outcome: string;
  quote: string;
  avatarBg: string;
  avatarEmoji: string;
  name: string;
  detail: string;
}

export const proofCards: ProofCard[] = [
  { outcome: "Moved to Bangkok full-time", quote: "\"I'd been saying 'maybe next year' for three years. Found a visa agent through OutQuest and booked a one-way ticket six weeks later.\"", avatarBg: "#BFDBF7", avatarEmoji: "🌍", name: "Priya S.", detail: "Singapore → Thailand · 4 months ago" },
  { outcome: "Landed a ski season in Hokkaido", quote: "\"Thought it was only for people with connections or perfect Japanese. Turned out the quest guide had everything — contract job board, housing tips, the lot.\"", avatarBg: "#C8EDCC", avatarEmoji: "🏔️", name: "Tom R.", detail: "London → Japan · Seasonal job" },
  { outcome: "Left £28k job, now freelancing", quote: "\"I needed a roadmap, not another YouTube rabbit hole. The UX bootcamp path on here gave me a sequence I could actually follow. Six months later, I work from wherever.\"", avatarBg: "#E8D5F5", avatarEmoji: "💻", name: "Maya K.", detail: "Manchester → Remote · Career switch" },
];

/** "Explore by …" reel cards (destinations + goals). */
export interface ReelCard {
  /** Preset quest filter or a `showPage` target: `destination` filters by Country
   *  (location), `category` by Category, `outcome` by Outcome Goal (legacy). */
  action: { type: "destination" | "category" | "outcome" | "page"; value: string };
  gradient: string;
  /** Uploaded banner image URL; when set it replaces the gradient. */
  image?: string;
  emoji: string;
  tag: string;
  title: string;
  count: string;
}

export const destinationReel: ReelCard[] = [
  { action: { type: "destination", value: "asia" }, gradient: "linear-gradient(165deg,#0A2A44,#1E6A9A,#4ABCD4)", emoji: "🏔️", tag: "Asia Pacific", title: "Japan & Southeast Asia", count: "3 quests" },
  { action: { type: "destination", value: "europe" }, gradient: "linear-gradient(165deg,#2A0A1A,#7A1A3A,#E050A0)", emoji: "🍷", tag: "Europe", title: "France, Lisbon & Beyond", count: "2 quests" },
  { action: { type: "destination", value: "remote" }, gradient: "linear-gradient(165deg,#1A3A1A,#2E7A1A,#7EC84A)", emoji: "🌍", tag: "Anywhere", title: "Remote & Worldwide", count: "2 quests" },
  { action: { type: "destination", value: "latam" }, gradient: "linear-gradient(165deg,#1A0A2E,#3A1060,#7B2CBF)", emoji: "🌎", tag: "The Americas", title: "Mexico, Colombia & Beyond", count: "Coming soon" },
];

export const goalsReel: ReelCard[] = [
  { action: { type: "page", value: "work-abroad" }, gradient: "linear-gradient(165deg,#2A1A0A,#8A3A0A,#E88030)", emoji: "✈️", tag: "Quest Category", title: "Work Abroad", count: "Paid & seasonal work quests" },
  { action: { type: "page", value: "relocate-abroad" }, gradient: "linear-gradient(165deg,#1A0A3A,#4A1A8A,#A060F0)", emoji: "🌍", tag: "Quest Category", title: "Move Abroad", count: "Relocation & visa quests" },
  { action: { type: "page", value: "earn-skill" }, gradient: "linear-gradient(165deg,#0A2A1A,#1A7A3A,#50C080)", emoji: "🎓", tag: "Quest Category", title: "Get Certified", count: "Skill-building quests" },
  { action: { type: "page", value: "start-business" }, gradient: "linear-gradient(165deg,#0A1A3A,#1A3A7A,#3060C0)", emoji: "🏗️", tag: "Quest Category", title: "Start a Business", count: "Entrepreneur quests" },
];

/** "The Journal" preview cards. */
export interface JournalCard {
  post: string;
  imgGradient: string;
  emoji: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  /** Uploaded featured image (paints the card instead of gradient+emoji). */
  image?: string | null;
  /** Canonical post URL (`/journal/{slug}`), set only for DB-backed posts — see
   *  `JournalGridCard.href`. Static seed cards have no route and keep the overlay. */
  href?: string | null;
}

export const journalCards: JournalCard[] = [
  { post: "japan-ski", imgGradient: "linear-gradient(135deg,#1B3A5A,#2E7AA8)", emoji: "🏔️", tag: "Seasonal Jobs", date: "Apr 2026", title: "4 months in a Japanese ski resort — the honest version", excerpt: "Powder days, staff dorms, and the best decision I made at 26.", href: "/journal/japan-ski" },
  { post: "lisbon-2k", imgGradient: "linear-gradient(135deg,#1A3A0A,#3A8A1A)", emoji: "🌿", tag: "Move Abroad", date: "Mar 2026", title: "I moved to Lisbon with €2,000. Here's what happened.", excerpt: "Spoiler: I'm still here. The visa was easier than I thought.", href: "/journal/lisbon-2k" },
  { post: "freelance-6mo", imgGradient: "linear-gradient(135deg,#3A1A42,#8A3A8A)", emoji: "💻", tag: "Upgrade Your Life", date: "Mar 2026", title: "How I went from £28k salary to freelancing in 6 months", excerpt: "The skill I learned. The clients I found. The exact path.", href: "/journal/freelance-6mo" },
];
