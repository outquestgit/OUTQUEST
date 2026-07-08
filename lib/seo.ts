import type { Metadata } from "next";
import type { SeoFields } from "./types";
import type { SeoDefaults } from "./site/data/seoDefaults";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Resolve an image reference to an absolute URL (OG/social images must be
 * absolute). Full URLs pass through; relative paths get the origin.
 */
function absoluteImageUrl(u?: string | null): string | undefined {
  const s = (u ?? "").trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  return `${SITE_URL}/${s.replace(/^\/+/, "")}`;
}

/**
 * Build fully-dynamic page metadata from admin-controlled SEO fields.
 * No head tags are hardcoded in the components — everything comes from the DB,
 * with sensible fallbacks so a page is never left without a title/description.
 * The OG/social image falls back from `og_image_url` to the uploaded
 * featured/card image (`fallback.image`), made absolute.
 */
export function buildMetadata(
  seo: Partial<SeoFields>,
  fallback: {
    title: string;
    description?: string;
    path: string;
    canonical?: string | null;
    /** Featured/card image to use as the OG image when og_image_url is unset. */
    image?: string | null;
    noindex?: boolean;
    nofollow?: boolean;
  },
  /** Site-wide SEO defaults (Settings → SEO Defaults). */
  defaults?: SeoDefaults
): Metadata {
  const baseTitle = seo.seo_title?.trim() || fallback.title;
  // Apply the admin title pattern ("{title} | Brand") when set.
  const pattern = defaults?.titlePattern?.trim();
  const title = pattern && pattern.includes("{title}") ? pattern.replace("{title}", baseTitle) : baseTitle;
  const description =
    seo.meta_description?.trim() || fallback.description || defaults?.metaDescription?.trim() || undefined;
  // An admin-set canonical URL wins; otherwise default to the page's own URL.
  const url = fallback.canonical?.trim() || `${SITE_URL}${fallback.path}`;
  // og_image_url → uploaded featured/card image → site-wide default OG image.
  const ogImage =
    absoluteImageUrl(seo.og_image_url) ||
    absoluteImageUrl(fallback.image) ||
    absoluteImageUrl(defaults?.defaultOgImage);
  const noindex = fallback.noindex || defaults?.noindex || false;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots:
      noindex || fallback.nofollow
        ? { index: !noindex, follow: !fallback.nofollow }
        : undefined,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
