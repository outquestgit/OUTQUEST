import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/siteSettings";
import { DEFAULT_SEO_DEFAULTS } from "@/lib/site/data/seoDefaults";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ClarityProvider } from "@/components/ClarityProvider";


// Async so the admin-managed favicon (nav branding) can be wired into <head>.
// Falls back to whatever file-based icon exists when no favicon is uploaded.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  // Site title comes from Settings → General (`siteName`); if an SEO title
  // pattern ("{title} | Brand") is set it's applied to it. Falls back to the
  // built-in name when settings can't be read.
  const siteName = settings?.general.siteName?.trim() || "OutQuest";
  const pattern = settings?.seo.titlePattern?.trim();
  const title =
    pattern && pattern.includes("{title}") ? pattern.replace("{title}", siteName) : siteName;

  // Description + canonical base come from Settings (SEO Defaults / General),
  // not hardcoded — admins control them from the dashboard.
  const description =
    settings?.seo.metaDescription?.trim() || DEFAULT_SEO_DEFAULTS.metaDescription;
  const siteUrl = settings?.general.siteUrl?.trim() || process.env.NEXT_PUBLIC_SITE_URL;

  const meta: Metadata = { title, description };
  if (siteUrl) {
    try {
      meta.metadataBase = new URL(siteUrl);
    } catch {
      /* ignore a malformed siteUrl — relative URLs just won't be resolved */
    }
  }
  // Favicon. Search engines (Google) need a crawlable, square icon that's at
  // least 48px — the old 16/32px favicon.ico alone was below that bar, so it was
  // often dropped from search results. We now lead with a scalable SVG
  // (sizes="any", never rejected on size) and keep favicon.ico as the legacy
  // fallback. An admin-uploaded favicon (nav branding), when present, is the
  // single authoritative icon and overrides the defaults.
  const favicon = settings?.nav.brand?.faviconUrl?.trim();
  if (favicon) {
    meta.icons = { icon: favicon, shortcut: favicon, apple: favicon };
  }
  return meta;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Each site (front / admin) loads its own fonts in its own layout so the
  // pages stay byte-faithful to their source HTML.
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
      <GoogleAnalytics />
      <ClarityProvider />
    </html>
  );
}
