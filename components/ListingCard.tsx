import Image from "next/image";
import Link from "next/link";
import { publicImageUrl } from "@/lib/queries";
import type { ListingWithRelations } from "@/lib/types";

/**
 * Listing card for directory grids. Server-rendered (SEO content is in the
 * HTML, not hydrated). Fixed dimensions + lazy images prevent layout shift.
 */
export function ListingCard({ listing }: { listing: ListingWithRelations }) {
  const industrySlug = listing.industry?.slug;
  const modelSlug = listing.business_model?.slug;
  // Listings are only linkable once attached to an industry + model.
  const href =
    industrySlug && modelSlug
      ? `/suppliers/${industrySlug}/${modelSlug}/${listing.slug}`
      : `#`;

  const cover =
    listing.images.find((i) => i.is_logo) ?? listing.images[0] ?? null;

  return (
    <Link href={href} className="dir-card">
      <div className="dir-card-media">
        {cover ? (
          <Image
            src={publicImageUrl(cover.storage_path)}
            alt={cover.alt_text}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="dir-card-logo" aria-hidden>
            {listing.company_name.charAt(0)}
          </span>
        )}
      </div>
      <div className="dir-card-body">
        <h3 className="dir-card-title">{listing.company_name}</h3>
        <div className="dir-card-meta">
          {[listing.location, listing.made_in && `Made in ${listing.made_in}`]
            .filter(Boolean)
            .join(" · ")}
        </div>
        <div className="dir-badges">
          {listing.visibility === "featured" && (
            <span className="dir-pill is-featured">Featured</span>
          )}
          {listing.visibility === "coming_soon" && (
            <span className="dir-pill is-coming">Coming soon</span>
          )}
          {listing.tags.slice(0, 2).map((t) => (
            <span key={t} className="dir-pill">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
