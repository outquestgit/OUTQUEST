import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/siteSettings";
import { getPublishedQuests } from "@/lib/quests";
import { getPublishedJournalPosts } from "@/lib/journal";
import { getPublishedDeals } from "@/lib/deals";
import { questCategorySlug } from "@/lib/site/questMapping";

export const revalidate = 3600; // re-generate every 1 hour

const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";

/** Public, always-present routes (SPA sections + editorial index pages). */
const STATIC_PATHS = [
  "/",
  "/quests",
  "/journal",
  "/about",
  "/faq",
  "/contact",
  "/partner",
  "/privacy",
  "/tos",
  "/abroad",
  "/upgrade",
  "/life",
  "/move-abroad",
  "/level-up",
  "/try-a-new-life",
];

/**
 * sitemap.xml — served at /sitemap.xml. Lists the static pages plus every
 * published quest (under its canonical category URL) and journal post so Google
 * discovers and indexes the whole site. Dynamic reads are best-effort: if a
 * fetch fails we still return the static routes rather than erroring the route.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings().catch(() => null);
  const base = (settings?.general.siteUrl?.trim() || FALLBACK_URL).replace(/\/+$/, "");
  const now = new Date();

  // Static pages: omit lastModified — we have no per-page timestamp, and using
  // `now` on every regeneration misleads Google into thinking all pages changed.
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const [quests, posts, deals] = await Promise.all([
    getPublishedQuests().catch(() => []),
    getPublishedJournalPosts().catch(() => []),
    getPublishedDeals().catch(() => []),
  ]);

  for (const q of quests) {
    const cat = questCategorySlug(q);
    const path = cat ? `/${cat}/${q.slug}` : `/quests/${q.slug}`;
    entries.push({
      url: `${base}${path}`,
      lastModified: q.updated_at ? new Date(q.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const p of posts) {
    entries.push({
      url: `${base}/journal/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const d of deals) {
    // Skip noindex deals — don't tell Google about pages we don't want indexed.
    if (d.noindex) continue;
    entries.push({
      url: `${base}/deals/${d.slug}`,
      lastModified: d.updated_at ? new Date(d.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  return entries;
}