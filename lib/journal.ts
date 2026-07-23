import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "./supabase/public";
import { createSupabaseServerClient } from "./supabase/server";

/** Cache tag — admin mutations call `revalidateTag(JOURNAL_TAG, { expire: 0 })` for immediate refresh. */
export const JOURNAL_TAG = "journal";

/** A journal/blog post (self-contained article rendered on the front + at /journal/[slug]). */
export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  category_color: string | null;
  date_label: string | null;
  published_at: string | null;
  /** Future publish moment (absolute UTC); hidden from public reads until then. */
  scheduled_at: string | null;
  /** Offset (minutes east of UTC) of the zone the schedule was picked in, for
   *  displaying the schedule as the author's wall-clock time. */
  scheduled_tz: number | null;
  read_time: string | null;
  author: string | null;
  emoji: string | null;
  card_gradient: string | null;
  hero_bg: string | null;
  featured_image_path: string | null;
  excerpt: string | null;
  body: string | null;
  related: string[];
  featured: boolean;
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  noindex: boolean;
  nofollow: boolean;
  visibility: string;
  display_order: number;
  updated_at: string;
}

type RawPost = Omit<JournalPost, "related"> & { related: unknown };

function normalize(row: RawPost): JournalPost {
  return { ...row, related: Array.isArray(row.related) ? (row.related as string[]) : [] };
}

const SELECT = "*";

// ── Admin reads (uncached, RLS-as-admin → includes drafts) ──────────────────

export async function adminListJournalPosts(): Promise<JournalPost[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("journal_posts")
    .select(SELECT)
    // Newest first by publish date (matches the public Journal page), then most
    // recently created, then title.
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .order("title", { ascending: true });
  return ((data ?? []) as RawPost[]).map(normalize);
}

export async function adminGetJournalPost(id: string): Promise<JournalPost | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("journal_posts").select(SELECT).eq("id", id).maybeSingle();
  return data ? normalize(data as RawPost) : null;
}

// ── Public reads (cached) ───────────────────────────────────────────────────

// Hide scheduled posts until their time: keep rows with no schedule, or whose
// scheduled_at has passed. The cutoff `now` is captured when this cached read
// runs, so a scheduled post becomes visible at the next revalidation after its
// time. The `revalidate` below is kept short so that happens within ~a minute
// (rather than needing a manual re-save to bust the cache).
const notFutureScheduled = () =>
  `scheduled_at.is.null,scheduled_at.lte.${new Date().toISOString()}`;

export const getPublishedJournalPosts = unstable_cache(
  async (): Promise<JournalPost[]> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("journal_posts")
      .select(SELECT)
      .or(notFutureScheduled())
      // Newest first: latest publish date, then most recently created. So the
      // freshest article is the hero / top of the Journal page.
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    return ((data ?? []) as RawPost[]).map(normalize);
  },
  ["published-journal-posts"],
  { revalidate: 300, tags: [JOURNAL_TAG] }
);

export const getJournalPostBySlug = unstable_cache(
  async (slug: string): Promise<JournalPost | null> => {
    const sb = createSupabasePublicClient();
    const { data } = await sb
      .from("journal_posts")
      .select(SELECT)
      .eq("slug", slug)
      .or(notFutureScheduled())
      .maybeSingle();
    return data ? normalize(data as RawPost) : null;
  },
  ["journal-post-by-slug"],
  { revalidate: 300, tags: [JOURNAL_TAG] }
);
