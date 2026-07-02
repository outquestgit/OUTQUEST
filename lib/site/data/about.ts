/**
 * Full About-page CMS model + defaults. Every section's copy and card
 * collections are editable; layout-only fields (polaroid colours, world-map
 * card positions, locator dots) are kept in the data so they round-trip on save
 * but are NOT exposed in the admin form. Defaults reproduce the current About
 * page exactly. Multi-line headings use "\n" (rendered as <br/>).
 */
import { aboutMapImage } from "./aboutMapImage";

export { aboutMapImage };

export interface AboutPolaroid {
  cls: string;
  bg: string;
  color: string;
  role: string;
  title: [string, string];
}
export interface AboutDecoPolaroid {
  cls: string;
  emoji: string;
  caption: string;
  /** Optional uploaded image URL. When set, it fills the polaroid photo area
   *  (cover) instead of the emoji. */
  image?: string;
}
export interface AboutPathCard {
  page: string;
  emoji: string;
  tag: string;
  title: string;
  desc: string;
}
export interface AboutWhoCard {
  icon: string;
  title: string;
  desc: string;
}
export interface AboutMapCard {
  left: string;
  top: string;
  bg: string;
  color?: string;
  avatarBg: string;
  emoji: string;
  name: string;
  role: string;
  desc: string;
  tag: string;
  tagStyle?: { background: string; color: string };
}
export interface AboutLocDot {
  left: string;
  top: string;
  bg: string;
}
export interface AboutHiwStep {
  icon: string;
  title: string;
  desc: string;
}
export interface AboutWhyItem {
  badge: string;
  title: string;
  desc: string;
}

export interface AboutConfig {
  hero: { h1: string; sub: string; ctaLabel: string; polaroids: AboutPolaroid[] };
  whatWeDo: { label: string; heading: string; paragraphs: string[]; polaroids: AboutDecoPolaroid[] };
  paths: { heading: string; subtitle: string; cards: AboutPathCard[] };
  who: { heading: string; cards: AboutWhoCard[] };
  map: { heading: string; cards: AboutMapCard[]; dots: AboutLocDot[] };
  howItWorks: { heading: string; steps: AboutHiwStep[] };
  why: { label: string; heading: string; items: AboutWhyItem[] };
  cta: { heading: string; subtitle: string; ctaLabel: string; footnote: string };
}

export const DEFAULT_ABOUT: AboutConfig = {
  hero: {
    h1: "A platform built for people\nwho want to live differently.",
    sub: "Most people know what they want. They just can't see the path. We built it for them.",
    ctaLabel: "Explore Quests",
    polaroids: [
      { cls: "amo-pol-1", bg: "#FFD400", color: "#161412", role: "WORK ABROAD", title: ["Ski Season", "in Japan"] },
      { cls: "amo-pol-2", bg: "#7B2CBF", color: "#fff", role: "FREELANCER", title: ["Go Freelance", "in 90 Days"] },
      { cls: "amo-pol-3", bg: "#F23D1D", color: "#fff", role: "RELOCATE", title: ["Move to", "Bangkok"] },
      { cls: "amo-pol-4", bg: "#10CDB0", color: "#161412", role: "SIDE HUSTLE", title: ["House Sitting", "Worldwide"] },
      { cls: "amo-pol-5", bg: "#F33BB0", color: "#fff", role: "GET CERTIFIED", title: ["Surf Instructor", "in Bali"] },
      { cls: "amo-pol-6", bg: "#BFFF00", color: "#161412", role: "HARVEST", title: ["Grape Harvest", "in France"] },
    ],
  },
  whatWeDo: {
    label: "What we do",
    heading: "From idea to action,\nwithout the paralysis",
    paragraphs: [
      'Most platforms give you inspiration and leave you stranded. OutQuest connects the dots — from the moment you think "maybe I should try something different" to the moment you\'re actually doing it.',
      "Every quest is a complete roadmap: visa steps, income sources, housing options, community connections, and curated tools — all in one place.",
      "We built the kind of resource we wish existed when we were staring at Google tabs at 11pm wondering how people actually do this stuff.",
    ],
    polaroids: [
      { cls: "wbt3-pol-a", emoji: "🌴", caption: "somewhere better than here" },
      { cls: "wbt3-pol-b", emoji: "🏔️", caption: "Hokkaido, Nov" },
      { cls: "wbt3-pol-c", emoji: "🏄", caption: "Bali, always" },
    ],
  },
  paths: {
    heading: "Pick Your Path",
    subtitle: "Pick your direction. We'll hand you the map.",
    cards: [
      { page: "work-abroad", emoji: "✈️", tag: "Work Abroad", title: "Work Abroad", desc: "Seasonal jobs, resort work & paid adventures overseas." },
      { page: "relocate-abroad", emoji: "🌍", tag: "Move Abroad", title: "Move Abroad", desc: "Visas, cities, housing, communities — everything to actually relocate, not just consider it." },
      { page: "earn-skill", emoji: "💸", tag: "Get Certified", title: "Get Certified", desc: "Credentials that open doors — TEFL, PADI, coaching & more." },
      { page: "side-hustle", emoji: "🌱", tag: "Side Hustle", title: "Start a Side Hustle", desc: "Build income streams alongside your existing life." },
      { page: "start-business", emoji: "🏢", tag: "Start a Business", title: "Start a Business", desc: "From idea to entity. Build something that lasts." },
      { page: "level-income", emoji: "📈", tag: "Level Up", title: "Level Up", desc: "New skills, higher income, sharper version of you." },
    ],
  },
  who: {
    heading: "Sound familiar?",
    cards: [
      { icon: "🧠", title: "The stuck one", desc: "You're fine. But fine isn't enough anymore. You want something you can't quite name yet." },
      { icon: "🔀", title: "The career switcher", desc: "Ready to pivot, but not sure where to. Wants to try before they fully commit." },
      { icon: "💻", title: "The remote worker", desc: "Location-free in theory. Your laptop works from Bangkok. You know this. You're just not doing it." },
      { icon: "🎒", title: "Gap year & sabbatical", desc: "Got time. Wants to use it for something that actually means something." },
    ],
  },
  map: {
    heading: "Real people. Real moves.",
    cards: [
      { left: "19%", top: "50%", bg: "linear-gradient(135deg,#1AAF7A,#0A8A5A)", avatarBg: "rgba(255,255,255,.2)", emoji: "🚀", name: "Priya, 38", role: "Founder in Motion · Medellín", desc: "Left a VP role to build her own thing. Moved to Medellín for runway. Lower burn, better focus, first clients in month two.", tag: "✦ Founder Mode" },
      { left: "44%", top: "3%", bg: "linear-gradient(135deg,#7B2CBF,#5A1A9A)", avatarBg: "rgba(255,255,255,.2)", emoji: "🎓", name: "Sofia, 34", role: "Career Switcher · Lisbon", desc: "Ex-lawyer who wants to build something of her own. Got certified, moved to Lisbon, launched a consulting practice.", tag: "✦ New Chapter" },
      { left: "64%", top: "30%", bg: "linear-gradient(135deg,#F5C842,#D4A010)", color: "#1A1A1A", avatarBg: "rgba(0,0,0,.1)", emoji: "💻", name: "Marcus, 31", role: "Digital Nomad · Bangkok", desc: "UX freelancer hopping SE Asia. Needs fast coworking, short stays, and a city that runs on $1,400/month.", tag: "✦ Remote Worker", tagStyle: { background: "rgba(0,0,0,.12)", color: "#1A1A1A" } },
      { left: "84%", top: "3%", bg: "linear-gradient(135deg,#1A6ACA,#0A4A9A)", avatarBg: "rgba(255,255,255,.2)", emoji: "🏔️", name: "James, 26", role: "Adventure Worker · Japan", desc: "Just graduated. Chose a ski season in Hokkaido over a grad scheme. Leaves with savings, a network, and a story.", tag: "✦ First Leap" },
      { left: "77%", top: "60%", bg: "linear-gradient(135deg,#E8451A,#C43210)", avatarBg: "rgba(255,255,255,.2)", emoji: "🏄", name: "Zara, 28", role: "Escape Artist · Bali", desc: "Marketing manager who hit a wall. Wants to feel alive again. Booked a surf instructor course and never looked back.", tag: "✦ Career Reset" },
    ],
    dots: [
      { left: "21%", top: "62%", bg: "#1AAF7A" },
      { left: "46%", top: "27%", bg: "#7B2CBF" },
      { left: "65%", top: "48%", bg: "#F5C842" },
      { left: "83%", top: "33%", bg: "#1A6ACA" },
      { left: "74%", top: "60%", bg: "#E8451A" },
    ],
  },
  howItWorks: {
    heading: "How it works",
    steps: [
      { icon: "🗺️", title: "Pick a quest", desc: "Find the one that pulls at you. Japan ski season, Bali surf life, Bangkok relocation — we have the map." },
      { icon: "📋", title: "Follow the roadmap", desc: "Every quest has a complete path — visas, housing, income, community. No rabbit holes, no guesswork." },
      { icon: "🤝", title: "Use deals & partners", desc: "Access curated partner offers inside each quest. Real tools, real services, direct access." },
    ],
  },
  why: {
    label: "Why OutQuest",
    heading: "What makes this different",
    items: [
      { badge: "🚫", title: "No courses to sell", desc: "We don't have a $997 masterclass hiding behind the free content. The quest guides are the product." },
      { badge: "🎯", title: "Direct access to real opportunities", desc: "Partner links inside quests go to actual services — not affiliate spam. Curated for the specific quest you're on." },
      { badge: "✂️", title: "Curated, not overwhelming", desc: "We choose fewer, better options. One clear path beats twenty tabs and three Reddit threads." },
      { badge: "📖", title: "No fluff content", desc: "Every piece of content serves the quest. If it doesn't help you move, it doesn't belong here." },
    ],
  },
  cta: {
    heading: "Start your next move.",
    subtitle: "The roadmap is ready. The only question is which quest is calling you loudest right now.",
    ctaLabel: "Explore Quests",
    footnote: "No sign-up required. Just browse.",
  },
};
