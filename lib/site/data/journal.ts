/** "Top Articles" grid on the Journal page. Each opens a blog post by id. */
export interface JournalGridCard {
  post: string;
  gradient: string;
  emoji: string;
  tag: string;
  date: string;
  title: string;
  /** Uploaded featured image (paints the card instead of gradient+emoji). */
  image?: string | null;
}

export const journalGrid: JournalGridCard[] = [
  { post: "ai-website", gradient: "linear-gradient(135deg,#1A2A4A,#2A5A8A,#4A8AC0)", emoji: "🌐", tag: "Quest Planning", date: "May 2026", title: "How to plan your first OutQuest from scratch" },
  { post: "domain-nomad", gradient: "linear-gradient(135deg,#3A1A5A,#7A3A9A,#B060D0)", emoji: "🌍", tag: "Move Abroad", date: "Apr 2026", title: "What is a digital nomad visa and why it matters" },
  { post: "bali-honest", gradient: "linear-gradient(135deg,#0A2A1A,#1A7A3A,#50C070)", emoji: "🏄", tag: "Seasonal Jobs", date: "Apr 2026", title: "What it's actually like to teach surf in Bali" },
  { post: "freelance-6mo", gradient: "linear-gradient(135deg,#3A1A42,#8A3A8A,#C060C0)", emoji: "💻", tag: "Upgrade Your Life", date: "Mar 2026", title: "How I went from £28k salary to freelancing in 6 months" },
  { post: "lisbon-2k", gradient: "linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)", emoji: "🌿", tag: "Move Abroad", date: "Mar 2026", title: "I moved to Lisbon with €2,000. Here's what happened." },
  { post: "budget-nomad", gradient: "linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)", emoji: "💰", tag: "Budget & Money", date: "Mar 2026", title: "Living on $1,000 a month abroad: the real numbers" },
  { post: "web-design-life", gradient: "linear-gradient(135deg,#0A1A3A,#1A4A8A,#4080D0)", emoji: "⚡", tag: "Upgrade Your Life", date: "Feb 2026", title: "Learning web design changed my life — and took 3 months" },
  { post: "landing-page-life", gradient: "linear-gradient(135deg,#2A2A0A,#7A7A0A,#C0C020)", emoji: "🏡", tag: "Lifestyle Design", date: "Feb 2026", title: "How to build a life you don't need a vacation from" },
  { post: "best-countries", gradient: "linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)", emoji: "✈️", tag: "Move Abroad", date: "Feb 2026", title: "The 8 best countries for digital nomads in 2026" },
];
