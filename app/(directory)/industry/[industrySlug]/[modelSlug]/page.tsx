import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusinessModel, getListingsForModel } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { ListingCard } from "@/components/ListingCard";
import { AutoReflowGrid } from "@/components/AutoReflowGrid";

type Params = Promise<{ industrySlug: string; modelSlug: string }>;
type Search = Promise<{ page?: string }>;

const PAGE_SIZE = 12;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { industrySlug, modelSlug } = await params;
  const model = await getBusinessModel(industrySlug, modelSlug);
  if (!model) return {};
  return buildMetadata(model, {
    title: `${model.name} — ${model.industry.name} Suppliers`,
    description: model.description ?? undefined,
    path: `/industry/${industrySlug}/${modelSlug}`,
  });
}

export default async function ModelPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { industrySlug, modelSlug } = await params;
  const model = await getBusinessModel(industrySlug, modelSlug);
  if (!model) notFound();

  const all = await getListingsForModel(model.id);

  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const start = (current - 1) * PAGE_SIZE;
  const listings = all.slice(start, start + PAGE_SIZE);

  const base = `/industry/${industrySlug}/${modelSlug}`;

  return (
    <div className="dir-wrap">
      <nav className="dir-crumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href={`/industry/${industrySlug}`}>{model.industry.name}</Link>
        <span className="sep">/</span>
        <span>{model.name}</span>
      </nav>

      <header className="dir-head">
        <div className="dir-eyebrow">{model.industry.name}</div>
        <h1 className="dir-h1">{model.h1 || model.name}</h1>
        {(model.intro || model.description) && (
          <p className="dir-intro">{model.intro || model.description}</p>
        )}
      </header>

      <AutoReflowGrid
        isEmpty={listings.length === 0}
        empty="No suppliers published in this category yet."
      >
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </AutoReflowGrid>

      {totalPages > 1 && (
        <nav className="dir-pagination" aria-label="Pagination">
          <Link
            href={current > 2 ? `${base}?page=${current - 1}` : base}
            className={`dir-page-link ${
              current === 1 ? "is-disabled" : ""
            }`}
            aria-label="Previous page"
          >
            ‹
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? base : `${base}?page=${n}`}
              className={`dir-page-link ${n === current ? "is-active" : ""}`}
            >
              {n}
            </Link>
          ))}
          <Link
            href={`${base}?page=${current + 1}`}
            className={`dir-page-link ${
              current === totalPages ? "is-disabled" : ""
            }`}
            aria-label="Next page"
          >
            ›
          </Link>
        </nav>
      )}
    </div>
  );
}
