import { slugify } from "./forms";
import type { QuestContent } from "@/lib/quests";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Content (jsonb) keys the editor fully owns. On update these are replaced
 * wholesale (so clearing a repeater really clears it); any OTHER content keys in
 * the DB (e.g. legacy `overview`/`included`) are preserved by the route's merge.
 */
export const MANAGED_CONTENT_KEYS: (keyof QuestContent)[] = [
  "intro",
  "immersive",
  "overview",
  "why",
  "unlocksIntro",
  "unlocks",
  "path",
  "embark",
  "prep",
  "faq",
  "companion",
  "gallery",
];

export type QuestPayload = {
  title: string;
  slug: string;
  tagline: string | null;
  level: string | null;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  card_icon: string | null;
  card_color: string | null;
  timeline_label: string | null;
  difficulty_label: string | null;
  monthly_budget: string | null;
  best_time: string | null;
  location_label: string | null;
  duration: string | null;
  slides: string[];
  arts: string[];
  content: QuestContent;
  visibility: "published" | "draft";
  featured: boolean;
  hide_frontend: boolean;
  display_order: number;
  // Optional — set only when present so they're preserved on update.
  card_gradient?: string;
  featured_image_path?: string;
  card_image_path?: string;
  og_image_url?: string;
};

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const clean = (v: unknown) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};

/** Sanitize the editor-managed `content` blocks; omit empty ones. */
function buildContent(raw: unknown): QuestContent {
  const c = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: QuestContent = {};

  if (str(c.intro).trim()) out.intro = str(c.intro).trim();
  if (str(c.immersive).trim()) out.immersive = str(c.immersive).trim();
  if (str(c.overview).trim()) out.overview = str(c.overview).trim();
  if (str(c.why).trim()) out.why = str(c.why).trim();
  if (str(c.unlocksIntro).trim()) out.unlocksIntro = str(c.unlocksIntro).trim();

  const unlocks = arr(c.unlocks)
    .map((x) => x as Record<string, unknown>)
    .map((u) => ({ i: str(u.i).trim(), t: str(u.t).trim(), p: str(u.p).trim() }))
    .filter((u) => u.t || u.p || u.i);
  if (unlocks.length) out.unlocks = unlocks;

  const path = arr(c.path)
    .map((x) => x as Record<string, unknown>)
    .map((s) => ({ t: str(s.t).trim(), p: str(s.p).trim() }))
    .filter((s) => s.t || s.p);
  if (path.length) out.path = path;

  const embark = arr(c.embark)
    .map((x) => x as Record<string, unknown>)
    .map((s) => ({ t: str(s.t).trim(), p: str(s.p).trim() }))
    .filter((s) => s.t || s.p);
  if (embark.length) out.embark = embark;

  const prep = arr(c.prep)
    .map((x) => x as Record<string, unknown>)
    .map((p) => ({
      i: str(p.i).trim(),
      t: str(p.t).trim(),
      btn: str(p.btn).trim(),
      bg: str(p.bg).trim(),
      dealPage: str(p.dealPage).trim(),
    }))
    .filter((p) => p.t || p.i);
  if (prep.length) out.prep = prep;

  const faq = arr(c.faq)
    .map((x) => x as Record<string, unknown>)
    .map((f) => ({ q: str(f.q).trim(), a: str(f.a).trim() }))
    .filter((f) => f.q || f.a);
  if (faq.length) out.faq = faq;

  const co = c.companion as Record<string, unknown> | undefined;
  if (co && typeof co === "object" && (str(co.heading).trim() || str(co.body).trim())) {
    out.companion = {
      heading: str(co.heading).trim(),
      body: str(co.body).trim(),
      button: str(co.button).trim(),
      show: co.show !== false,
    };
  }

  const gallery = arr(c.gallery).map(str).filter(Boolean);
  if (gallery.length) out.gallery = gallery;

  return out;
}

/**
 * Validates + normalizes a quest editor payload. Shared by the create (POST) and
 * update (PUT) routes. Returns an `error` string for the caller to surface, or
 * the `payload` + cleaned `slug` + `termIds`.
 */
export function buildQuestPayload(
  body: Record<string, unknown>
): { error: string } | { payload: QuestPayload; slug: string; termIds: string[] } {
  const title = String(body.title ?? "").trim();
  let slug = String(body.slug ?? "").trim();
  if (!slug && title) slug = slugify(title);
  if (!title) return { error: "Title is required." };
  if (!SLUG_RE.test(slug))
    return { error: "Slug must be lowercase letters, numbers and hyphens." };

  const slides = arr(body.slides).map(str).filter(Boolean);
  const arts = arr(body.arts).map(str);

  const payload: QuestPayload = {
    title,
    slug,
    tagline: clean(body.tagline),
    level: clean(body.level),
    seo_title: clean(body.seo_title),
    meta_description: clean(body.meta_description),
    canonical_url: clean(body.canonical_url),
    card_icon: clean(body.card_icon),
    card_color: clean(body.card_color),
    timeline_label: clean(body.timeline_label),
    difficulty_label: clean(body.difficulty_label),
    monthly_budget: clean(body.monthly_budget),
    best_time: clean(body.best_time),
    location_label: clean(body.location_label),
    duration: clean(body.duration),
    slides,
    arts,
    content: buildContent(body.content),
    visibility: body.status === "published" ? "published" : "draft",
    featured: !!body.featured,
    hide_frontend: !!body.hide_frontend,
    display_order: Number.isFinite(Number(body.display_order))
      ? Math.trunc(Number(body.display_order))
      : 0,
  };

  // Derive the card gradient from the first hero slide (so listing cards get the
  // rich gradient). Only when slides exist, so a seeded gradient isn't wiped.
  if (slides.length) payload.card_gradient = slides[0];

  // Image URLs — set only when a new upload happened (else preserved on update).
  if (clean(body.featured_image_path)) payload.featured_image_path = String(body.featured_image_path);
  if (clean(body.card_image_path)) payload.card_image_path = String(body.card_image_path);
  if (clean(body.og_image_url)) payload.og_image_url = String(body.og_image_url);

  const rawTerms = body.termIds;
  const termIds = Array.isArray(rawTerms)
    ? [...new Set(rawTerms.map((x) => String(x)).filter((s) => s !== ""))]
    : [];

  return { payload, slug, termIds };
}
