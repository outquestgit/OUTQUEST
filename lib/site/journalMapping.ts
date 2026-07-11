import type { JournalPost } from "@/lib/journal";
import type { JournalGridCard } from "@/lib/site/data/journal";
import type { JournalCard } from "@/lib/site/data/home";

const FALLBACK_GRADIENT = "linear-gradient(135deg,#1A2A4A,#2A5A8A,#4A8AC0)";
const FALLBACK_EMOJI = "📝";

/** The featured article on the Journal index (the big hero card at the top). */
export interface JournalFeatured {
  post: string;
  tag: string;
  title: string;
  desc: string;
  gradient: string;
  emoji: string;
  image: string | null;
  /** Canonical post URL — see `JournalGridCard.href`. */
  href?: string | null;
}

/** A fully-resolved blog post for the SPA reader + the SSR /journal/[slug] page. */
export interface BlogPostData {
  slug: string;
  tag: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  heroBg: string;
  heroIcon: string;
  featuredImage: string | null;
  body: string;
  related: { id: string; tag: string; title: string; bg: string; icon: string; image: string | null }[];
}

/** Exact publish date for the blog post ("April 15, 2026"), formatted server-side
 *  so there's no locale hydration drift; falls back to the free-text `date_label`
 *  when a post has no published timestamp. Cards don't show a date at all. */
function exactDate(p: JournalPost): string {
  if (p.published_at) {
    const d = new Date(p.published_at);
    if (!Number.isNaN(d.getTime()))
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  return p.date_label ?? "";
}

const grad = (p: JournalPost) => p.card_gradient || p.hero_bg || FALLBACK_GRADIENT;
const heroGrad = (p: JournalPost) => p.hero_bg || p.card_gradient || FALLBACK_GRADIENT;
const icon = (p: JournalPost) => p.emoji || FALLBACK_EMOJI;

/** DB post → Journal-index grid card (matches the static `journalGrid` shape). */
export function postToGridCard(p: JournalPost): JournalGridCard {
  return {
    post: p.slug,
    gradient: grad(p),
    emoji: icon(p),
    tag: p.category ?? "",
    date: p.date_label ?? "",
    title: p.title,
    image: p.featured_image_path,
    href: `/journal/${p.slug}`,
  };
}

/** DB post → home "The Journal" preview card (matches the static `journalCards` shape). */
export function postToHomeCard(p: JournalPost): JournalCard {
  return {
    post: p.slug,
    imgGradient: grad(p),
    emoji: icon(p),
    tag: p.category ?? "",
    date: p.date_label ?? "",
    title: p.title,
    excerpt: p.excerpt ?? "",
    image: p.featured_image_path,
    href: `/journal/${p.slug}`,
  };
}

/** DB post → the Journal-index featured hero article. */
export function postToFeatured(p: JournalPost): JournalFeatured {
  return {
    post: p.slug,
    tag: p.category ?? "",
    title: p.title,
    desc: p.excerpt ?? "",
    gradient: heroGrad(p),
    emoji: icon(p),
    image: p.featured_image_path,
    href: `/journal/${p.slug}`,
  };
}

/** DB post → the full reader payload, resolving `related` slugs into cards. */
export function postToBlogData(p: JournalPost, all: JournalPost[]): BlogPostData {
  const bySlug = new Map(all.map((x) => [x.slug, x]));
  const toCard = (r: JournalPost) => ({
    id: r.slug,
    tag: r.category ?? "",
    title: r.title,
    bg: grad(r),
    icon: icon(r),
    image: r.featured_image_path,
  });
  let relatedPosts = (p.related ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((r): r is JournalPost => !!r);
  // No explicit picks → fall back to other posts sharing this post's category.
  if (relatedPosts.length === 0 && p.category) {
    relatedPosts = all
      .filter((r) => r.slug !== p.slug && r.category === p.category)
      .slice(0, 3);
  }
  const related = relatedPosts.map(toCard);
  return {
    slug: p.slug,
    tag: p.category ?? "",
    title: p.title,
    date: exactDate(p),
    readTime: p.read_time ?? "",
    author: p.author ?? "OutQuest Team",
    heroBg: heroGrad(p),
    heroIcon: icon(p),
    featuredImage: p.featured_image_path,
    body: p.body ?? "",
    related,
  };
}

/**
 * Build the `window.__JOURNAL_POSTS__` map the SPA runtime (`openBlogPost` in
 * front.js) reads, keyed by slug. Same shape as front.js's hardcoded BLOG_POSTS
 * so the existing renderer works unchanged.
 */
export function postsToReaderMap(posts: JournalPost[]): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  for (const p of posts) {
    const d = postToBlogData(p, posts);
    map[p.slug] = {
      tag: d.tag,
      title: d.title,
      date: d.date,
      readTime: d.readTime,
      author: d.author,
      heroBg: d.heroBg,
      heroIcon: d.heroIcon,
      featuredImage: d.featuredImage,
      body: d.body,
      related: d.related,
    };
  }
  return map;
}
