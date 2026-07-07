import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/siteSettings";

const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * robots.txt — served at /robots.txt. Google must be able to crawl the homepage
 * and the favicon for the icon to appear in search results, so we allow the
 * whole public site (only the admin dashboard is disallowed) and point crawlers
 * at the sitemap. When the site is flipped to noindex (Settings → SEO Defaults),
 * we block everything instead.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings().catch(() => null);
  const base = (settings?.general.siteUrl?.trim() || FALLBACK_URL).replace(/\/+$/, "");
  const noindex = settings?.seo.noindex ?? false;

  if (noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
