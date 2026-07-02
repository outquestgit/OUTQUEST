import { slugify } from "./forms";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type JournalPayload = {
  title: string;
  slug: string;
  category: string | null;
  category_color: string | null;
  date_label: string | null;
  published_at: string | null;
  read_time: string | null;
  author: string | null;
  emoji: string | null;
  card_gradient: string | null;
  hero_bg: string | null;
  excerpt: string | null;
  body: string | null;
  related: string[];
  featured: boolean;
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  noindex: boolean;
  nofollow: boolean;
  visibility: "published" | "draft";
  display_order: number;
  /** Future publish moment (ISO). NULL = go live immediately. */
  scheduled_at: string | null;
  /** Zone the schedule was picked in (minutes east of UTC). NULL = none. */
  scheduled_tz: number | null;
  // Optional — set only when present so they're preserved on update.
  featured_image_path?: string;
  og_image_url?: string;
};

const clean = (v: unknown) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};
const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x ?? "").trim()).filter(Boolean) : [];

// "2026-06-22" → keep as date; anything unparseable → null.
const cleanDate = (v: unknown): string | null => {
  const s = String(v ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
};

// An ISO datetime string (the schedule time) → keep if parseable, else null.
const cleanTimestamp = (v: unknown): string | null => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
};

/**
 * Validates + normalizes a journal editor payload. Shared by the create (POST)
 * and update (PUT) routes so they can't diverge. Returns an `error` string, or
 * the `payload` + cleaned `slug`.
 */
export function buildJournalPayload(
  body: Record<string, unknown>
): { error: string } | { payload: JournalPayload; slug: string } {
  const title = String(body.title ?? "").trim();
  let slug = String(body.slug ?? "").trim();
  if (!slug && title) slug = slugify(title);
  if (!title) return { error: "Title is required." };
  if (!SLUG_RE.test(slug))
    return { error: "Slug must be lowercase letters, numbers and hyphens." };

  const payload: JournalPayload = {
    title,
    slug,
    category: clean(body.category),
    category_color: clean(body.category_color),
    date_label: clean(body.date_label),
    published_at: cleanDate(body.published_at),
    read_time: clean(body.read_time),
    author: clean(body.author),
    emoji: clean(body.emoji),
    card_gradient: clean(body.card_gradient),
    hero_bg: clean(body.hero_bg),
    excerpt: clean(body.excerpt),
    body: clean(body.body),
    related: arr(body.related),
    featured: !!body.featured,
    seo_title: clean(body.seo_title),
    meta_description: clean(body.meta_description),
    focus_keyword: clean(body.focus_keyword),
    canonical_url: clean(body.canonical_url),
    noindex: !!body.noindex,
    nofollow: !!body.nofollow,
    visibility: body.status === "published" ? "published" : "draft",
    display_order: Number.isFinite(Number(body.display_order))
      ? Math.trunc(Number(body.display_order))
      : 0,
    scheduled_at: cleanTimestamp(body.scheduled_at),
    scheduled_tz:
      cleanTimestamp(body.scheduled_at) != null && Number.isFinite(Number(body.scheduled_tz))
        ? Math.trunc(Number(body.scheduled_tz))
        : null,
  };

  if (clean(body.featured_image_path)) payload.featured_image_path = String(body.featured_image_path);
  if (clean(body.og_image_url)) payload.og_image_url = String(body.og_image_url);

  return { payload, slug };
}
