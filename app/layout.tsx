import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/siteSettings";
import { DEFAULT_SEO_DEFAULTS } from "@/lib/site/data/seoDefaults";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

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
  // Admin-uploaded favicon (nav branding) overrides the default. Set explicitly
  // so it's the single authoritative <link rel="icon"> — the static default now
  // lives in /public (served at /favicon.ico) so Next doesn't emit a competing
  // file-based icon link that would win over the upload.
  const favicon = settings?.nav.brand?.faviconUrl;
  meta.icons = { icon: favicon || "/favicon.ico" };
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
    </html>
  );
}
