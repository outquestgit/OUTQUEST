/** FAQ page content, grouped into categories. */
export interface FaqCategory {
  icon: string;
  title: string;
  items: { q: string; a: string }[];
}

/** Editable FAQ page (admin Pages-CMS → FAQ). */
export interface FaqPageConfig {
  hero: { eyebrow: string; title: string; em: string; sub: string };
  categories: FaqCategory[];
  stillBox: {
    heading: string;
    body: string;
    buttonLabel: string;
    modalIcon: string;
    modalTitle: string;
    modalDesc: string;
  };
}

export const faqCategories: FaqCategory[] = [
  {
    icon: "🗺️",
    title: "Getting Started",
    items: [
      { q: "What exactly is a OutQuest?", a: "A OutQuest is an immersive life experience — typically 1 to 6 months — that takes you somewhere new to live, work, and actually experience a different way of life. Think ski seasons in Japan, surf instructor stints in Bali, or moving to Lisbon as a remote worker. We curate the full picture: visas, housing, cost, income, community. You just have to decide to go." },
      { q: "Who is OutQuest for?", a: "Anyone who's thought \"there has to be more to life than this\" at least once. Our community includes people in their 20s doing their first big adventure, 30-somethings transitioning careers, and 40-somethings who finally have the financial freedom to go. If you're curious, you belong here." },
      { q: "Do I need to quit my job to do a OutQuest?", a: "Not necessarily. Many of our quests are built around remote-work-compatible lifestyles — you keep your job, change your location. Others (like seasonal work quests) involve trading your current income for a different one on the ground. We're honest about which is which on every quest page." },
      { q: "How do I know which quest is right for me?", a: "Start with the \"Try a New Life\" or \"Move Abroad\" sections if you're not sure. Each quest has a difficulty level (Starter → Legendary), a monthly budget estimate, and an honest description of who it suits. If you're genuinely stuck, start a quest enquiry — we'll help you figure it out." },
    ],
  },
  {
    icon: "📋",
    title: "Visas & Legalities",
    items: [
      { q: "Do you handle visas for me?", a: "We don't apply for visas on your behalf — we're not a visa agency. What we do is give you a thorough, honest guide to every visa route relevant to each quest: what you need, what the process looks like, and what the most common mistakes are. Think of it as the research we wish existed when we were starting out." },
      { q: "Is the visa information on OutQuest up to date?", a: "We update our quest guides regularly, but visa rules change. We always recommend verifying requirements with the official embassy or consulate of your destination country before submitting any application. Our guides are a starting point — official sources are the final word." },
      { q: "What if my country isn't eligible for a Working Holiday Visa?", a: "Many quests have multiple visa pathways. Seasonal work quests often have employer-sponsored routes; location-independent quests usually work on tourist visas or digital nomad visas that have broader eligibility. We outline all available options on each quest page." },
    ],
  },
  {
    icon: "💰",
    title: "Money & Budget",
    items: [
      { q: "How much money do I need to start a quest?", a: "It depends on the quest. Our \"Starter\" quests (like Bangkok or Bali) can be started with $2,000–$3,000 as an arrival fund. Our more expensive quests (like moving to Lisbon or Zurich) need more runway. Every quest page shows a monthly budget range and a recommended arrival fund — those numbers are honest, not aspirational." },
      { q: "Can I actually earn money while on a quest?", a: "Yes — many quests are designed around this. Seasonal work quests (ski resort, surf instructor, vineyard harvest) provide on-the-ground income. Remote work quests let you keep your existing income in a cheaper country. We show estimated earnings on every earning-potential quest so you can model it properly." },
      { q: "Are the cost estimates accurate?", a: "We research these carefully and update them regularly, but no estimate is a guarantee. Costs vary based on your lifestyle, how you find housing, and market conditions. We generally present a realistic mid-range — not the absolute cheapest possible, and not the tourist rate. You can live cheaper or spend more; the numbers are a calibration tool, not a contract." },
    ],
  },
  {
    icon: "⚡",
    title: "The OutQuest Platform",
    items: [
      { q: "Is OutQuest free to use?", a: "Yes. All quest guides, cost breakdowns, visa information, and journal content are free. Some links in our gear and resource sections are affiliate links — meaning we may earn a small commission if you buy through them, at no extra cost to you. We only recommend things we'd genuinely use ourselves." },
      { q: "What happens when I submit a quest enquiry?", a: "A real person on the OutQuest team reviews it and gets back to you — usually within 48 hours. We'll ask a few follow-up questions to understand your situation, then point you toward the right resources, visa routes, and community connections. We're not a booking service; we're a compass." },
      { q: "Do you have a community I can join?", a: "We're building one. Sign up for the newsletter to be first in when we launch the OutQuest community — it'll be a space for people planning quests and people already on them to connect, share, and help each other out." },
      { q: "I'm a hostel / surf school / retreat operator — can I list on OutQuest?", a: "Yes — head to our Partner With Us page. We work with hosts, operators, and experience providers who want to reach people actively planning life adventures. We're selective about who we feature, but if your offering is genuinely good, we want to know about it." },
    ],
  },
];

export const DEFAULT_FAQ: FaqPageConfig = {
  hero: {
    eyebrow: "✦ Got questions?",
    title: "FAQ —",
    em: "Your Questions,\nAnswered.",
    sub: "Everything you need to know before you pack your bag and change your life.",
  },
  categories: faqCategories,
  stillBox: {
    heading: "Still have a question?",
    body: "We read every message. Drop us a line and a real person will get back to you — usually within 48 hours.",
    buttonLabel: "Send us a message",
    modalIcon: "💬",
    modalTitle: "Got a question?",
    modalDesc: "Tell us what's on your mind — we'll get back to you within 48 hours.",
  },
};
