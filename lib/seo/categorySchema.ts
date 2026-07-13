/**
 * lib/seo/categorySchema.ts
 *
 * Shared helper that builds ItemList + BreadcrumbList schema for static
 * category pages (/move-abroad, /level-up, /life, /try-a-new-life, etc.)
 * that use SiteApp as a client SPA and can't rely on the [category] dynamic
 * route to inject schema.
 */

import { buildItemListSchema, buildBreadcrumbSchema, schemaScript } from "@/lib/seo/schema";
import { altCategoryPages } from "@/lib/site/data/altCategoryPages";
import { categoryPages } from "@/lib/site/data/categoryPages";
import type { CategoryPageData } from "@/lib/site/data/categoryPages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";

/** All static category page definitions in one lookup. */
const ALL_CATEGORY_PAGES: CategoryPageData[] = [...categoryPages, ...altCategoryPages];

/**
 * Given a category page `id` (e.g. "abroad", "upgrade", "life") and the URL
 * path (e.g. "/move-abroad"), returns two inline <script> tag props ready for
 * dangerouslySetInnerHTML — one ItemList and one BreadcrumbList.
 *
 * The quest URLs point to /{listing} since the static category pages link to
 * their quest listing slugs (not full category paths — these are SPA-driven).
 */
export function buildStaticCategorySchemas(
  categoryId: string,
  urlPath: string,
  breadcrumbLabel: string
) {
  const page = ALL_CATEGORY_PAGES.find((p) => p.id === categoryId);

  const itemListSchema = buildItemListSchema(
    page?.title?.replace(/\s*[^\w\s].*/u, "").trim() ?? breadcrumbLabel,
    (page?.quests ?? []).map((q, i) => ({
      name: q.title,
      url: `${SITE_URL}${urlPath}`,   // category page URL (quests are SPA sections, not separate URLs)
      position: i + 1,
    }))
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: breadcrumbLabel },
  ]);

  return {
    itemList: schemaScript(itemListSchema),
    breadcrumb: schemaScript(breadcrumbSchema),
  };
}