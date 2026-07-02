/**
 * Full Partner-page CMS model + defaults. Editable: all section copy + the
 * partner-category cards, why cards, FAQ, and the application-form labels /
 * offering options / success message. Decorative illustrations (hero mock card
 * + notifications, the "what we do" visual, quote floats) and the form's wiring
 * stay in the component. Defaults reproduce the current page exactly. Multi-line
 * headings use "\n" (rendered as <br/>).
 */

export interface PartnerCategory {
  bg: string;
  color: string;
  icon: string;
  title: string;
  body: string;
}
export interface PartnerWhyCard {
  emoji: string;
  title: string;
  body: string;
}
export interface PartnerFaq {
  q: string;
  a: string;
}

export interface PartnerConfig {
  hero: { headline: string; sub: string; ctaLabel: string };
  whatWeDo: { label: string; heading: string; sub: string; pills: string[] };
  partnerWith: { heading: string; cards: PartnerCategory[] };
  quote: { text: string; tag: string };
  why: { label: string; heading: string; cards: PartnerWhyCard[] };
  faq: { emoji: string; label: string; heading: string; items: PartnerFaq[] };
  form: {
    emoji: string;
    label: string;
    heading: string;
    sub: string;
    nameLabel: string;
    companyLabel: string;
    websiteLabel: string;
    offeringLabel: string;
    descLabel: string;
    emailLabel: string;
    offerings: string[];
    submitLabel: string;
    successHeading: string;
    successBody: string;
  };
}

export const DEFAULT_PARTNER: PartnerConfig = {
  hero: {
    headline: "Meet your next customer before they meet your competitors",
    sub: "OutQuest puts your business in front of high-intent people actively planning a life change — relocation, career pivots, skill-building, and lifestyle redesign. They're ready. You just need to show up.",
    ctaLabel: "Become a Partner",
  },
  whatWeDo: {
    label: "What we do",
    heading: "Curated paths.\nReal commitment.",
    sub: "We curate end-to-end quests for people committed to major life changes. Each quest includes a roadmap, budget breakdown, timeline, and vetted partner deals to remove friction and reduce cost.",
    pills: ["🗺️ Roadmap", "💰 Budget breakdown", "📅 Timeline", "🤝 Partner deals"],
  },
  partnerWith: {
    heading: "Who We Partner With",
    cards: [
      { bg: "#FFD400", color: "#161412", icon: "🏠", title: "Housing & Coliving", body: "Short-term stays, serviced apartments, coliving spaces, and long-term rentals for people on the move." },
      { bg: "#F23D1D", color: "#fff", icon: "💻", title: "Coworking Spaces", body: "Day passes, hot desks, private offices, and work-friendly cafés for those who need a productive base." },
      { bg: "#10CDB0", color: "#161412", icon: "🏦", title: "Banks & Financial Services", body: "Digital-first accounts, international transfers, and fintech solutions that work across borders." },
      { bg: "#BFFF00", color: "#161412", icon: "🛡️", title: "Insurance Providers", body: "Health, travel, and relocation coverage that moves with the people OutQuest serves." },
      { bg: "#F33BB0", color: "#fff", icon: "🧘", title: "Wellness & Fitness", body: "Gyms, yoga studios, recovery centres, and spas offering visitor-friendly access and memberships." },
      { bg: "#7B2CBF", color: "#fff", icon: "🏥", title: "Healthcare Services", body: "Clinics, telehealth providers, and medical services experienced with international patients." },
      { bg: "#F23D1D", color: "#fff", icon: "📚", title: "Education & Learning", body: "Language schools, professional programs, certifications, and learning experiences in the city." },
      { bg: "#FFD400", color: "#161412", icon: "🎟️", title: "Local Experiences", body: "Curated activities, cultural experiences, and things worth doing in your city." },
      { bg: "#10CDB0", color: "#161412", icon: "🚀", title: "Relocation Services", body: "Company setup, legal services, movers, shipping, and market entry support for new arrivals." },
    ],
  },
  quote: {
    text: "Your offering isn't just a link — it's a step inside someone's real transformation.",
    tag: "— The OutQuest approach",
  },
  why: {
    label: "Why it works",
    heading: "Why partner with OutQuest?",
    cards: [
      { emoji: "🎯", title: "Join high-intent users in the middle of their journey", body: "OutQuest reaches people who aren't just browsing—they're already imagining themselves moving abroad, learning a skill, or redesigning their life. You're placed at the moment of decision." },
      { emoji: "🗺️", title: "Become a trusted guide, not just another link", body: 'Your offering is positioned inside curated quests like "Move to Bangkok" or "Learn AI in 3 months," framed as a necessary step—not a random recommendation.' },
      { emoji: "🚀", title: "Align with a self-betting mindset", body: "Our users are driven, action-oriented, and committed to change. Partnering places your brand alongside ambition, growth, and real-world transformation." },
    ],
  },
  faq: {
    emoji: "💬",
    label: "Got questions?",
    heading: "Frequently asked questions",
    items: [
      { q: "What types of partners do you accept?", a: "We work with programs, services, and tools that help people take action on real-life changes—relocation, skills, lifestyle, and career shifts." },
      { q: "How do users reach us?", a: "Users either click through directly or submit enquiries depending on the quest structure." },
      { q: "Do I need to integrate anything?", a: "No. There's no dashboard or technical setup required." },
      { q: "How do you monetise partnerships?", a: "We support affiliate, referral, and lead-based partnerships depending on the category." },
      { q: "Can I choose which users I work with?", a: "Yes. You manage all enquiries and decide who to accept." },
      { q: "When will I start seeing traffic or leads?", a: "Once your offering is placed into relevant quests, you'll start receiving exposure immediately." },
      { q: "Do you guarantee leads or conversions?", a: "No guarantees—but we focus on high-intent positioning rather than volume traffic." },
      { q: "Can I update or change my offering later?", a: "Yes, just reach out and we'll update your placement." },
    ],
  },
  form: {
    emoji: "📋",
    label: "Apply now",
    heading: "Become a OutQuest Partner",
    sub: "Tell us about your offering and we'll be in touch within 48 hours.",
    nameLabel: "Your name",
    companyLabel: "Company / Program name",
    websiteLabel: "Website / Link",
    offeringLabel: "Type of offering",
    descLabel: "Short description",
    emailLabel: "Contact email",
    offerings: [
      "🛂 Visa & Immigration",
      "🏢 Coliving / Coworking",
      "📚 Education / Training",
      "✈️ Travel & Insurance",
      "⚙️ SaaS / Tools",
      "🎒 Gear / Products",
      "💰 Finance / Banking",
      "🌐 Other",
    ],
    submitLabel: "Submit Application",
    successHeading: "Application received!",
    successBody: "We'll review your application and get back to you within 48 hours. We're excited to explore this together.",
  },
};
