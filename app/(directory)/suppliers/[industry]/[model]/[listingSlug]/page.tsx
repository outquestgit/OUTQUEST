import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListingBySlug, publicImageUrl } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{
  industry: string;
  model: string;
  listingSlug: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { industry, model, listingSlug } = await params;
  const listing = await getListingBySlug(listingSlug);
  if (!listing) return {};
  return buildMetadata(listing, {
    title: listing.company_name,
    description: listing.description ?? undefined,
    path: `/suppliers/${industry}/${model}/${listing.slug}`,
  });
}

function moq(min: number | null, max: number | null): string | null {
  if (min && max) return `${min.toLocaleString()} – ${max.toLocaleString()} units`;
  if (min) return `${min.toLocaleString()}+ units`;
  if (max) return `up to ${max.toLocaleString()} units`;
  return null;
}

export default async function ListingPage({ params }: { params: Params }) {
  const { industry, model, listingSlug } = await params;
  const listing = await getListingBySlug(listingSlug);
  if (!listing) notFound();

  // Enforce canonical URL: the path's industry/model must match the listing's.
  if (
    (listing.industry && listing.industry.slug !== industry) ||
    (listing.business_model && listing.business_model.slug !== model)
  ) {
    notFound();
  }

  const cover =
    listing.images.find((i) => i.is_logo) ?? listing.images[0] ?? null;

  const specs: [string, string | null][] = [
    ["Industry", listing.industry?.name ?? null],
    ["Business model", listing.business_model?.name ?? null],
    ["Location", listing.location],
    ["Made in", listing.made_in],
    [
      "Years in operation",
      listing.years_in_operation ? `${listing.years_in_operation} years` : null,
    ],
    ["Production time", listing.production_time],
    ["MOQ", moq(listing.moq_min, listing.moq_max)],
  ];

  return (
    <div className="dir-wrap">
      <nav className="dir-crumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href={`/industry/${industry}`}>
          {listing.industry?.name ?? industry}
        </Link>
        <span className="sep">/</span>
        <Link href={`/industry/${industry}/${model}`}>
          {listing.business_model?.name ?? model}
        </Link>
        <span className="sep">/</span>
        <span>{listing.company_name}</span>
      </nav>

      <header className="dir-head">
        <div className="dir-eyebrow">
          {listing.business_model?.name ?? "Supplier"}
        </div>
        <h1 className="dir-h1">{listing.h1 || listing.company_name}</h1>
        {listing.intro && <p className="dir-intro">{listing.intro}</p>}
      </header>

      <div className="dir-detail">
        <div>
          <div className="dir-detail-media">
            {cover ? (
              <Image
                src={publicImageUrl(cover.storage_path)}
                alt={cover.alt_text}
                fill
                sizes="(max-width: 880px) 100vw, 700px"
                priority
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span className="dir-card-logo" aria-hidden>
                {listing.company_name.charAt(0)}
              </span>
            )}
          </div>

          {listing.description && (
            <>
              <h2 className="dir-section-title">About</h2>
              <p className="dir-prose">{listing.description}</p>
            </>
          )}

          {listing.capabilities.length > 0 && (
            <>
              <h2 className="dir-section-title">Capabilities</h2>
              <div className="dir-chip-row">
                {listing.capabilities.map((c) => (
                  <span key={c} className="dir-chip">
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}

          {listing.product_categories.length > 0 && (
            <>
              <h2 className="dir-section-title">Product categories</h2>
              <div className="dir-chip-row">
                {listing.product_categories.map((pc) => (
                  <span key={pc.slug} className="dir-chip">
                    {pc.name}
                  </span>
                ))}
              </div>
            </>
          )}

          {listing.certifications.length > 0 && (
            <>
              <h2 className="dir-section-title">Certifications</h2>
              <div className="dir-chip-row">
                {listing.certifications.map((c) => (
                  <span key={c} className="dir-chip">
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <aside>
          <div className="dir-spec">
            <h2>Supplier details</h2>
            {specs
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div className="dir-spec-row" key={k}>
                  <span className="k">{k}</span>
                  <span className="v">{v}</span>
                </div>
              ))}
          </div>

          {listing.tags.length > 0 && (
            <div className="dir-spec" style={{ marginTop: 16 }}>
              <h2>Tags</h2>
              <div className="dir-chip-row">
                {listing.tags.map((t) => (
                  <span key={t} className="dir-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Contact details (website / email / phone) are intentionally not
              shown publicly — lead capture form is wired in a later step. */}
        </aside>
      </div>
    </div>
  );
}
