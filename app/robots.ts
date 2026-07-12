import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/siteSettings";

const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";

/**
 * robots.txt — served at /robots.txt. Google must be able to crawl the homepage
 * and the favicon for the icon to appear in search results, so we allow the
 * whole public site (only the admin dashboard is disallowed) and point crawlers
 * at the sitemap. When the site is flipped to noindex (Settings → SEO Defaults),
 * we block everything instead.
 *
 * Note: `host` directive removed — it is a non-standard Yandex extension and
 * causes a parse error in Bing Webmaster Tools' robots.txt tester. The 301
 * non-www → www redirect in next.config.ts already enforces the canonical host.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings().catch(() => null);

  const raw = settings?.general.siteUrl?.trim() || FALLBACK_URL;
  const base = raw.replace(/^https?:\/\/(?!www\.)/, "$&www.").replace(/\/+$/, "");
  
  const noindex = settings?.seo.noindex ?? false;

  if (noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${base}/sitemap.xml`,
  };
}